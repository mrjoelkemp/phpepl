var SessionStore = require('./sessionstore');
/**
 * A code editor wrapper around Codemirror
 *
 * @param {$} $element - Dom element the editor should bind to
 * @returns {CodeMirror}
 */
function Editor($element) {
  this.$element = $element;

  this._editor = window.CodeMirror(this.$element.get(0), {
    lineNumbers:       true,
    matchBrackets:     true,
    mode:              'text/x-php',
    indentUnit:        2,
    tabSize:           2,
    autofocus:         true,
    autoCloseBrackets: true
  });

  this._sessionStore = new SessionStore();

  this._defaultValue = 'echo "We\'re running php version: " . phpversion();';
}

/**
 * @return {String}
 */
Editor.prototype.getValue = function() {
  return this._editor.getValue();
};

/**
 * @param {String} val
 */
Editor.prototype.setValue = function(val) {
  this._editor.setValue(val);
};

/**
 * Highlights the line in the gutter with the error
 *
 * @param  {Number} line
 */
Editor.prototype.showLineError = function(line) {
  // Find the dom element in the gutter
  this.$element.find('.CodeMirror-linenumber').each(function() {
    // If the cell's line number matches the error line
    if (Number($(this).html()) === line) {
      // Make the background red
      $(this).addClass('error-gutter');
      return;
    }
  });
};

Editor.prototype.clearLineErrors = function() {
  this.$element.find('.CodeMirror-linenumber').removeClass('error-gutter');
};

Editor.prototype.saveSession = function() {
  this._sessionStore.save(this.getValue());
};

Editor.prototype.loadPreviousSession = function() {
  this.setValue(this._sessionStore.getPrevious());
};

Editor.prototype.loadNextSession = function() {
  this.setValue(this._sessionStore.getNext());
};

Editor.prototype.loadLastSession = function() {
  this.setValue(this.getLastSession() || this._defaultValue);
};

/**
 * Preload where you last left off
 * @return {String}
 */
Editor.prototype.getLastSession = function() {
  return this._sessionStore.getLast() || '';
};

/**
 * Process/Eval the code
 *
 * @param  {Object} options
 * @param  {Object} options.evalURL - Url to use for evaluation
 * @return {Deferred}
 */
Editor.prototype.evaluateCode = function(options) {
  var promise = $.ajax({
    type:     'POST',
    url:      options.evalURL,
    data:     {code: this.getValue()},
    dataType: 'json'
  });

  promise.then(function() {
    this.saveSession();
  }.bind(this));

  return promise;
};

module.exports = Editor;
