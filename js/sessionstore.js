'use strict';

function SessionStore() {
  this._sessionLimit = 100;
  this._dataKey = 'sessions';

  this._sessions = this._getAllSessions();
  this._currentSessionIndex = this._sessions.length - 1;
}

/**
 * Returns the last execution
 * @return {?String}
 */
SessionStore.prototype.getLast = function() {
  return this._sessions[this._sessions.length - 1];
};

/**
 * @param {String} code
 */
SessionStore.prototype.save = function(code) {
  // Don't store a just repeated session
  if (code === this.getLast()) { return; }

  this._sessions.push(code);

  if (this._sessions.length > this._sessionLimit) {
    this._sessions.shift();
  }

  this._currentSessionIndex = this._sessions.length - 1;
  this._storeSessions();
};

/**
 * Get the previous session in the history
 * @return {String}
 */
SessionStore.prototype.getPrevious = function() {
  if (!this._sessions.length) { return ''; }

  --this._currentSessionIndex;

  if (this._currentSessionIndex < 0) {
    this._currentSessionIndex = this._sessions.length - 1;
  }

  return this._sessions[this._currentSessionIndex];
};

/**
 * Get the next session in the history
 * @return {String}
 */
SessionStore.prototype.getNext = function() {
  if (!this._sessions.length) { return ''; }

  ++this._currentSessionIndex;

  if (this._currentSessionIndex === this._sessions.length) {
    this._currentSessionIndex = 0;
  }

  return this._sessions[this._currentSessionIndex];
};

/**
 * @private
 */
SessionStore.prototype._storeSessions = function() {
  if (!window.localStorage) { return; }

  // TODO: Maybe async this if it slows the UI
  window.localStorage.setItem(this._dataKey, JSON.stringify(this._sessions));
};

/**
 * @private
 * @return {String[]}
 */
SessionStore.prototype._getAllSessions = function() {
  if (!window.localStorage) { return []; }

  var sessions = window.localStorage.getItem(this._dataKey);
  var legacySession;

  if (!sessions || !sessions.length) {
    legacySession = this._getLegacySession();

    return legacySession ? [legacySession] : [];
  }

  try {
    return JSON.parse(sessions);
  } catch (e) {
    return [];
  }
};

/**
 * The old sessions used a 'code' key
 * @private
 * @return {?String}
 */
SessionStore.prototype._getLegacySession = function() {
  return window.localStorage.getItem('code');
};

module.exports = SessionStore;
