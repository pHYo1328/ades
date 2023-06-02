const chalk = require('chalk');
const pool = require('../config/database');

// overwriting bookmark data in database
module.exports.addBookMark = async (data) => {
  console.log(chalk.blue('addBookMark is called'));
  const { customerId, brandIds } = data;
  console.log(chalk.yellow('Inspecting data variables'), customerId, brandIds);
  const brandIdsData = brandIds.map((brand) => [customerId, brand]);
  const addBookmarkQuery = `INSERT IGNORE INTO bookmark(customer_id, brand_id) VALUES ?`;
  const deleteBookmarkQuery = `DELETE FROM bookmark WHERE customer_id = ? AND brand_id NOT IN (?)`;
  const deleteAllBookmarkQuery = `DELETE FROM bookmark WHERE customer_id = ?`;
  try {
    console.log(chalk.blue('Creating connection...'));
    let result = null;

    //if brand id data is bigger than , means user never unbookmarked anything
    if (brandIds.length > 0) {

      // first insert all data ignore duplicate
      console.log(chalk.blue('Executing query', addBookmarkQuery));
      result = await pool.query(addBookmarkQuery, [brandIdsData]);
      console.log(chalk.green('Result:', result));

      // then clear everything that is not inside new bookmark brand id data
      console.log(chalk.blue('Executing query', deleteBookmarkQuery));
      await pool.query(deleteBookmarkQuery, [customerId, brandIds]);
    } else {
      // else delete all data from database
      console.log(chalk.blue('Executing query', deleteAllBookmarkQuery));
      await pool.query(deleteAllBookmarkQuery, [customerId]);
    }
    return result ? result.affectedRows : 0;
  } catch (error) {
    console.log(chalk.red('Error in addBookmarkQuery:', error));
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
