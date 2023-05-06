const dotenv = require('dotenv');
const path = require('path');
// to access the env file in root dir, we must add path for that file
//use path.join to help avoiding error for platform syntax (window \, unix-based /)
dotenv.config({ path: path.join(__dirname, '../../.env') });
module.exports = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    cookie_secret: process.env.COOKIE_SECRET,
    cryptr_secret:process.env.CRYPTR_SECRET,
    redis_password : process.env.REDIS_PASSWORD,
    redis_host : process.env.REDIS_HOST,
    redis_port : process.env.REDIS_PORT,
}