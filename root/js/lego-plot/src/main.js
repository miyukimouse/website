require('./main.less');

var page = require('./main.html');
var Utils = require('./utils');
var $ = require('jquery');

Utils.GOClient.getModelByGene('UniProtKB:Q9GYQ4', function(graph, context){
  console.log(graph);
});


function getGraph(gid){
  Utils.GOClient.getModelByGene('UniProtKB:Q9GYQ4', function(graphJSON, context){

    // create a network
    var rootContainer = $('#root');
    rootContainer.html(page);
    var container = $(rootContainer).find('.lego-graph-container')[0];
    var modelView = new Utils.WBModelGraphView(graphJSON, container);

  });
}

module.exports = {
  getGraph: getGraph
};
