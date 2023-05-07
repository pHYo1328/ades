let client = require('../config/redis')
const chalk = require('chalk');
if (process.env.NODE_ENV === 'test') {
  const RedisMock = require('ioredis-mock');
  client = new RedisMock();
}
//set key value in redis
module.exports.addCartData = async (user_id, cartData) => {
  console.log(chalk.blue('addCartData is called'));
  try {
    const reply = await new Promise((resolve, reject) => {
      client.set(`cart:${user_id}`, cartData, (err, reply) => {
        if (err) {
          console.error(chalk.red('Error in adding cart data:', err));
          reject(err);
        } else {
          console.log(chalk.green('Key added', reply));
          resolve(reply);
        }
      });
    });
    await client.expire(`cart:${user_id}`, 86400);
    return reply;
  } catch (error) {
    throw error;
  } finally {
    client.quit();
  }
};


// fetching key value cart data from redis
module.exports.getCartData = async (user_id) => {
  console.log(chalk.blue('getCartData is called'));
  try {
    const cartData = await new Promise((resolve, reject) => {
      client.get(`cart:${user_id}`, (err, cartData) => {
        if (err) {
          console.error(chalk.red('Error in getting cart data:', err));
          reject(err);
        } else {
          console.log(chalk.green('Card data:', cartData));
          resolve(cartData);
        }
      });
    });
    return cartData;
  } catch (error) {
    throw error;
  } finally {
    client.quit();
  }
};


// delete key values in redis
module.exports.deleteCartData = async (user_id) => {
  console.log(chalk.blue('deleteCartData is called'));
  try {
    const reply = await new Promise((resolve, reject) => {
      client.del(`cart:${user_id}`, (err, reply) => {
        if (err) {
          console.error(chalk.red('Error in deleting cart data:', err));
          reject(err);
        } else {
          console.log(chalk.green('Key deleted', reply));
          resolve(reply);
        }
      });
    });
    return reply;
  } catch (error) {
    console.error(chalk.red('Error in deleteCartData:', error));
    throw error;
  } finally {
    client.quit();
  }
};

