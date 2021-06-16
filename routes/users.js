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

module.exports = r;