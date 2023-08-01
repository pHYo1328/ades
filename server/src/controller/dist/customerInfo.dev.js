'use strict';

var loginService = require('../services/login.services');

var retrieveUsersInformation = function retrieveUsersInformation(req, res) {
  var users;
  return regeneratorRuntime.async(
    function retrieveUsersInformation$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(loginService.retrieveUsersInfo());

          case 3:
            users = _context.sent;
            console.log('got users info');
            res.json(users);
            _context.next = 12;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](0);
            console.error(_context.t0);
            res.status(500).send('Error retrieving user information');

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    },
    null,
    null,
    [[0, 8]]
  );
};

module.exports = {
  retrieveUsersInformation: retrieveUsersInformation,
};
