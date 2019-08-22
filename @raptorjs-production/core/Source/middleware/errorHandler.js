/*!
 * Connect - errorHandler
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var fs;
try {
  fs = require('graceful-fs');
} catch (_) {
  fs = require('fs');
}

// environment

var env = process.env.NODE_ENV || 'development';

/**
 * Error handler:
 *
 * Development error handler, providing stack traces
 * and error message responses for requests accepting text, html,
 * or json.
 *
 * Text:
 *
 *   By default, and when _text/plain_ is accepted a simple stack trace
 *   or error message will be returned.
 *
 * JSON:
 *
 *   When _application/json_ is accepted, connect will respond with
 *   an object in the form of `{ "error": error }`.
 *
 * HTML:
 *
 *   When accepted connect will output a nice html stack trace.
 *
 * @return {Function}
 * @api public
 */

exports = module.exports = function errorHandler(){
  return function errorHandler(err, req, res, next){
    
    if (err.status) res.statusCode = err.status;
    if (res.statusCode < 400) res.statusCode = 500;
    //if ('test' != env) console.error(err.toString());
    if (res._header) return;
    var accept = req.headers.accept || '';
    // html
    if (~accept.indexOf('html')) {
     
      var stack = (err.stack || '').replace(err.toString(),'')
            .split('\n').slice(1)
            .map(function(v){ return '<li>' + v + '</li>'; }).join('');

      console.error(stack);      
      res.render($injector('TemplateERROR'),{
        stack:stack,
        title:exports.title,
        statusCode: res.statusCode,
        error: escapeHTML(err.toString()).replace(/\n/g, '</br>')
      })

      
    // json
    } else if (~accept.indexOf('json')) {
      var error = { message: err.message, stack: err.stack };
      for (var prop in err) error[prop] = err[prop];
      var json = JSON.stringify({ error: error });
      res.setHeader('Content-Type', 'application/json');
      res.end(json);
    // plain text
    } else {
      res.setHeader('Content-Type', 'text/plain');
      res.end(err.stack);
    }
  };
};

/**
 * Template title, framework authors may override this value.
 */

exports.title = 'Raptor.js';


/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

function escapeHTML(html){
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};