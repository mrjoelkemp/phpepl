var timestamp = require('../lib/timestamp');

// Set the html of the output div
module.exports.setOutput = function(text) {
  var isError = !!arguments[1];
  var $output = $('.output span');

  $output.html(text).removeClass('error');

  if (isError) { $output.addClass('error'); }

  $('.spinner').fadeOut('fast');
  $('.timestamp').find('span').html(timestamp());
};

// Highlights the line in the gutter with the error
module.exports.showLineError = function(line) {
  // Find the dom element in the gutter
  $('.CodeMirror-linenumber').each(function() {
    // If the cell's line number matches the error line
    if (Number($(this).html()) === line) {
      // Make the background red
      $(this).addClass('error-gutter');
      return;
    }
  });
};

// Helper to show the fatal errors nicely
// Returns a list of the error text and line number that
// generated the error.
// Note: Implementation is fairly naive but works
module.exports.getPrettyFatalErrorMessage = function(responseText) {
  if (!responseText.length) { return; }

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

  $.each(tokensToReplace, function(idx, val) {
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
