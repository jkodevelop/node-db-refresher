// user
const express = require('express')
  , r = express.Router();

/**
 * This is an protected route by JWT token
 * @route GET /api/protected
 * @group Protected - Protected APIs
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.get('/protected', function(req, res) {
  res.send('Hello! this is a protected API by JWT token');
});   

module.exports = r;