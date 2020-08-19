const express = require('express');
const r = express.Router();

/**
 * This allows you to pass in a json object and get a json object response back
 * this is also an example of a post request
 * @route POST /api/post/body
 * @param {Sprite.model} sprite.body.required - Sprite description
 * @group Post - POST API
 * @returns {Error}  default - Unexpected error
 */
r.post('/post/body', function(req, res) {
  console.log(req.body.id);
  res.json(req.body);
});

/**
 * @typedef Sprite
 * @property {integer} id
 * @property {string} name.required - this is name of the Sprite
 * @property {Array.<Vertex>} Vertex
 */
/**
 * @typedef Vertex
 * @property {integer} x.required - x coordinate of vertex
 * @property {integer} y.required - y coordinate of vertex
 * @property {string} color
 */

module.exports = r;