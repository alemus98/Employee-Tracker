const mysql = require('mysql2');

const connection = mysql.createConnection({
    database: 'store_db',
    user: 'root',
    password: 'juno',
    host: 'localhost',
    port: 3306
  
});

module.exports = connection;