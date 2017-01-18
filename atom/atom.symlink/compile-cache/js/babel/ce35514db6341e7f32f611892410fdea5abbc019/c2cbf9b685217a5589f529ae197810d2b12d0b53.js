function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

// eslint-disable-next-line import/extensions

var _atom = require('atom');

'use babel';

module.exports = {
  config: {
    executablePath: {
      type: 'string',
      'default': _path2['default'].join(__dirname, '..', 'node_modules', 'jshint', 'bin', 'jshint'),
      description: 'Path of the `jshint` node script'
    },
    lintInlineJavaScript: {
      type: 'boolean',
      'default': false,
      description: 'Lint JavaScript inside `<script>` blocks in HTML or PHP files.'
    },
    disableWhenNoJshintrcFileInPath: {
      type: 'boolean',
      'default': false,
      description: 'Disable linter when no `.jshintrc` is found in project.'
    },
    jshintFileName: {
      type: 'string',
      'default': '.jshintrc',
      description: 'jshint file name'
    }
  },

  activate: function activate() {
    var _this = this;

    require('atom-package-deps').install('linter-jshint');

    this.scopes = ['source.js', 'source.js-semantic'];
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-jshint.executablePath', function (executablePath) {
      _this.executablePath = executablePath;
    }));
    this.subscriptions.add(atom.config.observe('linter-jshint.disableWhenNoJshintrcFileInPath', function (disableWhenNoJshintrcFileInPath) {
      _this.disableWhenNoJshintrcFileInPath = disableWhenNoJshintrcFileInPath;
    }));

    this.subscriptions.add(atom.config.observe('linter-jshint.jshintFileName', function (jshintFileName) {
      _this.jshintFileName = jshintFileName;
    }));

    var scopeEmbedded = 'source.js.embedded.html';
    this.subscriptions.add(atom.config.observe('linter-jshint.lintInlineJavaScript', function (lintInlineJavaScript) {
      _this.lintInlineJavaScript = lintInlineJavaScript;
      if (lintInlineJavaScript) {
        _this.scopes.push(scopeEmbedded);
      } else if (_this.scopes.indexOf(scopeEmbedded) !== -1) {
        _this.scopes.splice(_this.scopes.indexOf(scopeEmbedded), 1);
      }
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    var Helpers = require('atom-linter');
    var Reporter = require('jshint-json');

    return {
      name: 'JSHint',
      grammarScopes: this.scopes,
      scope: 'file',
      lintOnFly: true,
      lint: _asyncToGenerator(function* (textEditor) {
        var results = [];
        var filePath = textEditor.getPath();
        var fileContents = textEditor.getText();
        var parameters = ['--reporter', Reporter, '--filename', filePath];

        var configFile = yield Helpers.findCachedAsync(_path2['default'].dirname(filePath), _this2.jshintFileName);

        if (configFile) {
          parameters.push('--config', configFile);
        } else if (_this2.disableWhenNoJshintrcFileInPath) {
          return results;
        }

        if (_this2.lintInlineJavaScript && textEditor.getGrammar().scopeName.indexOf('text.html') !== -1) {
          parameters.push('--extract', 'always');
        }
        parameters.push('-');

        var execOpts = { stdin: fileContents, ignoreExitCode: true };
        var result = yield Helpers.execNode(_this2.executablePath, parameters, execOpts);

        if (textEditor.getText() !== fileContents) {
          // File has changed since the lint was triggered, tell Linter not to update
          return null;
        }

        var parsed = undefined;
        try {
          parsed = JSON.parse(result);
        } catch (_) {
          console.error('[Linter-JSHint]', _, result);
          atom.notifications.addWarning('[Linter-JSHint]', { detail: 'JSHint return an invalid response, check your console for more info' });
          return results;
        }

        for (var entry of parsed.result) {
          if (!entry.error.id) {
            continue;
          }

          var error = entry.error;
          var errorType = error.code.substr(0, 1);
          var errorLine = error.line > 0 ? error.line - 1 : 0;
          var range = undefined;

          // TODO: Remove workaround of jshint/jshint#2846
          if (error.character === null) {
            range = Helpers.rangeFromLineNumber(textEditor, errorLine);
          } else {
            var character = error.character > 0 ? error.character - 1 : 0;
            var line = errorLine;
            var buffer = textEditor.getBuffer();
            var maxLine = buffer.getLineCount();
            // TODO: Remove workaround of jshint/jshint#2894
            if (errorLine >= maxLine) {
              line = maxLine;
            }
            var maxCharacter = buffer.lineLengthForRow(line);
            // TODO: Remove workaround of jquery/esprima#1457
            if (character > maxCharacter) {
              character = maxCharacter;
            }
            range = Helpers.rangeFromLineNumber(textEditor, line, character);
          }

          results.push({
            type: errorType === 'E' ? 'Error' : errorType === 'W' ? 'Warning' : 'Info',
            text: error.code + ' - ' + error.reason,
            filePath: filePath,
            range: range
          });
        }
        return results;
      })
    };
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hcm5lc2NocmV1ZGVyLy5kb3RmaWxlcy9hdG9tL2F0b20uc3ltbGluay9wYWNrYWdlcy9saW50ZXItanNoaW50L2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBSWlCLE1BQU07Ozs7OztvQkFFYSxNQUFNOztBQU4xQyxXQUFXLENBQUE7O0FBVVgsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLFFBQU0sRUFBRTtBQUNOLGtCQUFjLEVBQUU7QUFDZCxVQUFJLEVBQUUsUUFBUTtBQUNkLGlCQUFTLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQztBQUM5RSxpQkFBVyxFQUFFLGtDQUFrQztLQUNoRDtBQUNELHdCQUFvQixFQUFFO0FBQ3BCLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsS0FBSztBQUNkLGlCQUFXLEVBQUUsZ0VBQWdFO0tBQzlFO0FBQ0QsbUNBQStCLEVBQUU7QUFDL0IsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0FBQ2QsaUJBQVcsRUFBRSx5REFBeUQ7S0FDdkU7QUFDRCxrQkFBYyxFQUFFO0FBQ2QsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxXQUFXO0FBQ3BCLGlCQUFXLEVBQUUsa0JBQWtCO0tBQ2hDO0dBQ0Y7O0FBRUQsVUFBUSxFQUFBLG9CQUFHOzs7QUFDVCxXQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUE7O0FBRXJELFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxXQUFXLEVBQUUsb0JBQW9CLENBQUMsQ0FBQTtBQUNqRCxRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDhCQUE4QixFQUFFLFVBQUMsY0FBYyxFQUFL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QU07QUFDTCxnQkFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLFNBQVMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQzdELGdCQUFJLElBQUksR0FBRyxTQUFTLENBQUE7QUFDcEIsZ0JBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtBQUNyQyxnQkFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFBOztBQUVyQyxnQkFBSSxTQUFTLElBQUksT0FBTyxFQUFFO0FBQ3hCLGtCQUFJLEdBQUcsT0FBTyxDQUFBO2FBQ2Y7QUFDRCxnQkFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFBOztBQUVsRCxnQkFBSSxTQUFTLEdBQUcsWUFBWSxFQUFFO0FBQzVCLHVCQUFTLEdBQUcsWUFBWSxDQUFBO2FBQ3pCO0FBQ0QsaUJBQUssR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQTtXQUNqRTs7QUFFRCxpQkFBTyxDQUFDLElBQUksQ0FBQztBQUNYLGdCQUFJLEVBQUUsU0FBUyxLQUFLLEdBQUcsR0FBRyxPQUFPLEdBQUcsU0FBUyxLQUFLLEdBQUcsR0FBRyxTQUFTLEdBQUcsTUFBTTtBQUMxRSxnQkFBSSxFQUFLLEtBQUssQ0FBQyxJQUFJLFdBQU0sS0FBSyxDQUFDLE1BQU0sQUFBRTtBQUN2QyxvQkFBUSxFQUFSLFFBQVE7QUFDUixpQkFBSyxFQUFMLEtBQUs7V0FDTixDQUFDLENBQUE7U0FDSDtBQUNELGVBQU8sT0FBTyxDQUFBO09BQ2YsQ0FBQTtLQUNGLENBQUE7R0FDRjtDQUNGLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FybmVzY2hyZXVkZXIvLmRvdGZpbGVzL2F0b20vYXRvbS5zeW1saW5rL3BhY2thZ2VzL2xpbnRlci1qc2hpbnQvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG4vKiBAZmxvdyAqL1xuXG5pbXBvcnQgUGF0aCBmcm9tICdwYXRoJ1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9leHRlbnNpb25zXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxudHlwZSBMaW50ZXIkUHJvdmlkZXIgPSBPYmplY3RcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbmZpZzoge1xuICAgIGV4ZWN1dGFibGVQYXRoOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IFBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICdub2RlX21vZHVsZXMnLCAnanNoaW50JywgJ2JpbicsICdqc2hpbnQnKSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUGF0aCBvZiB0aGUgYGpzaGludGAgbm9kZSBzY3JpcHQnXG4gICAgfSxcbiAgICBsaW50SW5saW5lSmF2YVNjcmlwdDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogJ0xpbnQgSmF2YVNjcmlwdCBpbnNpZGUgYDxzY3JpcHQ+YCBibG9ja3MgaW4gSFRNTCBvciBQSFAgZmlsZXMuJ1xuICAgIH0sXG4gICAgZGlzYWJsZVdoZW5Ob0pzaGludHJjRmlsZUluUGF0aDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogJ0Rpc2FibGUgbGludGVyIHdoZW4gbm8gYC5qc2hpbnRyY2AgaXMgZm91bmQgaW4gcHJvamVjdC4nXG4gICAgfSxcbiAgICBqc2hpbnRGaWxlTmFtZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnLmpzaGludHJjJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnanNoaW50IGZpbGUgbmFtZSdcbiAgICB9XG4gIH0sXG5cbiAgYWN0aXZhdGUoKSB7XG4gICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdsaW50ZXItanNoaW50JylcblxuICAgIHRoaXMuc2NvcGVzID0gWydzb3VyY2UuanMnLCAnc291cmNlLmpzLXNlbWFudGljJ11cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItanNoaW50LmV4ZWN1dGFibGVQYXRoJywgKGV4ZWN1dGFibGVQYXRoKSA9PiB7XG4gICAgICB0aGlzLmV4ZWN1dGFibGVQYXRoID0gZXhlY3V0YWJsZVBhdGhcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWpzaGludC5kaXNhYmxlV2hlbk5vSnNoaW50cmNGaWxlSW5QYXRoJyxcbiAgICAgICAgKGRpc2FibGVXaGVuTm9Kc2hpbnRyY0ZpbGVJblBhdGgpID0+IHtcbiAgICAgICAgICB0aGlzLmRpc2FibGVXaGVuTm9Kc2hpbnRyY0ZpbGVJblBhdGggPSBkaXNhYmxlV2hlbk5vSnNoaW50cmNGaWxlSW5QYXRoXG4gICAgICAgIH1cbiAgICAgIClcbiAgICApXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1qc2hpbnQuanNoaW50RmlsZU5hbWUnLCAoanNoaW50RmlsZU5hbWUpID0+IHtcbiAgICAgIHRoaXMuanNoaW50RmlsZU5hbWUgPSBqc2hpbnRGaWxlTmFtZVxuICAgIH0pKVxuXG4gICAgY29uc3Qgc2NvcGVFbWJlZGRlZCA9ICdzb3VyY2UuanMuZW1iZWRkZWQuaHRtbCdcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1qc2hpbnQubGludElubGluZUphdmFTY3JpcHQnLFxuICAgICAgKGxpbnRJbmxpbmVKYXZhU2NyaXB0KSA9PiB7XG4gICAgICAgIHRoaXMubGludElubGluZUphdmFTY3JpcHQgPSBsaW50SW5saW5lSmF2YVNjcmlwdFxuICAgICAgICBpZiAobGludElubGluZUphdmFTY3JpcHQpIHtcbiAgICAgICAgICB0aGlzLnNjb3Blcy5wdXNoKHNjb3BlRW1iZWRkZWQpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zY29wZXMuaW5kZXhPZihzY29wZUVtYmVkZGVkKSAhPT0gLTEpIHtcbiAgICAgICAgICB0aGlzLnNjb3Blcy5zcGxpY2UodGhpcy5zY29wZXMuaW5kZXhPZihzY29wZUVtYmVkZGVkKSwgMSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICkpXG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcigpOiBMaW50ZXIkUHJvdmlkZXIge1xuICAgIGNvbnN0IEhlbHBlcnMgPSByZXF1aXJlKCdhdG9tLWxpbnRlcicpXG4gICAgY29uc3QgUmVwb3J0ZXIgPSByZXF1aXJlKCdqc2hpbnQtanNvbicpXG5cbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ0pTSGludCcsXG4gICAgICBncmFtbWFyU2NvcGVzOiB0aGlzLnNjb3BlcyxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50T25GbHk6IHRydWUsXG4gICAgICBsaW50OiBhc3luYyAodGV4dEVkaXRvcikgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHRzID0gW11cbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKVxuICAgICAgICBjb25zdCBmaWxlQ29udGVudHMgPSB0ZXh0RWRpdG9yLmdldFRleHQoKVxuICAgICAgICBjb25zdCBwYXJhbWV0ZXJzID0gWyctLXJlcG9ydGVyJywgUmVwb3J0ZXIsICctLWZpbGVuYW1lJywgZmlsZVBhdGhdXG5cbiAgICAgICAgY29uc3QgY29uZmlnRmlsZSA9IGF3YWl0IEhlbHBlcnMuZmluZENhY2hlZEFzeW5jKFxuICAgICAgICAgIFBhdGguZGlybmFtZShmaWxlUGF0aCksIHRoaXMuanNoaW50RmlsZU5hbWVcbiAgICAgICAgKVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlKSB7XG4gICAgICAgICAgcGFyYW1ldGVycy5wdXNoKCctLWNvbmZpZycsIGNvbmZpZ0ZpbGUpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5kaXNhYmxlV2hlbk5vSnNoaW50cmNGaWxlSW5QYXRoKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmxpbnRJbmxpbmVKYXZhU2NyaXB0ICYmXG4gICAgICAgICAgdGV4dEVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lLmluZGV4T2YoJ3RleHQuaHRtbCcpICE9PSAtMVxuICAgICAgICApIHtcbiAgICAgICAgICBwYXJhbWV0ZXJzLnB1c2goJy0tZXh0cmFjdCcsICdhbHdheXMnKVxuICAgICAgICB9XG4gICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLScpXG5cbiAgICAgICAgY29uc3QgZXhlY09wdHMgPSB7IHN0ZGluOiBmaWxlQ29udGVudHMsIGlnbm9yZUV4aXRDb2RlOiB0cnVlIH1cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgSGVscGVycy5leGVjTm9kZShcbiAgICAgICAgICB0aGlzLmV4ZWN1dGFibGVQYXRoLCBwYXJhbWV0ZXJzLCBleGVjT3B0c1xuICAgICAgICApXG5cbiAgICAgICAgaWYgKHRleHRFZGl0b3IuZ2V0VGV4dCgpICE9PSBmaWxlQ29udGVudHMpIHtcbiAgICAgICAgICAvLyBGaWxlIGhhcyBjaGFuZ2VkIHNpbmNlIHRoZSBsaW50IHdhcyB0cmlnZ2VyZWQsIHRlbGwgTGludGVyIG5vdCB0byB1cGRhdGVcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBhcnNlZFxuICAgICAgICB0cnkge1xuICAgICAgICAgIHBhcnNlZCA9IEpTT04ucGFyc2UocmVzdWx0KVxuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignW0xpbnRlci1KU0hpbnRdJywgXywgcmVzdWx0KVxuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdbTGludGVyLUpTSGludF0nLFxuICAgICAgICAgICAgeyBkZXRhaWw6ICdKU0hpbnQgcmV0dXJuIGFuIGludmFsaWQgcmVzcG9uc2UsIGNoZWNrIHlvdXIgY29uc29sZSBmb3IgbW9yZSBpbmZvJyB9XG4gICAgICAgICAgKVxuICAgICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHBhcnNlZC5yZXN1bHQpIHtcbiAgICAgICAgICBpZiAoIWVudHJ5LmVycm9yLmlkKSB7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGVycm9yID0gZW50cnkuZXJyb3JcbiAgICAgICAgICBjb25zdCBlcnJvclR5cGUgPSBlcnJvci5jb2RlLnN1YnN0cigwLCAxKVxuICAgICAgICAgIGNvbnN0IGVycm9yTGluZSA9IGVycm9yLmxpbmUgPiAwID8gZXJyb3IubGluZSAtIDEgOiAwXG4gICAgICAgICAgbGV0IHJhbmdlXG5cbiAgICAgICAgICAvLyBUT0RPOiBSZW1vdmUgd29ya2Fyb3VuZCBvZiBqc2hpbnQvanNoaW50IzI4NDZcbiAgICAgICAgICBpZiAoZXJyb3IuY2hhcmFjdGVyID09PSBudWxsKSB7XG4gICAgICAgICAgICByYW5nZSA9IEhlbHBlcnMucmFuZ2VGcm9tTGluZU51bWJlcih0ZXh0RWRpdG9yLCBlcnJvckxpbmUpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBjaGFyYWN0ZXIgPSBlcnJvci5jaGFyYWN0ZXIgPiAwID8gZXJyb3IuY2hhcmFjdGVyIC0gMSA6IDBcbiAgICAgICAgICAgIGxldCBsaW5lID0gZXJyb3JMaW5lXG4gICAgICAgICAgICBjb25zdCBidWZmZXIgPSB0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICAgICAgICBjb25zdCBtYXhMaW5lID0gYnVmZmVyLmdldExpbmVDb3VudCgpXG4gICAgICAgICAgICAvLyBUT0RPOiBSZW1vdmUgd29ya2Fyb3VuZCBvZiBqc2hpbnQvanNoaW50IzI4OTRcbiAgICAgICAgICAgIGlmIChlcnJvckxpbmUgPj0gbWF4TGluZSkge1xuICAgICAgICAgICAgICBsaW5lID0gbWF4TGluZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbWF4Q2hhcmFjdGVyID0gYnVmZmVyLmxpbmVMZW5ndGhGb3JSb3cobGluZSlcbiAgICAgICAgICAgIC8vIFRPRE86IFJlbW92ZSB3b3JrYXJvdW5kIG9mIGpxdWVyeS9lc3ByaW1hIzE0NTdcbiAgICAgICAgICAgIGlmIChjaGFyYWN0ZXIgPiBtYXhDaGFyYWN0ZXIpIHtcbiAgICAgICAgICAgICAgY2hhcmFjdGVyID0gbWF4Q2hhcmFjdGVyXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByYW5nZSA9IEhlbHBlcnMucmFuZ2VGcm9tTGluZU51bWJlcih0ZXh0RWRpdG9yLCBsaW5lLCBjaGFyYWN0ZXIpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6IGVycm9yVHlwZSA9PT0gJ0UnID8gJ0Vycm9yJyA6IGVycm9yVHlwZSA9PT0gJ1cnID8gJ1dhcm5pbmcnIDogJ0luZm8nLFxuICAgICAgICAgICAgdGV4dDogYCR7ZXJyb3IuY29kZX0gLSAke2Vycm9yLnJlYXNvbn1gLFxuICAgICAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgICAgICByYW5nZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/arneschreuder/.dotfiles/atom/atom.symlink/packages/linter-jshint/lib/main.js
