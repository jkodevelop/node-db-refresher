const express = require('express');
const r = express.Router();
const { MongoClient, ObjectID } = require('mongodb');

const { mongodb } = require('../_config.js');
// const mongodb = conf.mongodb;

/**
 * Get newest user
 * @route GET /api/users/latest
 * @group Users - Users Management
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.get('/users/latest', async (req, res) => {

  const client = new MongoClient(mongodb.url, mongodb.commonOptions);
  let users;
  try {
    await client.connect();
    const database = client.db(mongodb.dbName);
    const user = database.collection('user');
    const query = {};
    const options = {
      // sort matched documents in descending order by _id
      sort: { _id: -1 },
      projection: { _id: 0, email: 1, firstname: 1, lastname: 1 },
    };
    users = await user.findOne(query, options);
    // since this method returns the matched document, not a cursor, print it directly
    console.log(users);
  } catch(ex) {
    console.log(ex);
  } finally {
    await client.close();
  }

  // console.log('request time: ',req.requestTime);
  res.json(users);
});

/**
 * Get User by id
 * @route GET /api/users/get/{id}
 * @group Users - Users Management
 * @param {string} id.path.required - ID
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.get('/users/get/:id', async (req, res) => {

  const id = req.params.id;
  const client = new MongoClient(mongodb.url, mongodb.commonOptions);
  let users;
  try {
    await client.connect();
    const database = client.db(mongodb.dbName);
    const user = database.collection('user');
    const query = { "_id": new ObjectID(id) };
    const options = {
      // sort matched documents in descending order by _id
      sort: { _id: -1 },
      projection: { _id: 0, email: 1, firstname: 1, lastname: 1 },
    };
    users = await user.findOne(query, options);
    // since this method returns the matched document, not a cursor, print it directly
    console.log(users);
  } catch(ex) {
    console.log(ex);
  } finally {
    await client.close();
  }

  // console.log('request time: ',req.requestTime);
  res.json(users);
});

/**
 * Create new user
 * @route POST /api/users
 * @group Users - Users Management
 * @param {User.model} user.body.required - User Object
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.post('/users', async (req, res) => {

  const client = new MongoClient(mongodb.url, mongodb.commonOptions);
  let postUser = req.body;
  let users;
  try {
    await client.connect();
    const database = client.db(mongodb.dbName);
    const user = database.collection('user');
    const result = await user.insertOne(postUser);
    console.log(`${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,result);
    users = result.ops;
  } catch(ex) {
    console.log(ex);
  } finally {
    await client.close();
  }

  // console.log('request time: ',req.requestTime);
  res.json(users);
});

/**
 * Update user by _id
 * @route PUT /api/users/{id}
 * @group Users - Users Management
 * @param {string} id.path.required - ID
 * @param {User.model} user.body.required - User Object
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.put('/users/:id', async (req, res) => {

  const client = new MongoClient(mongodb.url, mongodb.commonOptions);
  const id = req.params.id;
  let postUser = req.body;
  let resp;
  try {
    await client.connect();
    const database = client.db(mongodb.dbName);
    const user = database.collection('user');

    const filter = { "_id": new ObjectID(id) };
    const updateUser = {
      $set: {
        ...postUser
      },
    };
    const options = { upsert: true }; // create a document if no documents match the query

    // alternative: replace op = replace the entire object with passed in attributes and values
    // const result = await user.replaceOne(filter, updateUser, options);

    const result = await user.updateOne(filter, updateUser, options);
    console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,result);
    resp = { 
      "modified": result.modifiedCount,
      "upsert": result.upsertedCount
    };

  } catch(ex) {
    console.log(ex);
  } finally {
    await client.close();
  }

  // console.log('request time: ',req.requestTime);
  res.json(resp);
});

/**
 * Delete user by _id
 * @route DELETE /api/users/{id}
 * @group Users - Users Management
 * @param {string} id.path.required - ID
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.delete('/users/:id', async (req, res) => {

  const client = new MongoClient(mongodb.url, mongodb.commonOptions);
  const id = req.params.id;
  let resp;
  try {
    await client.connect();
    const database = client.db(mongodb.dbName);
    const user = database.collection('user');
    const query = { "_id": new ObjectID(id) };
    const result = await user.deleteOne(query);
    
    resp = {
      "deleted": result.deletedCount
    }

  } catch(ex) {
    console.log(ex);
  } finally {
    await client.close();
  }

  // console.log('request time: ',req.requestTime);
  res.json(resp);
});

module.exports = r;

/**
 * @typedef User
 * @property {string} email.required - email of user
 * @property {string} firstname.required - first name of user
 * @property {string} lastname.required - last name of user
 */