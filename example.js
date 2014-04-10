/**
 * Module Dependencies
 */

var assert = require('assert');
var Simplenote = require('./');

assert(process.env.email, 'must provide a simplenote email')
assert(process.env.pass, 'must provide a simplenote password')

var simplenote = Simplenote(process.env.email, process.env.pass);

simplenote.all(function(err, notes) {
  if (err) throw err;
  var keys = notes.select('tags.length');
  console.log(keys);
})
