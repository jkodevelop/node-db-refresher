const express = require('express');
const r = express.Router();

r.get('/', function(req, res) {
  res.send('Hello!');
});

module.exports = r;