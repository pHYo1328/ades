const chalk = require('chalk');
const bookmarkService = require('../services/bookmark.service');

exports.processAddBookMark = async (req, res, next) => {
  console.log(chalk.blue('processAddBookMark is running'));
  const {customerId,productId} = req.body;
  try {
    if(isNaN(parseInt(customerId)) || isNaN(parseInt(productId))){
        const error = new Error("Invaild ID parameters");
        error.status = 400;
        throw error;
    }
    const result = await bookmarkService.addBookMark(customerId, productId)
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
