import vis from 'vis';
import WBModelGraph from './WBModelGraph';

export default class WBModelGraphView {
  constructor(graphJSON, container) {
    this._wbModelGraph = new WBModelGraph(graphJSON);
    this.visual = this._createVisual(container);

    this.update();
  }

  update(mode) {
    this._wbModelGraph.setMode(mode);
    console.log(this._wbModelGraph.getNodes());
    const nodes = this.decorateNodes(this._wbModelGraph.getNodes());
    const edges = this._wbModelGraph.getEdges();

    this.visual.nodes.update(nodes);
    this.visual.edges.update(edges);
  }

  decorateNodes(nodes){
    return nodes.map((v) => {
      const shape = 'circle';
      const label = this.prettyLabel(v.label);
      return {
        ...v,
        label,
        shape,
        mass:10
      }
    })
  }

  _createVisual(container) {

    var nodes = new vis.DataSet(this._wbModelGraph.getNodes());
    var edges = new vis.DataSet(this._wbModelGraph.getEdges());

    var options = {
      physics: {
        enabled: true,
        hierarchicalRepulsion: {
          // centralGravity: 0.0,
          // springLength: 100,
          // springConstant: 0.02,
          nodeDistance: 200,
          damping: 0.29
        },
      },
      layout: {
        improvedLayout: true,
        hierarchical: {
          enabled:true,
          levelSeparation: 250,
          // nodeSpacing: 200,
          // treeSpacing: 200,
          // blockShifting: true,
          // edgeMinimization: true,
          // parentCentralization: true,
          direction: 'UD',        // UD, DU, LR, RL
          sortMethod: 'directed'   // hubsize, directed
        }
      },
      interaction:{
        navigationButtons: true
      },
      nodes : {
        shape: 'dot',
        size: 10
      }
    };

    const network = new vis.Network(container, {nodes, edges}, options);

    network.once('stabilized', function(){
      network.setOptions({
        // physics: {
        //   stabilization: {
        //     onlyDynamicEdges: true
        //   }
        // }
      });
    });

    function toggleVisibility(items, hidden) {
      var newItems = items.map(function(e){
       // e.hidden = !e.hidden;
   //     return e;
        return Object.assign({
          hidden: hidden,
        }, e);
      })

      return newItems;
    }

//    var hidden = true;
//     setInterval(function(){
//       console.log('updating');
//       nodesData.update(toggleVisibility(nodes, hidden));
//       edgesData.update(toggleVisibility(edges, hidden));
//       hidden = !hidden;
//     }, 3000);

    return {
      nodes: nodes,
      edges: edges,
      network: network
    };
  }

  /*
   convert a long label text into mulitple lines
  */
  prettyLabel(label){
    var max_line_length = 20;
    var words = label.split(/\s+/);
    var lines = [];
    var partial_line = '';
    words.forEach(function(w){
      if (w.length + partial_line.length > max_line_length) {
        lines.push(partial_line);
        partial_line = w;
      }else{
        partial_line += ' ';
        partial_line += w;
      }
    });
    if (partial_line){
      lines.push(partial_line);
    }
    return lines.join('\n');
  }
}
