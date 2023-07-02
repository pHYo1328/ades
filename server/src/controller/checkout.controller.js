const stripe = require('../config/stripe');
const config = require('../config/config');
const chalk = require('chalk');
const paymentServices = require('../services/payment.services');

exports.getConfig = (req, res) => {
  res.send({
    stripe_publishable_key: config.stripe_publishable_key,
  });
};

// exports.createPaymentIntent = async (req, res) => {
//   console.log(chalk.blue('create payment intent'));
//   try {
//     const orderID = req.params.orderID; // Get the orderID from the request parameters

//     // Call the getPaymentTotal function from payment.services to fetch the payment_total
//     const createdPaymentTotal = await paymentServices.getPaymentTotal(orderID);
//     console.log(chalk.yellow('createdPaymentTotal:', createdPaymentTotal));
//     const paymentTotal = parseInt(createdPaymentTotal[0].payment_total * 100);
//     console.log(chalk.yellow('paymentTotal:', paymentTotal));
//     if (isNaN(paymentTotal)) {
//       throw new Error('Invalid payment total');
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: paymentTotal,
//       currency: 'sgd',
//       automatic_payment_methods: { enabled: true },
//       metadata: {
//         order_id: orderID,
//       },
//     });

//     // Send clientSecret and PaymentIntent details to client
//     res.json({
//       clientSecret: paymentIntent.client_secret,
//       id: paymentIntent.id,
//     });
//   } catch (err) {
//     console.log(chalk.red('Error in createPaymentIntent', err));
//     res.status(400).json({
//       error: {
//         message: err.message,
//       },
//     });
//   }
// };

// exports.handleChargeSucceeded = async (event) => {
//   const {
//     id: paymentIntentId,
//     status,
//     amount,
//     payment_method_details,
//     billing_details,
//     metadata,
//   } = event.data.object;
//   const { line1, line2, state, postal_code } = billing_details.address;
//   const shippingAddr = `${line1} ${line2 ? line2 + ' ' : ''}${state} ${postal_code}`;

//   console.log('Charge succeeded. Event data:');
//   console.log('ID:', paymentIntentId);
//   console.log('Status:', status);
//   const total = (amount / 100).toFixed(2);
//   console.log('Amount:', total);
//   console.log('Payment method:', payment_method_details.type);
//   console.log('Order ID:', metadata.order_id);
//   console.log('Shipping address:', shippingAddr);

//   try {
//     await paymentServices.addPayment(
//       paymentIntentId,
//       status,
//       total,
//       payment_method_details.type,
//       shippingAddr,
//       metadata.order_id
//     );

//     console.log('Payment details stored in the database successfully');
//   } catch (error) {
//     console.error('Error storing payment details in the database:', error);
//   }
// };




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

    // Process partial refunds for each order
    const refundPromises = idAndAmount.map(async (row) => {
      const transactionID = row.transaction_id;
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
        // If there was an error processing the refund, you can handle it here
        // For example, you can log the error, return an error response, etc.
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
    // Handle any errors that occurred during the refund process
    // For example, you can return an error response here
    return res.status(500).json({
      statusCode: 500,
      ok: false,
      message: 'An error occurred during partial refunds',
      error: error.message,
    });
  }
};

let endpointSecret;

// const createWebhookEndpoint = async () => {
//   const endpoint = await stripe.webhookEndpoints.create({
//     url: 'https://techzero-v3-1.onrender.com/webhook',
//     enabled_events: ['charge.refunded', 'charge.succeeded'],
//   });
//   console.log('Webhook endpoint created:', endpoint);
// };

// Call the function to create the webhook endpoint
// createWebhookEndpoint()
//   .then(() => {
//     console.log('Webhook endpoint created successfully');
//   })
//   .catch((error) => {
//     console.error('Error creating webhook endpoint:', error);
//   });

//creating webhook for getting data inside inside database
exports.handleWebhooks = async (req, res) => {
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
  } else if (eventType == 'charge.refunded') {
    const { id, status, amount, amount_refunded, metadata } = data;

    console.log('Payment refunded. Event data:');
    console.log('ID:', id);
    console.log('Status:', status);
    const total = (amount * 0.01).toFixed(2);
    const refund_total = (amount_refunded * 0.01).toFixed(2);
    console.log('Amount:', total);
    console.log('Order ID:', metadata.order_id);

    let refundStatus;
    if (amount_refunded < amount) {
      refundStatus = 'partially Refunded';
      try {
        await paymentServices.addPartialRefund(
          id,
          metadata.order_id,
          refund_total,
          refundStatus
        );
        console.log('Refund details stored in the database successfully');
      } catch (error) {
        console.error('Error storing refund details in the database:', error);
      }
    } else {
      refundStatus = 'fully Refunded';
      try {
        await paymentServices.addRefund(
          id,
          metadata.order_id,
          total,
          refundStatus
        );
        console.log('Refund details stored in the database successfully');
      } catch (error) {
        console.error('Error storing refund details in the database:', error);
      }
    }
  }
 
  res.send().end();
};

