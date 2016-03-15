var CustomEvents = (function() {
  var _map = {};

  return {
    subscribe: function(name, cb) {
      _map[name] || (_map[name] = []);
      _map[name].push(cb);
    },

    notify: function(name, data) {
      if (!_map[name]) {
        return;
      }

      // if you want canceling or anything else, add it in to this cb loop
      while (_map[name].length > 0) {
        var cb = _map[name].pop();
        cb(data);
      }
    },

    unsubscribe: function(name) {
      if (!_map[name]) {
        return;
      }

      while (_map[name].length > 0) {
        _map[name].pop();
      }
    }
  }
})();

export default CustomEvents;
