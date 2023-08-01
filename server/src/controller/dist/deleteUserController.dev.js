'use strict';

var adminServices = require('../services/admin.services');

var chalk = require('chalk');

var deleteUser = function deleteUser(req, res) {
  var userid, result;
  return regeneratorRuntime.async(
    function deleteUser$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            _context.prev = 0;
            userid = req.body.userid;
            console.log('try catch in controller!!');
            console.log('delete controller userid', userid);
            _context.next = 6;
            return regeneratorRuntime.awrap(adminServices.deleteUser(userid));

          case 6:
            result = _context.sent;
            console.log('in controller', result);

            if (result) {
              _context.next = 10;
              break;
            }

            throw new Error('User not found');

          case 10:
            console.log(chalk.green('User deleted successfully'));
            res.status(200).json({
              message: 'User deleted successfully',
            });
            _context.next = 18;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context['catch'](0);
            console.error(chalk.red('Error in deleting user: ', _context.t0));
            res.status(500).json({
              error: 'Failed to delete user',
            });

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    },
    null,
    null,
    [[0, 14]]
  );
};

module.exports = {
  deleteUser: deleteUser,
};
