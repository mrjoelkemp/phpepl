'use strict';

var
    $ = window.$ = window.jQuery = require('jquery'),

    // Detect the port that localhost is running on
    port        = window.location.host.split(':')[1] || '80',
    // Auto add the port number
    origin      = window.location.origin.indexOf(':') !== -1 ?
                  window.location.origin :
                  window.location.origin + ':' + port,

    // Evals for different environments
    unsafe    = origin + '/src/eval/unsafe.php',
    sandboxed = origin + '/src/eval/index.php',

    // Safeguard to always use the live eval on the remote server
    // and the unsafe dev version otherwise.
    evalURL        = isLiveEnv() ? sandboxed : unsafe,

    mixpanel       = window.mixpanel || {},
    editor         = require('./editor'),
    editorHelpers  = require('./helpers/EditorHelpers'),
    storageHelpers = require('./helpers/StorageHelpers');

storageHelpers.loadSavedCode();

if (!onPHP5Version() && isLiveEnv()) $('.link-to-heroku').fadeIn('fast');

$(document).keydown(checkForShortcuts);

// Remember the code in the editor before navigating away
$(window).unload(storageHelpers.saveCode.bind(storageHelpers));

// Helpers
function sendingCode(code) {
  return $.ajax({
    type:     'POST',
    url:      evalURL,
    data:     { code: code },
    dataType: 'json'
  });
}

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
    editorHelpers.setOutput('Please supply some code...');
    return;
  }

  $('.spinner').fadeIn('fast');

  // Track it
  mixpanel.track('Code Run', {code: code});

  sendingCode(code)
    .done(processResponse)
    .fail(processFatalError);
}

function processResponse(res) {
  if (!res) return;

  var result    = res.result,
      error     = res.error,
      errorMsg  = '';

  if (!error) {
    editorHelpers.setOutput(result);

  } else {
    if (error.line && error.message) {
      // Show the line in red
      editorHelpers.showLineError(error.line);

      // Show the error message
      errorMsg = 'Line ' + error.line + ': ';
    }

    errorMsg += error.message;

    editorHelpers.setOutput(errorMsg, true);
  }
}

function processFatalError(error) {
  if (!error) return;

  var textLine = editorHelpers.getPrettyFatalErrorMessage(error.responseText);

  editorHelpers.setOutput(textLine[0], true);
  editorHelpers.showLineError(textLine[1]);
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
    storageHelpers.saveCode();
    e.preventDefault();
    mixpanel.track('Save Shortcut');
  }
}
