(function() {
  module.exports = {
    config: {
      useBladeComments: {
        type: 'boolean',
        "default": true,
        description: 'Use Blade comments by default when toggling line comments'
      }
    },
    activate: function(state) {
      return this.changeUseBladeComments = atom.config.observe('language-blade.useBladeComments', this.setBladeComments);
    },
    deactivate: function() {
      return this.changeUseBladeComments.dispose();
    },
    setBladeComments: function(enabled) {
      var opts;
      opts = {
        scopeSelector: ['.text.html.php.blade']
      };
      if (enabled) {
        atom.config.set('editor.commentStart', '{{-- ', opts);
        return atom.config.set('editor.commentEnd', ' --}}', opts);
      } else {
        atom.config.unset('editor.commentStart', opts);
        return atom.config.unset('editor.commentEnd', opts);
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FybmVzY2hyZXVkZXIvLmRvdGZpbGVzL2F0b20vYXRvbS5zeW1saW5rL3BhY2thZ2VzL2xhbmd1YWdlLWJsYWRlL2xpYi9sYW5ndWFnZS1ibGFkZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxnQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSwyREFGYjtPQURGO0tBREY7QUFBQSxJQU1BLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxzQkFBRCxHQUEwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsaUNBQXBCLEVBQXVELElBQUMsQ0FBQSxnQkFBeEQsRUFEbEI7SUFBQSxDQU5WO0FBQUEsSUFTQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLHNCQUFzQixDQUFDLE9BQXhCLENBQUEsRUFEVTtJQUFBLENBVFo7QUFBQSxJQVlBLGdCQUFBLEVBQWtCLFNBQUMsT0FBRCxHQUFBO0FBQ2hCLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPO0FBQUEsUUFBQSxhQUFBLEVBQWUsQ0FBQyxzQkFBRCxDQUFmO09BQVAsQ0FBQTtBQUNBLE1BQUEsSUFBRyxPQUFIO0FBQ0UsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUJBQWhCLEVBQXVDLE9BQXZDLEVBQWdELElBQWhELENBQUEsQ0FBQTtlQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixtQkFBaEIsRUFBcUMsT0FBckMsRUFBOEMsSUFBOUMsRUFGRjtPQUFBLE1BQUE7QUFJRSxRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBWixDQUFrQixxQkFBbEIsRUFBeUMsSUFBekMsQ0FBQSxDQUFBO2VBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFaLENBQWtCLG1CQUFsQixFQUF1QyxJQUF2QyxFQUxGO09BRmdCO0lBQUEsQ0FabEI7R0FERixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/arneschreuder/.dotfiles/atom/atom.symlink/packages/language-blade/lib/language-blade.coffee
