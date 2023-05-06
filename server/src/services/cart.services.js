const client = require('../config/redis')
const chalk = require('chalk')
//set key value in redis
module.exports.addCartData = async (user_id, cartData) => {
  console.log(chalk.blue('addCartData is called'))
  try {
    await client.set(`cart:${user_id}`, cartData, (err, reply) => {
      if (err) console.error(chalk.red('Error in adding cart data:', err))
      else {
        console.log(chalk.green('Key added', reply));
        return reply;
      }
    })
    client.expire(`cart:${user_id}`, 86400);
  } catch (error) {
    console.error(chalk.red('Error in addCartData:', error));
    throw error
  } finally {
    client.quit()
  }
}

module.exports.getCartData = async user_id => {
  console.log(chalk.blue('getCartData is called'))
  try {
    await client.get(`cart:${user_id}`, (err, cartData) => {
      if (err) console.error(chalk.red('Error in getting cart data:', err))
      else {
        console.log(chalk.green('Card data:', cartData));
        return cartData;
      }
    })
  } catch (error) {
    console.error(chalk.red('Error in getCartData:', error))
    throw error
  } finally {
    client.quit();
  }
}

module.exports.deleteCartData = async user_id => {
  console.log(chalk.blue('deleteCartData is called'))
  try {
    await client.del(`cart:${user_id}`, (err, reply) => {
      if (err) console.error(chalk.red('Error in deleting cart data:', err))
      else {
        console.log(chalk.green('Key deleted', reply));
        return reply;
      }
    })
  } catch (error) {
    console.error(chalk.red('Error in deleteCartData:', error))
    throw error
  } finally {
    client.quit()
  }
}
