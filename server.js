const express = require('express');
const app = express();
const routerConf = require('./routes/index.js');
const bodyParser = require('body-parser');

////////////////////////////////////////////////////////////////
// express-swagger-generator configurations
var expressSwagger = require('express-swagger-generator')(app);
let options = {
  swaggerDefinition: {
    info: {
      description: 'This is a sample server',
      title: 'Swagger',
      version: '1.0.0',
    },
    host: 'localhost:3001',
    basePath: '/',
    produces: [
      "application/json",
      "application/xml"
    ],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'x-access-token',
        description: "",
      }
    }
  },
  basedir: __dirname, //app absolute path
  files: ['./routes/**/*.js'] //Path to the API handle folder
};
expressSwagger(options);
// END OF: express-swagger-generator configurations
////////////////////////////////////////////////////////////////

// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

routeConfig(app);

app.listen(3001);