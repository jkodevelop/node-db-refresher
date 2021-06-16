// rename this file to _config.js

const jwtConfig = {
  'secret': 'jwtSecret2020',
  'refreshTokenSecret': 'refreshSecret2020',
  'tokenLife': 1800, // seconds to hours = half hour 
  'refreshTokenLife': 86400, // seconds to hours = 24 hour
};
const mongodb = {
  'url': 'mongodb://localhost:27017',
  'authUrl': 'mongodb://testuser:test2020@localhost:27017',
  'dbName': 'zzz',
  'commonOptions': { 
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
};

module.exports = {
  'jwtConfig' : jwtConfig,
  'mongodb': mongodb,
};
