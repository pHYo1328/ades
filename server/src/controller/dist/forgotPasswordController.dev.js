'use strict';

var loginServices = require('../services/login.services');

var handleForgotPassword = function handleForgotPassword(req, res) {
  var _req$body, email, password, result;

  return regeneratorRuntime.async(
    function handleForgotPassword$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            (_req$body = req.body),
              (email = _req$body.email),
              (password = _req$body.password);

            if (!(!email || !password)) {
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
            return regeneratorRuntime.awrap(
              loginServices.forgotPassword(email, password)
            );

          case 6:
            result = _context.sent;

            if (result) {
              _context.next = 9;
              break;
            }

            return _context.abrupt(
              'return',
              res.status(404).json({
                message: 'Password update failed.',
              })
            );

          case 9:
            res.status(200).json({
              message: 'Password updated successfully!',
            });
            _context.next = 15;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context['catch'](3);
            res.status(500).json({
              message: _context.t0.message,
            });

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    },
    null,
    null,
    [[3, 12]]
  );
};

module.exports = {
  handleForgotPassword: handleForgotPassword,
};
