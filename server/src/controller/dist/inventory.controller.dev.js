'use strict';

var chalk = require('chalk');

var inventoryServices = require('../services/inventory.services'); // controller for fetching all infos from inventory

exports.processCheckInventory = function _callee(req, res, next) {
  var productIDs, response;
  return regeneratorRuntime.async(
    function _callee$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            console.log(chalk.blue('processCheckInventory is running'));
            productIDs = req.query.productIDs.split(',');
            console.log(
              chalk.yellow('Inspecting product IDs: '.concat(productIDs))
            );
            _context.prev = 3;
            _context.next = 6;
            return regeneratorRuntime.awrap(
              inventoryServices.checkInventory(productIDs)
            );

          case 6:
            response = _context.sent;
            return _context.abrupt(
              'return',
              res.status(200).send({
                message: 'all fetch successfully',
                data: response,
              })
            );

          case 10:
            _context.prev = 10;
            _context.t0 = _context['catch'](3);
            console.err('Error in processing check inventory', _context.t0);
            next(_context.t0);

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    },
    null,
    null,
    [[3, 10]]
  );
};
