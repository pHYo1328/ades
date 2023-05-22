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
  try {
    console.log(chalk.blue('Creating connection...'));
    console.log(chalk.blue('Executing query >>>', selectCartDataQuery));
    console.log(chalk.blue('Cart data values:', cartDataValues));
    const existingCartData = await pool.query(selectCartDataQuery, [userId]);
    console.log(chalk.green('Existing cart data:', existingCartData));
    if (existingCartData[0].length > cartData.length) {
      const existingProductIDs = cartData.map((item) => item.productId);
      console.log(chalk.blue('Executing query >>>', deleteCartDataQuery));
      const [deleteRows] = await pool.query(deleteCartDataQuery, [
        userId,
        [existingProductIDs],
      ]);
      console.log(chalk.green('Deleted rows:', JSON.stringify(deleteRows)));
    }
    console.log(chalk.blue('Executing query >>>', addCartDataQuery));
    const [rows, fields] = await pool.query(addCartDataQuery, [cartDataValues]);
    console.log(chalk.green('Row inserted:' + rows.affectedRows));
    return rows.affectedRows;
  } catch (error) {
    console.error(chalk.red('Error in addCartDataToMySqlDB:', error));
    throw error;
  }
};

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

module.exports.getCartProductDetails = async (productIDs) => {
  console.log(chalk.blue('getCartProductDetails is called'));
  const productDetailsFetchQuery = `SELECT * FROM product WHERE product_id in ?`;
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
