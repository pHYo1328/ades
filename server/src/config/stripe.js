const config = require('./config');

const stripe = require('stripe')(`${config.stripe_secret_key}`, {
  apiVersion: '2022-11-15',
});

module.exports = stripe;
