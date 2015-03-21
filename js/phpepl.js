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
