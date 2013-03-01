/**
 * Module Dependencies
 */

var request = require('superagent'),
    encode = require('base64-encode'),
    array = require('array.js');

/**
 * API Endpoints
 */

var api = "https://simple-note.appspot.com/api/",
    api2 = "https://simple-note.appspot.com/api2/";

/**
 * Export `SimpleNote`
 */

module.exports = SimpleNote;

/**
 * Initialize a `SimpleNote` instance
 *
 * @param {String} email
 * @param {String} password
 */

function SimpleNote(email, password) {
  if(!(this instanceof SimpleNote)) return new SimpleNote(email, password);
  this.email = email;
  this.password = password;
  this.notes = [];
}

/**
 * Get the auth token
 *
 * @param {Function} fn
 */

SimpleNote.prototype.auth = function(fn) {
  var self = this;

  // base64 encoding of auth params
  var query = encode("email=" + this.email + '&password=' + this.password);

  request
    .post(api + 'login')
    .send(query)
    .end(function(res) {
      if(res.error) return fn(res.error);
      self.token = res.text;
      return fn(null, res.text);
    });
};

/**
 * Get all the notes
 *
 * @param {Number} len
 */

SimpleNote.prototype.all = function(len, fn) {
  if(arguments.length == 1) fn = len;

  // 100 is the highest value you can query
  len = (len && len < 100) ? len : 100;

  var self = this;

  // TODO: loop through if `mark` is set
  // https://github.com/cpbotha/nvpy/blob/master/nvpy/simplenote.py#L211
  this.auth(function(err, token) {
    if(err) return fn(err);

    request
      .get(api2 + 'index')
      .type('json')
      .query({ auth : token, email : self.email, length : len })
      .end(function(res) {
        if(res.error) return fn(res.error);
        else if(!res.text) return fn(null, []);
        var json = JSON.parse(res.text);
        self.notes = array(json.data).sort('modifydate', 'desc');
        return fn(null, self.notes);
      });
  });
}

/**
 * Get a note by it's key
 *
 * @param {String} key
 */

SimpleNote.prototype.get = function(key, fn) {
  if(!key) return this.all(fn);
  var self = this;

  this.auth(function(err, token) {
    if(err) return fn(err);

    request
      .get(api2 + 'data/' + key)
      .query({ auth : token, email : self.email })
      .type('json')
      .end(function(res) {
        if(res.error) return fn(res.error);
        else if(!res.text) return fn(null, {})
        return fn(null, JSON.parse(res.text));
      });
  })
};
