const express = require('express');
const r = express.Router();
const { neo4jConf } = require('../_config.js');
const neo4j = require('neo4j-driver');

// Neo4j does not recommend using their internal node ID for identity,
// so it's better to create one
function getTimeStampUID(){
  return Date.now();
}

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
 * @route GET /api/users/get/{uid}
 * @group Users - Users Management
 * @param {integer} uid.path.required - unique identifier created for the node
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.get('/users/get/:uid', async (req, res) => {

  const uid = req.params.uid;
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

    // this is not recommended to use Neo4j internal ID
    // const cypher = 'MATCH (m) WHERE id(m)=toInteger($id) RETURN m'; 

    // alternative build our own id (uid)
    const cypher = 'MATCH (n:User{uid:toInteger($uid)}) RETURN n';     
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
 * Create User
 * @route POST /api/users
 * @group Users - Users Management
 * @param {User.model} user.body.required - User object
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.post('/users', async (req, res) => {

  let postBody = req.body;
  let insertUser = {
    'email': postBody.email ? postBody.email : '',
    'firstname': postBody.firstname ? postBody.firstname : '',
    'lastname': postBody.lastname ? postBody.lastname : '',
    'active': postBody.active ? true : false,
  };
  insertUser['uid'] = getTimeStampUID();
  console.log(insertUser);

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
    const cypher = 'CREATE (a:User {uid:toInteger($uid),email:$email,firstname:$firstname,lastname:$lastname,active:$active}) RETURN a';
    const result = await session.run(
      cypher,
      insertUser
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
 * Update user by uid
 * @route PUT /api/users/{uid}
 * @group Users - Users Management
 * @param {integer} uid.path.required - unique identifier created for the node
 * @param {User.model} user.body.required - User object
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.put('/users/:uid', async (req, res) => {

  const uid = req.params.uid;
  const postBody = req.body;
  let updateUser = {
    'uid': uid,
    'email': postBody.email ? postBody.email : '',
    'firstname': postBody.firstname ? postBody.firstname : '',
    'lastname': postBody.lastname ? postBody.lastname : '',
    'active': postBody.active ? true : false,
  };
  
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
    const cypher = 'MATCH (u:User{uid:toInteger($uid)}) SET u.email=$email,u.firstname=$firstname,u.lastname=$lastname,u.active=$active RETURN u';
    const result = await session.run(
      cypher,
      updateUser
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
 * Delete user by uid
 * @route DELETE /api/users/{uid}
 * @group Users - Users Management
 * @param {integer} uid.path.required - unique identifier created for the node
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.delete('/users/:uid', async (req, res) => {
  const uid = req.params.uid;
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
    const cypher = 'MATCH (u:User{uid:toInteger($uid)}) DELETE u';
    const result = await session.run(
      cypher,
      { 'uid': uid }
    );

    // console.log(result);
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
 * @typedef User
 * @property {string} email.required - email of user
 * @property {string} firstname.required - first name
 * @property {string} lastname.required - last name
 * @property {boolean} active.required - active or not
 */