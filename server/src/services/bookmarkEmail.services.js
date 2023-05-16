const chalk = require('chalk');
const moment = require('moment');
const pool = require('../config/database');
const sendInBlue = require('../config/sendinblue');
let previousUpdate = moment(new Date('2023-05-15 05:49:40')).format(
  'YYYY-MM-DD HH:mm:ss'
);

module.exports.fetchUsersDetailsByBrandId = async () => {
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
  const fetchUpdatedProductsByBrandIDQuery =
    'SELECT product_name,price,description,image_url FROM product where brand_id = ? and create_at > ?';
  const latestUpdateTime = await pool.query(updateCheckingQuery);
  const latestUpdate = moment(
    new Date(latestUpdateTime[0][0].latest_update)
  ).format('YYYY-MM-DD HH:mm:ss');
  if (new Date(latestUpdate).getTime() > new Date(previousUpdate).getTime()) {
    console.log(latestUpdate);
    console.log(previousUpdate)
    const results = await pool.query(fetchCustomerDetailsQuery, [
      previousUpdate,
    ]);
    console.log(results[0]);

  }
};
