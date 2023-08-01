'use strict';

function _typeof(obj) {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj;
    };
  }
  return _typeof(obj);
}

var chalk = require('chalk');

var orderServices = require('../services/order.services');

var _require = require('../config/orderStatus.enum'),
  OrderStatus = _require.OrderStatus; // controller for adding order

exports.processAddCustomerOrder = function _callee(req, res, next) {
  var customerId,
    _req$body,
    shippingAddr,
    totalPrice,
    shippingMethod,
    orderItems,
    error,
    _error,
    _error2,
    data,
    result;

  return regeneratorRuntime.async(
    function _callee$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            console.log(chalk.blue('processAddCustomerOrder is running'));
            customerId = req.params.customerId;
            (_req$body = req.body),
              (shippingAddr = _req$body.shippingAddr),
              (totalPrice = _req$body.totalPrice),
              (shippingMethod = _req$body.shippingMethod),
              (orderItems = _req$body.orderItems);
            console.log(
              chalk.yellow(
                'Inspect req.body variables',
                shippingAddr,
                totalPrice,
                shippingMethod,
                orderItems
              )
            );
            _context.prev = 4;

            if (!isNaN(parseInt(customerId))) {
              _context.next = 9;
              break;
            }

            error = new Error('Invalid customerID parameter');
            error.status = 400;
            throw error;

          case 9:
            if (
              !(
                !shippingAddr ||
                !shippingAddr.trim() ||
                isNaN(parseInt(totalPrice)) ||
                isNaN(parseInt(shippingMethod))
              )
            ) {
              _context.next = 13;
              break;
            }

            _error = new Error('Invalid Information parameters');
            _error.status = 400;
            throw _error;

          case 13:
            if (
              !(
                !orderItems ||
                orderItems.length <= 0 ||
                !orderItems.every(function (items) {
                  return _typeof(items) === 'object';
                })
              )
            ) {
              _context.next = 17;
              break;
            }

            _error2 = new Error('Invalid order items data');
            _error2.status = 400;
            throw _error2;

          case 17:
            data = {
              customerID: customerId,
              shippingAddr: shippingAddr,
              totalPrice: totalPrice,
              shippingMethod: shippingMethod,
              orderItems: orderItems,
            };
            _context.next = 20;
            return regeneratorRuntime.awrap(
              orderServices.addCustomerOrder(data)
            );

          case 20:
            result = _context.sent;
            console.log(
              chalk.yellow(
                'Inspect result variable from addCustomerOrder service\n:',
                result
              )
            );

            if (!result) {
              _context.next = 24;
              break;
            }

            return _context.abrupt(
              'return',
              res.status(201).send({
                message: 'Order Data added successfully',
                data: result,
              })
            );

          case 24:
            _context.next = 30;
            break;

          case 26:
            _context.prev = 26;
            _context.t0 = _context['catch'](4);
            console.error(
              chalk.red('Error in processAddCustomerOrder: ', _context.t0)
            );
            next(_context.t0);

          case 30:
          case 'end':
            return _context.stop();
        }
      }
    },
    null,
    null,
    [[4, 26]]
  );
}; // controller for getting customers orders by order status

exports.processGetOrderDetailsByOrderStatus = function _callee2(
  req,
  res,
  next
) {
  var _req$query, customerID, orderStatus, error, status, _error3, data, result;

  return regeneratorRuntime.async(
    function _callee2$(_context2) {
      while (1) {
        switch ((_context2.prev = _context2.next)) {
          case 0:
            console.log(
              chalk.blue('processGetOrderDetailsByOrderStatus is running')
            );
            (_req$query = req.query),
              (customerID = _req$query.customerID),
              (orderStatus = _req$query.orderStatus);
            console.log(
              chalk.yellow(
                'Inspect request variable :',
                customerID,
                orderStatus
              )
            );
            _context2.prev = 3;

            if (!isNaN(parseInt(customerID))) {
              _context2.next = 8;
              break;
            }

            error = new Error('Invalid customer ID parameter');
            error.status(400);
            throw error;

          case 8:
            status = null; // create enum here

            _context2.t0 = orderStatus;
            _context2.next =
              _context2.t0 === 'order_received'
                ? 12
                : _context2.t0 === 'paid'
                ? 14
                : _context2.t0 === 'delivering'
                ? 16
                : _context2.t0 === 'delivered'
                ? 18
                : 20;
            break;

          case 12:
            status = OrderStatus.ORDER_RECEIVED;
            return _context2.abrupt('break', 23);

          case 14:
            status = OrderStatus.ORDER_PAID;
            return _context2.abrupt('break', 23);

          case 16:
            status = OrderStatus.ORDER_DELIVERING;
            return _context2.abrupt('break', 23);

          case 18:
            status = OrderStatus.ORDER_DELIVERED;
            return _context2.abrupt('break', 23);

          case 20:
            _error3 = new Error('Invalid order status parameter');
            _error3.status = 400;
            throw _error3;

          case 23:
            data = {
              customerID: customerID,
              orderStatus: status,
            };
            console.log(
              chalk.yellow(
                'Inspecting data parameter variable',
                JSON.stringify(data)
              )
            );
            _context2.next = 27;
            return regeneratorRuntime.awrap(
              orderServices.getOrderDetailsByOrderStatus(data)
            );

          case 27:
            result = _context2.sent;
            console.log(
              chalk.yellow(
                'Inspect result variable from getOrderDetailsByOrderStatus service',
                JSON.stringify(result[0])
              )
            );
            return _context2.abrupt(
              'return',
              res.status(200).send({
                message: 'orders found',
                data: result,
              })
            );

          case 32:
            _context2.prev = 32;
            _context2.t1 = _context2['catch'](3);
            console.error(
              chalk.red(
                'Error in processGetOrderDetailsBeforePickUp: ',
                _context2.t1
              )
            );
            next(_context2.t1);

          case 36:
          case 'end':
            return _context2.stop();
        }
      }
    },
    null,
    null,
    [[3, 32]]
  );
}; // controller to fetch order details for administration

exports.processGetOrderDetailsForAdmin = function _callee3(req, res, next) {
  var result;
  return regeneratorRuntime.async(
    function _callee3$(_context3) {
      while (1) {
        switch ((_context3.prev = _context3.next)) {
          case 0:
            console.log(
              chalk.blue('processGetOrderDetailsForAdmin is running')
            );
            _context3.prev = 1;
            _context3.next = 4;
            return regeneratorRuntime.awrap(
              orderServices.getOrderDetailsForAdmin()
            );

          case 4:
            result = _context3.sent;
            console.log(
              chalk.yellow(
                'Inspect result variable from getOrderDetailsForAdmin service',
                result
              )
            );
            return _context3.abrupt(
              'return',
              res.status(200).send({
                message: 'orders found',
                data: result,
              })
            );

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3['catch'](1);
            console.error(
              chalk.red(
                'Error in processGetOrderDetailsForAdmin: ',
                _context3.t0
              )
            );
            next(_context3.t0);

          case 13:
          case 'end':
            return _context3.stop();
        }
      }
    },
    null,
    null,
    [[1, 9]]
  );
}; // controller to update order status

exports.processUpdateOrderStatus = function _callee4(req, res, next) {
  var _req$body2, orderIDs, orderStatus, error, status, _error4, data, result;

  return regeneratorRuntime.async(
    function _callee4$(_context4) {
      while (1) {
        switch ((_context4.prev = _context4.next)) {
          case 0:
            console.log(chalk.blue('ProcessUpdateOrderStatus is running'));
            (_req$body2 = req.body),
              (orderIDs = _req$body2.orderIDs),
              (orderStatus = _req$body2.orderStatus);
            _context4.prev = 2;

            if (!(!orderIDs || !orderStatus)) {
              _context4.next = 7;
              break;
            }

            error = new Error('Invalid Information parameters');
            error.status = 400;
            throw error;

          case 7:
            status = null;
            _context4.t0 = orderStatus;
            _context4.next =
              _context4.t0 === 'delivering'
                ? 11
                : _context4.t0 === 'delivered'
                ? 13
                : 15;
            break;

          case 11:
            status = OrderStatus.ORDER_DELIVERING;
            return _context4.abrupt('break', 18);

          case 13:
            status = OrderStatus.ORDER_DELIVERED;
            return _context4.abrupt('break', 18);

          case 15:
            _error4 = new Error('Invalid order status parameter');
            _error4.status = 400;
            throw _error4;

          case 18:
            data = {
              orderIDs: orderIDs,
              orderStatus: status,
            };
            _context4.next = 21;
            return regeneratorRuntime.awrap(
              orderServices.updateOrderStatus(data)
            );

          case 21:
            result = _context4.sent;
            console.log(
              chalk.yellow(
                'Inspect result variable from updateOrderStatus service',
                result
              )
            );
            return _context4.abrupt(
              'return',
              res.status(200).send({
                message: 'Order Status updated successfully',
                data: result,
              })
            );

          case 26:
            _context4.prev = 26;
            _context4.t1 = _context4['catch'](2);
            console.error(
              chalk.red('Error in processUpdateOrderStatus: ', _context4.t1)
            );
            next(_context4.t1);

          case 30:
          case 'end':
            return _context4.stop();
        }
      }
    },
    null,
    null,
    [[2, 26]]
  );
}; // controller for updating shipping details

exports.processUpdateShippingDetails = function _callee5(req, res, next) {
  var customerID,
    _req$body3,
    orderId,
    shippingAddr,
    error,
    _error5,
    data,
    result,
    _error6;

  return regeneratorRuntime.async(
    function _callee5$(_context5) {
      while (1) {
        switch ((_context5.prev = _context5.next)) {
          case 0:
            console.log(chalk.blue('processUpdateShippingDetails is running'));
            customerID = req.params.customerID;
            (_req$body3 = req.body),
              (orderId = _req$body3.orderId),
              (shippingAddr = _req$body3.shippingAddr);
            console.log(
              chalk.yellow('Inspect customerID variable :', customerID)
            );
            console.log(
              chalk.yellow('Inspect req body variables', orderId, shippingAddr)
            );
            _context5.prev = 5;

            if (!isNaN(parseInt(customerID))) {
              _context5.next = 10;
              break;
            }

            error = new Error('Invalid customerID parameter');
            error.status = 400;
            throw error;

          case 10:
            if (!(!orderId || !shippingAddr || !shippingAddr.trim())) {
              _context5.next = 14;
              break;
            }

            _error5 = new Error('Invalid information parameter');
            _error5.status = 400;
            throw _error5;

          case 14:
            data = {
              customerID: customerID,
              orderId: orderId,
              shippingAddr: shippingAddr,
            };
            _context5.next = 17;
            return regeneratorRuntime.awrap(
              orderServices.updateShippingDetails(data)
            );

          case 17:
            result = _context5.sent;
            console.log(
              chalk.yellow(
                'Inspect result variable from processUpdateShippingDetails service',
                result
              )
            );

            if (!(result == 0)) {
              _context5.next = 23;
              break;
            }

            _error6 = new Error('there is no such order');
            _error6.status = 404;
            throw _error6;

          case 23:
            return _context5.abrupt(
              'return',
              res.status(200).send({
                message: 'Information Updated',
                data: ' ',
              })
            );

          case 26:
            _context5.prev = 26;
            _context5.t0 = _context5['catch'](5);
            console.error(
              chalk.red(
                'Error in processGetOrderDetailsByDeliverStatus: ',
                _context5.t0
              )
            );
            next(_context5.t0);

          case 30:
          case 'end':
            return _context5.stop();
        }
      }
    },
    null,
    null,
    [[5, 26]]
  );
}; // controller for cancel the particular order items

exports.processCancelOrder = function _callee6(req, res, next) {
  var _req$query2,
    orderId,
    productID,
    quantity,
    orderStatus,
    error,
    _error7,
    _error8,
    status,
    _error9,
    data,
    result;

  return regeneratorRuntime.async(
    function _callee6$(_context6) {
      while (1) {
        switch ((_context6.prev = _context6.next)) {
          case 0:
            console.log(chalk.blue('processCancelOrder is running'));
            (_req$query2 = req.query),
              (orderId = _req$query2.orderId),
              (productID = _req$query2.productID),
              (quantity = _req$query2.quantity),
              (orderStatus = _req$query2.orderStatus);
            console.log(
              chalk.yellow(
                'Inspect req body variables :',
                orderId,
                productID,
                quantity,
                orderStatus
              )
            );
            _context6.prev = 3;

            if (orderId) {
              _context6.next = 8;
              break;
            }

            error = new Error('Invalid order ID parameter');
            error.status = 400;
            throw error;

          case 8:
            if (!isNaN(parseInt(productID))) {
              _context6.next = 12;
              break;
            }

            _error7 = new Error('Invalid product ID parameter');
            _error7.status = 400;
            throw _error7;

          case 12:
            if (!isNaN(parseInt(quantity))) {
              _context6.next = 16;
              break;
            }

            _error8 = new Error('Invalid quantity parameter');
            _error8.status = 400;
            throw _error8;

          case 16:
            status = null;
            _context6.t0 = orderStatus;
            _context6.next =
              _context6.t0 === 'order_received'
                ? 20
                : _context6.t0 === 'paid'
                ? 22
                : 24;
            break;

          case 20:
            status = OrderStatus.ORDER_RECEIVED;
            return _context6.abrupt('break', 27);

          case 22:
            status = OrderStatus.ORDER_PAID;
            return _context6.abrupt('break', 27);

          case 24:
            _error9 = new Error('Invalid order status parameter');
            _error9.status = 400;
            throw _error9;

          case 27:
            data = {
              orderID: orderId,
              productID: productID,
              quantity: quantity,
              orderStatus: status,
            };
            _context6.next = 30;
            return regeneratorRuntime.awrap(orderServices.cancelOrder(data));

          case 30:
            result = _context6.sent;
            console.log(
              chalk.yellow(
                'Inspect result variable from processCancelOrder service : ',
                result
              )
            );

            if (!result) {
              _context6.next = 34;
              break;
            }

            return _context6.abrupt(
              'return',
              res.status(201).send({
                message: 'delete Order successfully',
                data: '',
              })
            );

          case 34:
            _context6.next = 40;
            break;

          case 36:
            _context6.prev = 36;
            _context6.t1 = _context6['catch'](3);
            console.error(
              chalk.red('Error in processCancelOrder :', _context6.t1)
            );
            next(_context6.t1);

          case 40:
          case 'end':
            return _context6.stop();
        }
      }
    },
    null,
    null,
    [[3, 36]]
  );
};
