var vis =  require('vis');
var get_model = require('./find-models-by-gene.js');
var page = require('./main.html');
require('./main.less');
var utils = require('./utils.js');
var bbop = require('bbop-core');
var $ = require('jquery');

get_model('UniProtKB:Q9GYQ4', function(graph, context){
  console.log(graph);
});

/*
 convert a long label text into mulitple lines
*/
function prettyLabel(label){
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

function get_graph(gid){
  get_model('UniProtKB:Q9GYQ4', function(graph, context){
  //  graph.fold_go_noctua(["RO:0002233","RO:0002234","RO:0002333","RO:0002488","BFO:0000066","BFO:0000051", "BFO:0000050"]);

    // randomly create some nodes and edges

  // Stolen from the internal workings of widgetry.
  // Part 1.
  var cat_list = [];
  graph.all_nodes().forEach(function(enode, enode_id){
    enode.types().forEach(function(in_type){
    cat_list.push(in_type.category());
    });
  });
  var tmph = bbop.hashify(cat_list);
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
        label: prettyLabel(table_row.join("\n"))
      };
    });

    var edges = graph.all_edges().map(function(e){

      var edge_label = context.get_edge_label(e.predicate_id());
      return {
        id: e.id(),
        from: e.subject_id(),
        to: e.object_id(),
        label: prettyLabel(edge_label),
        arrows:'to',
      };
    });

    var nodesData = new vis.DataSet(nodes);
    var edgesData = new vis.DataSet(edges);
    var data = {
      nodes: nodesData,
      edges: edgesData,
    };

    // create a network
    var rootContainer = $('#root');
    rootContainer.html(page);
    var container = $(rootContainer).find('.lego-graph-container')[0];
    console.log(container);
    var options = {
      layout: {
        improvedLayout: true,
        hierarchical: {
          enabled:true,
          // levelSeparation: 150,
          // nodeSpacing: 100,
          // treeSpacing: 200,
          // blockShifting: true,
          // edgeMinimization: true,
          // parentCentralization: true,
          direction: 'UD',        // UD, DU, LR, RL
          sortMethod: 'directed'   // hubsize, directed
        }
      },
      nodes : {
        shape: 'dot',
        size: 10
      }
    };
    var network = new vis.Network(container, data, options);

    network.once('stabilized', function(){
      network.setOptions({
        physics: {
          stabilization: {
            onlyDynamicEdges: true
          }
        }
      });
    })

    function toggleVisibility(items, hidden) {
      var newItems = items.map(function(e){
       // e.hidden = !e.hidden;
   //     return e;
        return Object.assign({
          hidden: hidden,
        }, e);
      })
      console.log(newItems);
      return newItems;
    }

var hidden = true;
    setInterval(function(){
      console.log('updating');
      nodesData.update(toggleVisibility(nodes, hidden));
      edgesData.update(toggleVisibility(edges, hidden));
      hidden = !hidden;
    }, 3000);

  });
}

module.exports = {
  get_graph: get_graph
};
