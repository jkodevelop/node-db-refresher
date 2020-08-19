// auth
const express = require('express')
  , r = express.Router();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var jwtConfig = {
  'secret': 'jwtSecret2020',
  'refreshTokenSecret': 'refreshSecret2020',
  'tokenLife': 1800, // seconds to hours = half hour 
  'refreshTokenLife': 86400 // seconds to hours = 24 hour
};

// storing token to lightly confirm this token is active and exists
var inMEMORY_TOKENSTORE = {};

/**
 * @typedef LoginParams
 * @property {string} email.required
 * @property {string} password.required
 */
/**
 * This function let's you login and get a rest Token
 * @route POST /api/login
 * @param {LoginParams.model} loginParams.body.required - login parameters
 * @group Authentication - Operations for Authentication
 * @returns {object} 200 - token and refresh token
 * @returns {Error}  default - Unexpected error
 */
r.post('/login', function(req, res) {

  var email = req.body.email;
  var password = req.body.password;

  const payload = {
    'email': email
  };
  
  var jtoken = jwt.sign(
    payload, 
    jwtConfig.secret, 
    { 'expiresIn' : jwtConfig.tokenLife });

  var refreshToken = jwt.sign(
    payload, 
    jwtConfig.refreshTokenSecret, 
    { 'expiresIn': jwtConfig.refreshTokenLife });

  var resp = {
    'token': jtoken,
    'refreshToken': refreshToken,
  };

  var keep = {
    ...resp, 
    'payload': payload
  }
  // ! there might be collision here
  inMEMORY_TOKENSTORE[refreshToken] = keep;
  res.json(resp);

});   


/**
 * @typedef RefreshParams
 * @property {string} refreshToken.required
 */
/**
 * This function let's you get a new token from refresh token
 * @route POST /api/retoken
 * @param {RefreshParams.model} refreshParams.body.required - refresh tokens
 * @group Authentication - Operations for Authentication
 * @returns {object} 200 - new token
 * @returns {Error}  default - Unexpected error
 */
r.post('/retoken', function(req, res) {

  var refreshToken = req.body.refreshToken;
  // if refresh token exists, this should be in a database when you load balance.
  // if there are 2+ node servers running in memory check won't work 
  if(refreshToken && (refreshToken in inMEMORY_TOKENSTORE)) {
    var payload = inMEMORY_TOKENSTORE[refreshToken].payload;
    var token = jwt.sign(
      payload, 
      jwtConfig.secret, 
      { 'expiresIn': jwtConfig.tokenLife});

    var resp = {
      'token': token,
    };
    // update the token in the list
    inMEMORY_TOKENSTORE[refreshToken].token = token;
    res.status(200).json(resp);        
  } else {
    res.status(404).send('Invalid request');
  }

});   


/**
 * This function will verify your token, you must pass in header
 * x-access-token: token
 * the header params matches the swagger option, can be changed
 * @route GET /api/verifytoken
 * @group Authentication - Operations for Authentication
 * @returns {object} 200 - new token
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.get('/verifytoken', function(req, res) {
  console.log(req.headers);
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ 'message': 'No token provided.' });
  
  jwt.verify(token, jwtConfig.secret, function(err, decoded) {
    if (err) return res.status(500).send({ 'message': 'Failed to authenticate token.' });
    
    res.status(200).json(decoded); 

  });
});

module.exports = r;