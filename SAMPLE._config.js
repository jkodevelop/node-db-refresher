// rename this file to _config.js

const jwtConfig = {
  'secret': 'jwtSecret2020',
  'refreshTokenSecret': 'refreshSecret2020',
  'tokenLife': 1800, // seconds to hours = half hour 
  'refreshTokenLife': 86400, // seconds to hours = 24 hour
};

const neo4jConf = {
  'connection': 'bolt://localhost:7687',
  'user': 'neo4j',
  'password': 'password',
  'database': 'neo4j',
};

module.exports = {
  'jwtConfig' : jwtConfig,
  'neo4jConf': neo4jConf,
};
