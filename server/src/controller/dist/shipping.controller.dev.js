'use strict';

var chalk = require('chalk');

var shippingService = require('../services/shipping.service'); // controller for fetching shipping methods

exports.processFetchShippingMethod = function _callee(req, res, next) {
  var result;
  return regeneratorRuntime.async(
    function _callee$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            console.log(chalk.blue('processFetchShippingMethod is running'));
            _context.prev = 1;
            _context.next = 4;
            return regeneratorRuntime.awrap(
              shippingService.fetchShippingMethods()
            );

          case 4:
            result = _context.sent;
            console.log(
              chalk.yellow(
                'Inspect result variable from fetchShippingMethods service',
                result
              )
            );
            return _context.abrupt(
              'return',
              res.status(200).send({
                message: 'shipping methods were found',
                data: result,
              })
            );

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](1);
            console.log(
              chalk.red('Error from shipping service: ' + _context.t0)
            );
            next(_context.t0);

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    },
    null,
    null,
    [[1, 9]]
  );
};
