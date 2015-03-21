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
