const chalk = require('chalk');
const pool = require('../config/database');

module.exports.addCustomerOrder = async (data) => {
  console.log(chalk.blue('addCustomOrder is called'));
  // order data
  const {
    customerID,
    shippingAddr,
    billingAddr,
    totalPrice,
    paymentMethod,
    shippingMethod,
    orderItems,
  } = data;
  const addOrderQuery = `
                    INSERT INTO order 
                    (customer_id,shipping_address,billing_address,total_price,payment_method,shipping_method) 
                    VALUES ?
                    `;
  const addOrderItemsQuery = `
                    INSERT INTO order_items 
                    (order_id,product_id,quantity) 
                    VALUES ?
                    `;
  try {
    console.log(chalk.blue('Creating connection...'));
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    console.log(
      chalk.blue(
        'database is connected in order.services.js addCustomOrder function'
      )
    );
    console.log(chalk.blue('Starting transaction'));
    await connection.beginTransaction();
    const orderData = [
      [
        customerID,
        shippingAddr,
        billingAddr,
        totalPrice,
        paymentMethod,
        shippingMethod,
      ],
    ];
    console.log(chalk.blue('Executing query >>>>>>'), addOrderQuery);
    const [orderResult] = await connection.query(addOrderQuery, [orderData]);
    const orderID = orderResult.insertId;
    const orderItemsData = orderItems.map((item) => [
      orderID,
      item.product_id,
      item.quantity,
    ]);
    await connection.query(addOrderItemsQuery, [orderItemsData]);
    await connection.commit();
    console.log(
      chalk.green('Order and order items have been inserted successfully.')
    );
  } catch (error) {
    await connection.rollback();
    console.error(
      chalk.red('Error in inserting order and order items data:', error)
    );
  } finally {
    connection.release();
  }
};

// tmw start from here
// module.exports.getOrderDetailsForToShip = async (data) => {
//     console.log(chalk.blue("getOrderDetailsForToShip is called"));
//     const {
//         customerID
//     } = data;
//     const getOrderDetailsForToShipQuery = `
//                     select product.product_name,product.image_url,product.price, order_items.quantity FROM product
//                     inner join order_items on order_items.product_id=product.product_id
//                     inner join  orders on orders.order_id= order_items.order_id
//                     where orders.customer_id=? and orders.order_status="order_received";
//                     `;

// };
