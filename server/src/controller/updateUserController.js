const bcrypt = require('bcrypt');
const adminServices = require('../services/admin.services');
const chalk = require('chalk');
const pool = require('../config/database');

// Update user information
const updateUser = async (req, res) => {
  const { userid, username, email, password } = req.body;
  try {
    console.log('updateController userid', userid);
    // Fetch the previous hashed password from the database
    const getUserQuery = 'SELECT password FROM users WHERE customer_id = ?;';
    const [user] = await pool.query(getUserQuery, [userid]);
    const previousHashedPwd = user[0].password;

    // Compare the new password with the previous password
    const isSamePassword = await bcrypt.compare(password, previousHashedPwd);
    if (isSamePassword) {
      // Password is the same as the previous password
      console.log('New password is the same as the previous password');
      res.status(400).json({
        error: 'New password cannot be the same as the previous password',
      });
      return;
    }

    // Generate bcrypt hash for the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user information, including the hashed password
    const updatedUser = await adminServices.updateUser(
      username,
      email,
      hashedPassword,
      userid
    );
    console.log('updated user', userid);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(chalk.red('Error in updating user: ', error));
    res.status(500).json({ error: 'Failed to update user' });
  }
};

module.exports = { updateUser };
