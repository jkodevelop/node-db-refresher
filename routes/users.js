const express = require('express');
const r = express.Router();
const mysql = require('mysql2/promise');

const { mysqlConf } = require('../_config.js');

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
    const connection = await mysql.createConnection({
      host: mysqlConf.host, 
      user: mysqlConf.user, 
      password: mysqlConf.password,
      database: mysqlConf.database,
    });

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
    const connection = await mysql.createConnection({
      host: mysqlConf.host, 
      user: mysqlConf.user, 
      password: mysqlConf.password,
      database: mysqlConf.database,
    });

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

module.exports = r;