const mysql = require('mysql2');

const db = mysql.createConnection({
    database: 'store_db',
    user: 'root',
    password: 'juno',
    host: 'localhost',
    port: 3306
  
},
console.log(
    `------------------------
 ☆ EMPLOYEE TRACKER ☆
------------------------`)
    );

 module.exports = db;