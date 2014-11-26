var editor = require('../editor'),
    $ = require('jquery');

module.exports.saveCode = function() {
  if (!window.localStorage) return;

  var code = editor.getValue();

  window.localStorage.setItem('code', code);

  // Show the saved message
  $('.timestamp')
    .find('span')
      .html('Code Saved!');

  window.mixpanel.track('Code Saved');
};

// Preload where you last left off
module.exports.loadSavedCode = function() {
  if (!window.localStorage) return;

  var greeting = 'echo "We\'re running php version: " . phpversion();',
      result = window.localStorage.getItem('code'),
      code   = !result ? greeting : result;

  editor.setValue(code);
};
