'use strict';

var Editor = require('./editor');
var Console = require('./console');
var editorHelpers = require('./helpers/EditorHelpers');
var storageHelpers = require('./helpers/StorageHelpers');

var editor = new Editor($('#editor'));
var console = new Console($('.console'));

var mixpanel = window.mixpanel || {};
var evalURL = 'eval/index.php';

var savedCode = storageHelpers.getSavedCode();
if (savedCode) {
  editor.setValue(savedCode);
}

if (!onPHP5Version() && isLiveEnv()) { $('.link-to-heroku').fadeIn('fast'); }

$(document).keydown(checkForShortcuts);

// Remember the code in the editor before navigating away
$(window).unload(function() {
  storageHelpers.saveCode(editor.getValue());
});

// Helpers
function sendingCode(code) {
  return $.ajax({
    type:     'POST',
    url:      evalURL,
    data:     {code: code},
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
    console.setOutput('Please supply some code...');
    return;
  }

  console.toggleSpinner(true);

  // Track it
  mixpanel.track('Code Run', {code: code});

  sendingCode(code)
    .done(processResponse)
    .fail(processFatalError);
}

function processResponse(res) {
  if (!res) { return; }

  if (!res.error) {
    console.setOutput(res.result);

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

  var textLine = editorHelpers.getPrettyFatalErrorMessage(error.responseText);

  console.setOutput(textLine[0], true);
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
    storageHelpers.saveCode();
    e.preventDefault();
    mixpanel.track('Save Shortcut');
  }
}
