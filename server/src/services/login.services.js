const pool = require("../config/database");
const chalk = require("chalk");
const bcrypt = require('bcrypt');

// create new user
module.exports.registerUser = async (username, email, password) => {
  console.log(chalk.blue("User registered successfully"));
  try {
    // check for duplicates in the users table
    const checkDuplicateQuery = "SELECT COUNT(*) as count FROM users WHERE username = ?";
    const duplicateResults = await pool.query(checkDuplicateQuery, [username]);
    const count = duplicateResults[0].count;
    if (count > 0) {
      throw new Error("Username already exists");
    }
    
    // insert the new user
    const registerUserQuery = "INSERT INTO users (username, email, password) VALUES (?, ?, ?);";
    const results = await pool.query(registerUserQuery, [username, email, password]);
    console.log(chalk.green(results));
    return results;
  } catch (error) {
    console.error(chalk.red("Error in registering new user: ", error));
    throw error;
  }
};


// login user
module.exports.loginUser = async (username, password) => {
  console.log(chalk.blue("user is logged in"));
  try {
    const userQuery = "SELECT * FROM users WHERE username = ?;";
    const userResult = await pool.query(userQuery, [username]);
    console.log(userQuery);
    if (userResult.length === 0) {
      console.log(chalk.red("User not found"));
      return null;
    } 
    const hashedPassword = userResult[0][0].password;

    console.log(chalk.blue("executing query >>>>"));
    const loginUserQuery = "SELECT * FROM users WHERE username = ? AND password = ?;";
    const results = await pool.query(loginUserQuery, [username, hashedPassword]);
    console.log(chalk.green(JSON.stringify(results[0][0])));
    return results[0][0];
  } catch (error) {
    console.error(chalk.red("Error in logging user in: ", error));
    throw error;
  }
};


// // delete product by ID (done, but still need to delete from order)
// module.exports.deleteProductByID = async (productID) => {
//   console.log(chalk.blue("deleteProductByID is called"));
//   try {
//     const productDeleteQuery = "DELETE FROM product where product_id=?;";
//     const results = await pool.query(productDeleteQuery, [productID]);
//     console.log(chalk.green(results));
//     console.log(chalk.yellow(results[0].affectedRows));
//     return results[0].affectedRows > 0;
//   } catch (error) {
//     console.error(chalk.red("Error in deleteProductByID: ", error));
//     throw error;
//   }
// };


// // get products by category (done)
// module.exports.getProductsByCategoryID = async (categoryID) => {
//   console.log(chalk.blue("getProductsByCategoryID is called"));
//   try {
//     const productsDataQuery =
//       "SELECT p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url FROM product p, category c, brand b where c.category_id = p.category_id and p.brand_id = b.brand_id and c.category_id =?;";
//     const results = await pool.query(productsDataQuery, [categoryID]);
//     console.log(chalk.green(results[0]));
//     return results[0];
//   } catch (error) {
//     console.error(chalk.red("Error in getProductsByCategoryID: ", error));
//     throw error;
//   }
// };

// // get products by brand (done)
// module.exports.getProductsByBrandID = async (brandID) => {
//   console.log(chalk.blue("getProductsByBrandID is called"));
//   try {
//     const productsDataQuery =
//       "SELECT p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url FROM product p, category c, brand b where c.category_id = p.category_id and p.brand_id = b.brand_id and b.brand_id =?;";
//     const results = await pool.query(productsDataQuery, [brandID]);
//     console.log(chalk.green(results[0]));
//     return results[0];
//   } catch (error) {
//     console.error(chalk.red("Error in getProductsByBrandID: ", error));
//     throw error;
//   }
// };

// // get 5 newest product arrivals (done)
// module.exports.getNewArrivals = async () => {
//   console.log(chalk.blue("getNewArrivals is called"));
//   try {
//     const productsDataQuery =
//       "SELECT p.product_id, p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url FROM product p, category c, brand b where c.category_id = p.category_id and p.brand_id = b.brand_id order by created_at desc limit 5";
//     const results = await pool.query(productsDataQuery);
//     console.log(chalk.green(results[0]));
//     return results[0];
//   } catch (error) {
//     console.error(chalk.red("Error in getNewArrivals: ", error));
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
//   console.log(chalk.blue("updateProductByID is called"));
//   // const promisePool = pool.promise();
//   // const connection = await promisePool.getConnection();
//   const connection = await pool.getConnection();
//   try {
//     const productUpdateQuery =
//       "UPDATE product SET product_name=COALESCE(?,product_name), price=COALESCE(?,price), description=COALESCE(?,description), category_id=COALESCE(?,category_id), brand_id=COALESCE(?,brand_id), image_url=COALESCE(?,image_url) where product_id = ?";
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
//     console.error(chalk.red("Error in updateProductByID: ", error));
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
//   console.log(chalk.blue("createProduct is called"));
//   // const promisePool = pool.promise();
//   const connection = await pool.getConnection();
//   try {
//     // const cloudinaryResult = await cloudinary_api_key.uploader.upload(
//     //   image.path
//     // );
//     const productCreateQuery =
//       "INSERT into product (product_name,price, description, category_id, brand_id, image_url) values (?,?,?,?,?,?)";
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
//     if (error.code == "ER_BAD_FIELD_ERROR") {
//       return error.code;
//     }
//     console.error(chalk.red("Error in createProduct: ", error));
//     throw error;
//   } finally {
//     connection.release();
//   }
// };

// // get brand name by brand ID
// module.exports.getBrandByID = async (brandID) => {
//   console.log(chalk.blue("getBrandByID is called"));
//   try {
//     const productDataQuery = "SELECT brand_name from brand where brand_id = ?;";
//     const results = await pool.query(productDataQuery, [brandID]);
//     console.log(chalk.green(results));
//     return results[0][0];
//   } catch (error) {
//     console.error(chalk.red("Error in getBrandByID: ", error));
//     throw error;
//   }
// };

// // get category name by category ID
// module.exports.getCategoryByID = async (categoryID) => {
//   console.log(chalk.blue("getCategoryByID is called"));
//   try {
//     const productDataQuery =
//       "SELECT category_name from category where category_id = ?;";
//     const results = await pool.query(productDataQuery, [categoryID]);
//     console.log(chalk.green(results));
//     return results[0][0];
//   } catch (error) {
//     console.error(chalk.red("Error in getCategoryByID: ", error));
//     throw error;
//   }
// };
