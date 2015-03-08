var editor = require('../editor');

module.exports.saveCode = function(code) {
  if (!window.localStorage) { return; }

  window.localStorage.setItem('code', code);

  // Show the saved message
  $('.timestamp')
    .find('span')
      .html('Code Saved!');

  window.mixpanel.track('Code Saved');
};

// Preload where you last left off
module.exports.getSavedCode = function() {
  if (!window.localStorage) { return; }

  var greeting = 'echo "We\'re running php version: " . phpversion();';
  var result = window.localStorage.getItem('code');

  return !result ? greeting : result;
};
