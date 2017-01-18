(function() {
  var Task;

  Task = null;

  module.exports = {
    startTask: function(config, callback) {
      var dirtied, removed, task, taskPath;
      if (Task == null) {
        Task = require('atom').Task;
      }
      dirtied = [];
      removed = [];
      taskPath = require.resolve('./tasks/load-paths-handler');
      task = Task.once(taskPath, config, function() {
        return callback({
          dirtied: dirtied,
          removed: removed
        });
      });
      task.on('load-paths:paths-found', function(paths) {
        return dirtied.push.apply(dirtied, paths);
      });
      task.on('load-paths:paths-lost', function(paths) {
        return removed.push.apply(removed, paths);
      });
      return task;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FybmVzY2hyZXVkZXIvLmRvdGZpbGVzL2F0b20vYXRvbS5zeW1saW5rL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9wYXRocy1sb2FkZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLElBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sSUFBUCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsU0FBQSxFQUFXLFNBQUMsTUFBRCxFQUFTLFFBQVQsR0FBQTtBQUNULFVBQUEsZ0NBQUE7O1FBQUEsT0FBUSxPQUFBLENBQVEsTUFBUixDQUFlLENBQUM7T0FBeEI7QUFBQSxNQUVBLE9BQUEsR0FBVSxFQUZWLENBQUE7QUFBQSxNQUdBLE9BQUEsR0FBVSxFQUhWLENBQUE7QUFBQSxNQUlBLFFBQUEsR0FBVyxPQUFPLENBQUMsT0FBUixDQUFnQiw0QkFBaEIsQ0FKWCxDQUFBO0FBQUEsTUFNQSxJQUFBLEdBQU8sSUFBSSxDQUFDLElBQUwsQ0FDTCxRQURLLEVBRUwsTUFGSyxFQUdMLFNBQUEsR0FBQTtlQUFHLFFBQUEsQ0FBUztBQUFBLFVBQUMsU0FBQSxPQUFEO0FBQUEsVUFBVSxTQUFBLE9BQVY7U0FBVCxFQUFIO01BQUEsQ0FISyxDQU5QLENBQUE7QUFBQSxNQVlBLElBQUksQ0FBQyxFQUFMLENBQVEsd0JBQVIsRUFBa0MsU0FBQyxLQUFELEdBQUE7ZUFBVyxPQUFPLENBQUMsSUFBUixnQkFBYSxLQUFiLEVBQVg7TUFBQSxDQUFsQyxDQVpBLENBQUE7QUFBQSxNQWFBLElBQUksQ0FBQyxFQUFMLENBQVEsdUJBQVIsRUFBaUMsU0FBQyxLQUFELEdBQUE7ZUFBVyxPQUFPLENBQUMsSUFBUixnQkFBYSxLQUFiLEVBQVg7TUFBQSxDQUFqQyxDQWJBLENBQUE7YUFlQSxLQWhCUztJQUFBLENBQVg7R0FIRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/arneschreuder/.dotfiles/atom/atom.symlink/packages/pigments/lib/paths-loader.coffee
