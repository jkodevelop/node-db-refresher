# EXPRESS + swagger [database experimentation and refresher guides]

This project is for testing, experiments and guide for using different database in node projects. 
- **express-swagger-generator** is included for auto API documentation. 
- **jsonwebtoken** authentication and SSL configuration is included. 

note: **This project is NOT for production usage**

### prerequisite:
- node 12+
- MySQL

### usage:
1. make sure to run `npm install` to install the package
2. look into GIT **branches** for different database type and usage examples
   - example: branch: `feature/mongodb` is example of using mongodb

### MySQL

1. before running, import `mysqlscripts/export.sql` this will create the table and stored procedure for example
  - use command line: `mysql -u username -p password database_name < export.sql`
  - use GUI to import the file
2. add user credentials into **_config.js** use `SAMPLE._config.js` as reference, create the file
