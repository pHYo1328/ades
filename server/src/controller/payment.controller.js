const chalk = require('chalk');
const paymentServices = require('../services/payment.services');

//Get payment by ID
exports.processGetPaymentByID = async (req, res, next) => {
  console.log(chalk.blue('processGetPaymentByID running'));

  const { orderID } = req.params;

  try {
    if (!orderID) {
      const error = new Error('invalid orderID');
      error.status = 400;
      throw error;
    }
    const paymentData = await paymentServices.getPaymentByID(orderID);
    if (paymentData.length == 0) {
      const error = new Error('No order exists');
      error.status = 404;
      throw error;
    }
    if (paymentData) {
      console.log(chalk.yellow('Order data: ', paymentData));
      const payments = paymentData.map((payment) => ({
        product_name: payment.product_name,
        price: payment.price,
        description: payment.description,
        quantity: payment.quantity,
        total_price: payment.total_price,
        shipping_method: payment.shipping_method,
        fee: payment.fee,
        shipping_address: payment.shipping_address,
      }));
      return res.status(200).json({
        statusCode: 200,
        ok: true,
        message: 'Read order details successful',
        data: payments,
      });
    }
  } catch (error) {
    console.error(chalk.red('Error in getPaymentByID: ', error));
    return next(error);
  }
};

//get payment by status(idt i need)

exports.processGetPaymentByStatus = async (req, res, next) => {
  console.log(chalk.blue('processGetPaymentByStatus running'));

  const { orderID } = req.params;

  try {
    if (!orderID) {
      const error = new Error('invalid orderID');
      error.status = 400;
      throw error;
    }
    const paymentData = await paymentServices.getPaymentByStatus(orderID);
    if (paymentData.length == 0) {
      const error = new Error('No order exists');
      error.status = 404;
      throw error;
    }
    if (paymentData) {
      console.log(chalk.yellow('Order data: ', paymentData));
      const payments = paymentData.map((payment) => ({
        product_name: payment.product_name,
        price: payment.price,
        description: payment.description,
        quantity: payment.quantity,
        total_price: payment.total_price,
        shipping_method: payment.shipping_method,
        fee: payment.fee,
        shipping_address: payment.shipping_address,
      }));
      return res.status(200).json({
        statusCode: 200,
        ok: true,
        message: 'Read order details successful',
        data: payments,
      });
    }
  } catch (error) {
    console.error(chalk.red('Error in getPaymentByStatus: ', error));
    return next(error);
  }
};

//payment data

exports.processGetPaymentTotal = async (req, res, next) => {
  console.log(chalk.blue('processGetPaymentTotal running'));
  const { orderID } = req.params;

  try {
    if (!orderID) {
      const error = new Error('invalid orderID');
      error.status = 400;
      throw error;
    }

    const paymentTotal = await paymentServices.getPaymentTotal(orderID);
    if (!paymentTotal || paymentTotal[0].payment_total === null) {
      const error = new Error('No payment exists');
      error.status = 404;
      throw error;
    }

    console.log(chalk.yellow('Payment_total data: ', paymentTotal));

    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Read payment total successful',
      paymentTotal,
    });
  } catch (error) {
    console.error(chalk.red('Error in getPaymentTotal: ', error));
    return next(error);
  }
};
//for partial refund
exports.processGetIDAndAmount = async (req, res, next) => {
  console.log(chalk.blue('processGetIDAndAmount running'));
  const { productID } = req.params;

  try {
    if (!productID) {
      const error = new Error('invalid productID');
      error.status = 400;
      throw error;
    }

    const idAndAmount = await paymentServices.getIdAndAmount(productID);
    if (idAndAmount.length == 0) {
      const error = new Error('No payment exists');
      error.status = 404;
      throw error;
    }

    console.log(chalk.yellow('Payment_total data: ', idAndAmount));

    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Read refund data is successful',
      idAndAmount,
    });
  } catch (error) {
    console.error(chalk.red('Error in getIDAndAmount: ', error));
    return next(error);
  }
};
//add refund
exports.processCreateRefund = async (req, res, next) => {
  console.log(chalk.blue('processCreateRefund running'));
  const { order_id, customer_id, total } = req.body;
  if (
    order_id == '' ||
    !order_id ||
    customer_id == '' ||
    !customer_id ||
    total == '' ||
    !total
  ) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Refund Req data is missing',
    });
  }

  console.log(req.body);

  try {
    const createdRefundReqData = await paymentServices.addRefund(
      order_id,
      customer_id,
      total,
      'pending'
    );
    console.log(chalk.yellow(createdRefundReqData));
    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Create payment req successful',
    });
  } catch (error) {
    console.error(chalk.red(error.code));
    console.error(chalk.red('Error in createRefund: ', error));
    return next(error);
  }
};

exports.processGetOrderForRefund = async (req, res, next) => {
  console.log(chalk.blue('processGetOrderForRefund is running'));
  try {
    const result = await paymentServices.getOrderForRefund();
    console.log(
      chalk.yellow(
        'Inspect result variable from getOrderForRefund service',
        result
      )
    );
    return res.status(200).send({
      message: 'refund req found',
      data: result,
    });
  } catch (error) {
    console.error(chalk.red('Error in processGetOrderForRefund: ', error));
    next(error);
  }
};
//getting status for customer profile
exports.processGetRefundStatusByID = async (req, res, next) => {
  console.log(chalk.blue('processGetRefundStatusByID is running'));
  try {
    const {orderID}  = req.params; // Assuming the order_id is part of the URL
    const result = await paymentServices.getRefundStatusByID(orderID); // Pass the order_id to the function
    console.log(
      chalk.yellow(
        'Inspect result variable from getRefundStatusByID service',
        result
      )
    );
    return res.status(200).send({
      message: 'status found',
      data: result,
    });
  } catch (error) {
    console.error(chalk.red('Error in processGetRefundStatusByID: ', error));
    next(error);
  }
};


// update refund after click "click to refund"
exports.processUpdateRefundStatus = async (req, res, next) => {
  console.log(chalk.blue('ProcessUpdateRefundStatus is running'));
  const { orderIDs, refundStatus } = req.body;
  try {
    if (!orderIDs || !refundStatus) {
      const error = new Error('Invalid Information parameters');
      error.status = 400;
      throw error;
    }

    const data = { orderIDs, refundStatus };
    const result = await paymentServices.updateRefundStatus(data);
    console.log(
      chalk.yellow(
        'Inspect result variable from updateRefundStatus service',
        result
      )
    );
    return res.status(200).send({
      message: 'Refund Status updated successfully',
      data: result,
    });
  } catch (error) {
    console.error(chalk.red('Error in processUpdateOrderStatus: ', error));
    next(error);
  }
};


