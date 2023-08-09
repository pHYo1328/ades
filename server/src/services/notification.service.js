const pool = require('../config/database');
const chalk = require('chalk');

module.exports.addNotification = async (customerID) => {
  console.log(chalk.blue('addNotification function is called'));
  const sqlStr = 'INSERT IGNORE INTO notifications VALUES (?,true)';
  try {
    await pool.query(sqlStr, [customerID]);
    console.log(chalk.green('added notification successfully'));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.removeNotification = async (customerID) => {
  console.log(chalk.blue('removeNotification function is called'));
  const sqlStr = 'DELETE FROM notifications WHERE customer_id = ? ';
  try {
    await pool.query(sqlStr, [customerID]);
    console.log(chalk.green('remove notification successfully'));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.getNotification = async (customerID) => {
  console.log(chalk.blue('getNotification function is called'));
  const sqlStr = 'SELECT have_email FROM notifications WHERE customer_id = ? ';
  try {
    const result = await pool.query(sqlStr, [customerID]);
    console.log(chalk.green('fetch notification successfully'));
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
