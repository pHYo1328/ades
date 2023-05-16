const pool = require('../config/database');
const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const sequelize = require('sequelize'); //ORM for MySQL
const { QueryTypes } = sequelize;


// create new user
module.exports.registerUser = async (username, email, password, roles) => {
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
      'INSERT INTO users (username, email, password, roles) VALUES (?, ?, ?, ?);';
    const results = await pool.query(registerUserQuery, [
      username,
      email,
      password,
      roles
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
      'SELECT userid,password,roles FROM users WHERE username = ?';
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
  const sql = "SELECT * FROM users WHERE refreshToken = ?";
  console.log("rt is reused");
  return pool.query(sql, [refreshToken]);
}

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
  console.log("user found by rt");
  return foundUser;
};

// Find username of user who does not have a refreshToken
module.exports.findUserByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = ?';
  const foundUser = await sequelize.query(query, {
    replacements: [username],
    type: sequelize.QueryTypes.SELECT,
  });
  return foundUser;
};

// Update refreshToken for a user
module.exports.updateRefreshToken = async (newRefreshTokenArray, newRefreshToken, userId) => {
  const updateQuery = 'UPDATE users SET refreshToken = ? WHERE id = ?';
  const result = await sequelize.query(updateQuery, {
    replacements: [[...newRefreshTokenArray, newRefreshToken], userId],
    type: QueryTypes.UPDATE,
  });
  return result;
};




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
