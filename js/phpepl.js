'use strict';

var Editor = require('./editor');
var Console = require('./console');
var getPrettyFatalErrorMessage = require('./lib/getPrettyFatalErrorMessage');
var getQueryParams = require('./lib/getQueryParams');
var timestamp = require('./lib/timestamp');

var editor = new Editor($('#editor'));
var console = new Console($('.console'));

var mixpanel = window.mixpanel || {};
var evalURL = 'eval/index.php';

var code = getQueryParams(document.location.search).code;
if (code) {
  code = window.decodeURIComponent(code);
  mixpanel.track('Visit Code Url', {code: code});

} else {
  code = editor.getSavedCode() ||
        'echo "We\'re running php version: " . phpversion();';
}

editor.setValue(code);
shareCode(code);

if (!onPHP5Version() && isLiveEnv()) { $('.link-to-heroku').fadeIn('fast'); }

$(document).keydown(checkForShortcuts);

// Remember the code in the editor before navigating away
$(window).unload(function() {
  editor.saveCode();
});

$('input.share').focus(function() {
  mixpanel.track('Code Share');
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

function shareCode(code) {
  var shareUrl = window.location.origin +
                '?code=' +
                window.encodeURIComponent(code);

  $('input.share').val(shareUrl);
}

// Handles the sending of the code to the eval server
function processCode() {
  var code = editor.getValue();

  if (!code.length) {
    console.setOutput('Please supply some code...');
    return;
  }

  shareCode(code);

  console.toggleSpinner(true);

  mixpanel.track('Code Run', {code: code});

  editor.evaluateCode({evalURL: evalURL})
    .done(processResponse)
    .fail(processFatalError);
}

function processResponse(res) {
  if (!res) { return; }

  editor.clearLineErrors();

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
