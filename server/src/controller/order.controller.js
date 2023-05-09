const chalk = require('chalk');
const orderServices = require('../services/order.services');

module.exports.processAddCustomerOrder = async (req, res, next) => {
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
      shippingAddr.trim() === ' ' ||
      billingAddr.trim() === ' ' ||
      isNaN(parseInt(totalPrice)) ||
      paymentMethod.trim() === ' ' ||
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
    return res.status(201).send({
      message: 'Order Data added successfully',
      data: '',
    });
  } catch (error) {
    console.error(chalk.red('Error in processAddCustomerOrder: ', error));
    next(error);
  }
};
