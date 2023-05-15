const stripe = require('../config/stripe');
const config = require('../config/config');

exports.getConfig = (req, res) => {
  res.send({
    stripe_publishable_key: config.stripe_publishable_key,
  });
};

exports.createPaymentIntent = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: 'EUR',
      amount: 1999,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
};
