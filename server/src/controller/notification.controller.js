const chalk = require('chalk');
const notificationService = require('../services/notification.service');

exports.getNotifications = async (req, res, next) => {
  const { customerId } = req.params; // Take single brandId instead of an array of brandIds
  console.log(chalk.yellow('Inspecting req body variables'), customerId);
  try {
    // if customerId and brandId are nulls return as invalid IDs
    if (isNaN(parseInt(customerId))) {
      // Check if brandId is a number
      const error = new Error('Invalid ID parameters');
      error.status = 400;
      throw error;
    }
    const result = await notificationService.getNotification(customerId);
    console.log(
      chalk.yellow(
        'Inspect result variable from processFetchBookmarks service',
        result
      )
    );
    return res.status(200).send({
      message: 'notifications records are fetched',
      data: result,
    });
  } catch (error) {
    console.log(chalk.red('Error from bookmark service:' + error));
    next(error);
  }
};

exports.removeNotifications = async (req, res, next) => {
  const { customerId } = req.params; // Take single brandId instead of an array of brandIds
  console.log(chalk.yellow('Inspecting req body variables'), customerId);
  try {
    // if customerId and brandId are nulls return as invalid IDs
    if (isNaN(parseInt(customerId))) {
      // Check if brandId is a number
      const error = new Error('Invalid ID parameters');
      error.status = 400;
      throw error;
    }
    const result = await notificationService.removeNotification(customerId);
    console.log(
      chalk.yellow(
        'Inspect result variable from processFetchBookmarks service',
        result
      )
    );
    return res.status(200).send({
      message: 'notifications records are fetched',
      data: result,
    });
  } catch (error) {
    console.log(chalk.red('Error from bookmark service:' + error));
    next(error);
  }
};
