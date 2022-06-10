const mysql = require('mysql2');
const database = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'Wishbone1!',
      database: 'employee_database'
    }
  );

  module.exports = database;