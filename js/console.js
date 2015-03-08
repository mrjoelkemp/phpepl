var timestamp = require('./lib/timestamp');

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

  this.$element.find('.timestamp span').html(timestamp());
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
