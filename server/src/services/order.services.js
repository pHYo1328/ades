const chalk = require('chalk');
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { OrderStatus } = require('../config/orderStatus.enum');
module.exports.addCustomerOrder = async (data) => {
  console.log(chalk.blue('addCustomOrder is called'));
  // order data

  const { customerID, shippingAddr, totalPrice, shippingMethod, orderItems } =
    data;
  const addOrderQuery = `
                    INSERT INTO orders
                    (order_id,customer_id,shipping_address,total_price,shipping_id) 
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
    const uuid = uuidv4();
    const orderData = [
      [uuid, customerID, shippingAddr, totalPrice, shippingMethod],
    ];
    console.log(chalk.blue('Executing query >>>>>>'), addOrderQuery);
    const [orderResult] = await connection.query(addOrderQuery, [orderData]);
    const orderItemsData = orderItems.map((item) => [
      uuid,
      item.productId,
      item.quantity,
    ]);
    const result = await connection.query(addOrderItemsQuery, [orderItemsData]);
    await connection.commit();
    console.log(
      chalk.green('Order and order items have been inserted successfully.')
    );
    return uuid;
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

module.exports.getOrderDetailsByOrderStatus = async (data) => {
  console.log(chalk.blue('getOrderDetailsBeforePickUp is called'));
  const { customerID, orderStatus } = data;
  console.log(
    chalk.yellow('Inspecting data from controller:', customerID, orderStatus)
  );
  const orderBeforeDeliverQuery = `
                      select orders.order_id,product.product_id,product.product_name,product.image_url,product.price, order_items.quantity,orders.shipping_address,shipping.shipping_method,shipping.shipping_id FROM product
                      inner join order_items on order_items.product_id=product.product_id
                      inner join orders on orders.order_id= order_items.order_id
                      inner join shipping on shipping.shipping_id = orders.shipping_id
                      where orders.customer_id=? and orders.order_status=?;
                    `;
  const orderAfterDeliverQuery = `
                    select product.product_id,product.product_name,product.image_url,product.price, order_items.quantity FROM product
                    inner join order_items on order_items.product_id=product.product_id
                    inner join  orders on orders.order_id= order_items.order_id
                    where orders.customer_id=? and orders.order_status=?;
                    `;
  try {
    console.log(
      chalk.blue(
        'Creating connection...\n',
        'database is connected in order.services.js getOrderDetailsByOrderStatus function'
      )
    );
    if (
      orderStatus === OrderStatus.ORDER_RECEIVED ||
      orderStatus === OrderStatus.ORDER_PAID
    ) {
      console.log(
        chalk.blue('Executing query >>>>>>'),
        orderBeforeDeliverQuery
      );
      const dataRequired = [customerID, orderStatus.key];
      const result = await pool.query(orderBeforeDeliverQuery, dataRequired);
      console.log(
        chalk.green('Fetched Data according to order status >>>', result)
      );
      return result[0];
    } else if (
      orderStatus === OrderStatus.ORDER_DELIVERED ||
      orderStatus === OrderStatus.ORDER_DELIVERING
    ) {
      const dataRequired = [customerID, orderStatus.key];
      console.log(chalk.blue('Executing query >>>>>>'), orderAfterDeliverQuery);
      const result = await pool.query(orderAfterDeliverQuery, dataRequired);
      console.log(
        chalk.green('Fetched Data according to deliver status >>>', result)
      );
      return result[0];
    }
  } catch (error) {
    console.error(chalk.red('Errors in getOrderDetailsByOrderStatus', error));
    throw error;
  }
};

module.exports.getOrderDetailsForAdmin = async () => {
  console.log(chalk.blue('getOrderDetailsForAdmin is called'));
  const orderQuery = `SELECT * FROM orders WHERE order_status in ("paid","delivering");`;
  try {
    console.log(
      chalk.blue(
        'Creating connection...\n',
        'database is connected in order.services.js getOrderDetailsForAdmin function'
      )
    );
    console.log(chalk.blue('Executing query >>>>>>'), orderQuery);
    const result = await pool.query(orderQuery);
    console.log(chalk.green('result: '), result[0]);
    return result[0];
  } catch (error) {
    console.error(chalk.red('Errors in getOrderDetailsForAdmin', error));
    throw error;
  }
};

module.exports.updateOrderStatus = async (data) => {
  console.log(chalk.blue('updateOrderStatus is called'));
  const { orderIDs, orderStatus } = data;
  console.log(orderStatus);
  const updatePaidOrderStatusQuery = `UPDATE orders set order_status = ?,shipping_start_at = NOW() WHERE order_id in (?)`;
  const updateDeliveringOrderStatusQuery = `UPDATE orders set order_status = ?,completed_at = NOW() WHERE order_id in(?)`;
  try {
    console.log(
      chalk.blue(
        'Creating connection...\n',
        'database is connected in order.services.js updateOrderStatus function'
      )
    );
    const dataRequired = [orderStatus.key, orderIDs];
    let result;
    if (orderStatus === OrderStatus.ORDER_DELIVERING) {
      console.log(
        chalk.blue('Executing query >>>>>>'),
        updatePaidOrderStatusQuery
      );
      result = await pool.query(updatePaidOrderStatusQuery, dataRequired);
      console.log(chalk.green(`updated order status`));
      return result[0].affectedRows;
    }
    if (orderStatus === OrderStatus.ORDER_DELIVERED) {
      console.log(
        chalk.blue('Executing query >>>>>>'),
        updateDeliveringOrderStatusQuery
      );
      result = await pool.query(updateDeliveringOrderStatusQuery, dataRequired);
      console.log(chalk.green(`updated order status`));
      return result[0].affectedRows;
    }
  } catch (error) {
    console.error(chalk.red('Errors in updateOrderStatus', error));
    throw error;
  }
};

module.exports.updateShippingDetails = async (data) => {
  console.log(chalk.blue('updateShippingDetails is called'));
  const { customerID, orderId, shippingAddr, shippingMethod } = data;
  const updateShippingDetailsQuery = `
                    UPDATE orders
                    SET shipping_address = ?,
                    shipping_id=?
                    WHERE customer_id = ? and order_id= ?;
                    `;
  try {
    console.log(
      chalk.blue(
        'Creating connection...\n',
        'database is connected in order.services.js updateShippingDetails function'
      )
    );
    const dataRequired = [shippingAddr, shippingMethod, customerID, orderId];
    console.log(
      chalk.blue('Executing query >>>>>>'),
      updateShippingDetailsQuery
    );
    const result = await pool.query(updateShippingDetailsQuery, dataRequired);
    console.log(chalk.green('updated order details'));
    return result[0].affectedRows;
  } catch (error) {
    console.error(chalk.red('Errors in updating details', error));
    throw error;
  }
};

module.exports.cancelOrder = async (data) => {
  console.log(chalk.blue('cancelOrder is called'));
  const { orderID, productID } = data;
  const deleteOrderQuery = `
                    DELETE FROM orders
                    WHERE order_id = ?;
                    `;
  const deleteOrderItemsQuery = `
                    DELETE FROM order_items
                    WHERE order_id = ? AND product_id = ?;
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
        'database is connected in order.services.js cancelOrder function'
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
