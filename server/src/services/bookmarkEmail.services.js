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
          <p>${product.description}</p>
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
          name: `${customer.username}`,
          email: `${customer.email}`,
        },
      ],
      htmlContent: createHTMLContent(customerProducts),
      params: { bodyMessage: 'Made just for YOU!' }, // just testing
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

async function queryWithRetry(query, params, retries) {
  try {
    return await pool.query(query, params);
  } catch (error) {
    if (error.code === 'ETIMEDOUT' && retries > 0) {
      console.log('Query timed out, retrying...');
      await new Promise((resolve) => setTimeout(resolve, 5000)); // wait 5 seconds before retrying
      return await queryWithRetry(query, params, retries - 1);
    } else {
      throw error;
    }
  }
}

module.exports.updateProductsEmailSender = async () => {
  console.log(chalk.blue('Cron schedule Started'));
  const updateCheckingQuery =
    'SELECT MAX(created_at) AS latest_update FROM product';
  const fetchCustomerDetailsQuery = `
                              SELECT users.email,users.username,bookmark.brand_id
                              FROM users
                              INNER JOIN bookmark on bookmark.customer_id = users.customer_id
                              WHERE bookmark.brand_id IN (
                              SELECT DISTINCT product.brand_id
                              FROM product 
                              WHERE product.created_at > ?)`;
  const fetchUpdatedProductsByBrandIDQuery = `
                              select product.product_name,product.description,MAX(product_image.image_url) as image_url,product.brand_id from product
                              left join product_image on product_image.product_id = product.product_id
                              where brand_id in (SELECT DISTINCT brand_id FROM product WHERE created_at > ?) 
                              and created_at > ?
                              GROUP BY product.product_name, product.description, product.brand_id
                              ;`;
  try {
    const latestUpdateTime = await queryWithRetry(updateCheckingQuery, [], 3);
    const latestUpdate = moment(
      new Date(latestUpdateTime[0][0].latest_update)
    ).format('YYYY-MM-DD HH:mm:ss');
    console.log(chalk.blue('Latest Update Time: ', latestUpdate));
    console.log(chalk.blue('previous Update Time: ', previousUpdate));
    if (new Date(latestUpdate).getTime() > new Date(previousUpdate).getTime()) {
      console.log(chalk.blue('there is updated brands'));
      await Promise.all([
        queryWithRetry(fetchCustomerDetailsQuery, [previousUpdate], 3),
        queryWithRetry(
          fetchUpdatedProductsByBrandIDQuery,
          [previousUpdate, previousUpdate],
          3
        ),
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
    if (error.code === 'ETIMEDOUT' && retries > 0) {
      console.log('Query timed out, retrying...');
      await new Promise((resolve) => setTimeout(resolve, 5000)); // wait 5 seconds before retrying
      return await queryWithRetry(retries - 1);
    } else {
      throw error;
    }
  }
};
