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

//get all payment which haven't done delivery

exports.processGetListsByDeliStatus = async (req, res, next) => {
  console.log(chalk.blue('processGetListsByDeliStatus running'));

  try {
    const deliveryData = await paymentServices.getListsByDeliStatus();

    if (deliveryData) {
      console.log(chalk.yellow('Payment data: ', deliveryData));

      return res.status(200).json({
        statusCode: 200,
        ok: true,
        message: "orders haven't started the delivery yet",
        deliveryData,
      });
    }
  } catch (error) {
    console.error(chalk.red('Error in getPaymentByID: ', error));
    return next(error);
  }
};

//updating delivery_status

exports.processUpdateDeliByID = async (req, res, next) => {
  console.log(chalk.blue('processUpdateDeliByID running'));
  const { paymentID } = req.params;
  const { delivery_status } = req.body;

  try {
    if (isNaN(parseInt(paymentID))) {
      const error = new Error('invalid orderID');
      error.status = 400;
      throw error;
    }
    const updateDeliveryStatus = await paymentServices.updateDeliByID(
      delivery_status,
      paymentID
    );

    if (!updateDeliveryStatus) {
      const error = new Error('No order exists');
      error.status = 404;
      throw error;
    }
    if (updateDeliveryStatus) {
      console.log(chalk.yellow('Delivery data: ', updateDeliveryStatus));

      return res.status(200).json({
        statusCode: 200,
        ok: true,
        message: 'Update delivery status successful',
        updateDeliveryStatus,
      });
    }
  } catch (error) {
    console.error(chalk.red('Error in updateDeliByID: ', error));
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

    const createdPaymentTotal = await paymentServices.getPaymentTotal(orderID);
    if (!createdPaymentTotal || createdPaymentTotal[0].payment_total === null) {
      const error = new Error('No payment exists');
      error.status = 404;
      throw error;
    }

    console.log(chalk.yellow('Payment_total data: ', createdPaymentTotal));

    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Read payment total successful',
      createdPaymentTotal,
    });
  } catch (error) {
    console.error(chalk.red('Error in getPaymentTotal: ', error));
    return next(error);
  }
};
