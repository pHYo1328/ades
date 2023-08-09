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

var bcrypt = require('bcrypt');

var adminServices = require('../services/admin.services');

var chalk = require('chalk');

var pool = require('../config/database'); // Update user information

var updateUser = function updateUser(req, res) {
  var _req$body,
    userid,
    username,
    email,
    password,
    getUserQuery,
    _ref,
    _ref2,
    user,
    previousHashedPwd,
    isSamePassword,
    hashedPassword,
    updatedUser;

  return regeneratorRuntime.async(
    function updateUser$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            (_req$body = req.body),
              (userid = _req$body.userid),
              (username = _req$body.username),
              (email = _req$body.email),
              (password = _req$body.password);
            _context.prev = 1;
            console.log('updateController userid', userid); // Fetch the previous hashed password from the database

            getUserQuery = 'SELECT password FROM users WHERE customer_id = ?;';
            _context.next = 6;
            return regeneratorRuntime.awrap(pool.query(getUserQuery, [userid]));

          case 6:
            _ref = _context.sent;
            _ref2 = _slicedToArray(_ref, 1);
            user = _ref2[0];
            previousHashedPwd = user[0].password; // Compare the new password with the previous password

            _context.next = 12;
            return regeneratorRuntime.awrap(
              bcrypt.compare(password, previousHashedPwd)
            );

          case 12:
            isSamePassword = _context.sent;

            if (!isSamePassword) {
              _context.next = 17;
              break;
            }

            // Password is the same as the previous password
            console.log('New password is the same as the previous password');
            res.status(400).json({
              error: 'New password cannot be the same as the previous password',
            });
            return _context.abrupt('return');

          case 17:
            _context.next = 19;
            return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

          case 19:
            hashedPassword = _context.sent;
            _context.next = 22;
            return regeneratorRuntime.awrap(
              adminServices.updateUser(username, email, hashedPassword, userid)
            );

          case 22:
            updatedUser = _context.sent;
            console.log('updated user', userid);
            res.status(200).json(updatedUser);
            _context.next = 31;
            break;

          case 27:
            _context.prev = 27;
            _context.t0 = _context['catch'](1);
            console.error(chalk.red('Error in updating user: ', _context.t0));
            res.status(500).json({
              error: 'Failed to update user',
            });

          case 31:
          case 'end':
            return _context.stop();
        }
      }
    },
    null,
    null,
    [[1, 27]]
  );
};

module.exports = {
  updateUser: updateUser,
};
