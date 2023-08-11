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

// Update user info
module.exports.updateUserInfo = async (
  customer_id,
  username,
  email,
  password
) => {
  let query = 'UPDATE users SET';

  const params = [];
  if (username) {
    query += ' username = ?,';
    params.push(username);
  }
  if (email) {
    query += ' email = ?,';
    params.push(email);
  }
  if (password) {
    query += ' password = ?,';
    params.push(password);
  }

  // Remove the trailing comma from the query
  query = query.slice(0, -1);

  query += ' WHERE customer_id = ?';
  params.push(customer_id);

  try {
    await pool.query(query, params);
    console.log('User information updated successfully.');
  } catch (error) {
    console.error('Error updating user information:', error);
  }
};

// update user profile image
module.exports.updateProfileImage = async (image_url, customer_id) => {
  console.log('updateprofileimage service');

  try {
    const updateQuery = 'UPDATE users SET image_url = ? WHERE customer_id = ?';
    const results = await pool.query(updateQuery, [image_url, customer_id]);
    console.log(chalk.green('profile image updated'));
    console.log(chalk.green(results));
    return results;
  } catch (error) {
    console.log(chalk.red('Error in updating user profile image: ', error));
    throw error;
  }
};

// Retrieve Order Info
module.exports.retrieveOrderInfo = async (customer_id) => {
  const query = 'SELECT * FROM orders WHERE customer_id = ?';
  console.log("am i here in retrieveOrder");
  const [rows] = await pool.query(query, [customer_id]);
  console.log(chalk.blue('Order info retrieved by customer_id!'));
  return rows; // Return rows, not users
};

// Delete User on user side
module.exports.deleteUserByCustomerId = async (customer_id) => {
  console.log("deleteUserByCustomer id is " + customer_id);
  const orderDeleteQuery =
    'DELETE FROM orders WHERE customer_id = ? AND order_status NOT IN ("paid", "delivering");';
  const productOrderDeleteQuery =
    'DELETE FROM product WHERE product_id IN (SELECT product_id FROM cart WHERE customer_id = ?);';
  const userDeleteQuery = 'DELETE FROM users WHERE customer_id = ?';

  const connection = await pool.getConnection();
  console.log(
    chalk.blue('Database is connected to admin.services deleteUser query')
  );
  try {
    console.log(chalk.blue('Running SQL >>>>>>'));
    await connection.beginTransaction();
    // Run the delete queries concurrently
    await Promise.all([
      pool.query(orderDeleteQuery, [customer_id]),
      pool.query(productOrderDeleteQuery, [customer_id]),
      pool.query(userDeleteQuery, [customer_id]),
    ]);
    await connection.commit(); // commit all changes after Promise.All runs successfully
    console.log(
      chalk.green('User and all involving orders deleted successfully')
    );
    return true;
  } catch (error) {
    await connection.rollback(); // else rollback if errors are met
    console.error(chalk.red('Error in deleteUser:', error));
    throw error;
  } finally {
    connection.release();
  }
};

