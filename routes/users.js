const express = require('express');
const r = express.Router();
const mysql = require('mysql2/promise');

const { mysqlConf } = require('../_config.js');

const mysqlOptions = {
      host: mysqlConf.host, 
      user: mysqlConf.user, 
      password: mysqlConf.password,
      database: mysqlConf.database,
    };

/**
 * Get newest user
 * @route GET /api/users/latest
 * @group Users - Users Management
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.get('/users/latest', async (req, res) => {
  let users;
  try{
    const connection = await mysql.createConnection(mysqlOptions);

    const [rows, fields] = await connection.execute('SELECT * FROM `users` ORDER BY id DESC LIMIT 1');

    console.log('rows', rows);
    // console.log('fields', fields);

    users = rows;
    connection.end();

  } catch(ex) {
    console.log(ex);
  } finally {
    console.log('finish');
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
  let users;
  try{
    const connection = await mysql.createConnection(mysqlOptions);

    const [rows, fields] = await connection.query(
      'SELECT * FROM `users` WHERE `id` = ?',
      [id],
    );

    console.log('rows', rows);
    // console.log('fields', fields);

    users = rows;
    connection.end();

  } catch(ex) {
    console.log(ex);
  } finally {
    console.log('finish');
  }

  // console.log('request time: ',req.requestTime);
  res.json(users);

});

/**
 * Create user
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
  };

  let resp;
  try{
    const connection = await mysql.createConnection(mysqlOptions);

    const opsRes = await connection.query(
      'INSERT INTO `users` (`email`, `firstname`, `lastname`) VALUES (?,?,?)',
      [insertUser.email, insertUser.firstname, insertUser.lastname],
    );

    console.log('result:', opsRes);
    resp = { 'insertId': opsRes[0].insertId }
    connection.end();

  } catch(ex) {
    console.log(ex);
  } finally {
    console.log('finish');
  }

  // console.log('request time: ',req.requestTime);
  res.json(resp);
});

/**
 * Update user by id
 * @route PUT /api/users/{id}
 * @group Users - Users Management
 * @param {integer} id.path.required - id of user
 * @param {User.model} user.body.required - User object
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.put('/users/:id', async (req, res) => {

  let postBody = req.body;
  let editUser = {
    'email': postBody.email ? postBody.email : '',
    'firstname': postBody.firstname ? postBody.firstname : '',
    'lastname': postBody.lastname ? postBody.lastname : '',
  };
  const id = req.params.id;

  let resp;
  try{
    const connection = await mysql.createConnection(mysqlOptions);

    const opsRes = await connection.query(
      'UPDATE `users` SET `email`=?, `firstname`=?, `lastname`=? WHERE `id`=?',
      [editUser.email, editUser.firstname, editUser.lastname, id],
    );
    console.log('result:', opsRes);
    resp = { 'changedRows': opsRes[0].changedRows }
    connection.end();

  } catch(ex) {
    console.log(ex);
  } finally {
    console.log('finish');
  }

  // console.log('request time: ',req.requestTime);
  res.json(resp);
});

/**
 * Delete user by id
 * @route DELETE /api/users/{id}
 * @group Users - Users Management
 * @param {integer} id.path.required - id of user
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.delete('/users/:id', async (req, res) => {

  const id = req.params.id;
  let resp;
  try{
    const connection = await mysql.createConnection(mysqlOptions);

    const opsRes = await connection.query(
      'DELETE FROM `users` WHERE `id`=?',
      [id],
    );
    console.log('result:', opsRes);
    resp = { 'affectedRows': opsRes[0].affectedRows }
    connection.end();

  } catch(ex) {
    console.log(ex);
  } finally {
    console.log('finish');
  }

  // console.log('request time: ',req.requestTime);
  res.json(resp);
});

/**
 * Update user by id - stored procedure example
 * @route PUT /api/users/update/{id}/active/{active}
 * @group Users - Users Management
 * @param {integer} id.path.required - id of user
 * @param {boolean} active.path.required - active true or false
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
r.put('/users/update/:id/active/:active', async (req, res) => {

  let postBody = req.body;
  let editUser = {
    'email': postBody.email ? postBody.email : '',
    'firstname': postBody.firstname ? postBody.firstname : '',
    'lastname': postBody.lastname ? postBody.lastname : '',
  };
  const id = req.params.id;
  const active = req.params.active == 'true' ? 1:0;

  let resp;
  try{
    const connection = await mysql.createConnection(mysqlOptions);

    const opsRes = await connection.query(
      'CALL setActive(?,?)',
      [active,id],
    );
    console.log('result:', opsRes);
    resp = { 'affectedRows': opsRes[0].affectedRows }
    connection.end();

  } catch(ex) {
    console.log(ex);
  } finally {
    console.log('finish');
  }

  // console.log('request time: ',req.requestTime);
  res.json(resp);
});

module.exports = r;

/**
 * @typedef User
 * @property {string} email.required - email of user
 * @property {string} firstname.required - first name
 * @property {string} lastname.required - last name
 */