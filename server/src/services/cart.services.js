const chalk = require('chalk');
const getConnection = require('../config/redis');

// set key value in redis
module.exports.addCartData = async (userId, cartData) => {
  console.log(chalk.blue('addCartData is called'));
  console.log(chalk.blue('Creating connection to Redis...'));
  const client = await getConnection();
  console.log(chalk.green('Redis connected'));
  try {
    const reply = await client.set(`cart:${userId}`, JSON.stringify(cartData));
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
module.exports.getCartData = async (userId) => {
  console.log(chalk.blue('getCartData is called'));
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
module.exports.deleteCartData = async (userId) => {
  console.log(chalk.blue('deleteCartData is called'));
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
