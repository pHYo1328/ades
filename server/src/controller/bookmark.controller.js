const chalk = require('chalk');
const bookmarkService = require('../services/bookmark.service');

exports.processAddBookMark = async (req, res, next) => {
  console.log(chalk.blue('processAddBookMark is running'));
  const { customerId, brandId } = req.body;  // Take single brandId instead of an array of brandIds
  console.log(chalk.yellow('Inspecting req body variables'), customerId, brandId);
  try {
    // if customerId and brandId are nulls return as invalid IDs
    if (isNaN(parseInt(customerId)) || isNaN(parseInt(brandId))) { // Check if brandId is a number
      const error = new Error('Invalid ID parameters');
      error.status = 400;
      throw error;
    }
    const data = {
      customerId: customerId,
      brandId: brandId,  // Pass single brandId to service function
    };
    const result = await bookmarkService.addBookMark(data);
    console.log(
      chalk.yellow(
        'Inspect result variable from processAddBookMark service',
        result
      )
    );  
    return res.status(200).send({
      message: 'Bookmark record is inserted',
      data: result,
    });
  } catch (error) {
    console.log(chalk.red('Error from bookmark service: ' + error));
    next(error);
  }
};

exports.processRemoveBookMark = async (req, res, next) => {  // New controller function for removing bookmarks
  console.log(chalk.blue('processRemoveBookMark is running'));
  const { customerId, brandId } = req.params;  // Take single brandId
  console.log(chalk.yellow('Inspecting req body variables'), customerId, brandId);
  try {
    if (isNaN(parseInt(customerId)) || isNaN(parseInt(brandId))) {  // Check if brandId is a number
      const error = new Error('Invalid ID parameters');
      error.status = 400;
      throw error;
    }
    const data = {
      customerId: customerId,
      brandId: brandId,  // Pass single brandId to service function
    };
    const result = await bookmarkService.removeBookMark(data);  // Call service function to remove bookmark
    console.log(
      chalk.yellow(
        'Inspect result variable from processRemoveBookMark service',
        result
      )
    );
    return res.status(200).send({
      message: 'Bookmark record is removed',
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
