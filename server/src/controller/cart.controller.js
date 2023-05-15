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
    if (
      !cartData)
      {
      const error = new Error('Invalid cartData parameter');
      error.status = 400;
      throw error;
    }
    const result = await cartServices.addCartData(userID, cartData);
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

exports.processGetCartData = async (req, res, next) => {
  console.log(chalk.blue('processAddCartData is running'));
  const { userID } = req.params;
  try {
    if (isNaN(parseInt(userID))) {
      const error = new Error('Invalid userID parameter');
      error.status = 400;
      throw error;
    }
    console.log(chalk.yellow('Inspect userID variable\n'), userID);
    const result = await cartServices.getCartData(userID);
    console.log(
      chalk.yellow('Inspect result variable from getCartData service\n'),
      result
    );
    if (result.length == 0) {
      const error = new Error('userID not founded');
      error.status = 404;
      throw error;
    }
    return res.status(200).send({
      message: 'cartData founded successfully.',
      data: result,
    });
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
    const result = await cartServices.deleteCartData(userID);
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
  const { requests } = req.body;
  try {
    const response = await Promise.all(
      requests.map(async (request) => {
        if (
          request.method === 'GET' &&
          request.endpoint.startsWith('/api/getCartItemData/')
        ) {
          const productID = request.endpoint.split('/').pop();
          const cartItemData = await productServices.getProductByID(productID);
          if (!cartItemData || cartItemData.length == 0) {
            const error = new Error('product not found');
            error.status = 404;
            throw error;
          }
          return {
            status: 200,
            message: 'cart item data found',
            data: cartItemData,
          };
        } else {
          const error = new Error('Invalid request');
          error.status = 400;
          throw error;
        }
      })
    );
    return res.status(200).send({
      message: 'all fetch successfully',
      data: response,
    });
  } catch (error) {
    console.error(chalk.red('Error in processGetCartProductData:', error));
    next(error);
  }
};
