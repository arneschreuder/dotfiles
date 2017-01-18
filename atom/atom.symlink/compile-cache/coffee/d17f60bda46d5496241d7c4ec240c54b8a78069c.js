(function() {
  var CompositeDisposable, configFile, objectAssign, path;

  CompositeDisposable = require('atom').CompositeDisposable;

  path = require('path');

  objectAssign = require('object-assign');

  configFile = require('pug-lint/lib/config-file');

  module.exports = {
    config: {
      executablePath: {
        type: 'string',
        "default": path.join(__dirname, '..', 'node_modules', 'pug-lint', 'bin', 'pug-lint'),
        description: 'Full path to the `pug-lint` executable node script file (e.g. /usr/local/bin/pug-lint)'
      },
      projectConfigFile: {
        type: 'string',
        "default": '',
        description: 'Relative path from project to config file'
      },
      onlyRunWhenConfig: {
        "default": false,
        title: 'Run Pug-lint only if config is found',
        description: 'Disable linter if there is no config file found for the linter.',
        type: 'boolean'
      }
    },
    activate: function() {
      require('atom-package-deps').install();
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-pug.executablePath', (function(_this) {
        return function(executablePath) {
          return _this.executablePath = executablePath;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-pug.projectConfigFile', (function(_this) {
        return function(projectConfigFile) {
          return _this.projectConfigFile = projectConfigFile;
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter-pug.onlyRunWhenConfig', (function(_this) {
        return function(onlyRunWhenConfig) {
          return _this.onlyRunWhenConfig = onlyRunWhenConfig;
        };
      })(this)));
    },
    getConfig: function(filePath) {
      var config, newConfig, options;
      config = void 0;
      if (path.isAbsolute(this.projectConfigFile)) {
        config = configFile.load(false, this.projectConfigFile);
      } else {
        config = configFile.load(false, path.join(path.dirname(filePath), this.projectConfigFile));
      }
      if (!config && this.onlyRunWhenConfig) {
        return void 0;
      }
      options = {};
      newConfig = objectAssign(options, config);
      if (!newConfig.configPath && config && config.configPath) {
        newConfig.configPath = config.configPath;
      }
      return newConfig;
    },
    provideLinter: function() {
      var helpers, provider;
      helpers = require('atom-linter');
      return provider = {
        grammarScopes: ['source.jade', 'source.pug'],
        scope: 'file',
        lintOnFly: true,
        lint: (function(_this) {
          return function(textEditor) {
            var filePath, fileText, parameters, projectConfigPath;
            filePath = textEditor.getPath();
            fileText = textEditor.getText();
            projectConfigPath = _this.getConfig(filePath);
            if (!fileText) {
              return Promise.resolve([]);
            }
            parameters = [filePath];
            if (!projectConfigPath || !projectConfigPath.configPath) {
              if (!_this.onlyRunWhenConfig) {
                atom.notifications.addError('Pug-lint config not found');
              }
              return Promise.resolve([]);
            }
            if (_this.onlyRunWhenConfig || projectConfigPath) {
              parameters.push('-c', projectConfigPath.configPath);
            }
            parameters.push('-r', 'inline');
            return helpers.execNode(_this.executablePath, parameters, {
              stdin: fileText,
              allowEmptyStderr: true,
              stream: 'stderr'
            }).then(function(result) {
              var match, messages, regex;
              regex = /(Warning|Error)?(.*)\:(\d*)\:(\d*)\s(.*)/g;
              messages = [];
              while ((match = regex.exec(result)) !== null) {
                messages.push({
                  type: match[1] ? match[1] : 'Error',
                  text: match[5],
                  filePath: match[2],
                  range: helpers.rangeFromLineNumber(textEditor, match[3] - 1, match[4] - 1)
                });
              }
              return messages;
            });
          };
        })(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FybmVzY2hyZXVkZXIvLmRvdGZpbGVzL2F0b20vYXRvbS5zeW1saW5rL3BhY2thZ2VzL2xpbnRlci1wdWcvbGliL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1EQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxlQUFSLENBRmYsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsR0FBYSxPQUFBLENBQVEsMEJBQVIsQ0FIYixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLElBQXJCLEVBQTJCLGNBQTNCLEVBQTJDLFVBQTNDLEVBQXVELEtBQXZELEVBQThELFVBQTlELENBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSx3RkFGYjtPQURGO0FBQUEsTUFLQSxpQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSwyQ0FGYjtPQU5GO0FBQUEsTUFVQSxpQkFBQSxFQUNFO0FBQUEsUUFBQSxTQUFBLEVBQVMsS0FBVDtBQUFBLFFBQ0EsS0FBQSxFQUFPLHNDQURQO0FBQUEsUUFFQSxXQUFBLEVBQWEsaUVBRmI7QUFBQSxRQUdBLElBQUEsRUFBTSxTQUhOO09BWEY7S0FERjtBQUFBLElBaUJBLFFBQUEsRUFBVSxTQUFB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

//# sourceURL=/Users/arneschreuder/.dotfiles/atom/atom.symlink/packages/linter-pug/lib/init.coffee
