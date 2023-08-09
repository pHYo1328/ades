'use strict';

// const stripe = require('../config/stripe');
// const config = require('../config/config');
// const chalk = require('chalk');
// const paymentServices = require('../services/payment.services');
// exports.getConfig = (req, res) => {
//   res.send({
//     stripe_publishable_key: config.stripe_publishable_key,
//   });
// };
// //creating the payment intent with stripe
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
//       currency: 'SGD',
//       amount: paymentTotal,
//       automatic_payment_methods: { enabled: true },
//       metadata: {
//         order_id: orderID,
//       },
//     });
//     // Send publishable key and PaymentIntent details to client
//     res
//       .send({
//         clientSecret: paymentIntent.client_secret,
//       })
//       .end();
//   } catch (err) {
//     console.log(chalk.red('Error in createPaymentIntent', err));
//     return res.status(400).send({
//       error: {
//         message: err.message,
//       },
//     });
//   }
// };
// //processing refund
// exports.processRefund = async (req, res) => {
//   console.log(chalk.blue('refund'));
//   try {
//     const orderID = req.params.orderID;
//     const transactionID = await paymentServices.getPaymentIntentByID(orderID);
//     console.log(chalk.yellow('Transaction_id:', transactionID));
//     // Extract the payment intent ID from the transactionID object
//     const paymentIntentID = transactionID[0].transaction_id;
//     const createdPaymentTotal = await paymentServices.getPaymentTotal(orderID);
//     console.log(chalk.yellow('createdPaymentTotal:', createdPaymentTotal));
//     const refundAmount = parseInt(createdPaymentTotal[0].payment_total * 100);
//     console.log(chalk.yellow('refundTotal:', refundAmount));
//     const refund = await stripe.refunds.create({
//       payment_intent: paymentIntentID, // Use the extracted payment intent ID
//       amount: refundAmount,
//       metadata: {
//         order_id: orderID,
//       },
//     });
//     res.send({
//       refundId: refund.id,
//       amountRefunded: refund.amount,
//       currency: refund.currency,
//       status: refund.status,
//     });
//   } catch (error) {
//     console.error('Error processing refund:', error);
//     return res.status(500).send({
//       error: {
//         message: 'An error occurred while processing the refund.',
//       },
//     });
//   }
// };
// //processing partial refund
// exports.processPartialRefund = async (req, res) => {
//   console.log(chalk.blue('partial refund'));
//   try {
//     const productID = req.params.productID;
//     // Retrieve transaction IDs and refund amounts for orders with the given productID
//     const idAndAmount = await paymentServices.getIdAndAmount(productID);
//     // Process partial refunds for each order
//     const refundPromises = idAndAmount.map(async (row) => {
//       const transactionID = row.transaction_id;
//       const refundAmount = parseInt(Math.round(row.refund_total * 100));
//       try {
//         // Process the refund using Stripe
//         const refund = await stripe.refunds.create({
//           payment_intent: transactionID,
//           amount: refundAmount,
//           metadata: {
//             order_id: row.order_id,
//           },
//         });
//         // Return the refund details
//         return {
//           orderID: row.order_id,
//           refundId: refund.id,
//           amountRefunded: refund.amount,
//           currency: refund.currency,
//           status: refund.status,
//         };
//       } catch (error) {
//         console.error(chalk.red('Error processing refund: ', error));
//         // If there was an error processing the refund, you can handle it here
//         // For example, you can log the error, return an error response, etc.
//         return {
//           orderID: row.order_id,
//           error: error.message,
//         };
//       }
//     });
//     // Wait for all refund promises to resolve
//     const refundResults = await Promise.all(refundPromises);
//     // Return the refund results
//     return res.status(200).json({
//       statusCode: 200,
//       ok: true,
//       message: 'Partial refunds processed successfully',
//       refundResults,
//     });
//   } catch (error) {
//     console.error(chalk.red('Error in processPartialRefund: ', error));
//     // Handle any errors that occurred during the refund process
//     // For example, you can return an error response here
//     return res.status(500).json({
//       statusCode: 500,
//       ok: false,
//       message: 'An error occurred during partial refunds',
//       error: error.message,
//     });
//   }
// };
// let endpointSecret;
// //creating webhook for getting data inside inside database
// exports.createWebhooks = async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   let data;
//   let eventType;
//   if (endpointSecret) {
//     let event;
//     console.log(chalk.yellow(sig));
//     try {
//       event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//       console.log('Webhook verified');
//       res.status(200).end();
//     } catch (err) {
//       console.log(`Webhook Error: ${err.message}`);
//       res.status(400).send(`Webhook Error: ${err.message}`);
//       return;
//     }
//     data = event.data.object;
//     eventType = event.type;
//   } else {
//     data = req.body.data.object;
//     eventType = req.body.type;
//     console.log(chalk.yellow('Data: ', data));
//     console.log(chalk.yellow('Event Type: ', eventType));
//   }
//   //handle the event
//   if (eventType === 'charge.succeeded') {
//     const {
//       payment_intent,
//       status,
//       amount,
//       payment_method_details,
//       billing_details,
//       metadata,
//     } = data;
//     const { line1, line2, state, postal_code } = billing_details.address;
//     const shippingAddr = `${line1} ${
//       line2 ? line2 + ' ' : ''
//     }${state} ${postal_code}`;
//     console.log('Charge succeeded. Event data:');
//     console.log('ID:', payment_intent);
//     console.log('Status:', status);
//     const total = (amount * 0.01).toFixed(2);
//     console.log('Amount:', total);
//     console.log('Payment method:', payment_method_details.type);
//     console.log('Order ID:', metadata.order_id);
//     console.log('Shipping address:', shippingAddr);
//     try {
//       await paymentServices.addPayment(
//         payment_intent,
//         status,
//         total,
//         payment_method_details.type,
//         shippingAddr,
//         metadata.order_id
//       );
//       console.log('Payment details stored in the database successfully');
//     } catch (error) {
//       console.error('Error storing payment details in the database:', error);
//     }
//   } else if (eventType == 'charge.refunded') {
//     const { id, status, amount, amount_refunded, metadata } = data;
//     console.log('Payment refunded. Event data:');
//     console.log('ID:', id);
//     console.log('Status:', status);
//     const total = (amount * 0.01).toFixed(2);
//     const refund_total = (amount_refunded * 0.01).toFixed(2);
//     console.log('Amount:', total);
//     console.log('Order ID:', metadata.order_id);
//     let refundStatus;
//     if (amount_refunded < amount) {
//       refundStatus = 'partially Refunded';
//       try {
//         await paymentServices.addPartialRefund(
//           id,
//           metadata.order_id,
//           refund_total,
//           refundStatus
//         );
//         console.log('Refund details stored in the database successfully');
//       } catch (error) {
//         console.error('Error storing refund details in the database:', error);
//       }
//     } else {
//       refundStatus = 'fully Refunded';
//       try {
//         await paymentServices.addRefund(
//           id,
//           metadata.order_id,
//           total,
//           refundStatus
//         );
//         console.log('Refund details stored in the database successfully');
//       } catch (error) {
//         console.error('Error storing refund details in the database:', error);
//       }
//     }
//   }
//   res.send().end();
// };
var stripe = require('../config/stripe');

var config = require('../config/config');

var chalk = require('chalk');

var paymentServices = require('../services/payment.services');

exports.getConfig = function (req, res) {
  res.send({
    stripe_publishable_key: config.stripe_publishable_key,
  });
}; //creating the payment intent with stripe

exports.createPaymentIntent = function _callee(req, res) {
  var orderID, createdPaymentTotal, paymentTotal, paymentIntent;
  return regeneratorRuntime.async(
    function _callee$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            console.log(chalk.blue('create payment intent'));
            _context.prev = 1;
            orderID = req.params.orderID; // Get the orderID from the request parameters
            // Call the getPaymentTotal function from payment.services to fetch the payment_total

            _context.next = 5;
            return regeneratorRuntime.awrap(
              paymentServices.getPaymentTotal(orderID)
            );

          case 5:
            createdPaymentTotal = _context.sent;
            console.log(
              chalk.yellow('createdPaymentTotal:', createdPaymentTotal)
            );
            paymentTotal = parseInt(createdPaymentTotal[0].payment_total * 100);
            console.log(chalk.yellow('paymentTotal:', paymentTotal));

            if (!isNaN(paymentTotal)) {
              _context.next = 11;
              break;
            }

            throw new Error('Invalid payment total');

          case 11:
            _context.next = 13;
            return regeneratorRuntime.awrap(
              stripe.paymentIntents.create({
                currency: 'SGD',
                amount: paymentTotal,
                automatic_payment_methods: {
                  enabled: true,
                },
                metadata: {
                  order_id: orderID,
                },
              })
            );

          case 13:
            paymentIntent = _context.sent;
            // Send publishable key and PaymentIntent details to client
            res.json({
              clientSecret: paymentIntent.client_secret,
            });
            _context.next = 21;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context['catch'](1);
            console.log(chalk.red('Error in createPaymentIntent', _context.t0));
            return _context.abrupt(
              'return',
              res.status(400).send({
                error: {
                  message: _context.t0.message,
                },
              })
            );

          case 21:
          case 'end':
            return _context.stop();
        }
      }
    },
    null,
    null,
    [[1, 17]]
  );
}; //processing refund

exports.processRefund = function _callee2(req, res) {
  var orderID,
    transactionID,
    paymentIntentID,
    createdPaymentTotal,
    refundAmount,
    refund;
  return regeneratorRuntime.async(
    function _callee2$(_context2) {
      while (1) {
        switch ((_context2.prev = _context2.next)) {
          case 0:
            console.log(chalk.blue('refund'));
            _context2.prev = 1;
            orderID = req.params.orderID;
            _context2.next = 5;
            return regeneratorRuntime.awrap(
              paymentServices.getPaymentIntentByID(orderID)
            );

          case 5:
            transactionID = _context2.sent;
            console.log(chalk.yellow('Transaction_id:', transactionID)); // Extract the payment intent ID from the transactionID object

            paymentIntentID = transactionID[0].transaction_id;
            _context2.next = 10;
            return regeneratorRuntime.awrap(
              paymentServices.getPaymentTotal(orderID)
            );

          case 10:
            createdPaymentTotal = _context2.sent;
            console.log(
              chalk.yellow('createdPaymentTotal:', createdPaymentTotal)
            );
            refundAmount = parseInt(createdPaymentTotal[0].payment_total * 100);
            console.log(chalk.yellow('refundTotal:', refundAmount));
            _context2.next = 16;
            return regeneratorRuntime.awrap(
              stripe.refunds.create({
                payment_intent: paymentIntentID,
                // Use the extracted payment intent ID
                amount: refundAmount,
                metadata: {
                  order_id: orderID,
                },
              })
            );

          case 16:
            refund = _context2.sent;
            res.send({
              refundId: refund.id,
              amountRefunded: refund.amount,
              currency: refund.currency,
              status: refund.status,
            });
            _context2.next = 24;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2['catch'](1);
            console.error('Error processing refund:', _context2.t0);
            return _context2.abrupt(
              'return',
              res.status(500).send({
                error: {
                  message: 'An error occurred while processing the refund.',
                },
              })
            );

          case 24:
          case 'end':
            return _context2.stop();
        }
      }
    },
    null,
    null,
    [[1, 20]]
  );
}; //processing partial refund

exports.processPartialRefund = function _callee4(req, res) {
  var productID, idAndAmount, refundPromises, refundResults;
  return regeneratorRuntime.async(
    function _callee4$(_context4) {
      while (1) {
        switch ((_context4.prev = _context4.next)) {
          case 0:
            console.log(chalk.blue('partial refund'));
            _context4.prev = 1;
            productID = req.params.productID; // Retrieve transaction IDs and refund amounts for orders with the given productID

            _context4.next = 5;
            return regeneratorRuntime.awrap(
              paymentServices.getIdAndAmount(productID)
            );

          case 5:
            idAndAmount = _context4.sent;
            // Process partial refunds for each order
            refundPromises = idAndAmount.map(function _callee3(row) {
              var transactionID, refundAmount, refund;
              return regeneratorRuntime.async(
                function _callee3$(_context3) {
                  while (1) {
                    switch ((_context3.prev = _context3.next)) {
                      case 0:
                        transactionID = row.transaction_id;
                        refundAmount = parseInt(
                          Math.round(row.refund_total * 100)
                        );
                        _context3.prev = 2;
                        _context3.next = 5;
                        return regeneratorRuntime.awrap(
                          stripe.refunds.create({
                            payment_intent: transactionID,
                            amount: refundAmount,
                            metadata: {
                              order_id: row.order_id,
                            },
                          })
                        );

                      case 5:
                        refund = _context3.sent;
                        return _context3.abrupt('return', {
                          orderID: row.order_id,
                          refundId: refund.id,
                          amountRefunded: refund.amount,
                          currency: refund.currency,
                          status: refund.status,
                        });

                      case 9:
                        _context3.prev = 9;
                        _context3.t0 = _context3['catch'](2);
                        console.error(
                          chalk.red('Error processing refund: ', _context3.t0)
                        ); // If there was an error processing the refund, you can handle it here
                        // For example, you can log the error, return an error response, etc.

                        return _context3.abrupt('return', {
                          orderID: row.order_id,
                          error: _context3.t0.message,
                        });

                      case 13:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                },
                null,
                null,
                [[2, 9]]
              );
            }); // Wait for all refund promises to resolve

            _context4.next = 9;
            return regeneratorRuntime.awrap(Promise.all(refundPromises));

          case 9:
            refundResults = _context4.sent;
            return _context4.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Partial refunds processed successfully',
                refundResults: refundResults,
              })
            );

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4['catch'](1);
            console.error(
              chalk.red('Error in processPartialRefund: ', _context4.t0)
            ); // Handle any errors that occurred during the refund process
            // For example, you can return an error response here

            return _context4.abrupt(
              'return',
              res.status(500).json({
                statusCode: 500,
                ok: false,
                message: 'An error occurred during partial refunds',
                error: _context4.t0.message,
              })
            );

          case 17:
          case 'end':
            return _context4.stop();
        }
      }
    },
    null,
    null,
    [[1, 13]]
  );
}; //store payment inside database

exports.storePayment = function _callee5(req, res) {
  var requestData,
    paymentIntentData,
    orderID,
    id,
    status,
    amount,
    shipping,
    _shipping$address,
    line1,
    line2,
    state,
    postal_code,
    shippingAddr,
    total;

  return regeneratorRuntime.async(
    function _callee5$(_context5) {
      while (1) {
        switch ((_context5.prev = _context5.next)) {
          case 0:
            requestData = req.body; // Access the paymentIntent data from the requestData object

            paymentIntentData = requestData.paymentIntent;
            orderID = requestData.orderID; // Access the orderID

            console.log('PaymentIntent data:', paymentIntentData);
            console.log('Order ID:', orderID);
            (id = paymentIntentData.id),
              (status = paymentIntentData.status),
              (amount = paymentIntentData.amount),
              (shipping = paymentIntentData.shipping);
            (_shipping$address = shipping.address),
              (line1 = _shipping$address.line1),
              (line2 = _shipping$address.line2),
              (state = _shipping$address.state),
              (postal_code = _shipping$address.postal_code);
            shippingAddr = ''
              .concat(line1, ' ')
              .concat(line2 ? line2 + ' ' : '')
              .concat(state, ' ')
              .concat(postal_code);
            console.log('Charge succeeded. Event data:');
            console.log('ID:', id);
            console.log('Status:', status);
            total = (amount * 0.01).toFixed(2);
            console.log('Amount:', total);
            console.log('Order ID:', orderID);
            console.log('Shipping address:', shippingAddr);
            _context5.prev = 15;
            _context5.next = 18;
            return regeneratorRuntime.awrap(
              paymentServices.addPayment(
                id,
                status,
                total,
                shippingAddr,
                orderID
              )
            );

          case 18:
            console.log('Payment details stored in the database successfully');
            _context5.next = 24;
            break;

          case 21:
            _context5.prev = 21;
            _context5.t0 = _context5['catch'](15);
            console.error(
              'Error storing payment details in the database:',
              _context5.t0
            );

          case 24:
          case 'end':
            return _context5.stop();
        }
      }
    },
    null,
    null,
    [[15, 21]]
  );
};
