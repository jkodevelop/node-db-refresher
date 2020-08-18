const basic = require('./basic.js');
const post  = require('./post.js');

module.exports = routeConfig = (app) => {
  app.use('/api', basic);
  app.use('/api', post);
}