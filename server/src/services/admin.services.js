const { user } = require('../config/config');
const pool = require('../config/database');
const chalk = require('chalk');

// ADMIN CONTROL BOARD

// UPDATE USER INFO
module.exports.updateUser = async (username, email, password, userid) => {
  console.log(chalk.blue('User updated successfully'));
  try {
    console.log("I'm inside try-catch");
    // Update the user information
    const updateUserQuery =
      'UPDATE users SET username = ?, email = ?, password = ? WHERE userid = ?;';
    await pool.query(updateUserQuery, [username, email, password, userid]);
    console.log(username, email, userid);
    // Fetch the updated user from the database
    const getUserQuery = 'SELECT * FROM users WHERE userid = ?;';
    console.log('sql userid', userid);
    const [updatedUser] = await pool.query(getUserQuery, [userid]);
    console.log(chalk.green('this is my userid', userid));

    return updatedUser;
  } catch (error) {
    console.error(chalk.red('Error in updating user: ', error));
    throw error;
  }
};

// DELETE USER
module.exports.deleteUser = async (userid) => {
  console.log(chalk.blue('User deleted successfully'));
  console.log('this is 1231234' + userid.userid);
  try {
    console.log("I'm inside delete try-catch");
    // Update the user information
    const deleteUserQuery = 'DELETE FROM users WHERE userid = ?';
    const deletedUser = await pool.query(deleteUserQuery, [userid]);
    console.log(chalk.green(userid));
    console.log('this is the deleted user ', deletedUser);
    return deletedUser; // Return the deletedUser object
  } catch (error) {
    console.error(chalk.red('Error in deleting user: ', error));
    throw error;
  }
};
