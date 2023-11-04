const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Tommy@613',
    database: 'employees_db',
});

console.log(`Connected to the employees_db database.`);

module.exports = db;
