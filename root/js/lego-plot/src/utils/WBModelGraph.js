import { graph as noctua_graph } from 'bbop-graph-noctua';
import { hashify } from 'bbop-core';


export default class WBModelGraph {
  constructor(graphJSON) {

    const _noctuaGraph = new noctua_graph();
    _noctuaGraph.load_data_basic(graphJSON);
    this._noctuaGraph = _noctuaGraph;
    this._raw = graphJSON;
    this.setMode();
  }

  setMode(mode){
    let ignoredEdges = []
    if (mode === 'simple') {
      ignoredEdges = ["RO:0002233","RO:0002234","RO:0002333","RO:0002488","BFO:0000066","BFO:0000051", "BFO:0000050"];
    }else {
      ignoredEdges = ["RO:0002233","RO:0002234","RO:0002333","RO:0002488","BFO:0000066","BFO:0000051", "BFO:0000050"];
    }
    this._noctuaGraph.fold_go_noctua(ignoredEdges);
  }


  getNodes() {
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
          cell_cache.push(tt);
        });
        table_row.push(cell_cache.join("\n"));
      });

      return {
        id: n.id(),
        label: table_row.join("\n")
      };
    });

    return nodes;
  }

  getEdges(graph) {

    const edges = this._noctuaGraph.all_edges().map((e) => {

      const edge_label = this._getEdgeLabel(e.predicate_id());
      return {
        id: e.id(),
        from: e.subject_id(),
        to: e.object_id(),
        label: edge_label,
        arrows:'to',
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

