const chalk = require('chalk');
const getConnection = require('../config/redis');
const pool = require('../config/database');
const expireTime = 3600;

// set key value in redis
module.exports.addCartDataToRedis = async (userId, cartData) => {
  console.log(chalk.blue('addCartDataToRedis is called'));
  console.log(chalk.blue('Creating connection to Redis...'));
  const client = await getConnection();
  console.log(chalk.green('Redis connected'));
  try {
    const reply = await client.set(`cart:${userId}`, JSON.stringify(cartData), {
      EX: expireTime,
    });
    console.log(chalk.green('Key Added', reply));
    return reply;
  } catch (error) {
    console.error(chalk.red('Error in adding cart data:', error));
    throw error;
  } finally {
    await client.disconnect();
  }
};

// fetching key value cart data from redis
module.exports.getCartDataFromRedis = async (userId) => {
  console.log(chalk.blue('getCartDataFromRedis is called'));
  console.log(chalk.blue('Creating connection to Redis...'));
  const client = await getConnection();
  console.log(chalk.green('Redis connected'));
  try {
    const cartData = await client.get(`cart:${userId}`);
    console.log(chalk.green('Cart data:', cartData));
    return JSON.parse(cartData);
  } catch (error) {
    console.error(chalk.red('Error in getting cart data:', error));
    throw error;
  } finally {
    await client.disconnect();
  }
};

// delete key values in redis
module.exports.deleteCartDataInRedis = async (userId) => {
  console.log(chalk.blue('deleteCartDataInRedis is called'));
  console.log(chalk.blue('Creating connection to Redis...'));
  const client = await getConnection();
  console.log(chalk.green('Redis connected'));
  try {
    const reply = await client.del(`cart:${userId}`);
    console.log(chalk.green('Cart data:', reply));
    return reply;
  } catch (error) {
    console.error(chalk.red('Error in deleteCartData:', error));
    throw error;
  } finally {
    await client.disconnect();
  }
};

// for synchronization of cache and database, decided to use write through for data consistency
module.exports.addCartDataToMySqlDB = async (userId, cartData) => {
  console.log(chalk.blue('addCartDataToMySqlDB is called'));
  console.log(cartData);
  const cartDataValues = cartData.map((item) => [
    userId,
    item.productId,
    item.quantity,
  ]);
  const addCartDataQuery = `INSERT INTO cart (customer_id, product_id, quantity) VALUES ? 
                          ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`;
  const selectCartDataQuery = `SELECT product_id,quantity FROM cart WHERE customer_id = ?`;
  const deleteCartDataQuery = `DELETE FROM cart WHERE customer_id = ? AND product_id NOT IN ?;`;
  const deleteAllCartDataQuery = `DELETE FROM cart WHERE customer_id =?`;
  try {
    console.log(chalk.blue('Creating connection...'));
    console.log(chalk.blue('Executing query >>>', selectCartDataQuery));
    console.log(chalk.blue('Cart data values:', cartDataValues));

    // First insert all cart data values if duplicate update the quantity
    let rows;
    if (cartData.length > 0) {
      console.log(chalk.blue('Executing query >>>', addCartDataQuery));
      rows = await pool.query(addCartDataQuery, [cartDataValues]);
      console.log(chalk.green('Row inserted:' + rows.affectedRows));
    }
    
    // and fetch all cart data for that customer id
    const existingCartData = await pool.query(selectCartDataQuery, [userId]);
    console.log(chalk.green('Existing cart data:', existingCartData));

    // check that data is longer then new cart data, Yes means there extra data user has deleted in frontend
    if (existingCartData[0].length > cartData.length) {
      // find make all cart item id as array then 
      const existingProductIDs = cartData.map((item) => item.productId);
      if (existingProductIDs.length === 0) {

        // cart is deleted ? remove all data
        console.log(chalk.blue('Executing query >>>', deleteAllCartDataQuery));
        const [deleteRows] = await pool.query(deleteAllCartDataQuery, [userId]);
        console.log(chalk.green('Deleted rows:', JSON.stringify(deleteRows)));
      } else {

        // partially deleted, delete all cart item without that ids in cart data
        console.log(chalk.blue('Executing query >>>', deleteCartDataQuery));
        const [deleteRows] = await pool.query(deleteCartDataQuery, [
          userId,
          [existingProductIDs],
        ]);
        console.log(chalk.green('Deleted rows:', JSON.stringify(deleteRows)));
      }
    }
    return rows ? rows.affectedRows : 0;
  } catch (error) {
    console.error(chalk.red('Error in addCartDataToMySqlDB:', error));
    throw error;
  }
};

// fetch data from cart MYSQL
module.exports.getCartDataFromMySqlDB = async (userId) => {
  console.log(chalk.blue('getCartDataFromMySqlDB is called'));
  const getCartDataQuery = `SELECT product_id,quantity FROM cart WHERE customer_id =?`;
  try {
    console.log(chalk.blue('Creating connection...'));
    console.log(chalk.blue('Executing query', getCartDataQuery));
    const result = await pool.query(getCartDataQuery, [userId]);
    //console.log(chalk.green('cartData :', JSON.stringify(result[0])));
    const returnData = result[0].map((cartItem) => ({
      productId: cartItem.product_id,
      quantity: cartItem.quantity,
    }));
    console.log(chalk.green('returnData :', returnData));
    return returnData;
  } catch (error) {
    console.error(chalk.red('Error in getCartDataFromMySqlDB:', error));
    throw error;
  }
};

// delete all cart items from mysql
module.exports.deleteCartDataInMySqlDB = async (userId) => {
  console.log(chalk.blue('deleteCartDataInMySqlDB is called'));
  const deleteCartDataQuery = `DELETE FROM cart WHERE customer_id = ?`;
  try {
    console.log(chalk.blue('Creating connection...'));
    console.log(chalk.blue('Executing query', deleteCartDataQuery));
    const result = await pool.query(deleteCartDataQuery, [userId]);
    console.log(chalk.green('cartData :', result));
    return result.affectedRows;
  } catch (error) {
    console.error(chalk.red('Error in deleteCartDataInMySqlDB:', error));
    throw error;
  }
};

// get all cart productDetails with array of productIDs
module.exports.getCartProductDetails = async (productIDs) => {
  console.log(chalk.blue('getCartProductDetails is called'));
  const productDetailsFetchQuery = `SELECT product.product_id,
                                    product.product_name,
                                    product.price,
                                    MAX(product_image.image_url) as image_url,
                                    category.category_name as category,
                                    brand.brand_name as brand
                                    FROM product 
                                    INNER JOIN category ON product.category_id = category.category_id
                                    INNER JOIN brand ON product.brand_id = brand.brand_id
                                    LEFT JOIN product_image ON product_image.product_id = product.product_id 
                                    WHERE product.product_id in ?
                                    GROUP BY product.product_id, product.product_name, product.price, category.category_name, brand.brand_name;
                                    `;
  try {
    console.log(chalk.blue('Creating connection...'));
    console.log(chalk.blue('Executing query', productDetailsFetchQuery));
    console.log(chalk.blue('Cart product_id values :', productIDs));
    const result = await pool.query(productDetailsFetchQuery, [[productIDs]]);
    console.log(
      chalk.green('Cart product details values :', JSON.stringify(result[0]))
    );
    return result[0];
  } catch (error) {
    console.error(chalk.red('Error in getCartProductDetails:', error));
    throw error;
  }
};
