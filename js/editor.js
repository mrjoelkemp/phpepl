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

Editor.prototype.getValue = function() {
  return this._editor.getValue();
};

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

module.exports = Editor;
