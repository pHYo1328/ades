const pool = require('../config/database');
const chalk = require('chalk');

// get payment by ID
module.exports.getPaymentByID = async (payment_id) => {
  console.log(chalk.blue('getPaymentByCusID is called'));
  try {
    const paymentDataQuery =
      'SELECT o.order_id, p.product_name, p.price, p.description, i.quantity, o.total_price, s.shipping_method, pay.payment_total FROM product p, order_items i, orders o, shipping s, payment pay WHERE payment_id=? AND o.order_id = i.order_id AND pay.order_id = o.order_id AND s.shipping_id = o.shipping_id AND p.product_id = i.product_id;';
    const results = await pool.query(paymentDataQuery, [payment_id]);
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

//paymentTotal
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
  } finally {
    connection.release();
  }
};
