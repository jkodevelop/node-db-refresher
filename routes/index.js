const basic = require('./basic.js');

module.exports = routeConfig = (app) => {
  app.use('/api', basic);
}