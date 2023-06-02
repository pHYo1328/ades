const chalk = require('chalk');
const inventoryServices = require('../services/inventory.services');

// controller for fetching all infos from inventory
exports.processCheckInventory = async (req, res, next) => {
  console.log(chalk.blue('processCheckInventory is running'));
  const productIDs = req.query.productIDs.split(',');
  console.log(chalk.yellow(`Inspecting product IDs: ${productIDs}`));
  try {
    const response = await inventoryServices.checkInventory(productIDs);
    return res.status(200).send({
      message: 'all fetch successfully',
      data: response,
    });
  } catch (error) {
    console.err('Error in processing check inventory', error);
    next(error);
  }
};
