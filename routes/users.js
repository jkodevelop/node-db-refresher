const express = require('express');
const r = express.Router();
const { neo4jConf } = require('../_config.js');
const neo4j = require('neo4j-driver');

/**
 * Get newest user
 * @route GET /api/users/latest
 * @group Users - Users Management
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.get('/users/latest', async (req, res) => {

  let driver, session;
  let dbRes;
  try{
    driver = neo4j.driver(
      neo4jConf.connection, 
      neo4j.auth.basic(neo4jConf.user, neo4jConf.password));
    // Create Driver session
    session = driver.session({ database: neo4jConf.database });
    // Run Cypher query
    const cypher = 'MATCH (a:User) RETURN a ORDER BY id(a) DESC LIMIT 1';
    const result = await session.run(cypher);

    if(result.records.length > 0){
      const singleRecord = result.records[0];
      const node = singleRecord.get(0);
      console.log('db res: ', result, singleRecord, node);
      dbRes = node;
    }
  }catch(ex){
    console.error(ex);
    res.status(500).send({ 
      'err': 'Database error' 
    });
  } finally {
    if(session){
      await session.close();
    }
    if(driver){
      // on application exit:
      await driver.close()
    }
  }
  // console.log('request time: ',req.requestTime);
  res.json([dbRes]);
});

/**
 * Get User by properties key and value
 * @route GET /api/users/get/{id}
 * @group Users - Users Management
 * @param {string} id.path.required - ID
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.get('/users/get/:id', async (req, res) => {

  const nodeId = req.params.id;
  let driver, session;
  let dbRes;
  try{
    driver = neo4j.driver(
      neo4jConf.connection, 
      neo4j.auth.basic(neo4jConf.user, neo4jConf.password));
    // Create Driver session
    session = driver.session({ database: neo4jConf.database });
    // Run Cypher query
    // Neo4j is case senitive AND type sensitive
    const cypher = 'MATCH (m) WHERE id(m)=toInteger($id) RETURN m';
    const result = await session.run(
      cypher,
      { id: nodeId }
    );
    if(result.records.length > 0){
      const singleRecord = result.records[0];
      const node = singleRecord.get(0);
      console.log('db res: ', result, singleRecord, node);
      dbRes = node;
    }
  }catch(ex){
    console.error(ex);
    res.status(500).send({ 
      'err': 'Database error' 
    });
  } finally {
    if(session){
      await session.close();
    }
    if(driver){
      // on application exit:
      await driver.close()
    }
  }
  // console.log('request time: ',req.requestTime);
  res.json([dbRes]);

});

module.exports = r;