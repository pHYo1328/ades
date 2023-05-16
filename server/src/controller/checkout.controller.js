const stripe = require("../config/stripe");
const config = require("../config/config");
const chalk = require("chalk");

exports.getConfig = (req, res) => {
  res.send({
    stripe_publishable_key: config.stripe_publishable_key,
  });
};

exports.createPaymentIntent = async (req, res) => {
  console.log(chalk.blue("create payment intent"));
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "SGD",
      amount: 1999,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    console.log(chalk.red("Error is createPaymentIntent",e))
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
};
