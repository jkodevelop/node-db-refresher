// rename this file to _config.js

const jwtConfig = {
  'secret': 'jwtSecret2020',
  'refreshTokenSecret': 'refreshSecret2020',
  'tokenLife': 1800, // seconds to hours = half hour 
  'refreshTokenLife': 86400, // seconds to hours = 24 hour
};
const mysqlConf = {
  host: 'localhost',
  user: 'test',
  password: 'password',
  database: 'test',
};

module.exports = {
  'jwtConfig' : jwtConfig,
  'mysqlConf': mysqlConf,
};
