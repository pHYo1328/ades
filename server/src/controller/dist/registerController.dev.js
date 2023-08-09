'use strict';

var loginServices = require('../services/login.services');

var bcrypt = require('bcrypt');

var handleNewUser = function handleNewUser(req, res) {
  var _req$body, username, email, password, hashedPwd, result;

  return regeneratorRuntime.async(
    function handleNewUser$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            (_req$body = req.body),
              (username = _req$body.username),
              (email = _req$body.email),
              (password = _req$body.password);

            if (!(!username || !email || !password)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt(
              'return',
              res.status(400).json({
                message: 'All fields are required.',
              })
            );

          case 3:
            _context.prev = 3;
            _context.next = 6;
            return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

          case 6:
            hashedPwd = _context.sent;
            _context.next = 9;
            return regeneratorRuntime.awrap(
              loginServices.registerUser(
                username,
                email,
                hashedPwd,
                'customer',
                'ades/default_profile'
              )
            );

          case 9:
            result = _context.sent;
            console.log(result);
            res.status(201).json({
              success: 'New user '.concat(username, ' created!'),
            }); //User successfully created

            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context['catch'](3);
            res.status(500).json({
              message: _context.t0.message,
            });

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    },
    null,
    null,
    [[3, 14]]
  );
};

module.exports = {
  handleNewUser: handleNewUser,
};
