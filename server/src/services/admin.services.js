const pool = require('../config/database');
const chalk = require('chalk');

// ADMIN CONTROL BOARD

// UPDATE USER INFO
module.exports.updateUser = async (username, email, password, userid) => {
  console.log(chalk.blue('User updated successfully'));
  try {
    // Update the user's information
    const updateUserQuery =
      'UPDATE users SET username = ?, email = ?, password = ? WHERE customer_id = ?;';
    await pool.query(updateUserQuery, [username, email, password, userid]);
    console.log(username, email, userid);
    // Fetch the updated user from the database to display
    const getUserQuery = 'SELECT * FROM users WHERE customer_id = ?;';
    console.log('sql userid', userid);
    const [updatedUser] = await pool.query(getUserQuery, [userid]);
    console.log(chalk.green('this is my userid', userid)); // inputted userid

    return updatedUser;
  } catch (error) {
    console.error(chalk.red('Error in updating user: ', error));
    throw error;
  }
};

// // DELETE USER
// module.exports.deleteUser = async (userid) => {
//   console.log(chalk.blue('User deleted successfully'));
//   console.log('this is 1231234' + userid.userid);
//   try {
//     console.log("I'm inside delete try-catch");
//     // Update the user information
//     const deleteUserQuery = 'DELETE FROM users WHERE userid = ?';
//     const deletedUser = await pool.query(deleteUserQuery, [userid]);
//     console.log(chalk.green(userid));
//     console.log('this is the deleted user ', deletedUser);
//     return deletedUser; // Return the deletedUser object
//   } catch (error) {
//     console.error(chalk.red('Error in deleting user: ', error));
//     throw error;
//   }
// };

// Delete user
module.exports.deleteUser = async (userid) => {
  console.log(chalk.blue('User deleted successfully'));
  const orderDeleteQuery =
    'DELETE FROM orders WHERE customer_id = ? AND order_status NOT IN ("paid", "delivering");';
  const productOrderDeleteQuery =
    'DELETE product FROM product INNER JOIN cart ON product.product_id = cart.product_id;';
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
      pool.query(orderDeleteQuery, [userid]),
      pool.query(productOrderDeleteQuery),
      pool.query(userDeleteQuery, [userid]),
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
