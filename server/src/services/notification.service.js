const pool = require('../config/database');
const chalk = require('chalk');

module.exports.addNotification = async (customerID, message, brand_id) => {
  console.log(chalk.blue('addNotification function is called'));
  const sqlStr = `
  INSERT INTO notifications (customer_id, message, have_email, brand_id)
  VALUES (?, ?, true, ?)
  ON DUPLICATE KEY UPDATE message = VALUES(message);
`;
  try {
    await pool.query(sqlStr, [customerID, message, brand_id]);
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
  const sqlStr =
    'SELECT have_email,message FROM notifications WHERE customer_id = ? ';
  try {
    const result = await pool.query(sqlStr, [customerID]);
    console.log(chalk.green('fetch notification successfully'));
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
