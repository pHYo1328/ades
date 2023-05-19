//const fs = require('fs');
const pool = require('../config/database');
const chalk = require('chalk');

// get product by ID (done) (done)
module.exports.getProductByID = async (productID) => {
  console.log(chalk.blue('getProductByID is called'));
  try {
    const productDataQuery = `
      SELECT
  i.quantity,
  p.product_id,
  p.product_name,
  p.description,
  p.price,
  c.category_name,
  b.brand_name,
  p.image_url,
  COALESCE(ROUND(AVG(r.rating_score), 2), 0) AS average_rating,
  COUNT(r.rating_score) AS rating_count
FROM
  product p
  INNER JOIN category c ON c.category_id = p.category_id
  INNER JOIN brand b ON b.brand_id = p.brand_id
  LEFT JOIN rating r ON r.product_id = p.product_id
  LEFT JOIN inventory i ON i.product_id = p.product_id
WHERE
  p.product_id = ?
GROUP BY
  i.quantity,
  p.product_id,
  p.product_name,
  p.description,
  p.price,
  c.category_name,
  b.brand_name,
  p.image_url;
      `;
    const results = await pool.query(productDataQuery, [productID]);
    console.log(chalk.green(results));
    return results[0][0];
  } catch (error) {
    console.error(chalk.red('Error in getProductByID: ', error));
    throw error;
  }
};

// delete product by id
module.exports.deleteProductByID = async (productID) => {
  console.log(chalk.blue('deleteProductByID is called'));
  try {
    const orderItemsDeleteQuery =
      'DELETE from order_items where product_id = ?;';
    const ordersDeleteQuery =
      'DELETE FROM orders WHERE order_id NOT IN (SELECT DISTINCT order_id FROM order_items);';
    const ratingDeleteQuery = 'DELETE from rating where product_id =?;';
    const inventoryDeleteQuery = 'DELETE from inventory where product_id=?;';
    const productDeleteQuery = 'DELETE FROM product where product_id=?;';

    // Run the delete queries concurrently
    await Promise.all([
      pool.query(orderItemsDeleteQuery, [productID]),
      pool.query(ordersDeleteQuery),
      pool.query(ratingDeleteQuery, [productID]),
      pool.query(inventoryDeleteQuery, [productID]),
    ]);

    const productDeleteResult = await pool.query(productDeleteQuery, [
      productID,
    ]);
    console.log(chalk.green(productDeleteResult));
    console.log(chalk.yellow(productDeleteResult[0].affectedRows));
    return productDeleteResult[0].affectedRows > 0;
  } catch (error) {
    console.error(chalk.red('Error in deleteProductByID: ', error));
    throw error;
  }
};

// delete brand by id
module.exports.deleteBrandByID = async (brandID) => {
  console.log(chalk.blue('deleteBrandByID is called'));
  try {
    const orderItemsDeleteQuery =
      'DELETE o FROM order_items o JOIN product p ON o.product_id = p.product_id WHERE p.brand_id = ? AND o.order_id IN (SELECT order_id FROM orders);';
    const ordersDeleteQuery =
      'DELETE FROM orders WHERE order_id NOT IN (SELECT DISTINCT order_id FROM order_items);';
    const ratingDeleteQuery =
      'DELETE FROM rating WHERE product_id IN (SELECT product_id FROM product WHERE brand_id = ?);';
    const inventoryDeleteQuery =
      'DELETE FROM inventory WHERE product_id IN ( SELECT product_id FROM product WHERE brand_id = ?);';
    const productDeleteQuery = 'DELETE FROM product where brand_id=?;';
    const brandDeleteQuery = 'DELETE from brand where brand_id = ?;';

    // Run the delete queries concurrently
    await Promise.all([
      pool.query(orderItemsDeleteQuery, [brandID]),
      pool.query(ordersDeleteQuery),
      pool.query(ratingDeleteQuery, [brandID]),
      pool.query(inventoryDeleteQuery, [brandID]),
    ]);

    await pool.query(productDeleteQuery, [brandID]);

    const brandDeleteResult = await pool.query(brandDeleteQuery, [brandID]);
    console.log(chalk.green(brandDeleteResult));
    console.log(chalk.yellow(brandDeleteResult[0].affectedRows));
    return brandDeleteResult[0].affectedRows > 0;
  } catch (error) {
    console.error(chalk.red('Error in deleteBrandByID: ', error));
    throw error;
  }
};

// delete category by id
module.exports.deleteCategoryByID = async (categoryID) => {
  console.log(chalk.blue('deleteCategoryByID is called'));
  try {
    const orderItemsDeleteQuery =
      'DELETE o FROM order_items o JOIN product p ON o.product_id = p.product_id WHERE p.category_id = ? AND o.order_id IN (SELECT order_id FROM orders);';
    const ordersDeleteQuery =
      'DELETE FROM orders WHERE order_id NOT IN (SELECT DISTINCT order_id FROM order_items);';
    const ratingDeleteQuery =
      'DELETE FROM rating WHERE product_id IN (SELECT product_id FROM product WHERE category_id = ?);';
    const inventoryDeleteQuery =
      'DELETE FROM inventory WHERE product_id IN ( SELECT product_id FROM product WHERE category_id = ?);';
    const productDeleteQuery = 'DELETE FROM product where category_id=?;';
    const categoryDeleteQuery = 'DELETE from category where category_id = ?;';

    // Run the delete queries concurrently
    await Promise.all([
      pool.query(orderItemsDeleteQuery, [categoryID]),
      pool.query(ordersDeleteQuery),
      pool.query(ratingDeleteQuery, [categoryID]),
      pool.query(inventoryDeleteQuery, [categoryID]),
    ]);

    await pool.query(productDeleteQuery, [categoryID]);

    const categoryDeleteResult = await pool.query(categoryDeleteQuery, [
      categoryID,
    ]);
    console.log(chalk.green(categoryDeleteResult));
    console.log(chalk.yellow(categoryDeleteResult[0].affectedRows));
    return categoryDeleteResult[0].affectedRows > 0;
  } catch (error) {
    console.error(chalk.red('Error in deleteCategoryByID: ', error));
    throw error;
  }
};

// get all products (done)
module.exports.getAllProducts = async () => {
  console.log(chalk.blue('getAllProducts is called'));
  try {
    const productsDataQuery = `
      SELECT
  i.quantity,
  p.product_id,
  p.product_name,
  p.description,
  p.price,
  c.category_name,
  b.brand_name,
  p.image_url,
  COALESCE(ROUND(AVG(r.rating_score), 2), 0) AS average_rating,
  COUNT(r.rating_score) AS rating_count
FROM
  product p
  INNER JOIN category c ON c.category_id = p.category_id
  INNER JOIN brand b ON b.brand_id = p.brand_id
  LEFT JOIN rating r ON r.product_id = p.product_id
  LEFT JOIN inventory i ON i.product_id = p.product_id
GROUP BY
  i.quantity,
  p.product_id,
  p.product_name,
  p.description,
  p.price,
  c.category_name,
  b.brand_name,
  p.image_url;
      `;
    const results = await pool.query(productsDataQuery);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getAllProducts: ', error));
    throw error;
  }
};

// get products by category and brand (done)
module.exports.getProductsByCategoryOrBrand = async (categoryID, brandID) => {
  console.log(chalk.blue('getProductsByCategoryOrBrand is called'));
  try {
    let productsDataQuery =
      'SELECT p.product_id, p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url FROM product p, category c, brand b where c.category_id = p.category_id and p.brand_id = b.brand_id ';
    if (categoryID != 0) {
      productsDataQuery += 'and c.category_id =?';
    }
    if (brandID != 0) {
      productsDataQuery += 'and b.brand_id =?';
    }

    const results = await pool.query(productsDataQuery, [categoryID, brandID]);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getProductsByCategoryOrBrand: ', error));
    throw error;
  }
};

// get products by category (done)
module.exports.getProductsByCategoryID = async (categoryID) => {
  console.log(chalk.blue('getProductsByCategoryID is called'));
  try {
    const productsDataQuery =
      'SELECT p.product_id, p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url FROM product p, category c, brand b where c.category_id = p.category_id and p.brand_id = b.brand_id and c.category_id =?;';
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
      'SELECT p.product_id, p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url FROM product p, category c, brand b where c.category_id = p.category_id and p.brand_id = b.brand_id and b.brand_id =?;';
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
      'SELECT p.product_id, p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url FROM product p, category c, brand b where c.category_id = p.category_id and p.brand_id = b.brand_id order by created_at desc limit 5';
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
  quantity,
  product_id
) => {
  console.log(chalk.blue('updateProductByID is called'));

  try {
    const productUpdateQuery =
      'UPDATE product SET product_name=COALESCE(?,product_name), price=COALESCE(?,price), description=COALESCE(?,description), category_id=COALESCE(?,category_id), brand_id=COALESCE(?,brand_id), image_url = CONCAT(image_url, COALESCE(?, "")) where product_id = ?';
    const inventoryUpdateQuery =
      'UPDATE inventory SET quantity = COALESCE(?,quantity) where product_id = ?';

    const productUpdatePromise = pool.query(productUpdateQuery, [
      product_name,
      price,
      description,
      category_id,
      brand_id,
      image_url,
      product_id,
    ]);

    const inventoryUpdatePromise = pool.query(inventoryUpdateQuery, [
      quantity,
      product_id,
    ]);

    const [productUpdateResult, inventoryUpdateResult] = await Promise.all([
      productUpdatePromise,
      inventoryUpdatePromise,
    ]);

    console.log(chalk.green(productUpdateResult[0]));
    console.log(chalk.green(inventoryUpdateResult[0]));

    return (
      productUpdateResult[0].affectedRows > 0
      // inventoryUpdateResult[0].affectedRows > 0
    );
  } catch (error) {
    console.error(chalk.red('Error in updateProductByID: ', error));
    throw error;
  }
};

// create product
module.exports.createProduct = async (
  name,
  price,
  description,
  category_id,
  brand_id,
  image,
  quantity
) => {
  console.log(chalk.blue('createProduct is called'));
  const productCreateQuery =
    'INSERT into product (product_name,price, description, category_id, brand_id, image_url) values (?,?,?,?,?, ?)';
  const inventoryCreateQuery =
    'INSERT INTO inventory (product_id, quantity) values (?, ?);';

  quantity = quantity || 0;
  console.log(chalk.blue('Creating connection...'));
  const connection = await pool.getConnection();
  console.log(
    chalk.blue(
      'database is connected to product.services.js createProduct function'
    )
  );
  try {
    console.log(chalk.blue('Starting transaction'));
    await connection.beginTransaction();
    const productData = [
      name,
      price,
      description,
      category_id,
      brand_id,
      image,
    ];
    console.log(chalk.blue('Executing query: '), productCreateQuery);
    const productResult = await connection.query(
      productCreateQuery,
      productData
    );
    const productID = productResult[0].insertId;
    const inventoryData = [productID, quantity];
    const result = await connection.query(inventoryCreateQuery, inventoryData);
    await connection.commit();
    console.log(
      chalk.green('Product and inventory have been created successfully')
    );
    return result[0].affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    console.error(
      chalk.red('Error in inserting product and inventory data: '),
      error
    );
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

// search results (done)
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

    if (product_name)
      (searchResultsDataQuery += ` AND p.product_name RLIKE ?`),
        queryInput.push(product_name);
    if (category_id)
      (searchResultsDataQuery += ` AND p.category_id = ?`),
        queryInput.push(category_id);
    if (brand_id)
      (searchResultsDataQuery += ` AND p.brand_id = ?`),
        queryInput.push(brand_id);

    if (max_price) {
      if (min_price)
        (searchResultsDataQuery += ` AND p.price BETWEEN ? AND ?`),
          queryInput.push(max_price, min_price);
      else
        (searchResultsDataQuery += ` AND p.price < ?`),
          queryInput.push(max_price);
    } else if (min_price)
      (searchResultsDataQuery += ` AND p.price > ?`),
        queryInput.push(min_price);

    const results = await pool.query(searchResultsDataQuery, queryInput);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getSearchResults: ', error));
    throw error;
  }
};

// create rating
module.exports.createRating = async (
  comment,
  rating_score,
  product_id,
  customer_id
) => {
  console.log(chalk.blue('createRating is called'));
  try {
    const ratingCreateQuery =
      'INSERT INTO rating (comment, rating_score, customer_id, product_id) VALUES (?,?,?,?);';
    const results = await pool.query(ratingCreateQuery, [
      comment,
      rating_score,
      customer_id,
      product_id,
    ]);
    console.log(chalk.green(results[0]));
    return results[0].affectedRows > 0;
  } catch (error) {
    console.error(chalk.red('Error in createProduct: ', error));
    throw error;
  }
};

// update inventory - increase by 1
module.exports.updateInventoryUp = async (product_id) => {
  console.log(chalk.blue('updateInventoryUp is called'));
  try {
    const inventoryUpdateUpQuery =
      'UPDATE inventory SET quantity = quantity + 1 WHERE product_id =?';
    const results = await pool.query(inventoryUpdateUpQuery, [product_id]);
    console.log(results[0]);
    console.log(chalk.green(results[0].affectedRows));
    return results[0].affectedRows > 0;
  } catch (error) {
    console.error(chalk.red('Error in updateInventoryUp: ', error));
    throw error;
  }
};

// update inventory - decrease by 1
module.exports.updateInventoryDown = async (product_id) => {
  console.log(chalk.blue('updateInventoryDown is called'));
  try {
    const inventoryUpdateDownQuery =
      'UPDATE inventory SET quantity = quantity - 1 WHERE product_id =?';
    const results = await pool.query(inventoryUpdateDownQuery, [product_id]);
    console.log(chalk.green(results[0].affectedRows));
    return results[0].affectedRows > 0;
  } catch (error) {
    console.error(chalk.red('Error in updateInventoryDown: ', error));
    throw error;
  }
};

// delete all product images
module.exports.deleteProductImages = async (product_id) => {
  console.log(chalk.blue('deleteProductImages is called'));
  try {
    const deleteProductImageQuery =
      'UPDATE product SET image_url = "" WHERE product_id =?';
    const results = await pool.query(deleteProductImageQuery, [product_id]);
    console.log(chalk.green(results[0].affectedRows));
    return results[0].affectedRows > 0;
  } catch (error) {
    console.error(chalk.red('Error in deleteProductImages: ', error));
    throw error;
  }
};

// add new brand or category
module.exports.createBrandOrCategory = async (name, type) => {
  console.log(chalk.blue('createBrandOrCategory is called'));
  try {
    let createQuery;
    if (type == 'category') {
      createQuery = 'INSERT INTO category (category_name) VALUES (?)';
    }
    if (type == 'brand') {
      createQuery = 'INSERT INTO brand (brand_name) VALUES (?)';
    }
    const results = await pool.query(createQuery, [name, type]);
    console.log(chalk.green(results[0]));
    return results[0].affectedRows > 0;
  } catch (error) {
    console.error(chalk.red('Error in createBrandOrCategory: ', error));
    throw error;
  }
};

// get stats
module.exports.getStatistics = async () => {
  console.log(chalk.blue('getStatistics is called'));
  try {
    const statisticsQuery = `
    SELECT SUM(oi.quantity) as total_sold, 
    SUM(i.quantity) as total_inventory, 
    SUM(p.payment_total) as total_payment, 
    COUNT(oi.order_id) as total_order
FROM order_items oi
JOIN inventory i ON oi.product_id = i.product_id
JOIN payment p ON oi.order_id = p.order_id;
  `;

    const results = await pool.query(statisticsQuery);
    console.log(chalk.green(results[0][0]));
    return results[0][0];
  } catch (error) {
    console.error(chalk.red('Error in getStatistics: ', error));
    throw error;
  }
};
