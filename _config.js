// _config.js

var jwtConfig = {
  'secret': 'jwtSecret2020',
  'refreshTokenSecret': 'refreshSecret2020',
  'tokenLife': 1800, // seconds to hours = half hour 
  'refreshTokenLife': 86400 // seconds to hours = 24 hour
};

module.exports = {
  'jwtConfig' : jwtConfig
};