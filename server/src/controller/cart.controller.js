const chalk = require('chalk');
const cartServices = require('../services/cart.services');
const productServices = require('../services/product.services');

exports.processAddCartData = async (req, res, next) => {
  console.log(chalk.blue('processAddCartData is running'));
  const { userID } = req.params;
  const { cartData } = req.body;
  try {
    if (isNaN(parseInt(userID))) {
      const error = new Error('Invalid userID parameter');
      error.status = 400;
      throw error;
    }
    if (!cartData) {
      const error = new Error('Invalid cartData parameter');
      error.status = 400;
      throw error;
    }
    const result = await Promise.all([
      cartServices.addCartDataToRedis(userID, cartData),
      cartServices.addCartDataToMySqlDB(userID, cartData),
    ]);
    console.log(
      chalk.yellow('Inspect result variable from addCartData service\n'),
      result
    );
    return res.status(201).send({
      message: 'cartData added successfully.',
      data: '',
    });
  } catch (error) {
    console.error(chalk.red('Error in processAddCartData:', error));
    next(error);
  }
};

// for reading, decided to use cache aside
exports.processGetCartData = async (req, res, next) => {
  console.log(chalk.blue('processGetCartData is running'));
  const { userID } = req.params;
  try {
    if (isNaN(parseInt(userID))) {
      const error = new Error('Invalid userID parameter');
      error.status = 400;
      throw error;
    }
    console.log(chalk.yellow('Inspect userID variable\n'), userID);
    let result = await cartServices.getCartDataFromRedis(userID);

    if (!result || result.length === 0) {
      console.log(chalk.blue('There is no redis result'));
      const mysqlResult = await cartServices.getCartDataFromMySqlDB(userID);
      result = mysqlResult;
      await cartServices.addCartDataToRedis(userID, mysqlResult);
    }

    console.log(
      chalk.yellow('Inspect result variable from getCartData service\n'),
      result
    );
    const message = 'cartData found successfully.';
    console.log(result);
    return res.status(200).send({ message, data: result });
  } catch (error) {
    console.error(chalk.red('Error in processGetCartData:', error));
    next(error);
  }
};

exports.processDeleteCartData = async (req, res, next) => {
  console.log(chalk.blue('processDeleteCartData is running'));
  const { userID } = req.params;

  try {
    if (isNaN(parseInt(userID))) {
      const error = new Error('Invalid userID parameter');
      error.status = 400;
      throw error;
    }
    console.log(chalk.yellow('Inspect userID variable\n'), userID);
    const result = await Promise.all([
      cartServices.deleteCartDataInRedis(userID),
      cartServices.deleteCartDataInMySqlDB(userID),
    ]);
    console.log(
      chalk.yellow('Inspect result variable from deleteCartData service\n'),
      result
    );
    return res.status(204).send({
      statusCode: 204,
      ok: true,
      message: 'cartData deleted successfully.',
      data: '',
    });
  } catch (error) {
    console.error(chalk.red('Error in processDeleteCartData:', error));
    next(error);
  }
};

exports.processGetCartProductData = async (req, res, next) => {
  console.log(chalk.blue('processGetCartProductData is running'));
  const productIDs = req.query.productIDs.split(',');
  console.log(chalk.yellow(`Inspecting product IDs: ${productIDs}`));
  try {
    // this is only for ADES project, actually this one can achieve better performance with WHERE IN statement
    const response = await cartServices.getCartProductDetails(productIDs);
    return res.status(200).send({
      message: 'all fetch successfully',
      data: response,
    });
  } catch (error) {
    console.error(chalk.red('Error in processGetCartProductData:', error));
    next(error);
  }
};
