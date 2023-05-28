const pool = require('../config/database');
const chalk = require('chalk');

// GET

// get product by ID (done)
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
          b.brand_name;
    `;
    let productImageQuery = `
      SELECT image_url 
      FROM product_image
      WHERE product_id = ?`;
    const productResults = await pool.query(productDataQuery, [productID]);
    let productImageResults = await pool.query(productImageQuery, [productID]);
    return [productResults[0][0], productImageResults[0]];
  } catch (error) {
    console.error(chalk.red('Error in getProductByID: ', error));
    throw error;
  }
};

// get all products (done)
module.exports.getAllProducts = async () => {
  console.log(chalk.blue('getAllProducts is called'));
  // console.log('limit: ', limit);
  // console.log('offset: ', offset);
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
    MAX(p_i.image_url) as image_url,
    COALESCE(ROUND(AVG(r.rating_score), 2), 0) AS average_rating,
    COUNT(r.rating_score) AS rating_count
  FROM
    product p
    INNER JOIN category c ON c.category_id = p.category_id
    INNER JOIN brand b ON b.brand_id = p.brand_id
    LEFT JOIN rating r ON r.product_id = p.product_id
    LEFT JOIN inventory i ON i.product_id = p.product_id
    LEFT JOIN product_image p_i ON p_i.product_id = p.product_id 
  GROUP BY
    i.quantity,
    p.product_id,
    p.product_name,
    p.description,
    p.price,
    c.category_name;
      `;
    const results = await pool.query(productsDataQuery);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getAllProducts: ', error));
    throw error;
  }
};

// get products by category or brand (done)
module.exports.getProductsByCategoryOrBrand = async (
  categoryID,
  brandID,
  limit,
  offset,
  sort
) => {
  console.log(chalk.blue('getProductsByCategoryOrBrand is called'));
  try {
    let productsDataQuery = `
  SELECT
    p.product_id, 
    p.product_name, 
    p.description, 
    p.price, 
    c.category_name, 
    b.brand_name, 
    MAX(p_i.image_url) as image_url
  FROM 
    product p 
    INNER JOIN category c ON c.category_id = p.category_id
    INNER JOIN brand b ON b.brand_id = p.brand_id
    LEFT JOIN product_image p_i ON p_i.product_id = p.product_id
`;

    const params = [];

    if (categoryID != 0) {
      productsDataQuery += ' WHERE c.category_id = ?';
      params.push(categoryID);
    }

    if (brandID != 0) {
      if (categoryID != 0) {
        productsDataQuery += ' AND b.brand_id = ?';
      } else {
        productsDataQuery += ' WHERE b.brand_id = ?';
      }
      params.push(brandID);
    }

    productsDataQuery += ' GROUP BY p.product_id';

    if (sort != 0) {
      switch (sort) {
        case 1:
          productsDataQuery += ' ORDER BY p.price ASC';
          break;
        case 2:
          productsDataQuery += ' ORDER BY p.price DESC';
          break;
        case 3:
          productsDataQuery += ' ORDER BY p.product_name ASC';
          break;
        case 4:
          productsDataQuery += ' ORDER BY p.product_name DESC';
          break;
        default:
          break;
      }
    }

    if (limit != 0) {
      productsDataQuery += ' LIMIT ?';
      params.push(limit);
      if (offset != 0) {
        productsDataQuery += ' OFFSET ?';
        params.push(offset);
      }
    }

    const results = await pool.query(productsDataQuery, params);
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
  console.log(chalk.blue(categoryID));
  try {
    const productsDataQuery = `
      SELECT 
        p.product_id, 
        p.product_name, 
        p.description, 
        p.price, 
        c.category_name, 
        b.brand_name, 
        MAX(p_i.image_url) as image_url
      FROM 
        category c 
        INNER JOIN product p ON p.category_id = c.category_id 
        INNER JOIN brand b ON b.brand_id = p.brand_id
        LEFT JOIN product_image p_i ON p_i.product_id = p.product_id
      WHERE
        c.category_id = ?
      GROUP BY
	      p.product_id

      `;
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
    const productsDataQuery = `
      SELECT
	p.product_id, 
    p.product_name, 
    p.description, 
    p.price, 
    c.category_name, 
    b.brand_name, 
	MAX(p_i.image_url) as image_url
FROM 
	category c 
    INNER JOIN product p ON p.category_id = c.category_id 
    INNER JOIN brand b ON b.brand_id = p.brand_id
    LEFT JOIN product_image p_i ON p_i.product_id = p.product_id
WHERE
	b.brand_id = ?
GROUP BY
	p.product_id
      `;
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
    const productsDataQuery = `
    SELECT
    i.quantity,
    p.product_id,
    p.product_name,
    p.description,
    p.price,
    c.category_name,
    b.brand_name,
    MAX(p_i.image_url) as image_url,
    COALESCE(ROUND(AVG(r.rating_score), 2), 0) AS average_rating,
    COUNT(r.rating_score) AS rating_count
  FROM
    product p
    INNER JOIN category c ON c.category_id = p.category_id
    INNER JOIN brand b ON b.brand_id = p.brand_id
    LEFT JOIN rating r ON r.product_id = p.product_id
    LEFT JOIN inventory i ON i.product_id = p.product_id
    LEFT JOIN product_image p_i ON p_i.product_id = p.product_id 
  GROUP BY
    i.quantity,
    p.product_id,
    p.product_name,
    p.description,
    p.price,
    c.category_name
ORDER BY
    p.created_at desc limit 5
      `;
    const results = await pool.query(productsDataQuery);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getNewArrivals: ', error));
    throw error;
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
    let searchResultsDataQuery = `
      SELECT
      p.product_id, 
        p.product_name, 
        p.description, 
        p.price, 
        c.category_name, 
        b.brand_name, 
      MAX(p_i.image_url) as image_url
    FROM 
      category c 
        INNER JOIN product p ON p.category_id = c.category_id 
        INNER JOIN brand b ON b.brand_id = p.brand_id
        LEFT JOIN product_image p_i ON p_i.product_id = p.product_id
    WHERE 1 = 1
      `;
    let queryInput = [];
    if (product_name) {
      searchResultsDataQuery += `
        AND (p.product_name RLIKE ? 
          OR c.category_name RLIKE ? 
          OR b.brand_name RLIKE ? 
          OR p.description RLIKE ?)`;
      queryInput.push(product_name, product_name, product_name, product_name);
    }
    if (category_id) {
      searchResultsDataQuery += ` AND p.category_id = ?`;
      queryInput.push(category_id);
    }
    if (brand_id) {
      searchResultsDataQuery += ` AND p.brand_id = ?`;
      queryInput.push(brand_id);
    }
    if (max_price) {
      if (min_price) {
        searchResultsDataQuery += ` AND p.price BETWEEN ? AND ?`;
        queryInput.push(max_price, min_price);
      } else {
        searchResultsDataQuery += ` AND p.price < ?`;
        queryInput.push(max_price);
      }
    } else if (min_price) {
      searchResultsDataQuery += ` AND p.price > ?`;
      queryInput.push(min_price);
    }
    searchResultsDataQuery += ` GROUP BY p.product_id;`;

    const results = await pool.query(searchResultsDataQuery, queryInput);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getSearchResults: ', error));
    throw error;
  }
};

// get stats
module.exports.getStatistics = async () => {
  console.log(chalk.blue('getStatistics is called'));
  try {
    const statisticsQuery = `
  SELECT 
  (SELECT SUM(quantity) FROM inventory) AS total_inventory,
  (SELECT SUM(quantity) FROM order_items) AS total_sold,
  (SELECT SUM(payment_total) FROM payment) AS total_payment,
  (SELECT COUNT(order_id) FROM orders) AS total_order,
  (SELECT COUNT(product_id) FROM product) AS total_products;
  `;

    const results = await pool.query(statisticsQuery);
    console.log(chalk.green(results[0][0]));
    return results[0][0];
  } catch (error) {
    console.error(chalk.red('Error in getStatistics: ', error));
    throw error;
  }
};

// get total number of products by brand or category
module.exports.getTotalNumberOfProducts = async (categoryID, brandID) => {
  console.log(chalk.blue('getTotalNumberOfProducts is called'));
  try {
    let productsDataQuery = `
      SELECT COUNT(DISTINCT p.product_id) AS total_products
      FROM product p
      JOIN category c ON p.category_id = c.category_id
      JOIN brand b ON p.brand_id = b.brand_id
      `;
    const params = [];

    if (categoryID != 0) {
      productsDataQuery += ' WHERE c.category_id = ?';
      params.push(categoryID);
    }

    if (brandID != 0) {
      if (categoryID != 0) {
        productsDataQuery += ' AND b.brand_id = ?';
      } else {
        productsDataQuery += ' WHERE b.brand_id = ?';
      }
      params.push(brandID);
    }
    const results = await pool.query(productsDataQuery, params);
    console.log(chalk.green('total products: ', results[0][0].total_products));
    return results[0][0];
  } catch (error) {
    console.error(chalk.red('Error in getTotalNumberOfProducts: ', error));
    throw error;
  }
};

// get all images by product ID
module.exports.getImagesByProductID = async (productID) => {
  console.log(chalk.blue('getImagesByProductID is called'));
  try {
    const imageDataQuery = `
      SELECT * FROM product_image WHERE product_id = ?;
    `;
    const results = await pool.query(imageDataQuery, [productID]);
    console.log(chalk.green(results));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getImagesByProductID: ', error));
    throw error;
  }
};

// DELETE

// delete product by id
module.exports.deleteProductByID = async (productID) => {
  console.log(chalk.blue('deleteProductByID is called'));
  const orderItemsDeleteQuery =
    // 'DELETE from order_items where product_id = ?;';
    'UPDATE order_items SET status = "Unavailable" WHERE product_id =?';
  const ordersDeleteQuery =
    'DELETE FROM orders WHERE order_id NOT IN (SELECT DISTINCT order_id FROM order_items);';
  const ratingDeleteQuery = 'DELETE from rating where product_id =?;';
  const inventoryDeleteQuery = 'DELETE from inventory where product_id=?;';
  const imageDeleteQuery = 'DELETE FROM product_image where product_id=?';
  const productDeleteQuery = 'DELETE FROM product where product_id=?;';

  const connection = await pool.getConnection();
  console.log(
    chalk.blue('database is connected to product.services.js deleteProductByID')
  );
  try {
    console.log(chalk.blue('Starting transaction'));
    await connection.beginTransaction();
    // Run the delete queries concurrently
    await Promise.all([
      pool.query(orderItemsDeleteQuery, [productID]),
      pool.query(ordersDeleteQuery),
      pool.query(ratingDeleteQuery, [productID]),
      pool.query(inventoryDeleteQuery, [productID]),
      pool.query(imageDeleteQuery, [productID]),
    ]);

    const productDeleteResult = await pool.query(productDeleteQuery, [
      productID,
    ]);
    await connection.commit();
    console.log(chalk.green(productDeleteResult));
    console.log(chalk.yellow(productDeleteResult[0].affectedRows));
    return productDeleteResult[0].affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    console.error(chalk.red('Error in deleteProductByID: ', error));
    throw error;
  } finally {
    connection.release();
  }
};

// delete brand by id
module.exports.deleteBrandByID = async (brandID) => {
  console.log(chalk.blue('deleteBrandByID is called'));

  const orderItemsDeleteQuery =
    'DELETE o FROM order_items o JOIN product p ON o.product_id = p.product_id WHERE p.brand_id = ? AND o.order_id IN (SELECT order_id FROM orders);';
  const ordersDeleteQuery =
    'DELETE FROM orders WHERE order_id NOT IN (SELECT DISTINCT order_id FROM order_items);';
  const ratingDeleteQuery =
    'DELETE FROM rating WHERE product_id IN (SELECT product_id FROM product WHERE brand_id = ?);';
  const inventoryDeleteQuery =
    'DELETE FROM inventory WHERE product_id IN ( SELECT product_id FROM product WHERE brand_id = ?);';
  const imageDeleteQuery =
    'DELETE FROM product_image where product_id IN ( SELECT product_id FROM product WHERE brand_id = ?);';
  const productDeleteQuery = 'DELETE FROM product where brand_id=?;';
  const brandDeleteQuery = 'DELETE from brand where brand_id = ?;';

  const connection = await pool.getConnection();
  console.log(
    chalk.blue('database is connected to product.services.js deleteBrandByID')
  );
  try {
    console.log(chalk.blue('Starting transaction'));
    await connection.beginTransaction();
    // Run the delete queries concurrently
    await Promise.all([
      pool.query(orderItemsDeleteQuery, [brandID]),
      pool.query(ordersDeleteQuery),
      pool.query(ratingDeleteQuery, [brandID]),
      pool.query(inventoryDeleteQuery, [brandID]),
      pool.query(imageDeleteQuery, [brandID]),
    ]);

    await pool.query(productDeleteQuery, [brandID]);

    const brandDeleteResult = await pool.query(brandDeleteQuery, [brandID]);
    await connection.commit();
    console.log(chalk.green(brandDeleteResult));
    console.log(chalk.yellow(brandDeleteResult[0].affectedRows));
    return brandDeleteResult[0].affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    console.error(chalk.red('Error in deleteBrandByID: ', error));
    throw error;
  } finally {
    connection.release();
  }
};

// delete category by id
module.exports.deleteCategoryByID = async (categoryID) => {
  console.log(chalk.blue('deleteCategoryByID is called'));
  const orderItemsDeleteQuery =
    'DELETE o FROM order_items o JOIN product p ON o.product_id = p.product_id WHERE p.category_id = ? AND o.order_id IN (SELECT order_id FROM orders);';
  const ordersDeleteQuery =
    'DELETE FROM orders WHERE order_id NOT IN (SELECT DISTINCT order_id FROM order_items);';
  const ratingDeleteQuery =
    'DELETE FROM rating WHERE product_id IN (SELECT product_id FROM product WHERE category_id = ?);';
  const inventoryDeleteQuery =
    'DELETE FROM inventory WHERE product_id IN ( SELECT product_id FROM product WHERE category_id = ?);';
  const imageDeleteQuery =
    'DELETE FROM product_image WHERE product_id IN ( SELECT product_id FROM product WHERE category_id = ?);';
  const productDeleteQuery = 'DELETE FROM product where category_id=?;';
  const categoryDeleteQuery = 'DELETE from category where category_id = ?;';

  const connection = await pool.getConnection();
  console.log(
    chalk.blue(
      'database is connected to product.services.js deleteCategoryByID'
    )
  );
  try {
    console.log(chalk.blue('Starting transaction'));
    await connection.beginTransaction();
    // Run the delete queries concurrently
    await Promise.all([
      pool.query(orderItemsDeleteQuery, [categoryID]),
      pool.query(ordersDeleteQuery),
      pool.query(ratingDeleteQuery, [categoryID]),
      pool.query(inventoryDeleteQuery, [categoryID]),
      pool.query(imageDeleteQuery, [categoryID]),
    ]);

    await pool.query(productDeleteQuery, [categoryID]);

    const categoryDeleteResult = await pool.query(categoryDeleteQuery, [
      categoryID,
    ]);
    await connection.commit();
    console.log(chalk.green(categoryDeleteResult));
    console.log(chalk.yellow(categoryDeleteResult[0].affectedRows));
    return categoryDeleteResult[0].affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    console.error(chalk.red('Error in deleteCategoryByID: ', error));
    throw error;
  } finally {
    connection.release();
  }
};

// delete image by image id
module.exports.deleteImageByID = async (imageID) => {
  console.log(chalk.blue('deleteImageByID is called'));
  try {
    const deleteImageQuery = `DELETE FROM product_image WHERE image_id=?;`;
    const results = await pool.query(deleteImageQuery, [imageID]);
    console.log(chalk.green(results[0].affectedRows));
    return results[0].affectedRows > 0;
  } catch (error) {
    console.error(chalk.red('Error in deleteImageByID: ', error));
    throw error;
  }
};

// delete all images by product id
module.exports.deleteImagesByProductID = async (productID) => {
  console.log(chalk.blue('deleteImagesByProductID is called'));
  try {
    const deleteImageQuery = `DELETE FROM product_image WHERE product_id = ?`;
    const results = await pool.query(deleteImageQuery, [productID]);
    console.log(chalk.green(results[0].affectedRows));
    return results[0].affectedRows > 0;
  } catch (error) {
    console.error(chalk.red('Error in deleteImageByID: ', error));
    throw error;
  }
};

// PUT

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
  const productUpdateQuery =
    "UPDATE product SET product_name=COALESCE(?,product_name), price=COALESCE(?,price), description=COALESCE(?,description), category_id=COALESCE(?,category_id), brand_id=COALESCE(?,brand_id), image_url =  CONCAT(image_url, COALESCE(?, '')) where product_id = ?";
  const inventoryUpdateQuery =
    'UPDATE inventory SET quantity = COALESCE(?,quantity) where product_id = ?';
  console.log(chalk.blue('Creating connection... '));
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
      product_name,
      price,
      description,
      category_id,
      brand_id,
      image_url,
      product_id,
    ];
    console.log(chalk.blue('Executing query: '), productUpdateQuery);
    const productUpdatePromise = connection.query(
      productUpdateQuery,
      productData
    );
    console.log(chalk.green(productUpdatePromise));
    const inventoryData = [quantity, product_id];
    const inventoryUpdatePromise = connection.query(
      inventoryUpdateQuery,
      inventoryData
    );

    await Promise.all([productUpdatePromise, inventoryUpdatePromise]);
    await connection.commit();
    console.log(
      chalk.green('Product and inventory have been updated successfully')
    );
    return true;
  } catch (error) {
    await connection.rollback();
    console.error(chalk.red('Error in updateProductByID: ', error));
    throw error;
  } finally {
    connection.release();
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

// POST

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
  console.log(chalk.blue(image));
  const productCreateQuery =
    'INSERT into product (product_name,price, description, category_id, brand_id) values (?,?,?,?,?)';
  const inventoryCreateQuery =
    'INSERT INTO inventory (product_id, quantity) values (?, ?);';
  let imageCreateQuery = `INSERT INTO product_image (product_id, image_url) VALUES ?;`;

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

    let imageValues = [image.map((i) => [productID, i])];
    console.log(chalk.blue(imageValues));
    await connection.query(imageCreateQuery, imageValues);

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

// add images by product ID
module.exports.createImageForProduct = async (image_urls, product_id) => {
  console.log(chalk.blue('createImageForProduct is called'));
  try {
    const imageCreateQuery = `
      INSERT INTO product_image (image_url, product_id) VALUES ?`;

    const imageValues = image_urls.map((image) => [image, product_id]);
    console.log(chalk.blue(imageValues));
    const results = await pool.query(imageCreateQuery, [imageValues]);
    console.log(chalk.green(results[0]));
    return results[0].affectedRows > 0;
  } catch (error) {
    console.error(chalk.red('Error in createImageForProduct: ', error));
    throw error;
  }
};
