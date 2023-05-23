const pool = require('../config/database');
const chalk = require('chalk');

// get payment by ID(used)
module.exports.getPaymentByID = async (order_id) => {
  console.log(chalk.blue('getPaymentByID is called'));
  try {
    const paymentDataQuery = `SELECT p.product_name, p.price, p.description, i.quantity, o.total_price, s.shipping_method, s.fee
      FROM product AS p, order_items AS i, orders AS o, shipping AS s
        WHERE o.order_id = ?
        AND o.order_id = i.order_id
        AND s.shipping_id = o.shipping_id
        AND p.product_id = i.product_id;`;
    const results = await pool.query(paymentDataQuery, [order_id]);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getPaymentByID: ', error));
    throw error;
  }
};

//get all payment which haven't done delivery
module.exports.getListsByDeliStatus = async () => {
  console.log(chalk.blue('getListsByDeliStatus is called'));
  try {
    const deliveryDataQuery =
      'SELECT c.first_name,c.last_name,p.order_id, o.shipping_address FROM customer c, orders o, payment p WHERE p.delivery_status= 0 AND p.order_id = o.order_id AND c.customer_id = o.customer_id;';
    const results = await pool.query(deliveryDataQuery);
    console.log(chalk.green(results));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getListsByDeliStatus: ', error));
    throw error;
  }
};

//updating delivery_status
module.exports.updateDeliByID = async (delivery_status, payment_id) => {
  console.log(chalk.blue('updateDeliByID is called'));
  // const promisePool = pool.promise();
  // const connection = await promisePool.getConnection();
  try {
    const deliveryUpdateQuery =
      'UPDATE payment SET delivery_status=? where payment_id = ?';
    const results = await pool.query(deliveryUpdateQuery, [
      delivery_status,
      payment_id,
    ]);
    console.log(chalk.green(results));
    return results[0].affectedRows > 0;
  } catch (error) {
    console.error(chalk.red('Error in updateDeliByID: ', error));
    throw error;
  }
};

//paymentTotal(used)
module.exports.getPaymentTotal = async (order_id) => {
  console.log(chalk.blue('getPaymentTotal is called'));

  try {
    const paymentTotalQuery = `SELECT SUM(subQuery1.total_price+subQuery2.fee) as payment_total FROM
            (SELECT total_price FROM orders where order_id=? ) subQuery1 ,
            (SELECT fee FROM shipping where shipping_id= (select shipping_id from orders where order_id=?)) subQuery2;`;

    const results = await pool.query(paymentTotalQuery, [order_id, order_id]);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getPaymentTotal: ', error));
    throw error;
  }
};

//shipping
module.exports.addShipping = async (shipping_method, fee) => {
  console.log(chalk.blue('addShipping is called'));
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  try {
    const productCreateQuery =
      'INSERT INTO shipping(shipping_method,fee) VALUES (?, ?);';
    const results = await connection.query(productCreateQuery, [
      shipping_method,
      fee,
    ]);
    console.log(chalk.green(results));
    return results.affectedRows > 0;
  } catch (error) {
    console.error(chalk.red('Error in addShipping: ', error));
    throw error;
  }
};

//Creating payment data into database(used)

module.exports.addPayment = async (
  payment_intent,
  status,
  total,
  paymentMethod,
  orderID
) => {
  console.log(chalk.blue('addPayment is called'));
  const createPaymentQuery =
    'INSERT INTO payment (transaction_id, status, payment_total, payment_method, order_id) VALUES (?, ?, ?, ?, ?);';
  const updateStatusQuery = `UPDATE orders
   SET order_status = 'paid'
   WHERE order_id = ? AND order_id IN (
   SELECT order_id
   FROM payment
   WHERE status = 'succeeded'
   );`;
  const updateInventoryQuery = `UPDATE inventory
  JOIN order_items ON inventory.product_id = order_items.product_id
  JOIN orders ON order_items.order_id = orders.order_id
  JOIN payment ON orders.order_id = payment.order_id
  SET inventory.quantity = inventory.quantity - order_items.quantity
  WHERE payment.order_id = ? AND payment.status = 'succeeded' AND inventory.inventory_id > 0;
  `;
  console.log(chalk.blue('Creating connection...'));
  const connection = await pool.getConnection();
  console.log(
    chalk.blue(
      'database is connected to product.services.js addPayment function'
    )
  );
  try {
    console.log(chalk.blue('Starting transaction'));
    await connection.beginTransaction();

    await pool.query(createPaymentQuery, [
      payment_intent,
      status,
      total,
      paymentMethod,
      orderID,
    ]);

    const createPaymentResult = await Promise.all([
      pool.query(updateStatusQuery, [orderID]),
      pool.query(updateInventoryQuery, [orderID]),
    ]);
    await connection.commit();
    console.log(chalk.green(createPaymentResult));

    return createPaymentResult[0].affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    console.error(chalk.red('Error in addPayment:', error));
    throw error;
  }
};


//payment_intent
module.exports.getPaymentIntentByID = async (order_id) => {
  console.log(chalk.blue('getPaymentIntentByID is called'));

  try {
    const getPaymentIntentByIDQuery = `SELECT transaction_id FROM payment WHERE order_id = ?;`;

    const results = await pool.query(getPaymentIntentByIDQuery, [order_id]);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getPaymentTotal: ', error));
    throw error;
  }
};

//Creating refund data into database(used)

module.exports.addRefund = async (
  id,
  orderID,
  total,
  status
) => {
  console.log(chalk.blue('addRefund is called'));
const createRefundQuery = 
  'INSERT INTO refund (refund_id, order_id, refunded_amount, refunded_status) VALUES (?, ?, ?, ?);';
  const deletePaymentQuery = 
  `DELETE FROM payment
  WHERE order_id = ?
    AND order_id IN (
      SELECT r.order_id
      FROM refund r
      WHERE r.refunded_status = 'succeeded'
    );
  `;
  const updateStatusQuery = 
  `UPDATE orders
   SET order_status = 'refunded'
   WHERE order_id = ? AND order_id IN (
   SELECT order_id
   FROM refund
   WHERE refunded_status = 'succeeded'
   );`
  const updateInventoryQuery = 
  `UPDATE inventory
  JOIN order_items ON inventory.product_id = order_items.product_id
  JOIN orders ON order_items.order_id = orders.order_id
  JOIN refund ON orders.order_id = refund.order_id
  SET inventory.quantity = inventory.quantity + order_items.quantity
  WHERE refund.order_id = ? AND refund.refunded_status = 'succeeded' AND inventory.inventory_id > 0;
  `
  console.log(chalk.blue('Creating connection...'));
  const connection = await pool.getConnection();
  console.log(
    chalk.blue(
      'database is connected to payment.services.js addRefund function'
    )
  );
  try {
    console.log(chalk.blue('Starting transaction'));
    await connection.beginTransaction();

    await pool.query(createRefundQuery,[
      id,
      orderID,
      total,
      status]);

      const createRefundResult =    await Promise.all([
        pool.query(deletePaymentQuery, [orderID]),
        pool.query(updateStatusQuery, [orderID]),
        pool.query(updateInventoryQuery, [orderID]),
      ]);
    await connection.commit();
    console.log(chalk.green(createRefundResult));
  
    return createRefundResult[0].affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    console.error(chalk.red('Error in addPayment:', error));
    throw error;
  }
};
