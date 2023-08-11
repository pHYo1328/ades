const stripe = require('../config/stripe');
const config = require('../config/config');
const chalk = require('chalk');
const paymentServices = require('../services/payment.services');

//get config for paymentIntent
exports.getConfig = (req, res) => {
  res.send({
    stripe_publishable_key: config.stripe_publishable_key,
  });
};

//creating the payment intent with stripe
exports.createPaymentIntent = async (req, res) => {
  console.log(chalk.blue('create payment intent'));
  try {
    const orderID = req.params.orderID; // Get the orderID from the request parameters

    // Call the getPaymentTotal function from payment.services to fetch the payment_total

    const createdPaymentTotal = await paymentServices.getPaymentTotal(orderID);
    console.log(chalk.yellow('createdPaymentTotal:', createdPaymentTotal));
    const paymentTotal = parseInt(createdPaymentTotal[0].payment_total * 100);
    console.log(chalk.yellow('paymentTotal:', paymentTotal));
    if (isNaN(paymentTotal)) {
      throw new Error('Invalid payment total');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      currency: 'SGD',
      amount: paymentTotal,
      automatic_payment_methods: { enabled: true },
      metadata: {
        order_id: orderID,
      },
    });

    // Send publishable key and PaymentIntent details to client
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.log(chalk.red('Error in createPaymentIntent', err));
    return res.status(400).send({
      error: {
        message: err.message,
      },
    });
  }
};

//processing refund
exports.processRefund = async (req, res) => {
  console.log(chalk.blue('refund'));
  try {
    const orderID = req.params.orderID;
    const transactionID = await paymentServices.getPaymentIntentByID(orderID);
    console.log(chalk.yellow('Transaction_id:', transactionID));

    // Extract the payment intent ID from the transactionID object
    const paymentIntentID = transactionID[0].transaction_id;

    const createdPaymentTotal = await paymentServices.getPaymentTotal(orderID);
    console.log(chalk.yellow('createdPaymentTotal:', createdPaymentTotal));
    const refundAmount = parseInt(createdPaymentTotal[0].payment_total * 100);
    console.log(chalk.yellow('refundTotal:', refundAmount));

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentID, // Use the extracted payment intent ID
      amount: refundAmount,
      metadata: {
        order_id: orderID,
      },
    });

    res.send({
      refundId: refund.id,
      amountRefunded: refund.amount,
      currency: refund.currency,
      status: refund.status,
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    return res.status(500).send({
      error: {
        message: 'An error occurred while processing the refund.',
      },
    });
  }
};

//processing partial refund
exports.processPartialRefund = async (req, res) => {
  console.log(chalk.blue('partial refund'));
  try {
    const productID = req.params.productID;
    // Retrieve transaction IDs and refund amounts for orders with the given productID
    const idAndAmount = await paymentServices.getIdAndAmount(productID);

    console.log(idAndAmount);
    // Process partial refunds for each order
    const refundPromises = idAndAmount.map(async (row) => {
      const transactionID = row.transaction_id;
      const orderID = row.order_id;
      const customerID = row.customer_id;
      const refundAmount = parseInt(Math.round(row.refund_total * 100));

      try {
        // Process the refund using Stripe
        const refund = await stripe.refunds.create({
          payment_intent: transactionID,
          amount: refundAmount,
          metadata: {
            order_id: row.order_id,
          },
        });

        // Log the refund details
        console.log('Refund details:', {
          orderId: orderID,
          refundId: refund.id,
          amountRefunded: refund.amount,
          currency: refund.currency,
          status: refund.status,
        });

        if (refund.status === 'succeeded') {
          // Call addPartialRefund for the current order
          await paymentServices.addPartialRefund(
            orderID,
            customerID,
            refund.amount / 100,
            'refunded'
          );
        }
        // Return the refund details
        return {
          orderID: row.order_id,
          refundId: refund.id,
          amountRefunded: refund.amount,
          currency: refund.currency,
          status: refund.status,
        };
      } catch (error) {
        console.error(chalk.red('Error processing refund: ', error));
        return {
          orderID: row.order_id,
          error: error.message,
        };
      }
    });

    // Wait for all refund promises to resolve
    const refundResults = await Promise.all(refundPromises);

    // Return the refund results
    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Partial refunds processed successfully',
      refundResults,
    });
  } catch (error) {
    console.error(chalk.red('Error in processPartialRefund: ', error));
    
    return res.status(500).json({
      statusCode: 500,
      ok: false,
      message: 'An error occurred during partial refunds',
      error: error.message,
    });
  }
};
//cancel order at delivering stage
exports.cancelRefund = async (req, res) => {
  console.log(chalk.blue('cancel refund'));
  try {
    const customerID = req.body.customerID; // Access the customerID from the request body

    const orderID = req.params.orderID;
    const transactionID = await paymentServices.getPaymentIntentByID(orderID);
    console.log(chalk.yellow('Transaction_id:', transactionID));

    // Extract the payment intent ID from the transactionID object
    const paymentIntentID = transactionID[0].transaction_id;

    const createdPaymentTotal = await paymentServices.getPaymentTotal(orderID);
    console.log(chalk.yellow('createdPaymentTotal:', createdPaymentTotal));
    const refundAmount = parseInt(createdPaymentTotal[0].payment_total * 100);
    console.log(chalk.yellow('refundTotal:', refundAmount));

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentID, // Use the extracted payment intent ID
      amount: refundAmount,
      metadata: {
        order_id: orderID,
      },
    });

    if (refund.status === 'succeeded') {
      // Call addPartialRefund for the current order
      await paymentServices.cancelOrder(
        orderID,
        customerID,
        refund.amount / 100,
        'refunded'
      );
    }

    res.send({
      refundId: refund.id,
      amountRefunded: refund.amount,
      currency: refund.currency,
      status: refund.status,
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    return res.status(500).send({
      error: {
        message: 'An error occurred while processing the refund.',
      },
    });
  }
};

//store payment inside database
exports.storePayment = async (req, res, next) => {
  const requestData = req.body;

  // Access the paymentIntent data from the requestData object
  const paymentIntentData = requestData.paymentIntent;
  const orderID = requestData.orderID; // Access the orderID

  console.log('PaymentIntent data:', paymentIntentData);
  console.log('Order ID:', orderID);

  const { id, status, amount, shipping } = paymentIntentData;
  const { line1, line2, state, postal_code } = shipping.address;
  const shippingAddr = `${line1} ${
    line2 ? line2 + ' ' : ''
  }${state} ${postal_code}`;
  const total = (amount * 0.01).toFixed(2);
  if (
    id == '' ||
    !id ||
    status == '' ||
    !status ||
    amount == '' ||
    !amount ||
    total == '' ||
    !total ||
    orderID == '' ||
    !orderID ||
    shippingAddr == '' ||
    !shippingAddr
  ) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Payment data is missing',
    });
  }

  console.log('Charge succeeded. Event data:');
  console.log('ID:', id);
  console.log('Status:', status);

  console.log('Amount:', total);
  console.log('Order ID:', orderID);
  console.log('Shipping address:', shippingAddr);

  try {
    const createPaymentData = await paymentServices.addPayment(
      id,
      status,
      total,
      shippingAddr,
      orderID
    );

    console.log(chalk.yellow(createPaymentData));
    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Storing payment details is successful',
    });
  } catch (error) {
    console.error(chalk.red(error.code));
    console.error(
      chalk.red('Error storing payment details in the database: ', error)
    );
    return next(error);
  }
};
