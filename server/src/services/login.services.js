const pool = require('../config/database');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// create new user
module.exports.registerUser = async (username, email, password) => {
  console.log(chalk.blue('User registered successfully'));
  try {
    // check for duplicates in the users table
    const checkDuplicateQuery =
      'SELECT COUNT(*) as count FROM users WHERE username = ?';
    const duplicateResults = await pool.query(checkDuplicateQuery, [username]);
    const count = duplicateResults[0].count;
    if (count > 0) {
      throw new Error('Username already exists');
    }

    // insert the new user
    const registerUserQuery =
      'INSERT INTO users (username, email, password, roles) VALUES (?, ?, ?, "user");';
    const results = await pool.query(registerUserQuery, [
      username,
      email,
      password,
    ]);
    console.log(chalk.green(results));
    return results;
  } catch (error) {
    console.error(chalk.red('Error in registering new user: ', error));
    throw error;
  }
};

// login user
module.exports.loginUser = async (username) => {
  console.log(chalk.blue('user is logged in'));
  try {
    const loginUserQuery =
      'SELECT userid,username,password,roles FROM users WHERE username = ?';
    const results = await pool.query(loginUserQuery, [username]);
    console.log(chalk.red(JSON.stringify(results[0])));
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
      'UPDATE users SET refreshToken = ? WHERE userid = ?';
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
  const updateQuery = 'UPDATE users SET refreshToken = ? WHERE userid = ?';
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
      // User not found
      console.log("User not found");
      return false;
    }

    const previousHashedPwd = rows[0].password;

    console.log(previousHashedPwd);
    console.log(newPassword);

    // Compare the new hashed password with the previous hashed password
    const isSamePassword = await bcrypt.compare(newPassword, previousHashedPwd);
    if (isSamePassword) {
      // password is the same as the previous password
      console.log("New password is the same as the previous password");
      return false;
    }

    // Encrypt the new password
    const hashedPwd = await bcrypt.hash(newPassword, 10);

    // Update the password
    const updateResult = await pool.query(updatePasswordQuery, [hashedPwd, email]);

    if (updateResult.affectedRows === 0) {
      console.log('Password update failed');
      return false; // prob due to email
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
    console.log("am i here");
    const result = await pool.query(
      'SELECT otp FROM users WHERE otp = ?',
      [otp]
    );

    const rows = result[0];
    if (rows.length > 0) {
      const savedOTP = rows[0].otp;

      if (otp === savedOTP) {
        // OTP verification successful
        console.log("otp same as db otp");
        return true;
      } else {
        // Invalid OTP
        console.log("ITS WRONG");
        return false;
      }
    } else {
      // User not found or OTP not saved
      console.log("not here LOL");
      return false;
    }
  } catch (error) {
    // Handle any error that occurred during the database query
    throw error;
  }
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




// // delete product by ID (done, but still need to delete from order)
// module.exports.deleteProductByID = async (productID) => {
//   console.log(chalk.blue('deleteProductByID is called'));
//   try {
//     const productDeleteQuery = 'DELETE FROM product where product_id=?;';
//     const results = await pool.query(productDeleteQuery, [productID]);
//     console.log(chalk.green(results));
//     console.log(chalk.yellow(results[0].affectedRows));
//     return results[0].affectedRows > 0;
//   } catch (error) {
//     console.error(chalk.red('Error in deleteProductByID: ', error));
//     throw error;
//   }
// };

// // get products by category (done)
// module.exports.getProductsByCategoryID = async (categoryID) => {
//   console.log(chalk.blue('getProductsByCategoryID is called'));
//   try {
//     const productsDataQuery =
//       'SELECT p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url FROM product p, category c, brand b where c.category_id = p.category_id and p.brand_id = b.brand_id and c.category_id =?;';
//     const results = await pool.query(productsDataQuery, [categoryID]);
//     console.log(chalk.green(results[0]));
//     return results[0];
//   } catch (error) {
//     console.error(chalk.red('Error in getProductsByCategoryID: ', error));
//     throw error;
//   }
// };

// // get products by brand (done)
// module.exports.getProductsByBrandID = async (brandID) => {
//   console.log(chalk.blue('getProductsByBrandID is called'));
//   try {
//     const productsDataQuery =
//       'SELECT p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url FROM product p, category c, brand b where c.category_id = p.category_id and p.brand_id = b.brand_id and b.brand_id =?;';
//     const results = await pool.query(productsDataQuery, [brandID]);
//     console.log(chalk.green(results[0]));
//     return results[0];
//   } catch (error) {
//     console.error(chalk.red('Error in getProductsByBrandID: ', error));
//     throw error;
//   }
// };

// // get 5 newest product arrivals (done)
// module.exports.getNewArrivals = async () => {
//   console.log(chalk.blue('getNewArrivals is called'));
//   try {
//     const productsDataQuery =
//       'SELECT p.product_id, p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url FROM product p, category c, brand b where c.category_id = p.category_id and p.brand_id = b.brand_id order by created_at desc limit 5';
//     const results = await pool.query(productsDataQuery);
//     console.log(chalk.green(results[0]));
//     return results[0];
//   } catch (error) {
//     console.error(chalk.red('Error in getNewArrivals: ', error));
//     throw error;
//   }
// };

// // update product by ID
// module.exports.updateProductByID = async (
//   product_name,
//   price,
//   description,
//   category_id,
//   brand_id,
//   image_url,
//   product_id
// ) => {
//   console.log(chalk.blue('updateProductByID is called'));
//   // const promisePool = pool.promise();
//   // const connection = await promisePool.getConnection();
//   const connection = await pool.getConnection();
//   try {
//     const productUpdateQuery =
//       'UPDATE product SET product_name=COALESCE(?,product_name), price=COALESCE(?,price), description=COALESCE(?,description), category_id=COALESCE(?,category_id), brand_id=COALESCE(?,brand_id), image_url=COALESCE(?,image_url) where product_id = ?';
//     const results = await connection.query(productUpdateQuery, [
//       product_name,
//       price,
//       description,
//       category_id,
//       brand_id,
//       image_url,
//       product_id,
//     ]);
//     console.log(chalk.green(results[0]));
//     return results[0].affectedRows > 0;
//   } catch (error) {
//     console.error(chalk.red('Error in updateProductByID: ', error));
//     throw error;
//   } finally {
//     connection.release();
//   }
// };

// // create product
// module.exports.createProduct = async (
//   name,
//   price,
//   description,
//   category_id,
//   brand_id,
//   image_url
// ) => {
//   console.log(chalk.blue('createProduct is called'));
//   // const promisePool = pool.promise();
//   const connection = await pool.getConnection();
//   try {
//     // const cloudinaryResult = await cloudinary_api_key.uploader.upload(
//     //   image.path
//     // );
//     const productCreateQuery =
//       'INSERT into product (product_name,price, description, category_id, brand_id, image_url) values (?,?,?,?,?,?)';
//     const results = await connection.query(productCreateQuery, [
//       name,
//       price,
//       description,
//       category_id,
//       brand_id,
//       // cloudinaryResult.secure_url,
//       image_url,
//     ]);
//     console.log(chalk.green(results[0]));
//     return results[0].affectedRows > 0;
//   } catch (error) {
//     console.error(chalk.red(error.code));
//     if (error.code == 'ER_BAD_FIELD_ERROR') {
//       return error.code;
//     }
//     console.error(chalk.red('Error in createProduct: ', error));
//     throw error;
//   } finally {
//     connection.release();
//   }
// };

// // get brand name by brand ID
// module.exports.getBrandByID = async (brandID) => {
//   console.log(chalk.blue('getBrandByID is called'));
//   try {
//     const productDataQuery = 'SELECT brand_name from brand where brand_id = ?;';
//     const results = await pool.query(productDataQuery, [brandID]);
//     console.log(chalk.green(results));
//     return results[0][0];
//   } catch (error) {
//     console.error(chalk.red('Error in getBrandByID: ', error));
//     throw error;
//   }
// };

// // get category name by category ID
// module.exports.getCategoryByID = async (categoryID) => {
//   console.log(chalk.blue('getCategoryByID is called'));
//   try {
//     const productDataQuery =
//       'SELECT category_name from category where category_id = ?;';
//     const results = await pool.query(productDataQuery, [categoryID]);
//     console.log(chalk.green(results));
//     return results[0][0];
//   } catch (error) {
//     console.error(chalk.red('Error in getCategoryByID: ', error));
//     throw error;
//   }
// };
