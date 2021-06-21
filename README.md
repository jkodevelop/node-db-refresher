# EXPRESS + swagger [database experimentation and refresher guides]

This project is for testing, experiments and guide for using different database in node projects. 
- **express-swagger-generator** is included for auto API documentation. 
- **jsonwebtoken** authentication and SSL configuration is included. 

note: **This project is NOT for production usage**

### prerequisite:
- node 12+
- neo4j

### usage:
1. make sure to run `npm install` to install the package
2. look into GIT **branches** for different database type and usage examples
   - example: branch: `feature/mongodb` is example of using mongodb

### Neo4j 

1. make sure to have Neo4j running
2. add user credentials into **_config.js** use `SAMPLE._config.js` as reference
3. use `neo4jscripts/setup.txt` to create the base data as example data
4. `neo4j-cypher.md` have example neo4j cypher commands as reference