const chalk = require('chalk');
const { format } = require('date-fns');
const {
  getLatestUpdate,
  getCustomerDetails,
  getUpdatedProductsByBrandID,
} = require('../services/bookmarkEmail.services');
const { sendEmail } = require('../services/email.service');

let previousUpdate = format(
  new Date('2023-05-15 05:49:40'),
  'yyyy-MM-dd HH:mm:ss'
);

module.exports.updateProductsEmailSender = async () => {
  console.log(chalk.blue('Cron schedule Started'));
  try {
    const latestUpdateTime = await getLatestUpdate();
    const latestUpdate = format(
      new Date(latestUpdateTime[0][0].latest_update),
      'yyyy-MM-dd HH:mm:ss'
    );
    console.log(chalk.blue('Latest Update Time: ', latestUpdate));
    console.log(chalk.blue('previous Update Time: ', previousUpdate));

    if (new Date(latestUpdate).getTime() > new Date(previousUpdate).getTime()) {
      console.log(chalk.blue('there is updated brands'));
      const [customers, products] = await Promise.all([
        getCustomerDetails(previousUpdate),
        getUpdatedProductsByBrandID(previousUpdate),
      ]);
      if (customers[0].length > 0 && products[0].length > 0) {
        const emailPromises = customers[0].map((customer) => {
          let customerProducts = products[0].filter(
            (product) => product.brand_id === customer.brand_id
          );
          if (customerProducts.length > 0) {
            return sendEmail(customer, customerProducts);
          }
        });
        await Promise.all(emailPromises);
      }
    }
    previousUpdate = latestUpdate;
  } catch (error) {
    console.log(chalk.red(error));
    throw error;
  }
};
