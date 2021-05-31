# simple express + swagger starter project [2021]
This repo is a simple starter for **express** developement, this provides a simple RESTful-API server. **express-swagger-generator** is included for auto API documentation. **jsonwebtoken** authentication and SSL configuration is included. Everything can be swapped out based on project needs this is simply is starter reference with common function setup and running.

note: This project is NOT production ready. It needs a new key/cert for SSL configuration, what is included should not be used. A javascript testing framework is recommended. Also note **express-swagger-generator** cannot cover 100% of all API configuration cases.

```

Please fork the project to start a new project

```

### prerequisite:
1. node 12+
2. make sure to run `npm install` to install the package

## usage: Development
`npm start` then go to http://localhost:3001/api-docs to see the swagger UI with routes definition and usage.
Or https://localhost:3001/api-docs for the https side

For development these libraries are in place:
- express
- express-swagger-generator
- jsonwebtoken
- nodemon

`server.js` is the starting point of the project, and express initialization codes.

#### configuration settings
1. configuration for express and swagger tools are inside `./server.js`
2. SSL configurations are also initialized in `./server.js` using `key.perm` and `cert.pem` (to be replaced for production)
3. other configuration are imported from `./_config.js` this provides JWT token life and refresh settings

#### API routing
**express** API routes are configured inside `./routes/index.js` this controls what route is available in the web server. For more details look inside file, since this is where new routes must be imported into.
**key point in router/index.js**
```
...
module.exports = routeConfig = (app) => {
  app.use('/api', basic);
  ...
  app.use('/api', authentication); // need to provided unprotected API for authentication routes
  /////////////////////////////
  // ORDER MATTERS HERE
  app.use('/api', tokenProtectedPath, protected);
  // any other api added after this point is protected
}
```
Sample routes are defined and imported from `./routes` folder

#### Swagger documentation
Inside `./routes` folder there are example code and documentation for **express-swagger-generator** to use for creating the projects swagger documentation

`authentication.js` - is used for creating JWT token and inside `routes/index.js` there is a **tokenProtectedPath** middleware to verify the token
`basic.is` - example of route documentation for swagger generator showing url parameters or path signature
`fileio.js` - shows how to document file upload parameters
`post.js` - shows how to document swagger models for post body
`protected.js` - shows how to document secured routes

#### express - middleware
Inside `./middleware` folder there is an example of a middleware imported and used in `server.js` 
**format of a middleware**
```
var nameOfMiddleware = function (req, res, next) {
  // logic here
  next()
}
```

#### Static Content
This project is also configured to serve static content. `public_www` is the root folder.

## Walkthrough
Please use git comments/history to see the guides and steps for changes and adding new features/functions to the server.

---
## further reading: Documentations
https://expressjs.com/en/guide/routing.html
https://github.com/pgroot/express-swaggerize-ui

**alternative library**
[swagger-ui-express] https://github.com/scottie1984/swagger-ui-express
https://blog.logrocket.com/documenting-your-express-api-with-swagger/
