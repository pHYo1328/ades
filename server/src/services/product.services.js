const pool = require('../config/database');
const chalk = require('chalk');

// get product by ID
module.exports.getProductByID = async (product_id) => {
  console.log(chalk.blue('getProductByID is called'));
  try {
    const productDataQuery = 'SELECT name FROM product where product_id=?;';
    const results = await connection.query(productDataQuery, [product_id]);
    console.log(chalk.green(results));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getProductByID: ', error));
    throw error;
  }
};

// delete product by ID
module.exports.deleteProductByID = async (product_id) => {
  console.log(chalk.blue('deleteProductByID is called'));
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  try {
    const productDeleteQuery = 'DELETE FROM product where product_id =?';
    const results = await pool.query(productDeleteQuery, [product_id]);
    console.log(chalk.green(results));
    return results.affectedRows > 0;
  } catch (error) {
    console.error(chalk.red('Error in deleteProductByID: ', error));
    throw error;
  }
};

// get all products
module.exports.getAllProducts = async () => {
  console.log(chalk.blue('getAllProducts is called'));
  try {
    const productsDataQuery = 'SELECT * FROM product';
    const results = await pool.query(productsDataQuery);
    console.log(chalk.green(results));
    return results;
  } catch (error) {
    console.error(chalk.red('Error in getAllProducts: ', error));
    throw error;
  }
};

// get products by category
module.exports.getProductsByCategoryID = async (category_id) => {
  console.log(chalk.blue('getProductsByCategoryID is called'));
  try {
    const productsDataQuery = 'SELECT * FROM product where category_id = ?';
    const results = await pool.query(productsDataQuery, [category_id]);
    console.log(chalk.green(results));
    return results;
  } catch (error) {
    console.error(chalk.red('Error in getProductsByCategoryID: ', error));
    throw error;
  }
};

// get products by brand
module.exports.getProductsByBrandID = async (brand_id) => {
  console.log(chalk.blue('getProductsByBrandID is called'));
  try {
    const productsDataQuery = 'SELECT * FROM product where brand_id = ?';
    const results = await pool.query(productsDataQuery, [brand_id]);
    console.log(chalk.green(results));
    return results;
  } catch (error) {
    console.error(chalk.red('Error in getProductsByBrandID: ', error));
    throw error;
  }
};

// get 3 newest product arrivals

// module.exports.getNewArrivals = asyncLog(async function getNewArrivals () {
//     console.log(chalk.blue("getNewArrivals is called"));
//     const productsDataQuery = 'SELECT * FROM product order by created_at desc limit 3';
//     return pool.query(productsDataQuery);
// });

// update product by ID
module.exports.updateProductByID = async (
  name,
  price,
  description,
  category_id,
  brand_id,
  image_url,
  product_id
) => {
  console.log(chalk.blue('updateProductByID is called'));
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  try {
    const productUpdateQuery =
      'UPDATE product SET name=COALESCE(?,name), price=COALESCE(?,price), description=COALESCE(?,description), category_id=COALESCE(?,category_id), brand_id=COALESCE(?,brand_id), image_url=COALESCE(?,image_url) where product_id = ?';
    const results = await connection.query(productUpdateQuery, [
      name,
      price,
      description,
      category_id,
      brand_id,
      image_url,
      product_id,
    ]);
    console.log(chalk.green(results));
    return results.affectedRows > 0;
  } catch (error) {
    console.error(chalk.red('Error in updateProductByID: ', error));
    throw error;
  } finally {
    connection.release();
  }
};

// create product
module.exports.createProduct = async (
  name,
  price,
  description,
  category_id,
  brand_id,
  image
) => {
  console.log(chalk.blue('createProduct is called'));
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  try {
    const cloudinaryResult = await cloudinary_api_key.uploader.upload(
      image.path
    );
    const productCreateQuery =
      'INSERT into product (name,price, description, category_id, brand_id, image_url) values (?,?,?,?,?,?)';
    const results = await connection.query(productCreateQuery, [
      name,
      price,
      description,
      category_id,
      brand_id,
      cloudinaryResult.secure_url,
    ]);
    console.log(chalk.green(results));
    return results.affectedRows > 0;
  } catch (error) {
    console.error(chalk.red('Error in createProduct: ', error));
    throw error;
  } finally {
    connection.release();
  }
};
