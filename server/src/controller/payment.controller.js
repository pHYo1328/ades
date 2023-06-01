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
