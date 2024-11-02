const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const connect = mysql.createPool({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT
}).promise();

module.exports = connect;