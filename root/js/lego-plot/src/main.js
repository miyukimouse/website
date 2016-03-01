var vis =  require('vis');
var get_model = require('./find-models-by-gene.js');
var bbop = require('bbop-core');

get_model('UniProtKB:Q9GYQ4', function(graph){
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
  get_model('UniProtKB:Q9GYQ4', function(graph){
    console.log(graph.all_nodes());


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
      return {
        id: e.id(),
		from: e.subject_id(),
		to: e.object_id(),
        label: prettyLabel(e.predicate_id()),
        arrows:'to',
      };
    });

    var data = {
      nodes: nodes,
      edges: edges
    };

    // create a network
    var container = document.getElementById('lego-graph-container');
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
    network = new vis.Network(container, data, options);

  });
}

get_graph();

module.exports = {
  get_graph: get_graph
};
