'use strict';

// const { user } = require('../config/config');
var loginServices = require('../services/login.services');

var verifyOTP = function verifyOTP(req, res) {
  var otp, verificationResult;
  return regeneratorRuntime.async(
    function verifyOTP$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            otp = req.body.otp;
            _context.prev = 1;
            console.log('im inside verifyOTPcONTROLELTSRIGN');
            _context.next = 5;
            return regeneratorRuntime.awrap(loginServices.verifyOTP(otp));

          case 5:
            verificationResult = _context.sent;

            if (verificationResult) {
              // OTP verification successful
              console.log('successful OTP verification');
              res.sendStatus(200);
            } else {
              // Invalid OTP
              console.log('invalid OTP verification');
              res.sendStatus(401);
            }

            _context.next = 13;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](1);
            // Handle any error that occurred during the OTP verification
            console.error(_context.t0);
            res.sendStatus(500);

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
  verifyOTP: verifyOTP,
};
