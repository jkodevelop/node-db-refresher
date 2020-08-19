const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const _conf = require('../_config.js');

const basic = require('./basic.js');
const post  = require('./post.js');
const fileio= require('./fileio.js');
const authentication= require('./authentication.js');
const protected= require('./protected.js');


const tokenProtectedPath = function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  
  if (token) {
    const jwtConfig = _conf.jwtConfig;
    // verifies secret and checks exp
    jwt.verify(token, jwtConfig.secret, function(err, decoded) {      
      if (err) { return res.status(500).json({ message: 'Failed to authenticate token.' }); }
      // if everything is good, save to request for use in other routes
      req.decoded = decoded;    
      next();
    });
  } else {
    // if there is no token, return an error
    return res.status(403).send({ 
      'message': 'No token provided.' 
    });
  }
} // tokenProtectedPath

module.exports = routeConfig = (app) => {
  app.use('/api', basic);
  app.use('/api', post);
  app.use('/api', fileio);
  app.use('/api', authentication);

  /////////////////////////////
  // ORDER MATTERS HERE
  /////////////////////////////

  // protected paths because the middleware is applied forward
  app.use('/api', tokenProtectedPath, protected);

}