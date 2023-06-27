const pool = require('../config/database');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// creates new user
module.exports.registerUser = async (username, email, password, roles) => {
  console.log(chalk.blue('User registered successfully'));
  try {

     //  // Check if the username already exists in the database
    // const checkUsernameQuery = 'SELECT COUNT(*) as count FROM users WHERE username = ?';
    // const usernameExists = await pool.query(checkUsernameQuery, [username]);
    // const count = usernameExists[0].count; 

    // if (count > 0) {
    //   // Throw an error with status code 500
    //   const error = new Error('Username already exists');
    //   error.status = 500;
    //   throw error;
    // }

    // insert the new user

    const registerUserQuery =
      'INSERT INTO users (username, email, password, roles) VALUES (?, ?, ?, ?);';
    const results = await pool.query(registerUserQuery, [
      username,
      email,
      password,
      roles,
    ]);
    console.log(chalk.green(results));
    return results;

  } catch (error) {
    console.error(chalk.red('Error in registering new user: ', error)); //username prob already exists in database
    throw error;
  }
};

// login user
module.exports.loginUser = async (username) => {
  console.log(chalk.blue('user is logged in'));
  try {
    const loginUserQuery =
      'SELECT customer_id,username,password,roles FROM users WHERE username = ?';
    const results = await pool.query(loginUserQuery, [username]);
    console.log(chalk.red(JSON.stringify(results[0])));  // prints out the user logged in
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in logging user in: ', error));
    throw error;
  }
};

// check if refreshToken is reused
module.exports.checkRefreshTokenReuse = async (refreshToken) => {
  const sql = 'SELECT * FROM users WHERE refreshToken = ?';
  console.log('rt is reused');
  return pool.query(sql, [refreshToken]);
};

// update refreshToken
module.exports.saveRefreshToken = async (userId, refreshToken) => {
  try {
    const saveRefreshTokenQuery =
      'UPDATE users SET refreshToken = ? WHERE customer_id = ?';
    await pool.query(saveRefreshTokenQuery, [refreshToken, userId]);
    console.log('Refresh token saved in the database');
    return [refreshToken]; // Return the updated refresh token array
  } catch (error) {
    console.error('Error saving refresh token in the database:', error);
    throw error;
  }
};

// Find user by refreshToken
module.exports.findUserByRefreshToken = async (refreshToken) => {
  const query = 'SELECT * FROM users WHERE refreshToken = ?';
  const [foundUser] = await pool.query(query, [refreshToken]);
  console.log('user found by rt');
  return foundUser;
};

// Find username of user who does not have a refreshToken
module.exports.findUserByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = ?';
  const [foundUser] = await pool.query(query, [username]);
  console.log('find user by username found!');
  return foundUser;  
};

  // Update refreshToken for a user
  module.exports.updateRefreshToken = async (
    newRefreshTokenArray,
    newRefreshToken,
    userId
  ) => {
    const updateQuery = 'UPDATE users SET refreshToken = ? WHERE customer_id = ?';
    // updates refreshToken and create new array for the refreshToken for the same user
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
  // query to remove refreshToken by making it NULL 
  const logoutQuery =
    'UPDATE users SET refreshToken = NULL WHERE refreshToken = ? AND refreshToken IS NOT NULL';
  try {
    const updateResult = await pool.query(logoutQuery, [refreshToken]);

    if (updateResult.affectedRows === 0) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in logging out user: ', error);
    throw error;
  }
};

// Forgot password
module.exports.forgotPassword = async (email, newPassword) => {
  const getPasswordQuery = 'SELECT password FROM users WHERE email = ?';
  const updatePasswordQuery = 'UPDATE users SET password = ? WHERE email = ?';
  try {
    // Get the previous hashed password 
    const [rows] = await pool.query(getPasswordQuery, [email]);

    if (rows.length === 0) {
      // Admin not found
      console.log('User not found');
      return false;
    }

    const previousHashedPwd = rows[0].password;

    console.log(previousHashedPwd);
    console.log(newPassword);

    // Compare the new hashed password with the previous hashed password 
    const isSamePassword = await bcrypt.compare(newPassword, previousHashedPwd);
    if (isSamePassword) {
      // password is the same as the previous password 
      console.log('New password is the same as the previous password');
      return false;
    }

    // Encrypt the new password 
    const hashedPwd = await bcrypt.hash(newPassword, 10);

    // Update the password in admin database
    const updateResult = await pool.query(updatePasswordQuery, [
      hashedPwd,
      email,
    ]);

    if (updateResult.affectedRows === 0) {
      console.log('Password update failed');
      return false; // prob due to invalid email
    }

    console.log('Password updated successfully');
    return true; // Password updated successfully in db
  } catch (error) {
    console.error('Error in updating password: ', error);
    throw error;
  }
};

// Verify OTP
module.exports.verifyOTP = async (otp) => {
  try {
    console.log('am i here');
    const result = await pool.query('SELECT otp FROM users WHERE otp = ?', [
      otp,
    ]);

    const rows = result[0];
    if (rows.length > 0) {
      const savedOTP = rows[0].otp; // finds otp from database

      if (otp === savedOTP) { // compares OTP with inputted OTP
        // OTP verification successful
        console.log('otp same as db otp');
        return true;
      } else {
        // Invalid OTP
        console.log('ITS WRONG');
        return false;
      }
    } else {
      // User not found or OTP not saved
      return false;
    }
  } catch (error) {
    // Handle any error that occurred during the database query
    throw error;
  }
};

// Retrieve customer information
module.exports.retrieveUsersInfo = async () => {
  const query = 'SELECT * FROM users';
  const [users] = await pool.query(query);
  console.log('All users info retrieved!');
  return users;
};

// // Forgot password
// module.exports.forgotPassword = async (email, newPassword) => {
//   const forgotPasswordQuery = 'UPDATE users SET password = ? WHERE email = ?';
//   try {
//     const updateResult = await pool.query(forgotPasswordQuery, [newPassword, email]);
//     console.log(newPassword, email);
//     if (updateResult.affectedRows === 0) {
//       console.log("password did not update");
//       return false; // Password update failed, possibly due to incorrect email
//     }

//     console.log("password updated mannnn");
//     console.log(updateResult.affectedRows);

//     return true; // Password updated successfully
//   } catch (error) {
//     console.error('Error in updating password: ', error);
//     throw error;
//   }
// };

// // Check if the new password is the same as the previous password
// module.exports.isSameAsPreviousPassword = async (email, hashedPwd) => {
//   const getPasswordQuery = 'SELECT password FROM users WHERE email = ?';
//   try {
//     const [rows] = await pool.query(getPasswordQuery, [email]);

//     if (rows.length === 0) {
//       // User not found
//       console.log("user is not found");
//       return false;
//     }

//     const previousHashedPwd = rows[0].password;
//     console.log(rows[0].password);
//     console.log(hashedPwd);

//     const isSamePassword = await bcrypt.compare(hashedPwd, previousHashedPwd);
//     console.log("isSamePassword: ", isSamePassword);
//     console.log("am i here");

//     return isSamePassword;
//   } catch (error) {
//     console.error('Error in retrieving previous password: ', error);
//     throw error;
//   }
// };
