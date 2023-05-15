const chalk = require('chalk');
const orderServices = require('../services/order.services');

exports.processAddCustomerOrder = async (req, res, next) => {
  console.log(chalk.blue('processAddCustomerOrder is running'));
  const { customerId } = req.params;
  const {
    shippingAddr,
    billingAddr,
    totalPrice,
    paymentMethod,
    shippingMethod,
    orderItems,
  } = req.body;
  console.log(
    chalk.yellow(
      'Inspect req.body variables',
      shippingAddr,
      billingAddr,
      totalPrice,
      paymentMethod,
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
      !billingAddr ||
      !billingAddr.trim() ||
      isNaN(parseInt(totalPrice)) ||
      !paymentMethod ||
      !paymentMethod.trim() ||
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
      billingAddr,
      totalPrice,
      paymentMethod,
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
        data: '',
      });
    }
  } catch (error) {
    console.error(chalk.red('Error in processAddCustomerOrder: ', error));
    next(error);
  }
};

exports.processGetOrderDetailsBeforePickUp = async (req, res, next) => {
  console.log(chalk.blue('processGetOrderDetailsBeforePickUp is running'));
  const { customerID } = req.params;
  console.log(chalk.yellow('Inspect customerID variable :', customerID));
  try {
    if (isNaN(parseInt(customerID))) {
      const error = new Error('Invalid customer ID parameter');
      error.status(400);
      throw error;
    }
    const data = { customerID: customerID };
    const result = await orderServices.getOrderDetailsBeforePickUp(data);
    console.log(
      chalk.yellow(
        'Inspect result variable from getOrderDetailsBeforePickUp service',
        result
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

exports.processGetOrderDetailsByDeliverStatus = async (req, res, next) => {
  console.log(chalk.blue('processGetOrderDetailsByDeliverStatus is running'));
  const { customerID } = req.params;
  console.log(chalk.yellow('Inspect customerID variable :', customerID));
  try {
    if (isNaN(parseInt(customerID))) {
      const error = new Error('Invalid customer ID parameter');
      error.status(400);
      throw error;
    }
    const data = { customerID: customerID };
    const result = await orderServices.getOrderDetailsByDeliverStatus(data);
    console.log(
      chalk.yellow(
        'Inspect result variable from processGetOrderDetailsByDeliverStatus service',
        result
      )
    );
    return res.status(200).send({
      message: 'orders found',
      data: result,
    });
  } catch (error) {
    console.error(
      chalk.red('Error in processGetOrderDetailsByDeliverStatus: ', error)
    );
    next(error);
  }
};

exports.processUpdateShippingDetails = async (req, res, next) => {
  console.log(chalk.blue('processUpdateShippingDetails is running'));
  const { customerID } = req.params;
  const { orderId, shippingAddr, shippingMethod } = req.body;
  console.log(chalk.yellow('Inspect customerID variable :', customerID));
  console.log(
    chalk.yellow(
      'Inspect req body variables',
      orderId,
      shippingAddr,
      shippingMethod
    )
  );
  try {
    if (isNaN(parseInt(customerID))) {
      const error = new Error('Invalid customerID parameter');
      error.status = 400;
      throw error;
    }
    if (
      isNaN(parseInt(orderId)) ||
      !shippingAddr ||
      !shippingAddr.trim() ||
      !shippingMethod ||
      !shippingMethod.trim()
    ) {
      const error = new Error('Invalid information parameter');
      error.status = 400;
      throw error;
    }
    const data = {
      customerID: customerID,
      orderId: orderId,
      shippingAddr: shippingAddr,
      shippingMethod: shippingMethod,
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

exports.processCancelOrder = async (req, res, next) => {
  console.log(chalk.blue('processCancelOrder is running'));
  const { orderId, productID } = req.body;
  console.log(chalk.yellow('Inspect req body variables :', orderId, productID));
  try {
    if (isNaN(parseInt(orderId))) {
      const error = new Error('Invalid order ID parameter');
      error.status = 400;
      throw error;
    }
    if (isNaN(parseInt(productID))) {
      const error = new Error('Invalid product ID parameter');
      error.status = 400;
      throw error;
    }
    const data = {
      orderID: orderId,
      productID: productID,
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
