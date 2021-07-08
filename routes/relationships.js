const express = require('express');
const r = express.Router();
const { neo4jConf } = require('../_config.js');
const neo4j = require('neo4j-driver');
const { neo4jOptions } = require('../helpers/helper.js');

/**
 * Get all distinct relationships from db
 * @route GET /api/relationships/get/distinct
 * @group Relationships - Neo4j Relationship Management Examples
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.get('/relationships/get/distinct', async (req, res) => {

  let driver, session;
  let dbRes;
  try{
    driver = neo4j.driver(
      neo4jConf.connection, 
      neo4j.auth.basic(neo4jConf.user, neo4jConf.password),
      neo4jOptions);
    // Create Driver session
    session = driver.session({ database: neo4jConf.database });
    // Run Cypher query
    const cypher = 'MATCH ()-[r]-() RETURN DISTINCT r';
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
 * Get relationships of a specific node queried by uid
 * @route GET /api/relationships/of/{uid}
 * @group Relationships - Neo4j Relationship Management Examples
 * @param {integer} uid.path.required - unique identifier created for the node
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.get('/relationships/of/:uid', async (req, res) => {

  const uid = req.params.uid;
  let driver, session;
  let dbRes;
  try{
    driver = neo4j.driver(
      neo4jConf.connection, 
      neo4j.auth.basic(neo4jConf.user, neo4jConf.password),
      neo4jOptions);
    // Create Driver session
    session = driver.session({ database: neo4jConf.database });
    // Run Cypher query
    const cypher = 'MATCH (:User{uid:toInteger($uid)})-[r]-() RETURN DISTINCT r';
    const result = await session.run(
      cypher,
      { 'uid': uid }
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

/**
 * Create relationships "Friends" between two nodes that exists
 * @route POST /api/relationships/create
 * @group Relationships - Neo4j Relationship Management Examples
 * @param {Friendship.model} friendship.body.required - Friend object
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.post('/relationships/create', async (req, res) => {

  const postBody = req.body;
  let friendship = {
    'when': postBody.when ? postBody.when : '',
    'uidfrom': postBody.uidfrom ? postBody.uidfrom : 0,
    'uidto': postBody.uidto ? postBody.uidto : 0,
  };

  let driver, session;
  let dbRes;
  try{
    driver = neo4j.driver(
      neo4jConf.connection, 
      neo4j.auth.basic(neo4jConf.user, neo4jConf.password),
      neo4jOptions);
    // Create Driver session
    session = driver.session({ database: neo4jConf.database });
    // Run Cypher query
    const cypher = `MATCH (a:User), (b:User)
      WHERE a.uid = toInteger($uidfrom) AND b.uid = toInteger($uidto)
      MERGE (a)-[r:FRIENDS{when:$when}]->(b) 
      RETURN a,b,r`;
    const result = await session.run(
      cypher,
      friendship
    );

    console.log(result);

    if(result.records.length > 0){
      dbRes = result.records;
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
  res.json(dbRes);
});

/**
 * Delete relationships "Friends" between two nodes that exists
 * @route DELETE /api/relationships/del
 * @group Relationships - Neo4j Relationship Management Examples
 * @param {Friendship.model} friendship.body.required - Friend object
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.delete('/relationships/del', async (req, res) => {

  const postBody = req.body;
  let friendship = {
    'when': postBody.when ? postBody.when : '',
    'uidfrom': postBody.uidfrom ? postBody.uidfrom : 0,
    'uidto': postBody.uidto ? postBody.uidto : 0,
  };

  let driver, session;
  let dbRes;
  try{
    driver = neo4j.driver(
      neo4jConf.connection, 
      neo4j.auth.basic(neo4jConf.user, neo4jConf.password),
      neo4jOptions);
    // Create Driver session
    session = driver.session({ database: neo4jConf.database });
    // Run Cypher query
    const cypher = `MATCH (a:User {uid:toInteger($uidfrom)})-[r:FRIENDS {when:$when}]-(b:User {uid:toInteger($uidto)}) DELETE r`;
    const result = await session.run(
      cypher,
      friendship
    );

    console.log(result);
    if(result.records.length == 0){
      dbRes = { 'status':'success' }
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
  res.json(dbRes);
});

module.exports = r;

/**
 * @typedef Friendship
 * @property {string} when.required - start of friendship
 * @property {integer} uidfrom.required - uid of node from
 * @property {integer} uidto.required - uid of node to
 */

// MATCH (a:User {uid:toInteger($uidfrom)})-[r:FRIENDS {when:$when}]-(b:User {uid:toInteger($uidto)}) 
// SET r.when=$when
// RETURN r