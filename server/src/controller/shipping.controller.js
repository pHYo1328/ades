const chalk = require('chalk');
const shippingService = require('../services/shipping.service');

// controller for fetching shipping methods
exports.processFetchShippingMethod = async (req, res, next) => {
  console.log(chalk.blue('processFetchShippingMethod is running'));
  try {
    const result = await shippingService.fetchShippingMethods();
    console.log(
      chalk.yellow(
        'Inspect result variable from fetchShippingMethods service',
        result
      )
    );
    return res.status(200).send({
      message: 'shipping methods were found',
      data: result,
    });
  } catch (error) {
    console.log(chalk.red('Error from shipping service: ' + error));
    next(error);
  }
};
