const client = require('../config/redis')
const chalk = require('chalk');

//set key value in redis
module.exports.addCartData = async (userId, cartData) => {
  console.log(chalk.blue('addCartData is called'));
  try {
    const reply = await client.set(`cart:${userId}`, cartData);
    console.log(chalk.green("Key Added", reply));
    await client.expire(`cart:${userId}`, 86400);
    console.log(chalk.green("Expiration set"));
    return reply;
  } catch (error) {
    console.error(chalk.red('Error in adding cart data:', error));
    throw error;
  } finally {
    client.quit();
  }
};


// fetching key value cart data from redis
module.exports.getCartData = async (userId) => {
  console.log(chalk.blue('getCartData is called'));
  try {
    const cartData = await client.get(`cart:${userId}`);
    console.log(chalk.green("Cart data:", cartData));
    return cartData;
  } catch (error) {
    console.error(chalk.red('Error in getting cart data:', error));
    throw error;
  } finally {
    client.quit();
  }
};


// delete key values in redis
module.exports.deleteCartData = async (userId) => {
  console.log(chalk.blue('deleteCartData is called'));
  try {
    const reply = await client.del(`cart:${userId}`);
    console.log(chalk.green("Cart data:", reply));
    return reply;
  } catch (error) {
    console.error(chalk.red('Error in deleteCartData:', error));
    throw error;
  } finally {
    client.quit();
  }
};