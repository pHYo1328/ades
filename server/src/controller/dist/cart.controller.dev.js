'use strict';

var chalk = require('chalk');

var cartServices = require('../services/cart.services'); // controller for adding data to both redis and mysql databases

exports.processAddCartData = function _callee(req, res, next) {
  var userID, cartData, error, _error, result;

  return regeneratorRuntime.async(
    function _callee$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            console.log(chalk.blue('processAddCartData is running'));
            userID = req.params.userID;
            cartData = req.body.cartData;
            _context.prev = 3;

            if (!isNaN(parseInt(userID))) {
              _context.next = 8;
              break;
            }

            error = new Error('Invalid userID parameter');
            error.status = 400;
            throw error;

          case 8:
            if (cartData) {
              _context.next = 12;
              break;
            }

            _error = new Error('Invalid cartData parameter');
            _error.status = 400;
            throw _error;

          case 12:
            _context.next = 14;
            return regeneratorRuntime.awrap(
              Promise.all([
                cartServices.addCartDataToRedis(userID, cartData),
                cartServices.addCartDataToMySqlDB(userID, cartData),
              ])
            );

          case 14:
            result = _context.sent;
            console.log(
              chalk.yellow(
                'Inspect result variable from addCartData service\n'
              ),
              result
            );
            return _context.abrupt(
              'return',
              res.status(201).send({
                message: 'cartData added successfully.',
                data: '',
              })
            );

          case 19:
            _context.prev = 19;
            _context.t0 = _context['catch'](3);
            console.error(
              chalk.red('Error in processAddCartData:', _context.t0)
            );
            next(_context.t0);

          case 23:
          case 'end':
            return _context.stop();
        }
      }
    },
    null,
    null,
    [[3, 19]]
  );
}; // for reading, decided to use cache aside
// controller to get the cart data

exports.processGetCartData = function _callee2(req, res, next) {
  var userID, error, result, mysqlResult, _mysqlResult, message;

  return regeneratorRuntime.async(
    function _callee2$(_context2) {
      while (1) {
        switch ((_context2.prev = _context2.next)) {
          case 0:
            console.log(chalk.blue('processGetCartData is running'));
            userID = req.params.userID;
            _context2.prev = 2;

            if (!isNaN(parseInt(userID))) {
              _context2.next = 7;
              break;
            }

            error = new Error('Invalid userID parameter');
            error.status = 400;
            throw error;

          case 7:
            console.log(chalk.yellow('Inspect userID variable\n'), userID);
            _context2.prev = 8;
            _context2.next = 11;
            return regeneratorRuntime.awrap(
              cartServices.getCartDataFromRedis(userID)
            );

          case 11:
            result = _context2.sent;
            _context2.next = 21;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2['catch'](8);
            console.log(
              chalk.red('Error fetching data from Redis:', _context2.t0)
            );
            _context2.next = 19;
            return regeneratorRuntime.awrap(
              cartServices.getCartDataFromMySqlDB(userID)
            );

          case 19:
            mysqlResult = _context2.sent;
            result = mysqlResult;

          case 21:
            if (!(!result || result.length === 0)) {
              _context2.next = 29;
              break;
            }

            console.log(chalk.blue('There is no redis result'));
            _context2.next = 25;
            return regeneratorRuntime.awrap(
              cartServices.getCartDataFromMySqlDB(userID)
            );

          case 25:
            _mysqlResult = _context2.sent;
            result = _mysqlResult;
            _context2.next = 29;
            return regeneratorRuntime.awrap(
              cartServices.addCartDataToRedis(userID, _mysqlResult)
            );

          case 29:
            console.log(
              chalk.yellow(
                'Inspect result variable from getCartData service\n'
              ),
              result
            );
            message = 'cartData found successfully.';
            console.log(result);
            return _context2.abrupt(
              'return',
              res.status(200).send({
                message: message,
                data: result,
              })
            );

          case 35:
            _context2.prev = 35;
            _context2.t1 = _context2['catch'](2);
            console.error(
              chalk.red('Error in processGetCartData:', _context2.t1)
            );
            next(_context2.t1);

          case 39:
          case 'end':
            return _context2.stop();
        }
      }
    },
    null,
    null,
    [
      [2, 35],
      [8, 14],
    ]
  );
}; // controller to delete cart data from redis and mysql database

exports.processDeleteCartData = function _callee3(req, res, next) {
  var userID, error, result;
  return regeneratorRuntime.async(
    function _callee3$(_context3) {
      while (1) {
        switch ((_context3.prev = _context3.next)) {
          case 0:
            console.log(chalk.blue('processDeleteCartData is running'));
            userID = req.params.userID;
            _context3.prev = 2;

            if (!isNaN(parseInt(userID))) {
              _context3.next = 7;
              break;
            }

            error = new Error('Invalid userID parameter');
            error.status = 400;
            throw error;

          case 7:
            console.log(chalk.yellow('Inspect userID variable\n'), userID); // delete concurrently

            _context3.next = 10;
            return regeneratorRuntime.awrap(
              Promise.all([
                cartServices
                  .deleteCartDataInRedis(userID)
                  ['catch'](function (error) {
                    console.error('redis error', error);
                  }),
                cartServices.deleteCartDataInMySqlDB(userID),
              ])
            );

          case 10:
            result = _context3.sent;
            console.log(
              chalk.yellow(
                'Inspect result variable from deleteCartData service\n'
              ),
              result
            );
            return _context3.abrupt(
              'return',
              res.status(204).send({
                statusCode: 204,
                ok: true,
                message: 'cartData deleted successfully.',
                data: '',
              })
            );

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3['catch'](2);
            console.error(
              chalk.red('Error in processDeleteCartData:', _context3.t0)
            );
            next(_context3.t0);

          case 19:
          case 'end':
            return _context3.stop();
        }
      }
    },
    null,
    null,
    [[2, 15]]
  );
}; //controllers to fetch all cart data details

exports.processGetCartProductData = function _callee4(req, res, next) {
  var productIDs, response;
  return regeneratorRuntime.async(
    function _callee4$(_context4) {
      while (1) {
        switch ((_context4.prev = _context4.next)) {
          case 0:
            console.log(chalk.blue('processGetCartProductData is running'));
            productIDs = req.query.productIDs.split(',');
            console.log(
              chalk.yellow('Inspecting product IDs: '.concat(productIDs))
            );
            _context4.prev = 3;
            _context4.next = 6;
            return regeneratorRuntime.awrap(
              cartServices.getCartProductDetails(productIDs)
            );

          case 6:
            response = _context4.sent;
            return _context4.abrupt(
              'return',
              res.status(200).send({
                message: 'all fetch successfully',
                data: response,
              })
            );

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4['catch'](3);
            console.error(
              chalk.red('Error in processGetCartProductData:', _context4.t0)
            );
            next(_context4.t0);

          case 14:
          case 'end':
            return _context4.stop();
        }
      }
    },
    null,
    null,
    [[3, 10]]
  );
};
