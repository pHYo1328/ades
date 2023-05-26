const chalk = require('chalk');
const pool = require('../config/database');

module.exports.addBookMark = async (data) => {
  console.log(chalk.blue('addBookMark is called'));
  const {customerId,productId} = data;
  const addBookmarkQuery =`INSERT INTO bookmark(customer_id,brand_id) VALUES(?,?)`;
  try {
    console.log(chalk.blue('Creating connection...'));
    console.log(chalk.blue('Executing query', addBookmarkQuery));
    const result = await pool.query(addBookmarkQuery,[customerId,productId]);
    console.log(chalk.green('Result :', result[0]));
    return result[0];
  } catch (error) {
    console.log(chalk.red('Error in addBookmarkQuery: ', error));
    throw error;
  }
};