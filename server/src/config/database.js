const mysql2 = require('mysql2/promise');
const config = require('./config');

const pool = mysql2.createPool({
    user: config.user,
    password: config.password,
    host: config.host,
    database: config.database,
    connectionLimit: config.connectionLimit,
    multipleStatements: true,
    ssl: {
        rejectUnauthorized: false,
    },
});

module.exports = pool;
