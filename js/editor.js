module.exports = window.CodeMirror($('#editor')[0], {
  lineNumbers:       true,
  matchBrackets:     true,
  mode:              'text/x-php',
  indentUnit:        2,
  tabSize:           2,
  autofocus:         true,
  autoCloseBrackets: true
});
