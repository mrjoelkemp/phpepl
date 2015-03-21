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
var SessionStore = require('./sessionstore');

/**
 * A code editor wrapper around the client-side text editor
 *
 * @param {String} selector - Dom element the editor should bind to
 */
function Editor(selector) {
  this.$element = $('#' + selector);

  this._editor = window.ace.edit(selector);
  this._editor.getSession().setMode({path: 'ace/mode/php', inline: true});
  this._editor.getSession().setUseSoftTabs(true);
  this._editor.getSession().setTabSize(2);

  this._editor.$blockScrolling = Infinity;
  this._editor.setShowPrintMargin(false);
  this._editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: false
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
  this.$element
  .find('.ace_gutter-cell:nth-child(' + line + ')')
    .addClass('error-gutter');
};

Editor.prototype.clearLineErrors = function() {
  this.$element.find('.ace_gutter-cell').removeClass('error-gutter');
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

},{"./sessionstore":8}],3:[function(require,module,exports){
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
// http://stackoverflow.com/a/1099670/700897
module.exports = function(qs) {
  qs = qs.split('+').join(' ');

  var params = {};
  var tokens;
  var re = /[?&]?([^=]+)=([^&]*)/g;
  var token1;

  tokens = re.exec(qs);

  while (tokens) {
    token1 = decodeURIComponent(tokens[1]);
    params[token1] = decodeURIComponent(tokens[2]);
    tokens = re.exec(qs);
  }

  return params;
};

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
'use strict';

/**
 * @param  {String} part
 * @return {Boolean}
 */
module.exports.hostHas = function(part) {
  return window.location.host.indexOf(part) !== -1;
};

/**
 * @return {Boolean}
 */
module.exports.isLiveEnv = function() {
  return this.hostHas('cloudcontrolled') || this.hostHas('herokuapp');
};

/**
 * @return {Boolean}
 */
module.exports.onPHP5Version = function() {
  return this.hostHas('herokuapp');
};

},{}],7:[function(require,module,exports){
'use strict';

var Editor = require('./editor');
var Console = require('./console');
var Sidebar = require('./sidebar');

var getPrettyFatalErrorMessage = require('./lib/getPrettyFatalErrorMessage');
var getQueryParams = require('./lib/getQueryParams');
var timestamp = require('./lib/timestamp');
var utils = require('./lib/utils');

var editor = new Editor('editor');
var console = new Console($('.console'));
var sidebar = new Sidebar($('.sidebar'));

var mixpanel = window.mixpanel || {};
var evalURL = 'eval/index.php';

var code = getQueryParams(document.location.search).code;
if (code) {
  code = window.decodeURIComponent(code);
  editor.setValue(code);
  mixpanel.track('Visit Code Url', {code: code});

} else {
  editor.loadLastSession();
  code = editor.getValue();
}

sidebar.shareCode(code);

if (!utils.onPHP5Version() && utils.isLiveEnv()) {
  $('.link-to-heroku').fadeIn('fast');
}

$(document).keydown(function(e) {
  // CMD + Enter or CTRL + Enter to run code
  if (e.which === 13 && (e.ctrlKey || e.metaKey)) {
    processCode();
    return false;
  }

  // CMD + S or CTRL + S to save code
  if (e.which === 83 && (e.ctrlKey || e.metaKey)) {
    editor.saveSession();
    mixpanel.track('Save Shortcut');
    $('.timestamp span').html('Code Saved!');
    return false;
  }

  // (CMD or CTRL) + Shift + Up to get previous session
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.which === 38) {
    mixpanel.track('Previous Session Shortcut');
    editor.loadPreviousSession();
    return false;
  }

  // (CMD or CTRL) + Shift + Down to get next session
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.which === 40) {
    mixpanel.track('Next Session Shortcut');
    editor.loadNextSession();
    return false;
  }
});

// TODO: Move to sidebar binding, but need to emit an event
// that phpepl listens to and then calls process code
$('.title button').click(processCode);

// Remember the code in the editor before navigating away
$(window).unload(function() {
  editor.saveSession();
});

/**
 * Handles the sending of the code to the eval server
 */
function processCode() {
  var code = editor.getValue();

  if (!code.length) {
    console.setOutput('Please supply some code...');
    return;
  }

  sidebar.shareCode(code);

  console.toggleSpinner(true);

  mixpanel.track('Code Run', {code: code});

  editor.evaluateCode({evalURL: evalURL})
    .done(processResponse)
    .fail(processFatalError);
}

/**
 * @param  {Object} res
 * @param  {Object} res.error
 * @param  {String} res.result
 */
function processResponse(res) {
  if (!res) { return; }

  editor.clearLineErrors();

  if (!res.error) {
    console.setOutput(res.result);
    $('.timestamp span').html(timestamp());

  } else {
    console.setError(res.error);

    if (res.error.line) {
      editor.showLineError(res.error.line);
    }
  }

  console.toggleSpinner(false);
}

/**
 * @param  {Object} error
 */
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

},{"./console":1,"./editor":2,"./lib/getPrettyFatalErrorMessage":3,"./lib/getQueryParams":4,"./lib/timestamp":5,"./lib/utils":6,"./sidebar":9}],8:[function(require,module,exports){
'use strict';

function SessionStore() {
  this._sessionLimit = 100;
  this._dataKey = 'sessions';

  this._sessions = this._getAllSessions();
  this._currentSessionIndex = this._sessions.length - 1;
}

/**
 * Returns the last execution
 * @return {?String}
 */
SessionStore.prototype.getLast = function() {
  return this._sessions[this._sessions.length - 1];
};

/**
 * @param {String} code
 */
SessionStore.prototype.save = function(code) {
  // Don't store a just repeated session
  if (code === this.getLast()) { return; }

  this._sessions.push(code);

  if (this._sessions.length > this._sessionLimit) {
    this._sessions.shift();
  }

  this._currentSessionIndex = this._sessions.length - 1;
  this._storeSessions();
};

/**
 * Get the previous session in the history
 * @return {String}
 */
SessionStore.prototype.getPrevious = function() {
  if (!this._sessions.length) { return ''; }

  --this._currentSessionIndex;

  if (this._currentSessionIndex < 0) {
    this._currentSessionIndex = this._sessions.length - 1;
  }

  return this._sessions[this._currentSessionIndex];
};

/**
 * Get the next session in the history
 * @return {String}
 */
SessionStore.prototype.getNext = function() {
  if (!this._sessions.length) { return ''; }

  ++this._currentSessionIndex;

  if (this._currentSessionIndex === this._sessions.length) {
    this._currentSessionIndex = 0;
  }

  return this._sessions[this._currentSessionIndex];
};

/**
 * @private
 */
SessionStore.prototype._storeSessions = function() {
  if (!window.localStorage) { return; }

  // TODO: Maybe async this if it slows the UI
  window.localStorage.setItem(this._dataKey, JSON.stringify(this._sessions));
};

/**
 * @private
 * @return {String[]}
 */
SessionStore.prototype._getAllSessions = function() {
  if (!window.localStorage) { return []; }

  var sessions = window.localStorage.getItem(this._dataKey);
  var legacySession;

  if (!sessions || !sessions.length) {
    legacySession = this._getLegacySession();

    return legacySession ? [legacySession] : [];
  }

  try {
    return JSON.parse(sessions);
  } catch (e) {
    return [];
  }
};

/**
 * The old sessions used a 'code' key
 * @private
 * @return {?String}
 */
SessionStore.prototype._getLegacySession = function() {
  return window.localStorage.getItem('code');
};

module.exports = SessionStore;

},{}],9:[function(require,module,exports){
function Sidebar($container) {
  this.$container = $container;
  this.$share = this.$container.find('input.share');

  this.$share.focus(function() {
    window.mixpanel.track('Code Share');
  });
}

/**
 * Set the share url
 * @param  {String} code
 */
Sidebar.prototype.shareCode = function(code) {
  this.$share.val(this._getShareUrl(code));
};

/**
 * @private
 * @param  {String} code
 * @return {String}
 */
Sidebar.prototype._getShareUrl = function(code) {
  var encoded = window.encodeURIComponent(code);
  return window.location.origin + '?code=' + encoded;
};

module.exports = Sidebar;

},{}]},{},[7]);
