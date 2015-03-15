'use strict';

/**
 * @param  {String} part
 * @return {Boolean}
 */
module.exports.hostHas = function(part) {
  return window.location.host.indexOf(part) !== -1;
};

/**
 * @return {Boolean}
 */
module.exports.isLiveEnv = function() {
  return this.hostHas('cloudcontrolled') || this.hostHas('herokuapp');
};

/**
 * @return {Boolean}
 */
module.exports.onPHP5Version = function() {
  return this.hostHas('herokuapp');
};
