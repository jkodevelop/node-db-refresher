const express = require('express');
const r = express.Router();
const { neo4jConf } = require('../_config.js');
const neo4j = require('neo4j-driver');

/**
 * This API returns total number of nodes in the db
 * @route GET /api/neo4j/status
 * @group Neo4j Database - Basic Database Server APIs
 * @returns {Error}  default - Unexpected error
 */
r.get('/neo4j/status', function(req, res) {

  try{
    const driver = neo4j.driver(
      neo4jConf.connection, 
      neo4j.auth.basic(neo4jConf.user, neo4jConf.password));

    let count = false;
    // Create Driver session
    const session = driver.session({ database: neo4jConf.database });

    // Run Cypher query
    const cypher = 'MATCH (n) RETURN count(n) as count';
    session.run(cypher).then(result => {
      // On result, get count from first record
      count = result.records[0].get('count');
      // Log response
      console.log( 'Count: ',count.toNumber() );
    }).catch(e => {
      // Output the error
      console.log(e);
      res.status(500).send({ 
        'err': 'Database error' 
      });
    }).then(() => {
      // Close the Session
      return session.close();
    }).then(() => {
      // Close the Driver
      res.send(`session connected and closed, node count: ${count}`);
      return driver.close();
    });

  }catch(ex){
    console.error(ex);
    res.status(500).send({ 
      'err': 'Database error' 
    });
  }
});

module.exports = r;