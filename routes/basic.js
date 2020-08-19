const express = require('express');
const r = express.Router();

/**
 * This API returns text/html "Hello!"
 * @route GET /api
 * @group Basic - Basic API
 * @returns {Error}  default - Unexpected error
 */
r.get('/', function(req, res) {
  res.send('Hello!');
});

/**
 * This is allows you to pass in a url query variable(s)
 * @route GET /api/urlquery
 * @group Basic - Basic API
 * @param {string} email.query.required - username or email
 * @param {string} password.query.required - user's password.
 * @returns {Error}  default - Unexpected error
 */
r.get('/urlquery', function(req, res) {
  var email = req.query.email;
  var pass = req.query.password;
  res.send(`you sent ${email} ${pass}`);
});



/**
 * This allows you to pass in a PATH variable 
 * @route GET /api/pathvariable/{val}
 * @group Basic - Basic API
 * @param {string} val.path.required - value of parameter
 * @returns {Error}  default - Unexpected error
 */
r.get('/pathvariable/:val', function(req, res) {
  var val = req.params.val;
  res.send(`this is the value "${val}" of the param passed in!`);
});

module.exports = r;