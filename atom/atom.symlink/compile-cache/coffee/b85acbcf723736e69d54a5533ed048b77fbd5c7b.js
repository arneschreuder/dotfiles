(function() {
  var Color, ColorBuffer, ColorMarker, CompositeDisposable, Emitter, Range, Task, VariablesCollection, fs, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = [], Color = _ref[0], ColorMarker = _ref[1], VariablesCollection = _ref[2], Emitter = _ref[3], CompositeDisposable = _ref[4], Task = _ref[5], Range = _ref[6], fs = _ref[7];

  module.exports = ColorBuffer = (function() {
    function ColorBuffer(params) {
      var colorMarkers, saveSubscription, tokenized, _ref1;
      if (params == null) {
        params = {};
      }
      if (Emitter == null) {
        _ref1 = require('atom'), Emitter = _ref1.Emitter, CompositeDisposable = _ref1.CompositeDisposable, Task = _ref1.Task, Range = _ref1.Range;
      }
      this.editor = params.editor, this.project = params.project, colorMarkers = params.colorMarkers;
      this.id = this.editor.id;
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.ignoredScopes = [];
      this.colorMarkersByMarkerId = {};
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      tokenized = (function(_this) {
        return function() {
          var _ref2;
          return (_ref2 = _this.getColorMarkers()) != null ? _ref2.forEach(function(marker) {
            return marker.checkMarkerScope(true);
          }) : void 0;
        };
      })(this);
      if (this.editor.onDidTokenize != null) {
        this.subscriptions.add(this.editor.onDidTokenize(tokenized));
      } else {
        this.subscriptions.add(this.editor.displayBuffer.onDidTokenize(tokenized));
      }
      this.subscriptions.add(this.editor.onDidChange((function(_this) {
        return function() {
          if (_this.initialized && _this.variableInitialized) {
            _this.terminateRunningTask();
          }
          if (_this.timeout != null) {
            return clearTimeout(_this.timeout);
          }
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidStopChanging((function(_this) {
        return function() {
          if (_this.delayBeforeScan === 0) {
            return _this.update();
          } else {
            if (_this.timeout != null) {
              clearTimeout(_this.timeout);
            }
            return _this.timeout = setTimeout(function() {
              _this.update();
              return _this.timeout = null;
            }, _this.delayBeforeScan);
          }
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidChangePath((function(_this) {
        return function(path) {
          if (_this.isVariablesSource()) {
            _this.project.appendPath(path);
          }
          return _this.update();
        };
      })(this)));
      if ((this.project.getPaths() != null) && this.isVariablesSource() && !this.project.hasPath(this.editor.getPath())) {
        if (fs == null) {
          fs = require('fs');
        }
        if (fs.existsSync(this.editor.getPath())) {
          this.project.appendPath(this.editor.getPath());
        } else {
          saveSubscription = this.editor.onDidSave((function(_this) {
            return function(_arg) {
              var path;
              path = _arg.path;
              _this.project.appendPath(path);
              _this.update();
              saveSubscription.dispose();
              return _this.subscriptions.remove(saveSubscription);
            };
          })(this));
          this.subscriptions.add(saveSubscription);
        }
      }
      this.subscriptions.add(this.project.onDidUpdateVariables((function(_this) {
        return function() {
          if (!_this.variableInitialized) {
            return;
          }
          return _this.scanBufferForColors().then(function(results) {
            return _this.updateColorMarkers(results);
          });
        };
      })(this)));
      this.subscriptions.add(this.project.onDidChangeIgnoredScopes((function(_this) {
        return function() {
          return _this.updateIgnoredScopes();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.delayBeforeScan', (function(_this) {
        return function(delayBeforeScan) {
          _this.delayBeforeScan = delayBeforeScan != null ? delayBeforeScan : 0;
        };
      })(this)));
      if (this.editor.addMarkerLayer != null) {
        this.markerLayer = this.editor.addMarkerLayer();
      } else {
        this.markerLayer = this.editor;
      }
      if (colorMarkers != null) {
        this.restoreMarkersState(colorMarkers);
        this.cleanUnusedTextEditorMarkers();
      }
      this.updateIgnoredScopes();
      this.initialize();
    }

    ColorBuffer.prototype.onDidUpdateColorMarkers = function(callback) {
      return this.emitter.on('did-update-color-markers', callback);
    };

    ColorBuffer.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    ColorBuffer.prototype.initialize = function() {
      if (this.colorMarkers != null) {
        return Promise.resolve();
      }
      if (this.initializePromise != null) {
        return this.initializePromise;
      }
      this.updateVariableRanges();
      this.initializePromise = this.scanBufferForColors().then((function(_this) {
        return function(results) {
          return _this.createColorMarkers(results);
        };
      })(this)).then((function(_this) {
        return function(results) {
          _this.colorMarkers = results;
          return _this.initialized = true;
        };
      })(this));
      this.initializePromise.then((function(_this) {
        return function() {
          return _this.variablesAvailable();
        };
      })(this));
      return this.initializePromise;
    };

    ColorBuffer.prototype.restoreMarkersState = function(colorMarkers) {
      if (Color == null) {
        Color = require('./color');
      }
      if (ColorMarker == null) {
        ColorMarker = require('./color-marker');
      }
      this.updateVariableRanges();
      return this.colorMarkers = colorMarkers.filter(function(state) {
        return state != null;
      }).map((function(_this) {
        return function(state) {
          var color, marker, _ref1;
          marker = (_ref1 = _this.editor.getMarker(state.markerId)) != null ? _ref1 : _this.markerLayer.markBufferRange(state.bufferRange, {
            invalidate: 'touch'
          });
          color = new Color(state.color);
          color.variables = state.variables;
          color.invalid = state.invalid;
          return _this.colorMarkersByMarkerId[marker.id] = new ColorMarker({
            marker: marker,
            color: color,
            text: state.text,
            colorBuffer: _this
          });
        };
      })(this));
    };

    ColorBuffer.prototype.cleanUnusedTextEditorMarkers = function() {
      return this.markerLayer.findMarkers().forEach((function(_this) {
        return function(m) {
          if (_this.colorMarkersByMarkerId[m.id] == null) {
            return m.destroy();
          }
        };
      })(this));
    };

    ColorBuffer.prototype.variablesAvailable = function() {
      if (this.variablesPromise != null) {
        return this.variablesPromise;
      }
      return this.variablesPromise = this.project.initialize().then((function(_this) {
        return function(results) {
          if (_this.destroyed) {
            return;
          }
          if (results == null) {
            return;
          }
          if (_this.isIgnored() && _this.isVariablesSource()) {
            return _this.scanBufferForVariables();
          }
        };
      })(this)).then((function(_this) {
        return function(results) {
          return _this.scanBufferForColors({
            variables: results
          });
        };
      })(this)).then((function(_this) {
        return function(results) {
          return _this.updateColorMarkers(results);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.variableInitialized = true;
        };
      })(this))["catch"](function(reason) {
        return console.log(reason);
      });
    };

    ColorBuffer.prototype.update = function() {
      var promise;
      this.terminateRunningTask();
      promise = this.isIgnored() ? this.scanBufferForVariables() : !this.isVariablesSource() ? Promise.resolve([]) : this.project.reloadVariablesForPath(this.editor.getPath());
      return promise.then((function(_this) {
        return function(results) {
          return _this.scanBufferForColors({
            variables: results
          });
        };
      })(this)).then((function(_this) {
        return function(results) {
          return _this.updateColorMarkers(results);
        };
      })(this))["catch"](function(reason) {
        return console.log(reason);
      });
    };

    ColorBuffer.prototype.terminateRunningTask = function() {
      var _ref1;
      return (_ref1 = this.task) != null ? _ref1.terminate() : void 0;
    };

    ColorBuffer.prototype.destroy = function() {
      var _ref1;
      if (this.destroyed) {
        return;
      }
      this.terminateRunningTask();
      this.subscriptions.dispose();
      if ((_ref1 = this.colorMarkers) != null) {
        _ref1.forEach(function(marker) {
          return marker.destroy();
        });
      }
      this.destroyed = true;
      this.emitter.emit('did-destroy');
      return this.emitter.dispose();
    };

    ColorBuffer.prototype.isVariablesSource = function() {
      return this.project.isVariablesSourcePath(this.editor.getPath());
    };

    ColorBuffer.prototype.isIgnored = function() {
      var p;
      p = this.editor.getPath();
      return this.project.isIgnoredPath(p) || !atom.project.contains(p);
    };

    ColorBuffer.prototype.isDestroyed = function() {
      return this.destroyed;
    };

    ColorBuffer.prototype.getPath = function() {
      return this.editor.getPath();
    };

    ColorBuffer.prototype.getScope = function() {
      return this.project.scopeFromFileName(this.getPath());
    };

    ColorBuffer.prototype.updateIgnoredScopes = function() {
      var _ref1;
      this.ignoredScopes = this.project.getIgnoredScopes().map(function(scope) {
        try {
          return new RegExp(scope);
        } catch (_error) {}
      }).filter(function(re) {
        return re != null;
      });
      if ((_ref1 = this.getColorMarkers()) != null) {
        _ref1.forEach(function(marker) {
          return marker.checkMarkerScope(true);
        });
      }
      return this.emitter.emit('did-update-color-markers', {
        created: [],
        destroyed: []
      });
    };

    ColorBuffer.prototype.updateVariableRanges = function() {
      var variablesForBuffer;
      variablesForBuffer = this.project.getVariablesForPath(this.editor.getPath());
      return variablesForBuffer.forEach((function(_this) {
        return function(variable) {
          return variable.bufferRange != null ? variable.bufferRange : variable.bufferRange = Range.fromObject([_this.editor.getBuffer().positionForCharacterIndex(variable.range[0]), _this.editor.getBuffer().positionForCharacterIndex(variable.range[1])]);
        };
      })(this));
    };

    ColorBuffer.prototype.scanBufferForVariables = function() {
      var buffer, config, editor, results, taskPath;
      if (this.destroyed) {
        return Promise.reject("This ColorBuffer is already destroyed");
      }
      if (!this.editor.getPath()) {
        return Promise.resolve([]);
      }
      results = [];
      taskPath = require.resolve('./tasks/scan-buffer-variables-handler');
      editor = this.editor;
      buffer = this.editor.getBuffer();
      config = {
        buffer: this.editor.getText(),
        registry: this.project.getVariableExpressionsRegistry().serialize(),
        scope: this.getScope()
      };
      return new Promise((function(_this) {
        return function(resolve, reject) {
          _this.task = Task.once(taskPath, config, function() {
            _this.task = null;
            return resolve(results);
          });
          return _this.task.on('scan-buffer:variables-found', function(variables) {
            return results = results.concat(variables.map(function(variable) {
              variable.path = editor.getPath();
              variable.bufferRange = Range.fromObject([buffer.positionForCharacterIndex(variable.range[0]), buffer.positionForCharacterIndex(variable.range[1])]);
              return variable;
            }));
          });
        };
      })(this));
    };

    ColorBuffer.prototype.getMarkerLayer = function() {
      return this.markerLayer;
    };

    ColorBuffer.prototype.getColorMarkers = function() {
      return this.colorMarkers;
    };

    ColorBuffer.prototype.getValidColorMarkers = function() {
      var _ref1, _ref2;
      return (_ref1 = (_ref2 = this.getColorMarkers()) != null ? _ref2.filter(function(m) {
        var _ref3;
        return ((_ref3 = m.color) != null ? _ref3.isValid() : void 0) && !m.isIgnored();
      }) : void 0) != null ? _ref1 : [];
    };

    ColorBuffer.prototype.getColorMarkerAtBufferPosition = function(bufferPosition) {
      var marker, markers, _i, _len;
      markers = this.markerLayer.findMarkers({
        containsBufferPosition: bufferPosition
      });
      for (_i = 0, _len = markers.length; _i < _len; _i++) {
        marker = markers[_i];
        if (this.colorMarkersByMarkerId[marker.id] != null) {
          return this.colorMarkersByMarkerId[marker.id];
        }
      }
    };

    ColorBuffer.prototype.createColorMarkers = function(results) {
      if (this.destroyed) {
        return Promise.resolve([]);
      }
      if (ColorMarker == null) {
        ColorMarker = require('./color-marker');
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var newResults, processResults;
          newResults = [];
          processResults = function() {
            var marker, result, startDate;
            startDate = new Date;
            if (_this.editor.isDestroyed()) {
              return resolve([]);
            }
            while (results.length) {
              result = results.shift();
              marker = _this.markerLayer.markBufferRange(result.bufferRange, {
                invalidate: 'touch'
              });
              newResults.push(_this.colorMarkersByMarkerId[marker.id] = new ColorMarker({
                marker: marker,
                color: result.color,
                text: result.match,
                colorBuffer: _this
              }));
              if (new Date() - startDate > 10) {
                requestAnimationFrame(processResults);
                return;
              }
            }
            return resolve(newResults);
          };
          return processResults();
        };
      })(this));
    };

    ColorBuffer.prototype.findExistingMarkers = function(results) {
      var newMarkers, toCreate;
      newMarkers = [];
      toCreate = [];
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var processResults;
          processResults = function() {
            var marker, result, startDate;
            startDate = new Date;
            while (results.length) {
              result = results.shift();
              if (marker = _this.findColorMarker(result)) {
                newMarkers.push(marker);
              } else {
                toCreate.push(result);
              }
              if (new Date() - startDate > 10) {
                requestAnimationFrame(processResults);
                return;
              }
            }
            return resolve({
              newMarkers: newMarkers,
              toCreate: toCreate
            });
          };
          return processResults();
        };
      })(this));
    };

    ColorBuffer.prototype.updateColorMarkers = function(results) {
      var createdMarkers, newMarkers;
      newMarkers = null;
      createdMarkers = null;
      return this.findExistingMarkers(results).then((function(_this) {
        return function(_arg) {
          var markers, toCreate;
          markers = _arg.newMarkers, toCreate = _arg.toCreate;
          newMarkers = markers;
          return _this.createColorMarkers(toCreate);
        };
      })(this)).then((function(_this) {
        return function(results) {
          var toDestroy;
          createdMarkers = results;
          newMarkers = newMarkers.concat(results);
          if (_this.colorMarkers != null) {
            toDestroy = _this.colorMarkers.filter(function(marker) {
              return __indexOf.call(newMarkers, marker) < 0;
            });
            toDestroy.forEach(function(marker) {
              delete _this.colorMarkersByMarkerId[marker.id];
              return marker.destroy();
            });
          } else {
            toDestroy = [];
          }
          _this.colorMarkers = newMarkers;
          return _this.emitter.emit('did-update-color-markers', {
            created: createdMarkers,
            destroyed: toDestroy
          });
        };
      })(this));
    };

    ColorBuffer.prototype.findColorMarker = function(properties) {
      var marker, _i, _len, _ref1;
      if (properties == null) {
        properties = {};
      }
      if (this.colorMarkers == null) {
        return;
      }
      _ref1 = this.colorMarkers;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        marker = _ref1[_i];
        if (marker != null ? marker.match(properties) : void 0) {
          return marker;
        }
      }
    };

    ColorBuffer.prototype.findColorMarkers = function(properties) {
      var markers;
      if (properties == null) {
        properties = {};
      }
      markers = this.markerLayer.findMarkers(properties);
      return markers.map((function(_this) {
        return function(marker) {
          return _this.colorMarkersByMarkerId[marker.id];
        };
      })(this)).filter(function(marker) {
        return marker != null;
      });
    };

    ColorBuffer.prototype.findValidColorMarkers = function(properties) {
      return this.findColorMarkers(properties).filter((function(_this) {
        return function(marker) {
          var _ref1;
          return (marker != null) && ((_ref1 = marker.color) != null ? _ref1.isValid() : void 0) && !(marker != null ? marker.isIgnored() : void 0);
        };
      })(this));
    };

    ColorBuffer.prototype.selectColorMarkerAndOpenPicker = function(colorMarker) {
      var _ref1;
      if (this.destroyed) {
        return;
      }
      this.editor.setSelectedBufferRange(colorMarker.marker.getBufferRange());
      if (!((_ref1 = this.editor.getSelectedText()) != null ? _ref1.match(/^#[0-9a-fA-F]{3,8}$/) : void 0)) {
        return;
      }
      if (this.project.colorPickerAPI != null) {
        return this.project.colorPickerAPI.open(this.editor, this.editor.getLastCursor());
      }
    };

    ColorBuffer.prototype.scanBufferForColors = function(options) {
      var buffer, collection, config, registry, results, taskPath, variables, _ref1, _ref2, _ref3, _ref4, _ref5;
      if (options == null) {
        options = {};
      }
      if (this.destroyed) {
        return Promise.reject("This ColorBuffer is already destroyed");
      }
      if (Color == null) {
        Color = require('./color');
      }
      results = [];
      taskPath = require.resolve('./tasks/scan-buffer-colors-handler');
      buffer = this.editor.getBuffer();
      registry = this.project.getColorExpressionsRegistry().serialize();
      if (options.variables != null) {
        if (VariablesCollection == null) {
          VariablesCollection = require('./variables-collection');
        }
        collection = new VariablesCollection();
        collection.addMany(options.variables);
        options.variables = collection;
      }
      variables = this.isVariablesSource() ? ((_ref2 = (_ref3 = options.variables) != null ? _ref3.getVariables() : void 0) != null ? _ref2 : []).concat((_ref1 = this.project.getVariables()) != null ? _ref1 : []) : (_ref4 = (_ref5 = options.variables) != null ? _ref5.getVariables() : void 0) != null ? _ref4 : [];
      delete registry.expressions['pigments:variables'];
      delete registry.regexpString;
      config = {
        buffer: this.editor.getText(),
        bufferPath: this.getPath(),
        scope: this.getScope(),
        variables: variables,
        colorVariables: variables.filter(function(v) {
          return v.isColor;
        }),
        registry: registry
      };
      return new Promise((function(_this) {
        return function(resolve, reject) {
          _this.task = Task.once(taskPath, config, function() {
            _this.task = null;
            return resolve(results);
          });
          return _this.task.on('scan-buffer:colors-found', function(colors) {
            return results = results.concat(colors.map(function(res) {
              res.color = new Color(res.color);
              res.bufferRange = Range.fromObject([buffer.positionForCharacterIndex(res.range[0]), buffer.positionForCharacterIndex(res.range[1])]);
              return res;
            }));
          });
        };
      })(this));
    };

    ColorBuffer.prototype.serialize = function() {
      var _ref1;
      return {
        id: this.id,
        path: this.editor.getPath(),
        colorMarkers: (_ref1 = this.colorMarkers) != null ? _ref1.map(function(marker) {
          return marker.serialize();
        }) : void 0
      };
    };

    return ColorBuffer;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FybmVzY2hyZXVkZXIvLmRvdGZpbGVzL2F0b20vYXRvbS5zeW1saW5rL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9jb2xvci1idWZmZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlHQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxPQUlJLEVBSkosRUFDRSxlQURGLEVBQ1MscUJBRFQsRUFDc0IsNkJBRHRCLEVBRUUsaUJBRkYsRUFFVyw2QkFGWCxFQUVnQyxjQUZoQyxFQUVzQyxlQUZ0QyxFQUdFLFlBSEYsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLHFCQUFDLE1BQUQsR0FBQTtBQUNYLFVBQUEsZ0RBQUE7O1FBRFksU0FBTztPQUNuQjtBQUFBLE1BQUEsSUFBTyxlQUFQO0FBQ0UsUUFBQSxRQUE4QyxPQUFBLENBQVEsTUFBUixDQUE5QyxFQUFDLGdCQUFBLE9BQUQsRUFBVSw0QkFBQSxtQkFBVixFQUErQixhQUFBLElBQS9CLEVBQXFDLGNBQUEsS0FBckMsQ0FERjtPQUFBO0FBQUEsTUFHQyxJQUFDLENBQUEsZ0JBQUEsTUFBRixFQUFVLElBQUMsQ0FBQSxpQkFBQSxPQUFYLEVBQW9CLHNCQUFBLFlBSHBCLENBQUE7QUFBQSxNQUlDLElBQUMsQ0FBQSxLQUFNLElBQUMsQ0FBQSxPQUFQLEVBSkYsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FMWCxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBTmpCLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxhQUFELEdBQWUsRUFQZixDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsc0JBQUQsR0FBMEIsRUFUMUIsQ0FBQTtBQUFBLE1BV0EsSUFB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

//# sourceURL=/Users/arneschreuder/.dotfiles/atom/atom.symlink/packages/pigments/lib/color-buffer.coffee
