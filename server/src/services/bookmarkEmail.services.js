const chalk = require('chalk');
const moment = require('moment');
const pool = require('../config/database');
const sendInBlue = require('../config/sendinblue');

let previousUpdate = moment(new Date('2023-05-15 05:49:40')).format(
  'YYYY-MM-DD HH:mm:ss'
);

const createHTMLContent = (customerProducts) => {
  return `<html><body><h1>This is NEW products for YOU {{params.bodyMessage}}</h1>
    ${customerProducts
      .map(
        (product) =>
          `<p>${product.product_name} is available for u</p>
          <img src="https://res.cloudinary.com/ddoajstil/image/upload/${product.image_url}" alt="Product image">
          `
        // I will create a customized email here
      )
      .join('')}
    </body></html>`;
};

const sendEmail = (customer, customerProducts) => {
  return sendInBlue
    .sendTransacEmail({
      subject: 'Hello from Our TechZero',
      sender: { email: 'techZero@gmail.com', name: 'techZero' },
      replyTo: { email: 'techZero@gmail.com', name: 'techZero' },
      to: [
        {
          name: `${customer.first_name} ${customer.last_name}`,
          email: `${customer.email}`,
        },
      ],
      htmlContent: createHTMLContent(customerProducts),
      params: { bodyMessage: 'Made just for you!' }, // just testing
    })
    .then((data) => {
      console.log(data, customer);
      return {
        status: 200,
        message: 'Email sent successfully',
        data: data,
      };
    });
};

module.exports.updateProductsEmailSender = async () => {
  console.log(chalk.blue('Cron schedule Started'));
  const updateCheckingQuery =
    'SELECT MAX(created_at) AS latest_update FROM product';
  const fetchCustomerDetailsQuery = `
                              SELECT customer.first_name,customer.last_name, customer.email,bookmark.brand_id
                              FROM customer
                              INNER JOIN bookmark on bookmark.customer_id = customer.customer_id
                              WHERE bookmark.brand_id IN (
                              SELECT DISTINCT product.brand_id
                              FROM product 
                              WHERE product.created_at > ?)`;
  const fetchUpdatedProductsByBrandIDQuery = `
                              select product_name,description,image_url,brand_id from product 
                              where brand_id in (SELECT DISTINCT brand_id FROM product WHERE created_at > ?) 
                              and created_at > ? ;`;
  try {
    const latestUpdateTime = await pool.query(updateCheckingQuery);
    const latestUpdate = moment(
      new Date(latestUpdateTime[0][0].latest_update)
    ).format('YYYY-MM-DD HH:mm:ss');
    console.log(chalk.blue('Latest Update Time: ', latestUpdate));
    console.log(chalk.blue('previous Update Time: ', previousUpdate));
    if (new Date(latestUpdate).getTime() > new Date(previousUpdate).getTime()) {
      console.log(chalk.blue('there is updated brands'));
      await Promise.all([
        pool.query(fetchCustomerDetailsQuery, [previousUpdate]),
        pool.query(fetchUpdatedProductsByBrandIDQuery, [
          previousUpdate,
          previousUpdate,
        ]),
      ]).then(async ([customers, products]) => {
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
      });
    }

    previousUpdate = latestUpdate;
  } catch (error) {
    console.error(error);
    next(error);
  }
};
