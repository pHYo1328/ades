'use strict';

var chalk = require('chalk');

var paymentServices = require('../services/payment.services'); //Get payment by ID

exports.processGetPaymentByID = function _callee(req, res, next) {
  var orderID, error, paymentData, _error, payments;

  return regeneratorRuntime.async(
    function _callee$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            console.log(chalk.blue('processGetPaymentByID running'));
            orderID = req.params.orderID;
            _context.prev = 2;

            if (orderID) {
              _context.next = 7;
              break;
            }

            error = new Error('invalid orderID');
            error.status = 400;
            throw error;

          case 7:
            _context.next = 9;
            return regeneratorRuntime.awrap(
              paymentServices.getPaymentByID(orderID)
            );

          case 9:
            paymentData = _context.sent;

            if (!(paymentData.length == 0)) {
              _context.next = 14;
              break;
            }

            _error = new Error('No order exists');
            _error.status = 404;
            throw _error;

          case 14:
            if (!paymentData) {
              _context.next = 18;
              break;
            }

            console.log(chalk.yellow('Order data: ', paymentData));
            payments = paymentData.map(function (payment) {
              return {
                product_name: payment.product_name,
                price: payment.price,
                description: payment.description,
                quantity: payment.quantity,
                total_price: payment.total_price,
                shipping_method: payment.shipping_method,
                fee: payment.fee,
                shipping_address: payment.shipping_address,
              };
            });
            return _context.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read order details successful',
                data: payments,
              })
            );

          case 18:
            _context.next = 24;
            break;

          case 20:
            _context.prev = 20;
            _context.t0 = _context['catch'](2);
            console.error(chalk.red('Error in getPaymentByID: ', _context.t0));
            return _context.abrupt('return', next(_context.t0));

          case 24:
          case 'end':
            return _context.stop();
        }
      }
    },
    null,
    null,
    [[2, 20]]
  );
}; //get payment by status

exports.processGetPaymentByStatus = function _callee2(req, res, next) {
  var orderID, error, paymentData, _error2, payments;

  return regeneratorRuntime.async(
    function _callee2$(_context2) {
      while (1) {
        switch ((_context2.prev = _context2.next)) {
          case 0:
            console.log(chalk.blue('processGetPaymentByStatus running'));
            orderID = req.params.orderID;
            _context2.prev = 2;

            if (orderID) {
              _context2.next = 7;
              break;
            }

            error = new Error('invalid orderID');
            error.status = 400;
            throw error;

          case 7:
            _context2.next = 9;
            return regeneratorRuntime.awrap(
              paymentServices.getPaymentByStatus(orderID)
            );

          case 9:
            paymentData = _context2.sent;

            if (!(paymentData.length == 0)) {
              _context2.next = 14;
              break;
            }

            _error2 = new Error('No order exists');
            _error2.status = 404;
            throw _error2;

          case 14:
            if (!paymentData) {
              _context2.next = 18;
              break;
            }

            console.log(chalk.yellow('Order data: ', paymentData));
            payments = paymentData.map(function (payment) {
              return {
                product_name: payment.product_name,
                price: payment.price,
                description: payment.description,
                quantity: payment.quantity,
                total_price: payment.total_price,
                shipping_method: payment.shipping_method,
                fee: payment.fee,
                shipping_address: payment.shipping_address,
              };
            });
            return _context2.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read order details successful',
                data: payments,
              })
            );

          case 18:
            _context2.next = 24;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2['catch'](2);
            console.error(
              chalk.red('Error in getPaymentByStatus: ', _context2.t0)
            );
            return _context2.abrupt('return', next(_context2.t0));

          case 24:
          case 'end':
            return _context2.stop();
        }
      }
    },
    null,
    null,
    [[2, 20]]
  );
}; //payment data

exports.processGetPaymentTotal = function _callee3(req, res, next) {
  var orderID, error, paymentTotal, _error3;

  return regeneratorRuntime.async(
    function _callee3$(_context3) {
      while (1) {
        switch ((_context3.prev = _context3.next)) {
          case 0:
            console.log(chalk.blue('processGetPaymentTotal running'));
            orderID = req.params.orderID;
            _context3.prev = 2;

            if (orderID) {
              _context3.next = 7;
              break;
            }

            error = new Error('invalid orderID');
            error.status = 400;
            throw error;

          case 7:
            _context3.next = 9;
            return regeneratorRuntime.awrap(
              paymentServices.getPaymentTotal(orderID)
            );

          case 9:
            paymentTotal = _context3.sent;

            if (!(!paymentTotal || paymentTotal[0].payment_total === null)) {
              _context3.next = 14;
              break;
            }

            _error3 = new Error('No payment exists');
            _error3.status = 404;
            throw _error3;

          case 14:
            console.log(chalk.yellow('Payment_total data: ', paymentTotal));
            return _context3.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read payment total successful',
                paymentTotal: paymentTotal,
              })
            );

          case 18:
            _context3.prev = 18;
            _context3.t0 = _context3['catch'](2);
            console.error(
              chalk.red('Error in getPaymentTotal: ', _context3.t0)
            );
            return _context3.abrupt('return', next(_context3.t0));

          case 22:
          case 'end':
            return _context3.stop();
        }
      }
    },
    null,
    null,
    [[2, 18]]
  );
};

exports.processGetIDAndAmount = function _callee4(req, res, next) {
  var productID, error, idAndAmount, _error4;

  return regeneratorRuntime.async(
    function _callee4$(_context4) {
      while (1) {
        switch ((_context4.prev = _context4.next)) {
          case 0:
            console.log(chalk.blue('processGetIDAndAmount running'));
            productID = req.params.productID;
            _context4.prev = 2;

            if (productID) {
              _context4.next = 7;
              break;
            }

            error = new Error('invalid productID');
            error.status = 400;
            throw error;

          case 7:
            _context4.next = 9;
            return regeneratorRuntime.awrap(
              paymentServices.getIdAndAmount(productID)
            );

          case 9:
            idAndAmount = _context4.sent;

            if (!(idAndAmount.length == 0)) {
              _context4.next = 14;
              break;
            }

            _error4 = new Error('No payment exists');
            _error4.status = 404;
            throw _error4;

          case 14:
            console.log(chalk.yellow('Payment_total data: ', idAndAmount));
            return _context4.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read refund data is successful',
                idAndAmount: idAndAmount,
              })
            );

          case 18:
            _context4.prev = 18;
            _context4.t0 = _context4['catch'](2);
            console.error(chalk.red('Error in getIDAndAmount: ', _context4.t0));
            return _context4.abrupt('return', next(_context4.t0));

          case 22:
          case 'end':
            return _context4.stop();
        }
      }
    },
    null,
    null,
    [[2, 18]]
  );
};
