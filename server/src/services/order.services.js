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
                    INSERT INTO orders
                    (customer_id,shipping_address,billing_address,total_price,payment_method,shipping_id) 
                    VALUES ?
                    `;
  const addOrderItemsQuery = `
                    INSERT INTO order_items 
                    (order_id,product_id,quantity) 
                    VALUES ?
                    `;
  console.log(chalk.blue('Creating connection...'));
  const connection = await pool.getConnection();
  console.log(
    chalk.blue(
      'database is connected in order.services.js addCustomOrder function'
    )
  );
  try {
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
      item.productId,
      item.quantity,
    ]);
    const result = await connection.query(addOrderItemsQuery, [orderItemsData]);
    await connection.commit();
    console.log(
      chalk.green('Order and order items have been inserted successfully.')
    );
    return result[0].affectedRows;
  } catch (error) {
    await connection.rollback();
    console.error(
      chalk.red('Error in inserting order and order items data:', error)
    );
    throw error;
  } finally {
    connection.release();
  }
};

module.exports.getOrderDetailsBeforePickUp = async (data) => {
  console.log(chalk.blue('getOrderDetailsBeforePickUp is called'));
  const { customerID } = data;
  const getOrderDetailsBeforePickUpQuery = `
                      select orders.order_id,product.product_name,product.image_url,product.price, order_items.quantity,orders.shipping_address,shipping.shipping_method FROM product
                      inner join order_items on order_items.product_id=product.product_id
                      inner join orders on orders.order_id= order_items.order_id
                      inner join shipping on shipping.shipping_id = orders.shipping_id
                      where orders.customer_id=? and orders.order_status="order_received";
                    `;
  try {
    console.log(
      chalk.blue(
        'Creating connection...\n',
        'database is connected in order.services.js getOrderDetailsBeforePickUp function'
      )
    );
    const IdRequired = [customerID];
    console.log(
      chalk.blue('Executing query >>>>>>'),
      getOrderDetailsBeforePickUpQuery
    );
    const result = await pool.query(
      getOrderDetailsBeforePickUpQuery,
      IdRequired
    );
    console.log(
      chalk.green('Fetched Data according to order status >>>', result)
    );
    return result;
  } catch (error) {
    console.error(
      chalk.red('Errors in getting order details before pickup', error)
    );
    throw error;
  }
};

module.exports.getOrderDetailsByDeliverStatus = async (data) => {
  console.log(chalk.blue('getOrderDetailsForToShip is called'));
  const { customerID } = data;
  const getOrderDetailsByDeliverStatusQuery = `
                    select product.product_name,product.image_url,product.price, order_items.quantity FROM product
                    inner join order_items on order_items.product_id=product.product_id
                    inner join  orders on orders.order_id= order_items.order_id
                    where orders.customer_id=? and orders.order_status="delivering";
                    `;
  try {
    console.log(
      chalk.blue(
        'Creating connection...\n',
        'database is connected in order.services.js getOrderDetailsByDeliverStatus function'
      )
    );
    const IdRequired = [customerID];
    console.log(
      chalk.blue('Executing query >>>>>>'),
      getOrderDetailsByDeliverStatusQuery
    );
    const result = await pool.query(
      getOrderDetailsByDeliverStatusQuery,
      IdRequired
    );
    console.log(
      chalk.green('Fetched Data according to deliver status >>>', result)
    );
    return result;
  } catch (error) {
    console.error(
      chalk.red('Errors in getting order details by deliver status', error)
    );
    throw error;
  }
};

module.exports.updateShippingDetails = async (data) => {
  const { customerID, orderId, shippingAddr, shippingMethod } = data;
  const updateShippingDetailsQuery = `
                    UPDATE orders
                    SET shipping_address = ?,
                    shipping_id=?
                    WHERE customerID = ? and orderID= ?;
                    `;
  try {
    console.log(
      chalk.blue(
        'Creating connection...\n',
        'database is connected in order.services.js getOrderDetailsByDeliverStatus function'
      )
    );
    const dataRequired = [shippingAddr, shippingMethod, customerID, orderId];
    console.log(
      chalk.blue('Executing query >>>>>>'),
      updateShippingDetailsQuery
    );
    const result = await pool.query(updateShippingDetailsQuery, dataRequired);
    console.log(chalk.green('updated order details'));
    return result;
  } catch (error) {
    console.error(chalk.red('Errors in updating details', error));
    throw error;
  }
};

module.exports.cancelOrder = async (data) => {
  const { orderID, productID } = data;
  const deleteOrderQuery = `
                    DELETE FROM orders
                    WHERE order_id = ?;
                    `;
  const deleteOrderItemsQuery = `
                    DELETE FROM order_items
                    WHERE order_id = ? AND productID = ?;
                    `;
  const checkRemainingItemsQuery = `
                    SELECT COUNT(*) as count 
                    FROM order_items 
                    WHERE order_id = ?
                    ;`;
  try {
    console.log(chalk.blue('Creating connection...'));
    const connection = await pool.getConnection();
    console.log(
      chalk.blue(
        'database is connected in order.services.js addCustomOrder function'
      )
    );

    const dataRequiredToDeleteOrderItems = [orderID, productID];
    console.log(chalk.blue('Executing query >>>>>>'), deleteOrderItemsQuery);
    await connection.beginTransaction();
    // Delete the order item
    const result = await connection.query(
      deleteOrderItemsQuery,
      dataRequiredToDeleteOrderItems
    );

    const orderIdData = [orderID];
    console.log(chalk.blue('Executing query >>>>>>'), checkRemainingItemsQuery);
    // Check if there are any remaining items for this order
    const [rows] = await connection.query(
      checkRemainingItemsQuery,
      orderIdData
    );

    const remainingItemCount = rows[0].count;
    if (remainingItemCount === 0) {
      // If no remaining items, delete the order
      console.log(chalk.blue('Executing query >>>>>>'), deleteOrderQuery);
      await connection.query(deleteOrderQuery, orderIdData);
    }
    await connection.commit();
    console.log(
      chalk.green(
        'Order item has been cancelled successfully. If no remaining items, order has also been cancelled.'
      )
    );
    return result[0].affectedRows;
  } catch (error) {
    console.error(chalk.red('Errors in deleting order', error));
    throw error;
  }
};
