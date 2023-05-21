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
    const paymentTotal = parseInt(createdPaymentTotal[0].payment_total * 100); // Convert to an integer
    console.log(chalk.yellow('paymentTotal:', paymentTotal));
    if (isNaN(paymentTotal)) {
      throw new Error('Invalid payment total');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      currency: 'SGD',
      amount: paymentTotal,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    console.log(chalk.red('Error is createPaymentIntent', e));
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
};
