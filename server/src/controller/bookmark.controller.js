const chalk = require('chalk');
const bookmarkService = require('../services/bookmark.service');

exports.processAddBookMark = async (req, res, next) => {
  console.log(chalk.blue('processAddBookMark is running'));
  const { customerId, brandIds } = req.body;
  console.log(
    chalk.yellow('Inspecting req body variables'),
    customerId,
    brandIds
  );
  try {
    // if customerId and brands are nulls return as invalid IDs
    if (isNaN(parseInt(customerId)) || !brandIds) {
      const error = new Error('Invaild ID parameters');
      error.status = 400;
      throw error;
    }
    const data = {
      customerId: customerId,
      brandIds: brandIds,
    };
    const result = await bookmarkService.addBookMark(data);
    console.log(
      chalk.yellow(
        'Inspect result variable from processAddBookMark service',
        result
      )
    );  
    return res.status(200).send({
      message: 'bookmark record is inserted',
      data: result,
    });
  } catch (error) {
    console.log(chalk.red('Error from bookmark service: ' + error));
    next(error);
  }
};

exports.processFetchBookmarks = async (req, res, next) => {
  console.log(chalk.blue('processFetchBookmarks is running'));
  const customerId = req.params.customerId;
  console.log(chalk.yellow('Inspecting req body variables'), customerId);
  try {
    const data = {
      customerId: customerId,
    };
    const result = await bookmarkService.fetchBookmarkByCustomerID(data);
    console.log(
      chalk.yellow(
        'Inspect result variable from processFetchBookmarks service',
        result
      )
    );
    return res.status(200).send({
      message: 'bookmark records are fetched',
      data: result,
    });
  } catch (error) {
    console.log(chalk.red('Error from bookmark service:' + error));
    next(error);
  }
};
