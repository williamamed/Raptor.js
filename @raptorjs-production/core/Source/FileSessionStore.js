/*!
 * express-session
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module dependencies.
 * @private
 */

var Store = require('express').session.Store
var util = require('util')
var fs = require('fs')
var fse = require('fs-extra')
/**
 * Shim setImmediate for node.js < 0.10
 * @private
 */

/* istanbul ignore next */
var defer = typeof setImmediate === 'function'
  ? setImmediate
  : function(fn){ process.nextTick(fn.bind.apply(fn, arguments)) }

/**
 * Module exports.
 */

module.exports = FileSessionStore

/**
 * A session store in memory.
 * @public
 */

function FileSessionStore(R) {
  Store.call(this)
  this.sessions = Object.create(null)
  this.R=R;
  this.readSessions();
}

/**
 * Inherit from Store.
 */

util.inherits(FileSessionStore, Store)

/**
 * Get all active sessions.
 *
 * @param {function} callback
 * @public
 */

FileSessionStore.prototype.all = function all(callback) {
  var sessionIds = Object.keys(this.sessions)
  var sessions = Object.create(null)

  for (var i = 0; i < sessionIds.length; i++) {
    var sessionId = sessionIds[i]
    var session = getSession.call(this, sessionId)

    if (session) {
      sessions[sessionId] = session;
    }
  }

  callback && defer(callback, null, sessions)
}

FileSessionStore.prototype.readSessions=function(){
    var rutaSrc=this.R.basePath+'/cache/session';
    var self=this;
    fs
      .readdirSync(rutaSrc)
      .filter(function(fileNode) {
            
            return (fileNode.indexOf('.') !== 0)
             })
      .forEach(function(file){
         self.sessions[file]=fs.readFileSync(rutaSrc+'/'+file);
        
      })
     
}


/**
 * Clear all sessions.
 *
 * @param {function} callback
 * @public
 */

FileSessionStore.prototype.clear = function clear(callback) {
  this.sessions = Object.create(null)
  fse.emptyDirSync();
  callback && defer(callback)
}

/**
 * Destroy the session associated with the given session ID.
 *
 * @param {string} sessionId
 * @public
 */

FileSessionStore.prototype.destroy = function destroy(sessionId, callback) {
  delete this.sessions[sessionId]
  fse.removeSync(this.R.basePath+'/cache/session/'+sessionId)
  callback && defer(callback)
}

/**
 * Fetch session by the given session ID.
 *
 * @param {string} sessionId
 * @param {function} callback
 * @public
 */

FileSessionStore.prototype.get = function get(sessionId, callback) {
  defer(callback, null, getSession.call(this, sessionId))
}

/**
 * Commit the given session associated with the given sessionId to the store.
 *
 * @param {string} sessionId
 * @param {object} session
 * @param {function} callback
 * @public
 */

/**
 * Get number of active sessions.
 *
 * @param {function} callback
 * @public
 */

FileSessionStore.prototype.length = function length(callback) {
  this.all(function (err, sessions) {
    if (err) return callback(err)
    callback(null, Object.keys(sessions).length)
  })
}

FileSessionStore.prototype.set = function set(sessionId, session, callback) {

  this.sessions[sessionId] = JSON.stringify(session)
  var rutaSrc=this.R.basePath+'/cache/session';
  fs.writeFileSync(rutaSrc+'/'+sessionId,JSON.stringify(session));
  callback && defer(callback)
}

/**
 * Touch the given session object associated with the given session ID.
 *
 * @param {string} sessionId
 * @param {object} session
 * @param {function} callback
 * @public
 */

FileSessionStore.prototype.touch = function touch(sessionId, session, callback) {
  var currentSession = getSession.call(this, sessionId)

  if (currentSession) {
    // update expiration
    currentSession.cookie = session.cookie
    this.sessions[sessionId] = JSON.stringify(currentSession)
  }

  callback && defer(callback)
}

/**
 * Get session from the store.
 * @private
 */

function getSession(sessionId) {
  var sess = this.sessions[sessionId]

  if (!sess) {
    return
  }

  // parse
  sess = JSON.parse(sess)

  var expires = typeof sess.cookie.expires === 'string'
    ? new Date(sess.cookie.expires)
    : sess.cookie.expires

  // destroy expired session
  if (expires && expires <= Date.now()) {
    delete this.sessions[sessionId]
    fse.removeSync(this.R.basePath+'/cache/session/'+sessionId)
    return
  }

  return sess
}
