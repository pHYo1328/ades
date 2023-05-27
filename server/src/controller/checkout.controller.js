const stripe = require('../config/stripe');
const config = require('../config/config');
const chalk = require('chalk');
const paymentServices = require('../services/payment.services');

exports.getConfig = (req, res) => {
  res.send({
    stripe_publishable_key: config.stripe_publishable_key,
  });
};

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
    res
      .send({
        clientSecret: paymentIntent.client_secret,
      })
      .end();
  } catch (err) {
    console.log(chalk.red('Error in createPaymentIntent', err));
    return res.status(400).send({
      error: {
        message: err.message,
      },
    });
  }
};

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

let endpointSecret;
// endpointSecret = 'whsec_05c75be9817cfda85befac88dc648b626e771f1ace528d4b93d71795b53da0f7';

exports.createWebhooks = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let data;
  let eventType;

  if (endpointSecret) {
    let event;
    console.log(chalk.yellow(sig));
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log('Webhook verified');
      res.status(200).end();
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
    console.log(chalk.yellow('Data: ', data));
    console.log(chalk.yellow('Event Type: ', eventType));
  }
  //handle the event
  if (eventType === 'charge.succeeded') {
    const {
      payment_intent,
      status,
      amount,
      payment_method_details,
      billing_details,
      metadata,
    } = data;
    const { line1, line2, state, postal_code } = billing_details.address;
    const shippingAddr = `${line1} ${
      line2 ? line2 + ' ' : ''
    }${state} ${postal_code}`;

    console.log('Charge succeeded. Event data:');
    console.log('ID:', payment_intent);
    console.log('Status:', status);
    const total = (amount * 0.01).toFixed(2);
    console.log('Amount:', total);
    console.log('Payment method:', payment_method_details.type);
    console.log('Order ID:', metadata.order_id);
    console.log('Shipping address:', shippingAddr);
    try {
      await paymentServices.addPayment(
        payment_intent,
        status,
        total,
        payment_method_details.type,
        shippingAddr,
        metadata.order_id
      );

      console.log('Payment details stored in the database successfully');
    } catch (error) {
      console.error('Error storing payment details in the database:', error);
    }
  } else if (eventType == 'charge.refund.updated') {
    const { id, status, amount, metadata } = data;

    console.log('Payment refunded. Event data:');
    console.log('ID:', id);
    console.log('Status:', status);
    const total = (amount * 0.01).toFixed(2);
    console.log('Amount:', total);
    console.log('Order ID:', metadata.order_id);

    try {
      await paymentServices.addRefund(id, metadata.order_id, total, status);
      console.log('Refund details stored in the database successfully');
    } catch (error) {
      console.error('Error storing refund details in the database:', error);
    }
  }

  res.send().end();
};
