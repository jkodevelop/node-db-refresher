const express = require('express');
const app = express();
const routerConf = require('./routes/index.js');

routeConfig(app);

app.listen(3001);