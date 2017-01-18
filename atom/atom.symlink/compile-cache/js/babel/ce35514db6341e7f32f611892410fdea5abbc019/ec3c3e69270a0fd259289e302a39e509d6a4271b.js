Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.install = install;
exports.installPackage = installPackage;

var _helper = require('./helper');

'use babel';
var FS = require('fs');
var Path = require('path');
var View = require('./view');

window.__sb_package_deps = window.__sb_package_deps || [];

function install(packageName) {
  var enablePackages = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  if (!packageName) throw new Error('packageName is required');

  var packageDeps = atom.packages.getLoadedPackage(packageName).metadata['package-deps'] || [];
  var packagesToInstall = [];
  packageDeps.forEach(function (name) {
    if (__sb_package_deps.indexOf(name) === -1) {
      __sb_package_deps.push(name);
      if (!atom.packages.resolvePackagePath(name)) {
        packagesToInstall.push(name);
      } else if (!atom.packages.getActivePackage(name) && enablePackages) {
        atom.packages.enablePackage(name);
        atom.packages.activatePackage(name);
      }
    }
  });
  if (packagesToInstall.length) {
    return installPackage(packageName, packagesToInstall);
  } else return Promise.resolve();
}

function installPackage(packageName, packageNames) {
  var view = new View(packageName, packageNames);
  return view.createNotification().then(function () {
    return (0, _helper.installPackages)(packageNames, function (name) {
      view.markFinished();
      atom.packages.enablePackage(name);
      atom.packages.activatePackage(name);
    }, function (detail) {
      view.notification.dismiss();
      atom.notifications.addError('Error installing ' + packageName + ' dependencies', { detail: detail });
    });
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hcm5lc2NocmV1ZGVyLy5kb3RmaWxlcy9hdG9tL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdG9tLXR5cGVzY3JpcHQvbm9kZV9tb2R1bGVzL2F0b20tcGFja2FnZS1kZXBzL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztzQkFJOEIsVUFBVTs7QUFKeEMsV0FBVyxDQUFBO0FBQ1gsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3hCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM1QixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRzlCLE1BQU0sQ0FBQyxpQkFBaUIsR0FBRyxNQUFNLENBQUMsaUJBQWlCLElBQUksRUFBRSxDQUFBOztBQUVsRCxTQUFTLE9BQU8sQ0FBQyxXQUFXLEVBQTBCO01BQXhCLGNBQWMseURBQUcsS0FBSzs7QUFDekQsTUFBSSxDQUFDLFdBQVcsRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUE7O0FBRTVELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUM5RixNQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQTtBQUM1QixhQUFXLENBQUMsT0FBTyxDQUFDLFVBQVMsSUFBSSxFQUFFO0FBQ2pDLFFBQUksaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQzFDLHVCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUM1QixVQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUMzQyx5QkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7T0FDN0IsTUFBTSxJQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFjLEVBQUU7QUFDakUsWUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDakMsWUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUE7T0FDcEM7S0FDRjtHQUNGLENBQUMsQ0FBQTtBQUNGLE1BQUksaUJBQWlCLENBQUMsTUFBTSxFQUFFO0FBQzVCLFdBQU8sY0FBYyxDQUFDLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQyxDQUFBO0dBQ3RELE1BQU0sT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7Q0FDaEM7O0FBRU0sU0FBUyxjQUFjLENBQUMsV0FBVyxFQUFFLFlBQVksRUFBRTtBQUN4RCxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUE7QUFDaEQsU0FBTyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLENBQUM7V0FDcEMsNkJBQWdCLFlBQVksRUFBRSxVQUFTLElBQUksRUFBRTtBQUMzQyxVQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7QUFDbkIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDakMsVUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDcEMsRUFBRSxVQUFTLE1BQU0sRUFBRTtBQUNsQixVQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzNCLFVBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSx1QkFBcUIsV0FBVyxvQkFBaUIsRUFBQyxNQUFNLEVBQU4sTUFBTSxFQUFDLENBQUMsQ0FBQTtLQUN0RixDQUFDO0dBQUEsQ0FDSCxDQUFBO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL2FybmVzY2hyZXVkZXIvLmRvdGZpbGVzL2F0b20vYXRvbS5zeW1saW5rL3BhY2thZ2VzL2F0b20tdHlwZXNjcmlwdC9ub2RlX21vZHVsZXMvYXRvbS1wYWNrYWdlLWRlcHMvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuY29uc3QgRlMgPSByZXF1aXJlKCdmcycpXG5jb25zdCBQYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JylcbmltcG9ydCB7aW5zdGFsbFBhY2thZ2VzfSBmcm9tICcuL2hlbHBlcidcblxud2luZG93Ll9fc2JfcGFja2FnZV9kZXBzID0gd2luZG93Ll9fc2JfcGFja2FnZV9kZXBzIHx8IFtdXG5cbmV4cG9ydCBmdW5jdGlvbiBpbnN0YWxsKHBhY2thZ2VOYW1lLCBlbmFibGVQYWNrYWdlcyA9IGZhbHNlKSB7XG4gIGlmICghcGFja2FnZU5hbWUpIHRocm93IG5ldyBFcnJvcigncGFja2FnZU5hbWUgaXMgcmVxdWlyZWQnKVxuXG4gIGNvbnN0IHBhY2thZ2VEZXBzID0gYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKHBhY2thZ2VOYW1lKS5tZXRhZGF0YVsncGFja2FnZS1kZXBzJ10gfHwgW11cbiAgY29uc3QgcGFja2FnZXNUb0luc3RhbGwgPSBbXVxuICBwYWNrYWdlRGVwcy5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiAoX19zYl9wYWNrYWdlX2RlcHMuaW5kZXhPZihuYW1lKSA9PT0gLTEpIHtcbiAgICAgIF9fc2JfcGFja2FnZV9kZXBzLnB1c2gobmFtZSlcbiAgICAgIGlmICghYXRvbS5wYWNrYWdlcy5yZXNvbHZlUGFja2FnZVBhdGgobmFtZSkpIHtcbiAgICAgICAgcGFja2FnZXNUb0luc3RhbGwucHVzaChuYW1lKVxuICAgICAgfSBlbHNlIGlmKCFhdG9tLnBhY2thZ2VzLmdldEFjdGl2ZVBhY2thZ2UobmFtZSkgJiYgZW5hYmxlUGFja2FnZXMpIHtcbiAgICAgICAgYXRvbS5wYWNrYWdlcy5lbmFibGVQYWNrYWdlKG5hbWUpXG4gICAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKG5hbWUpXG4gICAgICB9XG4gICAgfVxuICB9KVxuICBpZiAocGFja2FnZXNUb0luc3RhbGwubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGluc3RhbGxQYWNrYWdlKHBhY2thZ2VOYW1lLCBwYWNrYWdlc1RvSW5zdGFsbClcbiAgfSBlbHNlIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5zdGFsbFBhY2thZ2UocGFja2FnZU5hbWUsIHBhY2thZ2VOYW1lcykge1xuICBjb25zdCB2aWV3ID0gbmV3IFZpZXcocGFja2FnZU5hbWUsIHBhY2thZ2VOYW1lcylcbiAgcmV0dXJuIHZpZXcuY3JlYXRlTm90aWZpY2F0aW9uKCkudGhlbigoKSA9PlxuICAgIGluc3RhbGxQYWNrYWdlcyhwYWNrYWdlTmFtZXMsIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZpZXcubWFya0ZpbmlzaGVkKClcbiAgICAgIGF0b20ucGFja2FnZXMuZW5hYmxlUGFja2FnZShuYW1lKVxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UobmFtZSlcbiAgICB9LCBmdW5jdGlvbihkZXRhaWwpIHtcbiAgICAgIHZpZXcubm90aWZpY2F0aW9uLmRpc21pc3MoKVxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBFcnJvciBpbnN0YWxsaW5nICR7cGFja2FnZU5hbWV9IGRlcGVuZGVuY2llc2AsIHtkZXRhaWx9KVxuICAgIH0pXG4gIClcbn1cbiJdfQ==
//# sourceURL=/Users/arneschreuder/.dotfiles/atom/atom.symlink/packages/atom-typescript/node_modules/atom-package-deps/lib/main.js
