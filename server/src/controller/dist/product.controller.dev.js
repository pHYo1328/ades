"use strict";

var chalk = require('chalk');

var productManager = require('../services/product.services'); // Get product by ID


exports.processGetProductByID = function _callee(req, res, next) {
  var productID, product_id, errors, productData, data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(chalk.blue('processGetProductByID running'));
          productID = req.params.productID;
          product_id = productID;
          errors = [];

          if (product_id == '') {
            errors.push({
              parameter: 'product_id',
              value: 'Empty product_id',
              message: 'product_id is empty'
            });
          }

          _context.prev = 5;
          _context.next = 8;
          return regeneratorRuntime.awrap(productManager.getProductByID(product_id));

        case 8:
          productData = _context.sent;

          if (!productData) {
            _context.next = 13;
            break;
          }

          console.log(chalk.yellow('Product data: ', productData));
          data = {
            name: productData.name,
            price: productData.price,
            description: productData.description,
            category: productData.category,
            image_url: productData.image_url
          };
          return _context.abrupt("return", res.status(200).json({
            statusCode: 200,
            ok: true,
            message: 'Read product details successful',
            data: data
          }));

        case 13:
          return _context.abrupt("return", res.status(404).json({
            statusCode: 404,
            ok: true,
            message: 'No such product exists'
          }));

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](5);

          if (!(_context.t0.message === 'product_id is empty')) {
            _context.next = 20;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            statusCode: 400,
            ok: true,
            message: 'Product ID is missing'
          }));

        case 20:
          console.error(chalk.red('Error in getProductByID: ', _context.t0));
          return _context.abrupt("return", next(_context.t0));

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 16]]);
}; // Delete product by ID


exports.processDeleteProductByID = function _callee2(req, res, next) {
  var productID, product_id, errors, deletedProductData;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log(chalk.blue('processDeleteProductByID running'));
          productID = req.params.productID;
          product_id = productID;
          errors = [];

          if (product_id == '') {
            errors.push({
              parameter: 'product_id',
              value: 'Empty product_id',
              message: 'product_id is empty'
            });
          }

          _context2.prev = 5;
          _context2.next = 8;
          return regeneratorRuntime.awrap(productManager.deleteProductByID(product_id));

        case 8:
          deletedProductData = _context2.sent;

          if (!deletedProductData) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", res.status(200).json({
            statusCode: 200,
            ok: true,
            message: 'Product Deletion successful',
            data: deletedProductData
          }));

        case 11:
          return _context2.abrupt("return", res.status(404).json({
            statusCode: 404,
            ok: true,
            message: 'No such product exists'
          }));

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](5);

          if (!(_context2.t0.message === 'product_id is empty')) {
            _context2.next = 18;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            statusCode: 400,
            ok: true,
            message: 'Product ID is missing'
          }));

        case 18:
          console.error(chalk.red('Error in deleteProductByID: ', _context2.t0));
          return _context2.abrupt("return", next(_context2.t0));

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[5, 14]]);
}; // get all products


exports.processGetAllProducts = function _callee3(req, res, next) {
  var productData, data;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log(chalk.blue('processGetAllProducts running'));
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(productManager.getAllProducts());

        case 4:
          productData = _context3.sent;

          if (!productData) {
            _context3.next = 9;
            break;
          }

          console.log(chalk.yellow('Product data: ', productData));
          data = {
            name: productData.name,
            price: productData.price,
            description: productData.description,
            category: productData.category,
            image_url: productData.image_url
          };
          return _context3.abrupt("return", res.status(200).json({
            statusCode: 200,
            ok: true,
            message: 'Read product details successful',
            data: data
          }));

        case 9:
          return _context3.abrupt("return", res.status(404).json({
            statusCode: 404,
            ok: true,
            message: 'No products exists'
          }));

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](1);
          console.error(chalk.red('Error in getProductByID: ', _context3.t0));
          return _context3.abrupt("return", next(_context3.t0));

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 12]]);
}; // get products by category


exports.processGetProductsByCategoryID = function _callee4(req, res, next) {
  var categoryID, category_id, errors, productData, data;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log(chalk.blue('processGetProductsByCategoryID running'));
          categoryID = req.params.categoryID;
          category_id = categoryID;
          errors = [];

          if (category_id == '') {
            errors.push({
              parameter: 'category_id',
              value: 'Empty category_id',
              message: 'category_id is empty'
            });
          }

          _context4.prev = 5;
          _context4.next = 8;
          return regeneratorRuntime.awrap(productManager.getProductsByCategoryID(category_id));

        case 8:
          productData = _context4.sent;

          if (!productData) {
            _context4.next = 13;
            break;
          }

          console.log(chalk.yellow('Product data: ', productData));
          data = {
            name: productData.name,
            price: productData.price,
            description: productData.description,
            category: productData.category,
            image_url: productData.image_url
          };
          return _context4.abrupt("return", res.status(200).json({
            statusCode: 200,
            ok: true,
            message: 'Read product details successful',
            data: data
          }));

        case 13:
          return _context4.abrupt("return", res.status(404).json({
            statusCode: 404,
            ok: true,
            message: 'No such category exists'
          }));

        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](5);

          if (!(_context4.t0.message === 'category_id is empty')) {
            _context4.next = 20;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            statusCode: 400,
            ok: true,
            message: 'Category ID is missing'
          }));

        case 20:
          console.error(chalk.red('Error in getProductsByCategoryID: ', _context4.t0));
          return _context4.abrupt("return", next(_context4.t0));

        case 22:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[5, 16]]);
}; // get products by brand


exports.processGetProductsByBrandID = function _callee5(req, res, next) {
  var brandID, brand_id, errors, productData, data;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log(chalk.blue('processGetProductsByBrandID running'));
          brandID = req.params.brandID;
          brand_id = brandID;
          errors = [];

          if (brand_id == '') {
            errors.push({
              parameter: 'brand_id',
              value: 'Empty brand_id',
              message: 'brand_id is empty'
            });
          }

          _context5.prev = 5;
          _context5.next = 8;
          return regeneratorRuntime.awrap(productManager.getProductsByBrandID(brand_id));

        case 8:
          productData = _context5.sent;

          if (!productData) {
            _context5.next = 13;
            break;
          }

          console.log(chalk.yellow('Product data: ', productData));
          data = {
            name: productData.name,
            price: productData.price,
            description: productData.description,
            category: productData.category,
            image_url: productData.image_url
          };
          return _context5.abrupt("return", res.status(200).json({
            statusCode: 200,
            ok: true,
            message: 'Read product details successful',
            data: data
          }));

        case 13:
          return _context5.abrupt("return", res.status(404).json({
            statusCode: 404,
            ok: true,
            message: 'No such brand exists'
          }));

        case 16:
          _context5.prev = 16;
          _context5.t0 = _context5["catch"](5);

          if (!(_context5.t0.message === 'brand_id is empty')) {
            _context5.next = 20;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            statusCode: 400,
            ok: true,
            message: 'Brand ID is missing'
          }));

        case 20:
          console.error(chalk.red('Error in getProductsByBrandID: ', _context5.t0));
          return _context5.abrupt("return", next(_context5.t0));

        case 22:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[5, 16]]);
}; // get 3 newest product arrivals


exports.processGetNewArrivals = function _callee6(req, res, next) {
  var productData, data;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          console.log(chalk.blue('processGetNewArrivals running'));
          _context6.prev = 1;
          _context6.next = 4;
          return regeneratorRuntime.awrap(productManager.getNewArrivals());

        case 4:
          productData = _context6.sent;

          if (!productData) {
            _context6.next = 9;
            break;
          }

          console.log(chalk.yellow('Product data: ', productData));
          data = {
            name: productData.name,
            price: productData.price,
            description: productData.description,
            category: productData.category,
            image_url: productData.image_url
          };
          return _context6.abrupt("return", res.status(200).json({
            statusCode: 200,
            ok: true,
            message: 'Read product details successful',
            data: data
          }));

        case 9:
          return _context6.abrupt("return", res.status(404).json({
            statusCode: 404,
            ok: true,
            message: 'No products exists'
          }));

        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](1);
          console.error(chalk.red('Error in getNewArrivals: ', _context6.t0));
          return _context6.abrupt("return", next(_context6.t0));

        case 16:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 12]]);
}; // update product by ID


exports.processUpdateProductByID = function _callee7(req, res, next) {
  var productID, product_id, _req$body, name, price, description, category_id, brand_id, image_url, errors, updatedProductData;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          console.log(chalk.blue('processUpdateProductByID running'));
          productID = req.params.productID;
          product_id = productID;
          _req$body = req.body, name = _req$body.name, price = _req$body.price, description = _req$body.description, category_id = _req$body.category_id, brand_id = _req$body.brand_id, image_url = _req$body.image_url;
          errors = [];

          if (product_id == '') {
            errors.push({
              parameter: 'product_id',
              value: 'Empty product_id',
              message: 'product_id is empty'
            });
          } else if (name == '' || price == '' || description == '' || category_id == '' || brand_id == '' || image_url == '') {
            errors.push({
              parameter: 'Input fields',
              value: 'Empty input fields',
              message: 'All input fields is required to be filled.'
            });
          }

          _context7.prev = 6;
          _context7.next = 9;
          return regeneratorRuntime.awrap(productManager.updateProductByID(name, price, description, category_id, brand_id, image_url, product_id));

        case 9:
          updatedProductData = _context7.sent;

          if (!updatedProductData) {
            _context7.next = 12;
            break;
          }

          return _context7.abrupt("return", res.status(200).json({
            statusCode: 200,
            ok: true,
            message: 'Update product details successful'
          }));

        case 12:
          return _context7.abrupt("return", res.status(404).json({
            statusCode: 404,
            ok: true,
            message: 'No such product exists'
          }));

        case 15:
          _context7.prev = 15;
          _context7.t0 = _context7["catch"](6);

          if (!(_context7.t0.message === 'product_id is empty')) {
            _context7.next = 21;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            statusCode: 400,
            ok: true,
            message: 'Product ID is missing'
          }));

        case 21:
          if (!(_context7.t0.message === 'All input fields is required to be filled.')) {
            _context7.next = 23;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            statusCode: 400,
            ok: true,
            message: 'Product data is missing'
          }));

        case 23:
          console.error(chalk.red('Error in updateProductByID: ', _context7.t0));
          return _context7.abrupt("return", next(_context7.t0));

        case 25:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[6, 15]]);
}; // create new product


exports.processCreateProduct = function _callee8(req, res, next) {
  var _req$body2, name, price, description, category_id, brand_id, image, errors, createdProductData;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          console.log(chalk.blue("processCreateProduct running"));
          _req$body2 = req.body, name = _req$body2.name, price = _req$body2.price, description = _req$body2.description, category_id = _req$body2.category_id, brand_id = _req$body2.brand_id, image = _req$body2.image;
          errors = [];

          if (name == "" || price == "" || description == "" || category_id == "" || brand_id == "" || image_url == "") {
            errors.push({
              parameter: 'Input fields',
              value: 'Empty input fields',
              message: 'All input fields is required to be filled.'
            });
          }

          _context8.prev = 4;
          _context8.next = 7;
          return regeneratorRuntime.awrap(productManager.createProduct(name, price, description, category_id, brand_id, image));

        case 7:
          createdProductData = _context8.sent;

          if (!createdProductData) {
            _context8.next = 10;
            break;
          }

          return _context8.abrupt("return", res.status(200).json({
            statusCode: 200,
            ok: true,
            message: 'Create product successful'
          }));

        case 10:
          _context8.next = 18;
          break;

        case 12:
          _context8.prev = 12;
          _context8.t0 = _context8["catch"](4);

          if (!(_context8.t0.message === 'All input fields is required to be filled.')) {
            _context8.next = 16;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            statusCode: 400,
            ok: true,
            message: 'Product data is missing'
          }));

        case 16:
          console.error(chalk.red("Error in createProduct: ", _context8.t0));
          return _context8.abrupt("return", next(_context8.t0));

        case 18:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[4, 12]]);
};