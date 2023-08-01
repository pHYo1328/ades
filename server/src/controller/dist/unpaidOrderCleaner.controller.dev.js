'use strict';

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError('Invalid attempt to destructure non-iterable instance');
}

function _iterableToArrayLimit(arr, i) {
  if (
    !(
      Symbol.iterator in Object(arr) ||
      Object.prototype.toString.call(arr) === '[object Arguments]'
    )
  ) {
    return;
  }
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError('Invalid attempt to spread non-iterable instance');
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === '[object Arguments]'
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
}

var orderServices = require('../services/order.services');

module.exports.cleanUnpaidOrders = function _callee() {
  var threeDayOldOrders, fourDayOldOrders;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch ((_context.prev = _context.next)) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(orderServices.getUnpaidOrders(3));

        case 2:
          threeDayOldOrders = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(orderServices.getOrdersToClean(4));

        case 5:
          fourDayOldOrders = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(
            Promise.all(
              [].concat(
                _toConsumableArray(
                  Object.entries(
                    threeDayOldOrders.reduce(function (acc, order) {
                      acc[order.customer_id] = acc[order.customer_id] || {
                        customerEmail: order.email,
                        orderIds: [],
                      };
                      acc[order.customer_id].orderIds.push(order.order_id);
                      return acc;
                    }, {})
                  ).map(function (_ref) {
                    var _ref2 = _slicedToArray(_ref, 2),
                      customerID = _ref2[0],
                      customerOrders = _ref2[1];

                    orderServices.sendReminderEmail(
                      customerOrders.orderIds,
                      customerOrders.customerEmail
                    );
                  })
                ),
                _toConsumableArray(
                  fourDayOldOrders.map(function (order) {
                    return orderServices.deleteOrder(order.order_id);
                  })
                )
              )
            )
          );

        case 8:
        case 'end':
          return _context.stop();
      }
    }
  });
};
