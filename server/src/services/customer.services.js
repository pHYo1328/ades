const pool = require('../config/database');
const chalk = require('chalk');

// CUSTOMER INFO

// Retrieve Customer Information by ID
module.exports.retrieveUserInfo = async (customer_id) => {
  const query = 'SELECT * FROM users WHERE customer_id = ?';
  const users = await pool.query(query, [customer_id]);
  console.log(chalk.blue('User info retrieved by customer_id!'));
  return users;
};
