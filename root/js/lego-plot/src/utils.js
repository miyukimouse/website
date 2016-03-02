function build_context(json_obj){
  console.log(json_obj);

  function _edge_context() {
    var _edges = {};
    json_obj.properties.forEach(function(e){
      _edges[e.id] = (e.label || '').replace(/_/, ' ');
    });

    console.log(_edges);
    return {
      get_edge_label: function(eid){
        return _edges[eid];
      }
    };
  }

  return {
    get_edge_label: _edge_context().get_edge_label
  }
}

module.exports = {
  build_context: build_context
};
