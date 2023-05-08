"use strict";

var pool = require('../config/database');

var chalk = require('chalk'); // get product by ID


module.exports.getProductByID = function _callee(product_id) {
  var productDataQuery, results;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(chalk.blue("getProductByID is called"));
          _context.prev = 1;
          productDataQuery = "SELECT name FROM product where product_id=?;";
          _context.next = 5;
          return regeneratorRuntime.awrap(connection.query(productDataQuery, [product_id]));

        case 5:
          results = _context.sent;
          console.log(chalk.green(results));
          return _context.abrupt("return", results[0]);

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](1);
          console.error(chalk.red('Error in getProductByID: ', _context.t0));
          throw _context.t0;

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 10]]);
}; // delete product by ID


module.exports.deleteProductByID = function _callee2(product_id) {
  var promisePool, connection, productDeleteQuery, results;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log(chalk.blue("deleteProductByID is called"));
          promisePool = pool.promise();
          _context2.next = 4;
          return regeneratorRuntime.awrap(promisePool.getConnection());

        case 4:
          connection = _context2.sent;
          _context2.prev = 5;
          productDeleteQuery = "DELETE FROM product where product_id =?";
          _context2.next = 9;
          return regeneratorRuntime.awrap(pool.query(productDeleteQuery, [product_id]));

        case 9:
          results = _context2.sent;
          console.log(chalk.green(results));
          return _context2.abrupt("return", results.affectedRows > 0);

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](5);
          console.error(chalk.red('Error in deleteProductByID: ', _context2.t0));
          throw _context2.t0;

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[5, 14]]);
}; // get all products


module.exports.getAllProducts = function _callee3() {
  var productsDataQuery, results;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log(chalk.blue("getAllProducts is called"));
          _context3.prev = 1;
          productsDataQuery = "SELECT * FROM product";
          _context3.next = 5;
          return regeneratorRuntime.awrap(pool.query(productsDataQuery));

        case 5:
          results = _context3.sent;
          console.log(chalk.green(results));
          return _context3.abrupt("return", results);

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](1);
          console.error(chalk.red('Error in getAllProducts: ', _context3.t0));
          throw _context3.t0;

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 10]]);
}; // get products by category


module.exports.getProductsByCategoryID = function _callee4(category_id) {
  var productsDataQuery, results;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log(chalk.blue("getProductsByCategoryID is called"));
          _context4.prev = 1;
          productsDataQuery = "SELECT * FROM product where category_id = ?";
          _context4.next = 5;
          return regeneratorRuntime.awrap(pool.query(productsDataQuery, [category_id]));

        case 5:
          results = _context4.sent;
          console.log(chalk.green(results));
          return _context4.abrupt("return", results);

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](1);
          console.error(chalk.red('Error in getProductsByCategoryID: ', _context4.t0));
          throw _context4.t0;

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 10]]);
}; // get products by brand


module.exports.getProductsByBrandID = function _callee5(brand_id) {
  var productsDataQuery, results;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log(chalk.blue("getProductsByBrandID is called"));
          _context5.prev = 1;
          productsDataQuery = "SELECT * FROM product where brand_id = ?";
          _context5.next = 5;
          return regeneratorRuntime.awrap(pool.query(productsDataQuery, [brand_id]));

        case 5:
          results = _context5.sent;
          console.log(chalk.green(results));
          return _context5.abrupt("return", results);

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](1);
          console.error(chalk.red('Error in getProductsByBrandID: ', _context5.t0));
          throw _context5.t0;

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 10]]);
}; // get 3 newest product arrivals


module.exports.getNewArrivals = function _callee6() {
  var productsDataQuery, results;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          console.log(chalk.blue("getProductsByBrandID is called"));
          _context6.prev = 1;
          productsDataQuery = "SELECT * FROM product order by created_at desc limit 3";
          _context6.next = 5;
          return regeneratorRuntime.awrap(pool.query(productsDataQuery));

        case 5:
          results = _context6.sent;
          console.log(chalk.green(results));
          return _context6.abrupt("return", results);

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](1);
          console.error(chalk.red('Error in getNewArrivals: ', _context6.t0));
          throw _context6.t0;

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 10]]);
}; // update product by ID


module.exports.updateProductByID = function _callee7(name, price, description, category_id, brand_id, image_url, product_id) {
  var promisePool, connection, productUpdateQuery, results;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          console.log(chalk.blue('updateProductByID is called'));
          promisePool = pool.promise();
          _context7.next = 4;
          return regeneratorRuntime.awrap(promisePool.getConnection());

        case 4:
          connection = _context7.sent;
          _context7.prev = 5;
          productUpdateQuery = 'UPDATE product SET name=COALESCE(?,name), price=COALESCE(?,price), description=COALESCE(?,description), category_id=COALESCE(?,category_id), brand_id=COALESCE(?,brand_id), image_url=COALESCE(?,image_url) where product_id = ?';
          _context7.next = 9;
          return regeneratorRuntime.awrap(connection.query(productUpdateQuery, [name, price, description, category_id, brand_id, image_url, product_id]));

        case 9:
          results = _context7.sent;
          console.log(chalk.green(results));
          return _context7.abrupt("return", results.affectedRows > 0);

        case 14:
          _context7.prev = 14;
          _context7.t0 = _context7["catch"](5);
          console.error(chalk.red('Error in updateProductByID: ', _context7.t0));
          throw _context7.t0;

        case 18:
          _context7.prev = 18;
          connection.release();
          return _context7.finish(18);

        case 21:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[5, 14, 18, 21]]);
}; // create product


module.exports.createProduct = function _callee8(name, price, description, category_id, brand_id, image) {
  var promisePool, connection, cloudinaryResult, productCreateQuery, results;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          console.log(chalk.blue('createProduct is called'));
          promisePool = pool.promise();
          _context8.next = 4;
          return regeneratorRuntime.awrap(promisePool.getConnection());

        case 4:
          connection = _context8.sent;
          _context8.prev = 5;
          _context8.next = 8;
          return regeneratorRuntime.awrap(cloudinary_api_key.uploader.upload(image.path));

        case 8:
          cloudinaryResult = _context8.sent;
          productCreateQuery = 'INSERT into product (name,price, description, category_id, brand_id, image_url) values (?,?,?,?,?,?)';
          _context8.next = 12;
          return regeneratorRuntime.awrap(connection.query(productCreateQuery, [name, price, description, category_id, brand_id, cloudinaryResult.secure_url]));

        case 12:
          results = _context8.sent;
          console.log(chalk.green(results));
          return _context8.abrupt("return", results.affectedRows > 0);

        case 17:
          _context8.prev = 17;
          _context8.t0 = _context8["catch"](5);
          console.error(chalk.red('Error in createProduct: ', _context8.t0));
          throw _context8.t0;

        case 21:
          _context8.prev = 21;
          connection.release();
          return _context8.finish(21);

        case 24:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[5, 17, 21, 24]]);
};