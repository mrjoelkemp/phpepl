function Sidebar($container) {
  this.$container = $container;
  this.$share = this.$container.find('input.share');

  this.$share.focus(function() {
    window.mixpanel.track('Code Share');
  });
}

/**
 * Set the share url
 * @param  {String} code
 */
Sidebar.prototype.shareCode = function(code) {
  this.$share.val(this._getShareUrl(code));
};

/**
 * @private
 * @param  {String} code
 * @return {String}
 */
Sidebar.prototype._getShareUrl = function(code) {
  var encoded = window.encodeURIComponent(code);
  return window.location.origin + '?code=' + encoded;
};

module.exports = Sidebar;
