const pool = require('../config/database');
const chalk = require('chalk');

// get product by ID (done) (done)
module.exports.getProductByID = async (productID) => {
  console.log(chalk.blue('getProductByID is called'));
  try {
    const productDataQuery =
      'SELECT p.product_id, p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url, COALESCE(ROUND(AVG(r.rating_score), 2), 0) AS average_rating, COUNT(r.rating_score) as rating_count FROM product p INNER JOIN category c ON c.category_id = p.category_id INNER JOIN brand b ON b.brand_id = p.brand_id LEFT JOIN rating r ON r.product_id = p.product_id WHERE p.product_id = ? GROUP BY p.product_id;';
    const results = await pool.query(productDataQuery, [productID]);
    console.log(chalk.green(results));
    return results[0][0];
  } catch (error) {
    console.error(chalk.red('Error in getProductByID: ', error));
    throw error;
  }
};

// delete product by ID (done, but still need to delete from order)
module.exports.deleteProductByID = async (productID) => {
  console.log(chalk.blue('deleteProductByID is called'));
  try {
    const productDeleteQuery = 'DELETE FROM product where product_id=?;';
    const orderItemsDeleteQuery = 'DELETE from order where product_id = ?;';
    const ratingDeleteQuery = 'DELETE from rating where product_id =?;';
    const results = await pool.query(productDeleteQuery, [productID]);
    console.log(chalk.green(results));
    console.log(chalk.yellow(results[0].affectedRows));
    return results[0].affectedRows > 0;
  } catch (error) {
    console.error(chalk.red('Error in deleteProductByID: ', error));
    throw error;
  }
};

// get all products (done)
module.exports.getAllProducts = async () => {
  console.log(chalk.blue('getAllProducts is called'));
  try {
    const productsDataQuery =
      'SELECT p.product_id, p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url FROM product p, category c, brand b where c.category_id = p.category_id and p.brand_id = b.brand_id order by b.brand_id;';
    const results = await pool.query(productsDataQuery);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getAllProducts: ', error));
    throw error;
  }
};

// get products by category (done)
module.exports.getProductsByCategoryID = async (categoryID) => {
  console.log(chalk.blue('getProductsByCategoryID is called'));
  try {
    const productsDataQuery =
      'SELECT p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url FROM product p, category c, brand b where c.category_id = p.category_id and p.brand_id = b.brand_id and c.category_id =?;';
    const results = await pool.query(productsDataQuery, [categoryID]);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getProductsByCategoryID: ', error));
    throw error;
  }
};

// get products by brand (done)
module.exports.getProductsByBrandID = async (brandID) => {
  console.log(chalk.blue('getProductsByBrandID is called'));
  try {
    const productsDataQuery =
      'SELECT p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url FROM product p, category c, brand b where c.category_id = p.category_id and p.brand_id = b.brand_id and b.brand_id =?;';
    const results = await pool.query(productsDataQuery, [brandID]);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getProductsByBrandID: ', error));
    throw error;
  }
};

// get 5 newest product arrivals (done)
module.exports.getNewArrivals = async () => {
  console.log(chalk.blue('getNewArrivals is called'));
  try {
    const productsDataQuery =
      'SELECT p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url FROM product p, category c, brand b where c.category_id = p.category_id and p.brand_id = b.brand_id order by created_at desc limit 3';
    const results = await pool.query(productsDataQuery);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getNewArrivals: ', error));
    throw error;
  }
};

// update product by ID
module.exports.updateProductByID = async (
  product_name,
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
      product_name,
      price,
      description,
      category_id,
      brand_id,
      image_url,
      product_id,
    ]);
    console.log(chalk.green(results[0]));
    return results[0].affectedRows > 0;
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
  image_url
) => {
  console.log(chalk.blue('createProduct is called'));
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  try {
    // const cloudinaryResult = await cloudinary_api_key.uploader.upload(
    //   image.path
    // );
    const productCreateQuery =
      'INSERT into product (name,price, description, category_id, brand_id, image_url) values (?,?,?,?,?,?)';
    const results = await connection.query(productCreateQuery, [
      name,
      price,
      description,
      category_id,
      brand_id,
      // cloudinaryResult.secure_url,
      image_url,
    ]);
    console.log(chalk.green(results[0]));
    return results[0].affectedRows > 0;
  } catch (error) {
    console.error(chalk.red('Error in createProduct: ', error));
    throw error;
  } finally {
    connection.release();
  }
};

// get brand name by brand ID
module.exports.getBrandByID = async (brandID) => {
  console.log(chalk.blue('getBrandByID is called'));
  try {
    const productDataQuery = 'SELECT brand_name from brand where brand_id = ?;';
    const results = await pool.query(productDataQuery, [brandID]);
    console.log(chalk.green(results));
    return results[0][0];
  } catch (error) {
    console.error(chalk.red('Error in getBrandByID: ', error));
    throw error;
  }
};

// get category name by category ID
module.exports.getCategoryByID = async (categoryID) => {
  console.log(chalk.blue('getCategoryByID is called'));
  try {
    const productDataQuery =
      'SELECT category_name from category where category_id = ?;';
    const results = await pool.query(productDataQuery, [categoryID]);
    console.log(chalk.green(results));
    return results[0][0];
  } catch (error) {
    console.error(chalk.red('Error in getCategoryByID: ', error));
    throw error;
  }
};

// get all ratings (done)
module.exports.getAllRatingsByProductID = async (productID) => {
  console.log(chalk.blue('getAllRatingsByProductID is called'));
  try {
    const productsDataQuery = 'SELECT * from rating where product_id = ?;';
    const results = await pool.query(productsDataQuery, [productID]);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getAllRatingsByProductID: ', error));
    throw error;
  }
};

// get all brands (done)
module.exports.getAllBrands = async () => {
  console.log(chalk.blue('getAllBrands is called'));
  try {
    const brandsDataQuery = 'SELECT * from brand;';
    const results = await pool.query(brandsDataQuery);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getAllBrands: ', error));
    throw error;
  }
};

// get all category (done)
module.exports.getAllCategory = async () => {
  console.log(chalk.blue('getAllCategory is called'));
  try {
    const categoryDataQuery = 'SELECT * from category;';
    const results = await pool.query(categoryDataQuery);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getAllCategory: ', error));
    throw error;
  }
};

// search results
module.exports.getSearchResults = async (
  product_name,
  category_id,
  brand_id,
  max_price,
  min_price
) => {
  console.log(chalk.blue('getSearchResults is called'));
  try {
    let searchResultsDataQuery =
      'SELECT p.product_id, p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url FROM product p, category c, brand b where c.category_id = p.category_id and p.brand_id = b.brand_id';

    let queryInput = [];
    if (
      product_name != '' &&
      product_name != undefined &&
      product_name != 'null'
    ) {
      searchResultsDataQuery += ` AND p.product_name RLIKE ?`;
      queryInput.push(product_name);
    }
    if (
      category_id != '' &&
      category_id != undefined &&
      category_id != 'null' &&
      category_id != 0
    ) {
      searchResultsDataQuery += ` AND p.category_id = ?`;
      queryInput.push(category_id);
    }
    if (
      brand_id != '' &&
      brand_id != undefined &&
      brand_id != 'null' &&
      brand_id != 0
    ) {
      searchResultsDataQuery += ` AND p.brand_id = ?`;
      queryInput.push(brand_id);
    }
    if (
      max_price != '' &&
      max_price != undefined &&
      max_price != 'null' &&
      max_price != 0
    ) {
      if (
        min_price != '' &&
        min_price != undefined &&
        min_price != 'null' &&
        min_price != 0
      ) {
        searchResultsDataQuery += ` AND p.price BETWEEN ? AND ?`;
        queryInput.push(max_price);
        queryInput.push(min_price);
      } else {
        searchResultsDataQuery += ` AND p.price < ?`;
        queryInput.push(max_price);
      }
    } else {
      if (
        min_price != '' &&
        min_price != undefined &&
        min_price != 'null' &&
        min_price != 0
      ) {
        searchResultsDataQuery += ` AND p.price > ?`;
        queryInput.push(min_price);
      }
    }
    const results = await pool.query(searchResultsDataQuery, queryInput);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getSearchResults: ', error));
    throw error;
  }
};
