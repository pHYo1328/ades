const chalk = require('chalk');
const pool = require('../config/database');

// Add a single brand to the bookmarks
module.exports.addBookMark = async (data) => {
  console.log(chalk.blue('addBookMark is called'));
  const { customerId, brandId } = data;  // Take single brandId instead of an array of brandIds
  console.log(chalk.yellow('Inspecting data variables'), customerId, brandId);
  const addBookmarkQuery = `INSERT IGNORE INTO bookmark(customer_id, brand_id) VALUES (?, ?)`;

  try {
    console.log(chalk.blue('Creating connection...'));
    console.log(chalk.blue('Executing query', addBookmarkQuery));
    const result = await pool.query(addBookmarkQuery, [customerId, brandId]);  // Pass single brandId to query
    console.log(chalk.green('Result:', result));
    return result ? result.affectedRows : 0;
  } catch (error) {
    console.log(chalk.red('Error in addBookMark:', error));
    throw error;
  }
};

// Remove a single brand from the bookmarks
module.exports.removeBookMark = async (data) => {  // New function for removing bookmarks
  console.log(chalk.blue('removeBookMark is called'));
  const { customerId, brandId } = data;  // Take single brandId
  console.log(chalk.yellow('Inspecting data variables'), customerId, brandId);
  const removeBookmarkQuery = `DELETE FROM bookmark WHERE customer_id = ? AND brand_id = ?`;

  try {
    console.log(chalk.blue('Creating connection...'));
    console.log(chalk.blue('Executing query', removeBookmarkQuery));
    const result = await pool.query(removeBookmarkQuery, [customerId, brandId]);  // Pass single brandId to query
    console.log(chalk.green('Result:', result));
    return result ? result.affectedRows : 0;
  } catch (error) {
    console.log(chalk.red('Error in removeBookMark:', error));
    throw error;
  }
};


// fetch all bookmark data from database for a particular customer
module.exports.fetchBookmarkByCustomerID = async (data) => {
  console.log(chalk.blue('fetcherBookmarkByCustomerID is called'));
  const { customerId } = data;
  const fetchBookmarkQuery = `SELECT brand_id FROM bookmark WHERE customer_id =?`;
  try {
    console.log(chalk.blue('Creating connection...'));
    console.log(chalk.blue('Executing query', fetchBookmarkQuery));
    const result = await pool.query(fetchBookmarkQuery, [customerId]);
    console.log(chalk.green('Result :', result[0]));
    return result[0];
  } catch (error) {
    console.log(chalk.red('Error in fetchBookmarkByCustomerID: ', error));
    throw error;
  }
};
