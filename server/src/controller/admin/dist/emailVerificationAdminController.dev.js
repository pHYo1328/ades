'use strict';

var verificationEmailServices = require('../../services/adminForgotPasswordEmail');

var sendForgotPasswordEmail = function sendForgotPasswordEmail(req, res) {
  var email, response;
  return regeneratorRuntime.async(
    function sendForgotPasswordEmail$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            email = req.body.email;
            _context.prev = 1;
            _context.next = 4;
            return regeneratorRuntime.awrap(
              verificationEmailServices.AdminForgotPasswordEmailSender(email)
            );

          case 4:
            response = _context.sent;
            console.log('admin forgot passwrod email sent');
            res.status(200).json(response);
            _context.next = 13;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](1);
            console.error(_context.t0);
            res.status(500).json({
              message: 'Internal server error',
            });

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

module.exports = {
  sendForgotPasswordEmail: sendForgotPasswordEmail,
};
