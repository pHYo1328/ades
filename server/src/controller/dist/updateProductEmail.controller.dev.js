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

var chalk = require('chalk');

var _require = require('date-fns'),
  format = _require.format;

var _require2 = require('../services/bookmarkEmail.services'),
  getLatestUpdate = _require2.getLatestUpdate,
  getCustomerDetails = _require2.getCustomerDetails,
  getUpdatedProductsByBrandID = _require2.getUpdatedProductsByBrandID;

var _require3 = require('../services/email.service'),
  sendEmail = _require3.sendEmail;

var _require4 = require('../services/notification.service'),
  addNotification = _require4.addNotification; // store default time to check

var previousUpdate = format(
  new Date('2023-05-15 05:49:40'),
  'yyyy-MM-dd HH:mm:ss'
);

module.exports.updateProductsEmailSender = function _callee() {
  var latestUpdateTime,
    latestUpdate,
    _ref,
    _ref2,
    customers,
    products,
    emailPromises;

  return regeneratorRuntime.async(
    function _callee$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            console.log(chalk.blue('Cron schedule Started'));
            _context.prev = 1;
            _context.next = 4;
            return regeneratorRuntime.awrap(getLatestUpdate());

          case 4:
            latestUpdateTime = _context.sent;
            latestUpdate = format(
              new Date(latestUpdateTime[0][0].latest_update),
              'yyyy-MM-dd HH:mm:ss'
            );
            console.log(chalk.blue('Latest Update Time: ', latestUpdate));
            console.log(chalk.blue('previous Update Time: ', previousUpdate)); // check there is the latest update?

            if (
              !(
                new Date(latestUpdate).getTime() >
                new Date(previousUpdate).getTime()
              )
            ) {
              _context.next = 19;
              break;
            }

            _context.next = 11;
            return regeneratorRuntime.awrap(
              Promise.all([
                getCustomerDetails(previousUpdate),
                getUpdatedProductsByBrandID(previousUpdate),
              ])
            );

          case 11:
            _ref = _context.sent;
            _ref2 = _slicedToArray(_ref, 2);
            customers = _ref2[0];
            products = _ref2[1];

            if (!(customers[0].length > 0 && products[0].length > 0)) {
              _context.next = 19;
              break;
            }

            // create email promise array by finding related brand id
            emailPromises = customers[0].map(function (customer) {
              console.log(customer);
              var customerProducts = products[0].filter(function (product) {
                return product.brand_id === customer.brand_id;
              });

              if (customerProducts.length > 0) {
                return sendEmail(customer, customerProducts)
                  .then(function (response) {
                    if (response.status == 200) {
                      console.log(
                        'Adding notification for customer with ID: '.concat(
                          customer.customer_id
                        )
                      );
                      return addNotification(customer.customer_id);
                    }
                  })
                  ['catch'](function (error) {
                    console.error(
                      'Error sending email for customer with ID: '.concat(
                        customer.customer_id,
                        ': '
                      ),
                      error
                    );
                  });
              }
            }); // and the solve the all promises

            _context.next = 19;
            return regeneratorRuntime.awrap(Promise.all(emailPromises));

          case 19:
            // update the previous time to latest time update
            previousUpdate = latestUpdate;
            _context.next = 26;
            break;

          case 22:
            _context.prev = 22;
            _context.t0 = _context['catch'](1);
            console.log(chalk.red(_context.t0));
            throw _context.t0;

          case 26:
          case 'end':
            return _context.stop();
        }
      }
    },
    null,
    null,
    [[1, 22]]
  );
};
