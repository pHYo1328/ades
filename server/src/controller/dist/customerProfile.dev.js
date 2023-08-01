'use strict';

var bcrypt = require('bcrypt');

var customerService = require('../services/customer.services');

exports.userProfileInformation = function _callee(req, res) {
  var customer_id, users;
  return regeneratorRuntime.async(
    function _callee$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            console.log('inside user profile controller');
            _context.prev = 1;
            customer_id = req.headers['customer-id'];
            console.log(customer_id);
            _context.next = 6;
            return regeneratorRuntime.awrap(
              customerService.retrieveUserInfo(customer_id)
            );

          case 6:
            users = _context.sent;
            console.log('got user"s info in ', customer_id);
            console.log(users[0][0]);
            res.json(users[0][0]);
            _context.next = 16;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context['catch'](1);
            console.error(_context.t0);
            res.status(500).send('Error retrieving user information');

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    },
    null,
    null,
    [[1, 12]]
  );
};

exports.updateUserProfile = function _callee2(req, res) {
  var _req$body, customer_id, username, email, password, hashedPassword;

  return regeneratorRuntime.async(
    function _callee2$(_context2) {
      while (1) {
        switch ((_context2.prev = _context2.next)) {
          case 0:
            console.log('In updateUserProfile controller');
            (_req$body = req.body),
              (customer_id = _req$body.customer_id),
              (username = _req$body.username),
              (email = _req$body.email),
              (password = _req$body.password);
            _context2.prev = 2;
            _context2.next = 5;
            return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

          case 5:
            hashedPassword = _context2.sent;
            _context2.next = 8;
            return regeneratorRuntime.awrap(
              customerService.updateUserInfo(
                customer_id,
                username,
                email,
                hashedPassword
              )
            );

          case 8:
            console.log('User information updated successfully.');
            res.status(200).json({
              message: 'User information updated successfully.',
            });
            _context2.next = 16;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2['catch'](2);
            console.error('Error updating user information:', _context2.t0);
            res.status(500).json({
              message: 'Error updating user information.',
            });

          case 16:
          case 'end':
            return _context2.stop();
        }
      }
    },
    null,
    null,
    [[2, 12]]
  );
};

exports.updateProfileImage = function _callee3(req, res) {
  var _req$body2, image_url, customer_id;

  return regeneratorRuntime.async(
    function _callee3$(_context3) {
      while (1) {
        switch ((_context3.prev = _context3.next)) {
          case 0:
            console.log('in updateProfileImage');
            (_req$body2 = req.body),
              (image_url = _req$body2.image_url),
              (customer_id = _req$body2.customer_id);
            _context3.prev = 2;
            _context3.next = 5;
            return regeneratorRuntime.awrap(
              customerService.updateProfileImage(image_url, customer_id)
            );

          case 5:
            console.log('User profile image updated successfully');
            res.status(200).json({
              message: 'User image updated successfully',
            });
            _context3.next = 13;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3['catch'](2);
            console.error(
              'Error in updating user profile image: ',
              _context3.t0
            );
            res.status(500).json({
              message: 'Error updating user image information',
            });

          case 13:
          case 'end':
            return _context3.stop();
        }
      }
    },
    null,
    null,
    [[2, 9]]
  );
};
