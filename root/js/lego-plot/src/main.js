var get_model = require('./find-models-by-gene.js');

get_model('UniProtKB:Q9GYQ4', function(graph){
  console.log(graph);
});
