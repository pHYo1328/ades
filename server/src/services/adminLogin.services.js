const pool = require('../config/database');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Create new admin
module.exports.registerAdmin = async (username, email, password, roles) => {
  console.log(chalk.blue('User registered successfully'));
  try {
    // insert the new admin
    const registerAdminQuery =
      'INSERT INTO admin (username, email, password, roles) VALUES (?, ?, ?, ?);';
    const results = await pool.query(registerAdminQuery, [
      username,
      email,
      password,
      roles,
    ]);
    console.log(chalk.green(results));
    return results;
  } catch (error) {
    console.error(chalk.red('Error in registering new ADMIN: ', error)); //username prob already exists in database
    throw error;
  }
};

// Login admin
module.exports.loginAdmin = async (username) => {
  console.log(chalk.blue('admin is logged in'));
  try {
    const loginAdminQuery =
      'SELECT admin_id,username,password,roles FROM admin WHERE username = ?';
    const results = await pool.query(loginAdminQuery, [username]);
    console.log(chalk.red(JSON.stringify(results[0]))); // prints out the admin logged in
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in logging admin in: ', error));
    throw error;
  }
};

// Update refreshToken for admin
module.exports.saveAdminRefreshToken = async (userId, refreshToken) => {
  try {
    const saveRefreshTokenQuery =
      'UPDATE admin SET refreshToken = ? WHERE admin_id = ?';
    await pool.query(saveRefreshTokenQuery, [refreshToken, userId]);
    console.log('Refresh token saved in the database in admin db');
    return [refreshToken]; // Return the updated refresh token array
  } catch (error) {
    console.error('Error saving refresh token in the database:', error);
    throw error;
  }
};

// Check if refreshToken is reused for admin
module.exports.checkAdminRefreshTokenReuse = async (refreshToken) => {
  const sql = 'SELECT * FROM admin WHERE refreshToken = ?';
  console.log('rt is reused on admin side');
  return pool.query(sql, [refreshToken]);
};

// Find admin by refreshToken
module.exports.findAdminByRefreshToken = async (refreshToken) => {
  const query = 'SELECT * FROM admin WHERE refreshToken = ?';
  const [foundUser] = await pool.query(query, [refreshToken]);
  console.log('admin found by rt');
  return foundUser;
};

// Find username of admin who does not have a refreshToken
module.exports.findAdminByUsername = async (username) => {
  const query = 'SELECT * FROM admin WHERE username = ?';
  const [foundUser] = await pool.query(query, [username]);
  console.log('find admin by username found!');
  return foundUser;
};

// Update refreshToken for an admin
module.exports.updateRefreshToken = async (
  newRefreshTokenArray,
  newRefreshToken,
  userId
) => {
  const updateQuery = 'UPDATE admin SET refreshToken = ? WHERE admin_id = ?';
  const values = [...newRefreshTokenArray, newRefreshToken, userId];

  try {
    const result = await pool.query(updateQuery, values);
    return result;
  } catch (error) {
    console.error('Error updating refreshToken:', error);
    throw error;
  }
};

// Logout user
module.exports.logoutUser = async (refreshToken) => {
  const logoutQuery =
    'UPDATE admin SET refreshToken = NULL WHERE refreshToken = ? AND refreshToken IS NOT NULL';
  try {
    const updateResult = await pool.query(logoutQuery, [refreshToken]);

    if (updateResult.affectedRows === 0) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in logging out admin: ', error);
    throw error;
  }
};

// Forgot password
module.exports.forgotPassword = async (email, newPassword) => {
  const getPasswordQuery = 'SELECT password FROM admin WHERE email = ?';
  const updatePasswordQuery = 'UPDATE admin SET password = ? WHERE email = ?';
  try {
    // Get the previous hashed password
    const [rows] = await pool.query(getPasswordQuery, [email]);

    if (rows.length === 0) {
      // User is not found
      console.log('Admin not found');
      return false;
    }

    const previousHashedPwd = rows[0].password;

    console.log(previousHashedPwd);
    console.log(newPassword);

    // Compare the new hashed password with the previous hashed password
    const isSamePassword = await bcrypt.compare(newPassword, previousHashedPwd);
    if (isSamePassword) {
      // if password is the same as the previous password
      console.log(
        'New password is the same as the previous password for admin'
      );
      return false;
    }

    // Encrypt the new password
    const hashedPwd = await bcrypt.hash(newPassword, 10);

    // Update the password into the database
    const updateResult = await pool.query(updatePasswordQuery, [
      hashedPwd,
      email,
    ]);

    if (updateResult.affectedRows === 0) {
      console.log('Password update failed');
      return false; // prob due to wrong email
    }

    console.log('Password updated successfully');
    return true; // Password updated successfully
  } catch (error) {
    console.error('Error in updating password: ', error);
    throw error;
  }
};

// Verify OTP
module.exports.verifyOTP = async (otp) => {
  try {
    console.log('am i admin');
    const result = await pool.query('SELECT otp FROM admin WHERE otp = ?', [
      otp,
    ]);

    const rows = result[0];
    if (rows.length > 0) {
      const savedOTP = rows[0].otp; //finds OTP from database

      if (otp === savedOTP) {
        // compares OTP with inputted OTP
        // OTP verification successful
        console.log('otp same as db otp for admin');
        return true;
      } else {
        // Invalid OTP
        console.log('ITS WRONG');

        return false;
      }
    } else {
      // User not found or OTP not saved
      console.log('not here LOL');
      return false;
    }
  } catch (error) {
    // Handle any error that occurred during the database query
    throw error;
  }
};
