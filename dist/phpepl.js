(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * An output console
 * @param {$} $element
 */
function Console($element) {
  this.$element = $element;
  this.$output = this.$element.find('.output-container span');
}

/**
 * @param {String} text
 */
Console.prototype.setOutput = function(text) {
  this.$output
  .html(text)
  .removeClass('error');
};

/**
 * @param {Object} error
 * @param {Number} error.line
 * @param {String} error.message
 */
Console.prototype.setError = function(error) {
  var errorMsg;

  if (error.line && error.message) {
    // Show the error message
    errorMsg = 'Line ' + error.line + ': ';
  }

  errorMsg += error.message;

  this.setOutput(errorMsg);

  this.$output.addClass('error');
};

/**
 * @param  {Boolean} state
 */
Console.prototype.toggleSpinner = function(state) {
  var $spinner = this.$element.find('.spinner');

  if (state) {
    $spinner.fadeIn('fast');
  } else {
    $spinner.fadeOut('fast');
  }
};

module.exports = Console;

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
/**
 * Helper to show the fatal errors nicely
 *
 * @param  {String} responseText
 * @return {String} A list of the error text and line number that generated the error.
 */
module.exports = function(responseText) {
  if (!responseText.length) { return ''; }

  var text = responseText;
  var tokensToReplace = ['\n', /<br \/>/g, /<b>/g, /<\/b>/g, /(Fatal error: +)/g];
  var splitTokens;
  var err;
  var line;
  var lineNum;

  // If the error message doesn't contain 'fatal error',
  // then just print it
  if (!responseText.toLowerCase().indexOf('fatal error')) {
    return [responseText, 1];
  }

  tokensToReplace.forEach(function(val) {
    text = text.replace(val, '');
  });

  splitTokens = text.split('in');
  err = splitTokens[0].trim();
  splitTokens = text.split('on');
  line = splitTokens[1].trim();

  text = (err + ' on ' + line).trim();

  lineNum = line.split(' ');
  lineNum = Number(lineNum[1]);

  return [text, lineNum];
};

},{}],4:[function(require,module,exports){
/**
 * Returns a pretty timestamp (only time)
 * @return {String}
 */
module.exports = function() {
  var now = new Date();
  var time = [now.getHours(), now.getMinutes(), now.getSeconds()];
  var suffix = time[0] < 12 ? 'AM' : 'PM';

  // Convert hour from military time
  time[0] = time[0] < 12 ? time[0] : time[0] - 12;

  // If hour is 0, set it to 12
  time[0] = time[0] || 12;

  // If seconds and minutes are less than 10, add a zero
  for (var i = 1; i < 3; i++) {
    if (time[i] < 10) {
      time[i] = '0' + time[i];
    }
  }

  return time.join(':') + ' ' + suffix;
};

},{}],5:[function(require,module,exports){
'use strict';

var Editor = require('./editor');
var Console = require('./console');
var getPrettyFatalErrorMessage = require('./lib/getPrettyFatalErrorMessage');
var timestamp = require('./lib/timestamp');

var editor = new Editor($('#editor'));
var console = new Console($('.console'));

var mixpanel = window.mixpanel || {};
var evalURL = 'eval/index.php';

var savedCode = editor.getSavedCode();
if (savedCode) {
  editor.setValue(savedCode);

} else {
  editor.setValue('echo "We\'re running php version: " . phpversion();');
}

if (!onPHP5Version() && isLiveEnv()) { $('.link-to-heroku').fadeIn('fast'); }

$(document).keydown(checkForShortcuts);

// Remember the code in the editor before navigating away
$(window).unload(function() {
  editor.saveCode();
});

function hostHas(part) {
  return window.location.host.indexOf(part) !== -1;
}

function isLiveEnv() {
  return hostHas('cloudcontrolled') || hostHas('herokuapp');
}

function onPHP5Version() {
  return hostHas('herokuapp');
}

// Handles the sending of the code to the eval server
function processCode() {
  var code = editor.getValue();

  if (!code.length) {
    console.setOutput('Please supply some code...');
    return;
  }

  console.toggleSpinner(true);

  mixpanel.track('Code Run', {code: code});

  editor.evaluateCode({evalURL: evalURL})
    .done(processResponse)
    .fail(processFatalError);
}

function processResponse(res) {
  if (!res) { return; }

  if (!res.error) {
    console.setOutput(res.result);
    $('.timestamp span').html(timestamp());

  } else {
    console.setError(res.error);

    if (res.error.line) {
      // Show the line in red
      editor.showLineError(res.error.line);
    }
  }

  console.toggleSpinner(false);
}

function processFatalError(error) {
  if (!error) { return; }

  var textLine = getPrettyFatalErrorMessage(error.responseText);

  console.setError({
    message: textLine[0],
    line: textLine[1]
  });

  console.toggleSpinner(false);
  editor.showLineError(textLine[1]);

  mixpanel.track('Error', {error: error.responseText});
}

function checkForShortcuts(e) {
  // CMD + Enter or CTRL + Enter to run code
  if (e.which === 13 && (e.ctrlKey || e.metaKey)) {
    processCode();
    e.preventDefault();
  }

  // CMD + S or CTRL + S to save code
  if (e.which === 83 && (e.ctrlKey || e.metaKey)) {
    editor.saveCode();
    e.preventDefault();
    mixpanel.track('Save Shortcut');
    $('.timestamp span').html('Code Saved!');
  }
}

},{"./console":1,"./editor":2,"./lib/getPrettyFatalErrorMessage":3,"./lib/timestamp":4}]},{},[5]);
