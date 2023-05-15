const chalk = require('chalk');
const config = require('./config');
console.log(chalk.green(config.stripe_secret_key));
const stripe = require('stripe')(`${config.stripe_secret_key}`, {
    apiVersion: "2022-11-15",
  } );


module.exports = stripe;