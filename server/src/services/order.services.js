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
  // manullyu creating connections to get all possible connections
  const connection = await pool.getConnection();
  console.log(
    chalk.blue(
      'database is connected in order.services.js addCustomOrder function'
    )
  );
  try {
    console.log(chalk.blue('Starting transaction'));
    // open transation
    await connection.beginTransaction();
    // create uuid for the order id
    const uuid = uuidv4();
    const orderData = [
      [uuid, customerID, shippingAddr, totalPrice, shippingMethod],
    ];
    console.log(chalk.blue('Executing query >>>>>>'), addOrderQuery);
    const [orderResult] = await connection.query(addOrderQuery, [orderData]);
    // if order inserted successfully manipulate data to insert into order_item
    const orderItemsData = orderItems.map((item) => [
      uuid,
      item.productId,
      item.quantity,
    ]);
    console.log(orderItemsData);
    //multiple insert with 2 dimensional array
    const result = await connection.query(addOrderItemsQuery, [orderItemsData]);
    await connection.commit();
    console.log(
      chalk.green('Order and order items have been inserted successfully.')
    );
    return uuid;
  } catch (error) {
    // if error, rollback to initial state before insertion
    await connection.rollback();
    console.error(
      chalk.red('Error in inserting order and order items data:', error)
    );
    throw error;
  } finally {
    // then release all  connections
    connection.release();
  }
};

// get order details before and after payment
module.exports.getOrderDetailsByOrderStatus = async (data) => {
  console.log(chalk.blue('getOrderDetailsBeforePickUp is called'));
  const { customerID, orderStatus } = data;
  console.log(
    chalk.yellow('Inspecting data from controller:', customerID, orderStatus)
  );
  const orderBeforePaidQuery = `
                      select orders.order_id,
                      product.product_id,
                      product.product_name,
                      MAX(product_image.image_url) as image_url,
                      product.price, 
                      order_items.quantity,
                      orders.shipping_address,
                      orders.order_date,
                      shipping.shipping_method
                      FROM product
                      inner join order_items on order_items.product_id=product.product_id
                      inner join orders on orders.order_id= order_items.order_id
                      inner join shipping on shipping.shipping_id = orders.shipping_id
                      left join product_image on product.product_id=product_image.product_id
                      where orders.customer_id=? and orders.order_status=?
                      GROUP BY orders.order_id, product.product_id, product.product_name, product.price, order_items.quantity, orders.shipping_address, shipping.shipping_method;
                    `;
  const orderAfterPaidQuery = `
                    select orders.order_id,
                    product.product_id,
                    product.product_name,
                    product.description,
                    MAX(product_image.image_url) as image_url,
                    product.price, 
                    order_items.quantity ,
                    orders.shipping_start_at,
                    orders.shipping_address,
                    orders.order_date,
                    shipping.shipping_method,
                    orders.completed_at,
                    payment.payment_date
                    FROM product
                    inner join order_items on order_items.product_id=product.product_id
                    inner join  orders on orders.order_id= order_items.order_id
                    inner join payment on payment.order_id = orders.order_id
                    inner join shipping on shipping.shipping_id = orders.shipping_id
                    left join product_image on product_image.product_id=product.product_id
                    where orders.customer_id=? and orders.order_status=?
                    GROUP BY orders.order_id, product.product_id, product.product_name, product.price, order_items.quantity, payment.payment_date;
                    `;
  try {
    console.log(
      chalk.blue(
        'Creating connection...\n',
        'database is connected in order.services.js getOrderDetailsByOrderStatus function'
      )
    );
    // if order status is order_received, payement date is not available
    if (orderStatus === OrderStatus.ORDER_RECEIVED) {
      console.log(chalk.blue('Executing query >>>>>>'), orderBeforePaidQuery);
      const dataRequired = [customerID, orderStatus.key];
      const result = await pool.query(orderBeforePaidQuery, dataRequired);
      console.log(
        chalk.green('Fetched Data according to order status >>>', result)
      );
      return result[0];
      // or else take all date
    } else if (
      orderStatus === OrderStatus.ORDER_DELIVERED ||
      orderStatus === OrderStatus.ORDER_DELIVERING ||
      orderStatus === OrderStatus.ORDER_PAID
    ) {
      const dataRequired = [customerID, orderStatus.key];
      console.log(chalk.blue('Executing query >>>>>>'), orderAfterPaidQuery);
      const result = await pool.query(orderAfterPaidQuery, dataRequired);
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

// fetch all orders with paid and delivering status
module.exports.getOrderDetailsForAdmin = async () => {
  console.log(chalk.blue('getOrderDetailsForAdmin is called'));
  const orderQuery = `SELECT orders.order_id,
                      orders.order_status,
                      payment.payment_date,
                      orders.shipping_address,
                      orders.shipping_start_at
                      FROM orders
                      inner join payment on payment.order_id=orders.order_id 
                      WHERE order_status in ("paid","delivering")
                      ORDER BY payment.payment_date
                      ;`;
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

// update orders by Admin
module.exports.updateOrderStatus = async (data) => {
  console.log(chalk.blue('updateOrderStatus is called'));
  const { orderIDs, orderStatus } = data;
  console.log(orderStatus);
  const updatePaidOrderStatusQuery = `UPDATE orders set order_status = ?,shipping_start_at = UTC_TIMESTAMP() WHERE order_id in (?)`;
  const updateDeliveringOrderStatusQuery = `UPDATE orders set order_status = ?,completed_at = UTC_TIMESTAMP() WHERE order_id in(?)`;
  try {
    console.log(
      chalk.blue(
        'Creating connection...\n',
        'database is connected in order.services.js updateOrderStatus function'
      )
    );
    const dataRequired = [orderStatus.key, orderIDs];
    let result;
    // if order_status is delivering update the status and shippig time
    if (orderStatus === OrderStatus.ORDER_DELIVERING) {
      console.log(
        chalk.blue('Executing query >>>>>>'),
        updatePaidOrderStatusQuery
      );
      result = await pool.query(updatePaidOrderStatusQuery, dataRequired);
      console.log(chalk.green(`updated order status`));
      return result[0].affectedRows;
    }
    // or deliverd, update status and completed with UTC
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

// Cancel the order
module.exports.updateShippingDetails = async (data) => {
  console.log(chalk.blue('updateShippingDetails is called'));
  const { customerID, orderId, shippingAddr, shippingMethod } = data;
  const updateShippingDetailsQuery = `
                    UPDATE orders
                    SET shipping_address = ?
                    WHERE customer_id = ? and order_id= ?;
                    `;
  try {
    console.log(
      chalk.blue(
        'Creating connection...\n',
        'database is connected in order.services.js updateShippingDetails function'
      )
    );
    const dataRequired = [shippingAddr, customerID, orderId];
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
  const { orderID, productID, quantity, orderStatus } = data;
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
  const returnInventoryQuery = `UPDATE inventory 
                                SET quantity = quantity + ? 
                                WHERE product_id = ?`;
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
    // return the quantity of the order items if customer canceled
    if (orderStatus === OrderStatus.ORDER_PAID) {
      console.log(chalk.blue('Executing query >>>>>>'), returnInventoryQuery);
      await connection.query(returnInventoryQuery, [quantity, productID]);
    }
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
