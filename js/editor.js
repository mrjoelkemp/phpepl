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

/**
 * @param  {String} code
 */
Editor.prototype.saveCode = function() {
  if (!window.localStorage) { return; }

  window.localStorage.setItem('code', this.getValue());
  window.mixpanel.track('Code Saved');
};

/**
 * Preload where you last left off
 * @return {String}
 */
Editor.prototype.getSavedCode = function() {
  if (!window.localStorage) { return; }

  return window.localStorage.getItem('code') || '';
};

/**
 * Process/Eval the code
 *
 * @param  {Object} options
 * @param  {Object} options.evalURL - Url to use for evaluation
 * @return {Deferred}
 */
Editor.prototype.evaluateCode = function(options) {
  return $.ajax({
    type:     'POST',
    url:      options.evalURL,
    data:     {code: this.getValue()},
    dataType: 'json'
  });
};

module.exports = Editor;
