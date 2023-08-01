const chalk = require('chalk');
const pool = require('../config/database');

module.exports.fetchShippingMethods = async () => {
  console.log(chalk.blue('fetchShippingMethods is called'));
  const fetchShippingMethodsQuery = 'SELECT * FROM shipping';
  try {
    console.log(chalk.blue('Creating connection...'));
    console.log(chalk.blue('Executing query', fetchShippingMethodsQuery));
    const result = await pool.query(fetchShippingMethodsQuery);
    console.log(chalk.green('Result :', result[0]));
    return result[0];
  } catch (error) {
    console.log(chalk.red('Error in fetchShippingMethods: ', error));
    throw error;
  }
};
