const chalk = require('chalk');
const { format } = require('date-fns');
const fs = require('fs');
const {
  getLatestUpdate,
  getCustomerDetails,
  getUpdatedProductsByBrandID,
} = require('../services/bookmarkEmail.services');
const { sendEmail } = require('../services/email.service');
const { addNotification } = require('../services/notification.service');
// store default time to check
try {
  previousUpdateTime = JSON.parse(
    fs.readFileSync('previousUpdate.json')
  ).previousUpdateTime;
} catch (error) {
  previousUpdateTime = '2023-05-15T05:49:40.000Z';
}
module.exports.updateProductsEmailSender = async (io, userSockets) => {
  console.log(chalk.blue('Cron schedule Started'));
  try {
    const latestUpdateTime = await getLatestUpdate();
    const latestUpdate = format(
      new Date(latestUpdateTime[0][0].latest_update),
      'yyyy-MM-dd HH:mm:ss'
    );
    const previousUpdate = format(
      new Date(previousUpdateTime),
      'yyyy-MM-dd HH:mm:ss'
    );
    console.log(chalk.blue('Latest Update Time: ', latestUpdate));
    console.log(chalk.blue('previous Update Time: ', previousUpdate));

    // check there is the latest update?
    if (new Date(latestUpdate).getTime() > new Date(previousUpdate).getTime()) {
      // if there is latest update, fetch all data of related customers and products
      const [customers, products] = await Promise.all([
        getCustomerDetails(previousUpdateTime),
        getUpdatedProductsByBrandID(previousUpdateTime),
      ]);

      // if there is customers to send and products data to be send then
      if (customers[0].length > 0 && products[0].length > 0) {
        // create email promise array by finding related brand id
        const emailPromises = customers[0].map((customer) => {
          let customerProducts = products[0].filter(
            (product) => product.brand_id === customer.brand_id
          );
          if (customerProducts.length > 0) {
            return sendEmail(customer, customerProducts)
              .then((response) => {
                if (response.status == 200) {
                  const socket = userSockets[customer.customer_id];
                  const message = `New products :${customerProducts.map(
                    (product) => product.product_name
                  )} from Brand ${
                    customer.brand_name
                  } are Updated !!! Go and Grab Some ${customer.username}`;
                  if (socket) {
                    socket.emit('message', {
                      message: message,
                    });
                    console.log("notification is emitted");
                  } else {
                    console.log(
                      `Adding notification for customer with ID: ${customer.customer_id}`
                    );
                    return addNotification(
                      customer.customer_id,
                      message,
                      customer.brand_id
                    );
                  }
                }
              })
              .catch((error) => {
                console.error(
                  `Error sending email for customer with ID: ${customer.customer_id}: `,
                  error
                );
              });
          }
        });

        // and the solve the all promises
        await Promise.all(emailPromises);
      }
    }
    // update the previous time to latest time update
    previousUpdateTime = latestUpdateTime[0][0].latest_update;
    fs.writeFileSync(
      'previousUpdate.json',
      JSON.stringify({ previousUpdateTime })
    );
  } catch (error) {
    console.log(chalk.red(error));
    throw error;
  }
};
