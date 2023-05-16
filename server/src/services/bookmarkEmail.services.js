const chalk = require('chalk');
const moment = require('moment');
const pool = require('../config/database');
const sendInBlue = require('../config/sendinblue');
let previousUpdate = moment(new Date('2023-05-15 05:49:40')).format(
  'YYYY-MM-DD HH:mm:ss'
);

module.exports.updateProductsEmailSender = async () => {
  console.log(chalk.blue('Cron schedule Started'));
  const updateCheckingQuery =
    'SELECT MAX(created_at) AS latest_update FROM product';
  const fetchCustomerDetailsQuery = `SELECT customer.first_name,customer.last_name, customer.email,bookmark.brand_id
    FROM customer
    INNER JOIN bookmark on bookmark.customer_id = customer.customer_id
    WHERE bookmark.brand_id IN (
      SELECT DISTINCT product.brand_id
      FROM product 
      WHERE product.created_at > ?
    )`;
  const fetchUpdatedProductsByBrandIDQuery = `select product_name,description,image_url,brand_id from product where brand_id in (SELECT DISTINCT brand_id FROM product WHERE created_at > ?) and created_at > ? ;`;
  try {
    const latestUpdateTime = await pool.query(updateCheckingQuery);
    const latestUpdate = moment(
      new Date(latestUpdateTime[0][0].latest_update)
    ).format('YYYY-MM-DD HH:mm:ss');
    console.log(latestUpdate);
    console.log(previousUpdate);
    if (new Date(latestUpdate).getTime() > new Date(previousUpdate).getTime()) {
      const results = await pool.query(fetchCustomerDetailsQuery, [
        previousUpdate,
      ]);
      if (results[0].length > 0) {
        const products = await pool.query(fetchUpdatedProductsByBrandIDQuery, [
          previousUpdate,
          previousUpdate,
        ]);
        const response = await Promise.all(
          results[0].map((customer) => {
            let customerProducts = products[0].filter(
              (product) => product.brand_id === customer.brand_id
            );
            if (customerProducts.length > 0) {
              sendInBlue
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
                  htmlContent: `<html><body><h1>This is NEW products for YOU {{params.bodyMessage}}</h1>
                ${customerProducts
                  .map(
                    (product) =>
                      `<p>${product.product_name} is available for u</p>
                      <img src="https://res.cloudinary.com/ddoajstil/image/upload/${product.image_url}" alt="Product image">
                      `
                  )
                  .join('')}
                </body></html>`,
                  params: { bodyMessage: 'Made just for you!' },
                })
                .then((data) => {
                  console.log(data);
                  return {
                    status: 200,
                    message: 'Email sent successfully',
                    data: data,
                  };
                });
            }
          })
        );
      }
    }
    previousUpdate = latestUpdate;
    console.log(latestUpdate);
    console.log(previousUpdate);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
