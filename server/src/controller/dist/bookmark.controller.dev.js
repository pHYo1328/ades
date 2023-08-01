'use strict';

var chalk = require('chalk');

var bookmarkService = require('../services/bookmark.service');

exports.processAddBookMark = function _callee(req, res, next) {
  var _req$body, customerId, brandId, error, data, result;

  return regeneratorRuntime.async(
    function _callee$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            console.log(chalk.blue('processAddBookMark is running'));
            (_req$body = req.body),
              (customerId = _req$body.customerId),
              (brandId = _req$body.brandId); // Take single brandId instead of an array of brandIds

            console.log(
              chalk.yellow('Inspecting req body variables'),
              customerId,
              brandId
            );
            _context.prev = 3;

            if (!(isNaN(parseInt(customerId)) || isNaN(parseInt(brandId)))) {
              _context.next = 8;
              break;
            }

            // Check if brandId is a number
            error = new Error('Invalid ID parameters');
            error.status = 400;
            throw error;

          case 8:
            data = {
              customerId: customerId,
              brandId: brandId, // Pass single brandId to service function
            };
            _context.next = 11;
            return regeneratorRuntime.awrap(bookmarkService.addBookMark(data));

          case 11:
            result = _context.sent;
            console.log(
              chalk.yellow(
                'Inspect result variable from processAddBookMark service',
                result
              )
            );
            return _context.abrupt(
              'return',
              res.status(200).send({
                message: 'Bookmark record is inserted',
                data: result,
              })
            );

          case 16:
            _context.prev = 16;
            _context.t0 = _context['catch'](3);
            console.log(
              chalk.red('Error from bookmark service: ' + _context.t0)
            );
            next(_context.t0);

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    },
    null,
    null,
    [[3, 16]]
  );
};

exports.processRemoveBookMark = function _callee2(req, res, next) {
  var _req$params, customerId, brandId, error, data, result;

  return regeneratorRuntime.async(
    function _callee2$(_context2) {
      while (1) {
        switch ((_context2.prev = _context2.next)) {
          case 0:
            // New controller function for removing bookmarks
            console.log(chalk.blue('processRemoveBookMark is running'));
            (_req$params = req.params),
              (customerId = _req$params.customerId),
              (brandId = _req$params.brandId); // Take single brandId instead of an array of brandIds

            console.log(
              chalk.yellow('Inspecting req body variables'),
              customerId,
              brandId
            );
            _context2.prev = 3;

            if (!(isNaN(parseInt(customerId)) || isNaN(parseInt(brandId)))) {
              _context2.next = 8;
              break;
            }

            // Check if brandId is a number
            error = new Error('Invalid ID parameters');
            error.status = 400;
            throw error;

          case 8:
            data = {
              customerId: customerId,
              brandId: brandId, // Pass single brandId to service function
            };
            _context2.next = 11;
            return regeneratorRuntime.awrap(
              bookmarkService.removeBookMark(data)
            );

          case 11:
            result = _context2.sent;
            // Call service function to remove bookmark
            console.log(
              chalk.yellow(
                'Inspect result variable from processRemoveBookMark service',
                result
              )
            );
            return _context2.abrupt(
              'return',
              res.status(200).send({
                message: 'Bookmark record is removed',
                data: result,
              })
            );

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2['catch'](3);
            console.log(
              chalk.red('Error from bookmark service: ' + _context2.t0)
            );
            next(_context2.t0);

          case 20:
          case 'end':
            return _context2.stop();
        }
      }
    },
    null,
    null,
    [[3, 16]]
  );
};

exports.processFetchBookmarks = function _callee3(req, res, next) {
  var customerId, data, result;
  return regeneratorRuntime.async(
    function _callee3$(_context3) {
      while (1) {
        switch ((_context3.prev = _context3.next)) {
          case 0:
            console.log(chalk.blue('processFetchBookmarks is running'));
            customerId = req.params.customerId;
            console.log(
              chalk.yellow('Inspecting req body variables'),
              customerId
            );
            _context3.prev = 3;
            data = {
              customerId: customerId,
            };
            _context3.next = 7;
            return regeneratorRuntime.awrap(
              bookmarkService.fetchBookmarkByCustomerID(data)
            );

          case 7:
            result = _context3.sent;
            console.log(
              chalk.yellow(
                'Inspect result variable from processFetchBookmarks service',
                result
              )
            );
            return _context3.abrupt(
              'return',
              res.status(200).send({
                message: 'bookmark records are fetched',
                data: result,
              })
            );

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3['catch'](3);
            console.log(
              chalk.red('Error from bookmark service:' + _context3.t0)
            );
            next(_context3.t0);

          case 16:
          case 'end':
            return _context3.stop();
        }
      }
    },
    null,
    null,
    [[3, 12]]
  );
};
