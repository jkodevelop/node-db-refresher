const express = require('express');
const r = express.Router();

/**
 * This API returns text/html "Hello!"
 * @route GET /api
 * @group basic - Basic API
 * @returns {Error}  default - Unexpected error
 */
r.get('/', function(req, res) {
  res.send('Hello!');
});

module.exports = r;