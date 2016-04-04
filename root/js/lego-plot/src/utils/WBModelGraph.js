import { graph as noctua_graph } from 'bbop-graph-noctua';
import { hashify } from 'bbop-core';

const MAJOR_PREDICATES = new Set(["RO:0002213", "BFO:0000050"]);
const MINOR_PREDICATES = new Set(["RO:0002233","RO:0002234","RO:0002333","RO:0002488","BFO:0000066","BFO:0000051", "BFO:0000050"]);

export default class WBModelGraph {
  constructor(graphJSON) {

    const _noctuaGraph = new noctua_graph();
    _noctuaGraph.load_data_basic(graphJSON);
    this._noctuaGraph = _noctuaGraph;
    this._raw = graphJSON;

    this._nodes = this._parseNodes();
    this._edges = this._parseEdges();
  }

  getEdges(){
    //return this._edges.filter((e) => MAJOR_PREDICATES.has(e.predicate_id));
    return this._edges.slice();  // shallow copy of the array
  }

  isMajorEdge(edge){
    return MAJOR_PREDICATES.has(edge.predicate_id);
  }

  getNodes(){
    const nodeHashMap = this._nodes;
    return Object.keys(nodeHashMap).map((nid) => nodeHashMap[nid]);
  }

  isMajorNode(node){

    if (!this.majorNodeKeys) {
      // infer major nodes based on major predicates
      const majorNodeKeys = [];
      this._edges.forEach((e) => {
        if (MAJOR_PREDICATES.has(e.predicate_id)){
          majorNodeKeys.push(e.to, e.from);
        }
      });
      this.majorNodeKeys = new Set(majorNodeKeys);
    }

    return this.majorNodeKeys.has(node.id);
  }

  getEdgesOfNode(node) {

    if (!this.nodeToEdges) {
      const nodeToEdges = {};

      this._edges.forEach((e) => {
        const nodeId = e.from;
        nodeToEdges[nodeId] = nodeToEdges[nodeId] || [];
        nodeToEdges[nodeId].push({
          ...e,
          toNode: this.getNodeById(e.to)
        });
      });

      this.nodeToEdges = nodeToEdges;
    }

    return this.nodeToEdges[node.id] || [];
  }

  getNodeById(nid){
    return this._nodes[nid];
  }


  _parseNodes() {
    const graph = this._noctuaGraph;

    // graph.fold_go_noctua(["RO:0002233","RO:0002234","RO:0002333","RO:0002488","BFO:0000066","BFO:0000051", "BFO:0000050"]);

    // Stolen from the internal workings of widgetry.
    // Part 1.
    var cat_list = [];
    graph.all_nodes().forEach(function(enode, enode_id){
      enode.types().forEach(function(in_type){
        cat_list.push(in_type.category());
      });
    });
    var tmph = hashify(cat_list);
    cat_list = Object.keys(tmph);

    var nodes = graph.all_nodes().map(function(n){
      var bin = {};
      n.types().forEach(function(in_type){
        var cat = in_type.category();
        if( ! bin[cat] ){ bin[cat] = []; }
          bin[cat].push(in_type);
      });

      var table_row = [];
      cat_list.forEach(function(cat_id){
        var accumulated_types = bin[cat_id];
        var cell_cache = [];
        accumulated_types.forEach(function(atype){
          //var tt = widgetry.type_to_span(atype, aid);
          var tt = atype.to_string();
          cell_cache.push({
            label: tt,
            class_id: atype.class_id(),
            class_label: atype.class_label(),
          });
        });
        table_row.push(cell_cache[0]);  //just take the first for now
      });

      return {
        id: n.id(),
        ...table_row[0]  //just take the first for now
      };
    });

    const nodeHashMap = {};
    nodes.forEach((node) => {
      nodeHashMap[node.id] = node;
    });

    return nodeHashMap;
  }

  _parseEdges(graph) {

    const edges = this._noctuaGraph.all_edges().map((e) => {

      const predicate_id = e.predicate_id();
      const edge_label = this._getEdgeLabel(predicate_id);
      return {
        id: e.id(),
        predicate_id: predicate_id,
        from: e.subject_id(),
        to: e.object_id(),
        label: edge_label
      };
    });

    return edges;
  }

  _getEdgeLabel(predicate_id) {
    if (!this._predicateMap) {
      // initialize if not existent
      this._predicateMap = {};
      this._raw.properties.forEach((predicate) => {
        this._predicateMap[predicate.id] = (predicate.label || '').replace(/_/, ' ');
      });
    }

    return this._predicateMap[predicate_id];
  }

}

