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
