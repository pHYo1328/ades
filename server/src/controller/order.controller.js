const chalk = require('chalk');
const orderServices = require('../services/order.services');
const { OrderStatus } = require('../config/orderStatus.enum');

// controller for adding order
exports.processAddCustomerOrder = async (req, res, next) => {
  console.log(chalk.blue('processAddCustomerOrder is running'));
  const { customerId } = req.params;
  const { shippingAddr, totalPrice, shippingMethod, orderItems } = req.body;
  console.log(
    chalk.yellow(
      'Inspect req.body variables',
      shippingAddr,
      totalPrice,
      shippingMethod,
      orderItems
    )
  );
  try {
    if (isNaN(parseInt(customerId))) {
      const error = new Error('Invalid customerID parameter');
      error.status = 400;
      throw error;
    }
    if (
      !shippingAddr ||
      !shippingAddr.trim() ||
      isNaN(parseInt(totalPrice)) ||
      isNaN(parseInt(shippingMethod))
    ) {
      const error = new Error('Invalid Information parameters');
      error.status = 400;
      throw error;
    }
    if (
      !orderItems ||
      orderItems.length <= 0 ||
      !orderItems.every((items) => typeof items === 'object')
    ) {
      const error = new Error('Invalid order items data');
      error.status = 400;
      throw error;
    }
    const data = {
      customerID: customerId,
      shippingAddr,
      totalPrice,
      shippingMethod,
      orderItems,
    };
    const result = await orderServices.addCustomerOrder(data);
    console.log(
      chalk.yellow(
        'Inspect result variable from addCustomerOrder service\n:',
        result
      )
    );
    if (result) {
      return res.status(201).send({
        message: 'Order Data added successfully',
        data: result,
      });
    }
  } catch (error) {
    console.error(chalk.red('Error in processAddCustomerOrder: ', error));
    next(error);
  }
};

// controller for getting customers orders by order status
exports.processGetOrderDetailsByOrderStatus = async (req, res, next) => {
  console.log(chalk.blue('processGetOrderDetailsByOrderStatus is running'));
  const { customerID, orderStatus } = req.query;
  console.log(
    chalk.yellow('Inspect request variable :', customerID, orderStatus)
  );
  try {
    if (isNaN(parseInt(customerID))) {
      const error = new Error('Invalid customer ID parameter');
      error.status(400);
      throw error;
    }
    let status = null;

    // create enum here
    switch (orderStatus) {
      case 'order_received':
        status = OrderStatus.ORDER_RECEIVED;
        break;
      case 'paid':
        status = OrderStatus.ORDER_PAID;
        break;
      case 'delivering':
        status = OrderStatus.ORDER_DELIVERING;
        break;
      case 'delivered':
        status = OrderStatus.ORDER_DELIVERED;
        break;
      default: {
        const error = new Error('Invalid order status parameter');
        error.status = 400;
        throw error;
      }
    }
    const data = { customerID: customerID, orderStatus: status };
    console.log(
      chalk.yellow('Inspecting data parameter variable', JSON.stringify(data))
    );
    const result = await orderServices.getOrderDetailsByOrderStatus(data);
    console.log(
      chalk.yellow(
        'Inspect result variable from getOrderDetailsByOrderStatus service',
        JSON.stringify(result[0])
      )
    );
    return res.status(200).send({
      message: 'orders found',
      data: result,
    });
  } catch (error) {
    console.error(
      chalk.red('Error in processGetOrderDetailsBeforePickUp: ', error)
    );
    next(error);
  }
};

// controller to fetch order details for administration
exports.processGetOrderDetailsForAdmin = async (req, res, next) => {
  console.log(chalk.blue('processGetOrderDetailsForAdmin is running'));
  try {
    const result = await orderServices.getOrderDetailsForAdmin();
    console.log(
      chalk.yellow(
        'Inspect result variable from getOrderDetailsForAdmin service',
        result
      )
    );
    return res.status(200).send({
      message: 'orders found',
      data: result,
    });
  } catch (error) {
    console.error(
      chalk.red('Error in processGetOrderDetailsForAdmin: ', error)
    );
    next(error);
  }
};

// controller to update order status
exports.processUpdateOrderStatus = async (req, res, next) => {
  console.log(chalk.blue('ProcessUpdateOrderStatus is running'));
  const { orderIDs, orderStatus } = req.body;
  try {
    if (!orderIDs || !orderStatus) {
      const error = new Error('Invalid Information parameters');
      error.status = 400;
      throw error;
    }
    let status = null;
    switch (orderStatus) {
      case 'delivering':
        status = OrderStatus.ORDER_DELIVERING;
        break;
      case 'delivered':
        status = OrderStatus.ORDER_DELIVERED;
        break;
      default: {
        const error = new Error('Invalid order status parameter');
        error.status = 400;
        throw error;
      }
    }
    const data = { orderIDs, orderStatus: status };
    const result = await orderServices.updateOrderStatus(data);
    console.log(
      chalk.yellow(
        'Inspect result variable from updateOrderStatus service',
        result
      )
    );
    return res.status(200).send({
      message: 'Order Status updated successfully',
      data: result,
    });
  } catch (error) {
    console.error(chalk.red('Error in processUpdateOrderStatus: ', error));
    next(error);
  }
};

// controller for updating shipping details
exports.processUpdateShippingDetails = async (req, res, next) => {
  console.log(chalk.blue('processUpdateShippingDetails is running'));
  const { customerID } = req.params;
  const { orderId, shippingAddr } = req.body;
  console.log(chalk.yellow('Inspect customerID variable :', customerID));
  console.log(
    chalk.yellow('Inspect req body variables', orderId, shippingAddr)
  );
  try {
    if (isNaN(parseInt(customerID))) {
      const error = new Error('Invalid customerID parameter');
      error.status = 400;
      throw error;
    }
    if (!orderId || !shippingAddr || !shippingAddr.trim()) {
      const error = new Error('Invalid information parameter');
      error.status = 400;
      throw error;
    }
    const data = {
      customerID: customerID,
      orderId: orderId,
      shippingAddr: shippingAddr,
    };
    const result = await orderServices.updateShippingDetails(data);
    console.log(
      chalk.yellow(
        'Inspect result variable from processUpdateShippingDetails service',
        result
      )
    );
    if (result == 0) {
      const error = new Error('there is no such order');
      error.status = 404;
      throw error;
    }
    return res.status(200).send({
      message: 'Information Updated',
      data: ' ',
    });
  } catch (error) {
    console.error(
      chalk.red('Error in processGetOrderDetailsByDeliverStatus: ', error)
    );
    next(error);
  }
};

// controller for cancel the particular order items
exports.processCancelOrder = async (req, res, next) => {
  console.log(chalk.blue('processCancelOrder is running'));
  const { orderId, productID, quantity, orderStatus } = req.query;
  console.log(
    chalk.yellow(
      'Inspect req body variables :',
      orderId,
      productID,
      quantity,
      orderStatus
    )
  );
  try {
    if (!orderId) {
      const error = new Error('Invalid order ID parameter');
      error.status = 400;
      throw error;
    }
    if (isNaN(parseInt(productID))) {
      const error = new Error('Invalid product ID parameter');
      error.status = 400;
      throw error;
    }
    if (isNaN(parseInt(quantity))) {
      const error = new Error('Invalid quantity parameter');
      error.status = 400;
      throw error;
    }
    let status = null;
    switch (orderStatus) {
      case 'order_received':
        status = OrderStatus.ORDER_RECEIVED;
        break;
      case 'paid':
        status = OrderStatus.ORDER_PAID;
        break;
      default: {
        const error = new Error('Invalid order status parameter');
        error.status = 400;
        throw error;
      }
    }
    const data = {
      orderID: orderId,
      productID: productID,
      quantity: quantity,
      orderStatus: status,
    };
    const result = await orderServices.cancelOrder(data);
    console.log(
      chalk.yellow(
        'Inspect result variable from processCancelOrder service : ',
        result
      )
    );
    if (result) {
      return res.status(201).send({
        message: 'delete Order successfully',
        data: '',
      });
    }
  } catch (error) {
    console.error(chalk.red('Error in processCancelOrder :', error));
    next(error);
  }
};
