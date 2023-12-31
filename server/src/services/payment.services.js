const pool = require('../config/database');
const chalk = require('chalk');

// get payment by ID
module.exports.getPaymentByID = async (order_id) => {
  console.log(chalk.blue('getPaymentByID is called'));
  try {
    const paymentDataQuery = `SELECT p.product_name, p.price, p.description, i.quantity, o.total_price, s.shipping_method, s.fee, o.shipping_address
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

//paymentTotal(putting total inside stripe)
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

//Creating payment data into database

module.exports.addPayment = async (
  payment_intent,
  status,
  total,
  shippingAddr,
  orderID
) => {
  console.log(chalk.blue('addPayment is called'));
  const createPaymentQuery =
    'INSERT INTO payment (transaction_id, status, payment_total, billing_address, order_id) VALUES (?, ?, ?, ?, ?);';
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
      shippingAddr,
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

//payment_intent(for refund)
module.exports.getPaymentIntentByID = async (order_id) => {
  console.log(chalk.blue('getPaymentIntentByID is called'));

  try {
    const getPaymentIntentByIDQuery =
      'SELECT transaction_id FROM payment WHERE order_id = ?;';

    const results = await pool.query(getPaymentIntentByIDQuery, [order_id]);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getPaymentTotal: ', error));
    throw error;
  }
};
//get payment for fully refund(idh full refund page anymore so idt i need this)
module.exports.getPaymentByStatus = async (order_id) => {
  console.log(chalk.blue('getPaymentByStatus is called'));
  try {
    const paymentDataQuery = `SELECT p.product_name, p.price, p.description, i.quantity, o.total_price, s.shipping_method, s.fee, o.shipping_address
    FROM product AS p, order_items AS i, orders AS o, shipping AS s
    WHERE o.order_id = ?
      AND o.order_id = i.order_id
      AND s.shipping_id = o.shipping_id
      AND p.product_id = i.product_id
      AND o.order_status = 'paid';
    `;
    const results = await pool.query(paymentDataQuery, [order_id]);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getPaymentByStatus: ', error));
    throw error;
  }
};

//fetch all payment which need to give refund(admin page)
module.exports.getOrderForRefund = async () => {
  console.log(chalk.blue('getOrderForRefund is called'));
  const refundDataQuery = `SELECT order_id, customer_id, refunded_amount, refunded_status
  FROM refund 
  WHERE refunded_status IN ('pending', 'refunded');
  `;
  try {
    console.log(
      chalk.blue(
        'Creating connection...\n',
        'database is connected in payment.services.js getOrderForRefund function'
      )
    );
    console.log(chalk.blue('Executing query >>>>>>'), refundDataQuery);
    const result = await pool.query(refundDataQuery);
    console.log(chalk.green('result:'), result[0]);
    return result[0];
  } catch (error) {
    console.error(chalk.red('Error in getOrderForRefund: ', error));
    throw error;
  }
};

//refunded status for button name changing 
module.exports.getRefundStatusByID = async (order_id) => {
  console.log(chalk.blue('getRefundStatusByID is called'));

  try {
    const getRefundStatusByIDQuery =
      'SELECT refunded_status FROM refund WHERE order_id = ?;';

    const results = await pool.query(getRefundStatusByIDQuery, [order_id]);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getRefundStatusByID: ', error));
    throw error;
  }
};

// update orders by Admin(after click update to refund inside admin)
module.exports.updateRefundStatus = async (data) => {
  console.log(chalk.blue('updateRefundStatus is called'));
  const { orderIDs, refundStatus } = data;
  console.log(refundStatus);
  const updateRefundedStatusQuery =
    'UPDATE refund set refunded_status = ? WHERE order_id in (?)';

  try {
    console.log(
      chalk.blue(
        'Creating connection...\n',
        'database is connected in payment.services.js updateRefundStatus function'
      )
    );
    const dataRequired = [refundStatus, orderIDs];

    console.log(
      chalk.blue('Executing query >>>>>>'),
      updateRefundedStatusQuery
    );
    const result = await pool.query(updateRefundedStatusQuery, dataRequired);
    console.log(chalk.green('updated refund status'));

    const deletePaymentQuery = `
  DELETE FROM payment WHERE order_id IN (?) 
    AND order_id IN (SELECT r.order_id FROM refund r WHERE r.refunded_status = 'refunded')
`;

    const updateInventoryQuery = `
  UPDATE inventory
  JOIN order_items ON inventory.product_id = order_items.product_id
  JOIN orders ON order_items.order_id = orders.order_id
  JOIN refund ON orders.order_id = refund.order_id
  SET inventory.quantity = inventory.quantity + order_items.quantity
  WHERE refund.order_id IN (?) AND refund.refunded_status = 'refunded' AND inventory.inventory_id > 0
`;

    const connection = await pool.getConnection();
    console.log(chalk.blue('Creating connection...'));

    try {
      console.log(chalk.blue('Starting transaction'));
      await connection.beginTransaction();

      const afterRefundResult = await Promise.all([
        pool.query(deletePaymentQuery, [orderIDs]),
        pool.query(updateInventoryQuery, [orderIDs]),
      ]);
      await connection.commit();
      console.log(chalk.green('After-refund operations completed'));

      return {
        refundStatusUpdate: result[0].affectedRows > 0,
        afterRefundOperations: afterRefundResult[0].affectedRows > 0,
      };
    } catch (error) {
      await connection.rollback();
      console.error(
        chalk.red('Error in updateRefundAndPerformAfterRefund:', error)
      );
      throw error;
    }
  } catch (error) {
    console.error(chalk.red('Errors in updateOrderStatus', error));
    throw error;
  }
};

//adding refund inside database
module.exports.addRefund = async (orderID, customerID, total, status) => {
  console.log(chalk.blue('addRefund is called'));
  try {
    const createRefundQuery =
      'INSERT INTO refund ( order_id, customer_id, refunded_amount, refunded_status) VALUES (?, ?, ?, ?);';

    const results = await pool.query(createRefundQuery, [
      orderID,
      customerID,
      total,
      status,
    ]);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getPaymentByID: ', error));
    throw error;
  }
};

//idt i need this
module.exports.afterRefund = async (orderID) => {
  console.log(chalk.blue('afterRefund is called'));

  const deletePaymentQuery = `DELETE FROM payment WHERE order_id = ? AND order_id IN (SELECT r.order_id FROM refund r WHERE r.refunded_status = 'fully Refunded');`;

  const updateInventoryQuery = `UPDATE inventory
    JOIN order_items ON inventory.product_id = order_items.product_id
    JOIN orders ON order_items.order_id = orders.order_id
    JOIN refund ON orders.order_id = refund.order_id
    SET inventory.quantity = inventory.quantity + order_items.quantity
    WHERE refund.order_id = ? AND refund.refunded_status = 'fully Refunded' AND inventory.inventory_id > 0;
    `;

  console.log(chalk.blue('Creating connection...'));
  const connection = await pool.getConnection();
  console.log(
    chalk.blue(
      'database is connected to payment.services.js afterRefund function'
    )
  );

  try {
    console.log(chalk.blue('Starting transaction'));
    await connection.beginTransaction();

    const createRefundResult = await Promise.all([
      pool.query(deletePaymentQuery, [orderID]),
      pool.query(updateInventoryQuery, [orderID]),
    ]);
    await connection.commit();
    console.log(chalk.green(createRefundResult));

    return createRefundResult[0].affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    console.error(chalk.red('Error in afterRefund:', error));
    throw error;
  }
};

//getID and amount for partial refund
module.exports.getIdAndAmount = async (productID) => {
  console.log(chalk.blue('getIdAndAmount is called'));

  try {
    const partialRefundQuery = `SELECT payment.transaction_id, payment.order_id, orders.customer_id, (order_items.quantity * product.price) as refund_total
    FROM payment
    JOIN order_items ON payment.order_id = order_items.order_id
    JOIN product ON order_items.product_id = product.product_id
    JOIN orders ON payment.order_id = orders.order_id
    WHERE order_items.product_id = ?
    AND orders.order_status IN ('paid', 'delivering');`;

    const results = await pool.query(partialRefundQuery, [productID]);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red('Error in getIdAndAmount: ', error.message)); // Print the error message
    console.error(chalk.red('Error stack trace: ', error.stack)); // Print the error stack trace
    throw error;
  }
};

//partial refund
module.exports.addPartialRefund = async (
  orderID,
  customerID,
  amount,
  status
) => {
  console.log(chalk.blue('addPartialRefund is called'));
  const createPartialRefundQuery =
    'INSERT INTO refund (order_id, customer_id, refunded_amount, refunded_status) VALUES (?, ?, ?, ?);';

  const updatePaymentQuery = `UPDATE payment
  SET payment_total = payment_total  - (
    SELECT refunded_amount
    FROM refund
    WHERE refunded_status = 'refunded'
      AND order_id = ?
  ),
  status = 'partially_refunded'
  WHERE order_id = ?;  
  `;

  const deleteOrderItemsQuery = `DELETE FROM order_items
  WHERE order_id = ?
    AND status = 'Unavailable'
    AND order_id IN (
      SELECT order_id
      FROM refund
    );
  `;

  console.log(chalk.blue('Creating connection...'));
  const connection = await pool.getConnection();
  console.log(
    chalk.blue(
      'database is connected to payment.services.js addPartialRefund function'
    )
  );
  try {
    console.log(chalk.blue('Starting transaction'));
    await connection.beginTransaction();

    await pool.query(createPartialRefundQuery, [
      orderID,
      customerID,
      amount,
      status,
    ]);

    const createRefundResult = await Promise.all([
      pool.query(updatePaymentQuery, [orderID, orderID]),
      pool.query(deleteOrderItemsQuery, [orderID]),
    ]);
    await connection.commit();
    console.log(chalk.green(createRefundResult));

    return createRefundResult[0].affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    console.error(chalk.red('Error in addPartialRefund:', error));
    throw error;
  }
};

//cancel order inside OrderToShip
module.exports.cancelOrder = async (
  orderID,
  customerID,
  amount,
  status
) => {
  console.log(chalk.blue('addRefundByCanceling is called'));
  const createRefundQuery =
    'INSERT INTO refund (order_id, customer_id, refunded_amount, refunded_status) VALUES (?, ?, ?, ?);';

    const deletePaymentQuery = `
  DELETE FROM payment WHERE order_id = ?
    AND order_id IN (SELECT r.order_id FROM refund r WHERE r.refunded_status = 'refunded')
`;

    const updateInventoryQuery = `
  UPDATE inventory
  JOIN order_items ON inventory.product_id = order_items.product_id
  JOIN orders ON order_items.order_id = orders.order_id
  JOIN refund ON orders.order_id = refund.order_id
  SET inventory.quantity = inventory.quantity + order_items.quantity
  WHERE refund.order_id = ? AND refund.refunded_status = 'refunded' AND inventory.inventory_id > 0
`;

const deleteOrderQuery = `DELETE FROM orders
  WHERE order_id IN (
    SELECT r.order_id
    FROM refund r
    WHERE r.order_id = ?
      AND r.refunded_status = 'refunded'
  );`;
    const deleteOrderItemQuery = `DELETE FROM order_items
  WHERE order_id IN (
    SELECT r.order_id
    FROM refund r
    WHERE r.order_id = ?
      AND r.refunded_status = 'refunded'
  );`;


  console.log(chalk.blue('Creating connection...'));
  const connection = await pool.getConnection();
  console.log(
    chalk.blue(
      'database is connected to payment.services.js addPartialRefund function'
    )
  );
  try {
    console.log(chalk.blue('Starting transaction'));
    await connection.beginTransaction();

    await pool.query(createRefundQuery, [
      orderID,
      customerID,
      amount,
      status,
    ]);

    const createRefundResult = await Promise.all([
      pool.query(deletePaymentQuery, [orderID]),
      pool.query(updateInventoryQuery, [orderID]),
      pool.query(deleteOrderQuery, [orderID]),
      pool.query(deleteOrderItemQuery, [orderID]),
    ]);
    await connection.commit();
    console.log(chalk.green(createRefundResult));

    return createRefundResult[0].affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    console.error(chalk.red('Error in addPartialRefund:', error));
    throw error;
  }
};