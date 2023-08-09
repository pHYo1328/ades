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

// THINZAR HNIN YU (P2201014)
var cloudinary = require('cloudinary').v2; // cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   secure: true,
//   // upload_preset: CLOUDINARY_UPLOAD_PRESET,
//   api_key: CLOUDINARY_API_KEY,
//   api_secret: CLOUDINARY_API_SECRET
// })

var chalk = require('chalk');

var productServices = require('../services/product.services');

var cloudinary_url = process.env.CLOUDINARY_URL; // GET
// // Get product by ID

exports.processGetProductByID = function _callee(req, res, next) {
  var productID, _ref, _ref2, productData, imageData, data;

  return regeneratorRuntime.async(
    function _callee$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            productID = req.params.productID;
            console.log(chalk.blue('processGetProductByID running'));

            if (productID) {
              _context.next = 4;
              break;
            }

            return _context.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Product ID is missing',
              })
            );

          case 4:
            _context.prev = 4;
            _context.next = 7;
            return regeneratorRuntime.awrap(
              productServices.getProductByID(productID)
            );

          case 7:
            _ref = _context.sent;
            _ref2 = _slicedToArray(_ref, 2);
            productData = _ref2[0];
            imageData = _ref2[1];

            if (productData) {
              _context.next = 13;
              break;
            }

            return _context.abrupt(
              'return',
              res.status(204).json({
                statusCode: 204,
                ok: true,
                message: 'No such product exists',
              })
            );

          case 13:
            console.log(chalk.green(Object.values(productData)));
            console.log(chalk.green(Object.values(imageData)));
            data = {
              product_name: productData.product_name,
              price: productData.price,
              description: productData.description,
              category_name: productData.category_name,
              brand_name: productData.brand_name,
              average_rating: productData.average_rating,
              rating_count: productData.rating_count,
              quantity: productData.quantity,
              category_id: productData.category_id,
              brand_id: productData.brand_id,
              image_url: imageData.map(function (u) {
                return u.image_url;
              }),
            };
            return _context.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read product details successful',
                data: data,
              })
            );

          case 19:
            _context.prev = 19;
            _context.t0 = _context['catch'](4);
            console.error(chalk.red('Error in getProductByID: ', _context.t0));
            return _context.abrupt('return', next(_context.t0));

          case 23:
          case 'end':
            return _context.stop();
        }
      }
    },
    null,
    null,
    [[4, 19]]
  );
}; // get all products

exports.processGetAllProducts = function _callee2(req, res, next) {
  var productData, products;
  return regeneratorRuntime.async(
    function _callee2$(_context2) {
      while (1) {
        switch ((_context2.prev = _context2.next)) {
          case 0:
            console.log(chalk.blue('processGetAllProducts running'));
            _context2.prev = 1;
            _context2.next = 4;
            return regeneratorRuntime.awrap(productServices.getAllProducts());

          case 4:
            productData = _context2.sent;

            if (!(!productData || productData.length === 0)) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No products exist',
              })
            );

          case 7:
            console.log(chalk.yellow('Product data: ', productData));
            products = productData.map(function (product) {
              return {
                product_id: product.product_id,
                product_name: product.product_name,
                price: product.price,
                description: product.description,
                category_name: product.category_name,
                brand_name: product.brand_name,
                image_url: product.image_url,
                quantity: product.quantity,
              };
            });
            return _context2.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read product details successful',
                data: products,
              })
            );

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2['catch'](1);
            console.error(chalk.red('Error in getAllProducts: ', _context2.t0));
            return _context2.abrupt('return', next(_context2.t0));

          case 16:
          case 'end':
            return _context2.stop();
        }
      }
    },
    null,
    null,
    [[1, 12]]
  );
}; // get products by category or brand

exports.processGetProductsByCategoryOrBrand = function _callee3(
  req,
  res,
  next
) {
  var _req$params,
    categoryID,
    brandID,
    limit,
    offset,
    sort,
    productData,
    products;

  return regeneratorRuntime.async(
    function _callee3$(_context3) {
      while (1) {
        switch ((_context3.prev = _context3.next)) {
          case 0:
            console.log(
              chalk.blue('processGetProductsByCategoryOrBrand running')
            );
            (_req$params = req.params),
              (categoryID = _req$params.categoryID),
              (brandID = _req$params.brandID),
              (limit = _req$params.limit),
              (offset = _req$params.offset),
              (sort = _req$params.sort);

            if (!(!categoryID || !brandID)) {
              _context3.next = 4;
              break;
            }

            return _context3.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Category ID or Brand ID is missing',
              })
            );

          case 4:
            if (!(isNaN(parseInt(categoryID)) || isNaN(parseInt(brandID)))) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Category ID or Brand ID is not a number',
              })
            );

          case 6:
            _context3.prev = 6;
            _context3.next = 9;
            return regeneratorRuntime.awrap(
              productServices.getProductsByCategoryOrBrand(
                categoryID,
                brandID,
                parseInt(limit),
                parseInt(offset),
                parseInt(sort)
              )
            );

          case 9:
            productData = _context3.sent;
            console.log(chalk.yellow('Product data: ', productData));

            if (!(!productData || productData.length === 0)) {
              _context3.next = 13;
              break;
            }

            return _context3.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'No products exist',
              })
            );

          case 13:
            console.log(chalk.yellow('Product data: ', productData));
            products = productData.map(function (product) {
              return {
                product_id: product.product_id,
                product_name: product.product_name,
                price: product.price,
                description: product.description,
                category_name: product.category_name,
                brand_name: product.brand_name,
                image_url: product.image_url,
              };
            });
            return _context3.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read product details successful',
                data: products,
              })
            );

          case 18:
            _context3.prev = 18;
            _context3.t0 = _context3['catch'](6);
            console.error(
              chalk.red('Error in getProductsByCategoryOrBrand: ', _context3.t0)
            );
            return _context3.abrupt('return', next(_context3.t0));

          case 22:
          case 'end':
            return _context3.stop();
        }
      }
    },
    null,
    null,
    [[6, 18]]
  );
}; // get products by category

exports.processGetProductsByCategoryID = function _callee4(req, res, next) {
  var categoryID, productData, products;
  return regeneratorRuntime.async(
    function _callee4$(_context4) {
      while (1) {
        switch ((_context4.prev = _context4.next)) {
          case 0:
            console.log(chalk.blue('processGetProductsByCategoryID running'));
            categoryID = req.params.categoryID;

            if (categoryID) {
              _context4.next = 4;
              break;
            }

            return _context4.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Category ID is missing',
              })
            );

          case 4:
            if (!isNaN(parseInt(categoryID))) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Category ID is not a number',
              })
            );

          case 6:
            _context4.prev = 6;
            _context4.next = 9;
            return regeneratorRuntime.awrap(
              productServices.getProductsByCategoryID(categoryID)
            );

          case 9:
            productData = _context4.sent;
            console.log(chalk.yellow('Product data: ', productData));

            if (!(!productData || productData.length === 0)) {
              _context4.next = 13;
              break;
            }

            return _context4.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'No products exist',
              })
            );

          case 13:
            console.log(chalk.yellow('Product data: ', productData));
            products = productData.map(function (product) {
              return {
                product_id: product.product_id,
                product_name: product.product_name,
                price: product.price,
                description: product.description,
                category_name: product.category_name,
                brand_name: product.brand_name,
                image_url: product.image_url,
                quantity: product.quantity,
              };
            });
            return _context4.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read product details successful',
                data: products,
              })
            );

          case 18:
            _context4.prev = 18;
            _context4.t0 = _context4['catch'](6);
            console.error(
              chalk.red('Error in getProductsByCategoryID: ', _context4.t0)
            );
            return _context4.abrupt('return', next(_context4.t0));

          case 22:
          case 'end':
            return _context4.stop();
        }
      }
    },
    null,
    null,
    [[6, 18]]
  );
}; // get products by brand

exports.processGetProductsByBrandID = function _callee5(req, res, next) {
  var brandID, productData, products;
  return regeneratorRuntime.async(
    function _callee5$(_context5) {
      while (1) {
        switch ((_context5.prev = _context5.next)) {
          case 0:
            console.log(chalk.blue('processGetProductsByBrandID running'));
            brandID = req.params.brandID;

            if (brandID) {
              _context5.next = 4;
              break;
            }

            return _context5.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Brand ID is missing',
              })
            );

          case 4:
            if (!isNaN(parseInt(brandID))) {
              _context5.next = 6;
              break;
            }

            return _context5.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Brand ID is not a number',
              })
            );

          case 6:
            _context5.prev = 6;
            _context5.next = 9;
            return regeneratorRuntime.awrap(
              productServices.getProductsByBrandID(brandID)
            );

          case 9:
            productData = _context5.sent;
            console.log(chalk.yellow('Product data: ', productData));

            if (!(!productData || productData.length === 0)) {
              _context5.next = 13;
              break;
            }

            return _context5.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'No products exist',
              })
            );

          case 13:
            console.log(chalk.yellow('Product data: ', productData));
            products = productData.map(function (product) {
              return {
                product_id: product.product_id,
                product_name: product.product_name,
                price: product.price,
                description: product.description,
                category_name: product.category_name,
                brand_name: product.brand_name,
                image_url: product.image_url,
                quantity: product.quantity,
              };
            });
            return _context5.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read product details successful',
                data: products,
              })
            );

          case 18:
            _context5.prev = 18;
            _context5.t0 = _context5['catch'](6);
            console.error(
              chalk.red('Error in getProductsByBrandID: ', _context5.t0)
            );
            return _context5.abrupt('return', next(_context5.t0));

          case 22:
          case 'end':
            return _context5.stop();
        }
      }
    },
    null,
    null,
    [[6, 18]]
  );
}; // get 5 newest product arrivals

exports.processGetNewArrivals = function _callee6(req, res, next) {
  var productData, products;
  return regeneratorRuntime.async(
    function _callee6$(_context6) {
      while (1) {
        switch ((_context6.prev = _context6.next)) {
          case 0:
            console.log(chalk.blue('processGetNewArrivals running'));
            _context6.prev = 1;
            _context6.next = 4;
            return regeneratorRuntime.awrap(productServices.getNewArrivals());

          case 4:
            productData = _context6.sent;

            if (!(!productData || productData.length === 0)) {
              _context6.next = 7;
              break;
            }

            return _context6.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No products exist',
              })
            );

          case 7:
            console.log(chalk.yellow('Product data: ', productData));
            products = productData.map(function (product) {
              return {
                product_id: product.product_id,
                product_name: product.product_name,
                price: product.price,
                description: product.description,
                category_name: product.category_name,
                brand_name: product.brand_name,
                image_url: product.image_url,
              };
            });
            return _context6.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read product details successful',
                data: products,
              })
            );

          case 12:
            _context6.prev = 12;
            _context6.t0 = _context6['catch'](1);
            console.error(chalk.red('Error in getNewArrivals: ', _context6.t0));
            return _context6.abrupt('return', next(_context6.t0));

          case 16:
          case 'end':
            return _context6.stop();
        }
      }
    },
    null,
    null,
    [[1, 12]]
  );
}; // get brand name by brand ID

exports.processGetBrandByID = function _callee7(req, res, next) {
  var brandID, brandData, data;
  return regeneratorRuntime.async(
    function _callee7$(_context7) {
      while (1) {
        switch ((_context7.prev = _context7.next)) {
          case 0:
            console.log(chalk.blue('processGetBrandByID running'));
            brandID = req.params.brandID;

            if (brandID) {
              _context7.next = 4;
              break;
            }

            return _context7.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Brand ID is missing',
              })
            );

          case 4:
            _context7.prev = 4;
            _context7.next = 7;
            return regeneratorRuntime.awrap(
              productServices.getBrandByID(brandID)
            );

          case 7:
            brandData = _context7.sent;

            if (!brandData) {
              _context7.next = 12;
              break;
            }

            console.log(chalk.yellow('Brand data: ', brandData));
            data = {
              brand_name: brandData.brand_name,
            };
            return _context7.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read brand name successful',
                data: data,
              })
            );

          case 12:
            return _context7.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No such brand exists',
              })
            );

          case 15:
            _context7.prev = 15;
            _context7.t0 = _context7['catch'](4);
            console.error(chalk.red('Error in getBrandByID: ', _context7.t0));
            return _context7.abrupt('return', next(_context7.t0));

          case 19:
          case 'end':
            return _context7.stop();
        }
      }
    },
    null,
    null,
    [[4, 15]]
  );
}; // get category name by category ID

exports.processGetCategoryByID = function _callee8(req, res, next) {
  var categoryID, categoryData, data;
  return regeneratorRuntime.async(
    function _callee8$(_context8) {
      while (1) {
        switch ((_context8.prev = _context8.next)) {
          case 0:
            console.log(chalk.blue('processGetCategoryByID running'));
            categoryID = req.params.categoryID;

            if (categoryID) {
              _context8.next = 4;
              break;
            }

            return _context8.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Category ID is missing',
              })
            );

          case 4:
            _context8.prev = 4;
            _context8.next = 7;
            return regeneratorRuntime.awrap(
              productServices.getCategoryByID(categoryID)
            );

          case 7:
            categoryData = _context8.sent;

            if (!categoryID) {
              _context8.next = 12;
              break;
            }

            console.log(chalk.yellow('Category data: ', categoryID));
            data = {
              category_name: categoryData.category_name,
            };
            return _context8.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read category name successful',
                data: data,
              })
            );

          case 12:
            return _context8.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No such category exists',
              })
            );

          case 15:
            _context8.prev = 15;
            _context8.t0 = _context8['catch'](4);
            console.error(
              chalk.red('Error in getCategoryByID: ', _context8.t0)
            );
            return _context8.abrupt('return', next(_context8.t0));

          case 19:
          case 'end':
            return _context8.stop();
        }
      }
    },
    null,
    null,
    [[4, 15]]
  );
}; // get all ratings

exports.processGetAllRatingsByProductID = function _callee9(req, res, next) {
  var productID, ratingData, ratings;
  return regeneratorRuntime.async(
    function _callee9$(_context9) {
      while (1) {
        switch ((_context9.prev = _context9.next)) {
          case 0:
            console.log(chalk.blue('processGetAllRatingsByProductID running'));
            productID = req.params.productID;
            _context9.prev = 2;
            _context9.next = 5;
            return regeneratorRuntime.awrap(
              productServices.getAllRatingsByProductID(productID)
            );

          case 5:
            ratingData = _context9.sent;

            if (ratingData) {
              console.log(chalk.yellow('Rating data: ', ratingData));
              ratings = ratingData.map(function (rating) {
                return {
                  rating_id: rating.rating_id,
                  product_id: rating.product_id,
                  rating_score: rating.rating_score,
                  comment: rating.comment,
                };
              });
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read rating details successful',
                data: ratings,
              });
            } else {
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No ratings exists',
              });
            }

            _context9.next = 13;
            break;

          case 9:
            _context9.prev = 9;
            _context9.t0 = _context9['catch'](2);
            console.error(
              chalk.red('Error in getAllRatingsByProductID: ', _context9.t0)
            );
            return _context9.abrupt('return', next(_context9.t0));

          case 13:
          case 'end':
            return _context9.stop();
        }
      }
    },
    null,
    null,
    [[2, 9]]
  );
}; // get all brands

exports.processGetAllBrands = function _callee10(req, res, next) {
  var brandData, brands;
  return regeneratorRuntime.async(
    function _callee10$(_context10) {
      while (1) {
        switch ((_context10.prev = _context10.next)) {
          case 0:
            console.log(chalk.blue('processGetAllBrands running'));
            _context10.prev = 1;
            _context10.next = 4;
            return regeneratorRuntime.awrap(productServices.getAllBrands());

          case 4:
            brandData = _context10.sent;

            if (brandData) {
              console.log(chalk.yellow('Brand data: ', brandData));
              brands = brandData.map(function (brand) {
                return {
                  brand_id: brand.brand_id,
                  brand_name: brand.brand_name,
                };
              });
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read brand details successful',
                data: brands,
              });
            } else {
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No brands exists',
              });
            }

            _context10.next = 12;
            break;

          case 8:
            _context10.prev = 8;
            _context10.t0 = _context10['catch'](1);
            console.error(chalk.red('Error in getAllBrands: ', _context10.t0));
            return _context10.abrupt('return', next(_context10.t0));

          case 12:
          case 'end':
            return _context10.stop();
        }
      }
    },
    null,
    null,
    [[1, 8]]
  );
}; // get all category

exports.processGetAllCategory = function _callee11(req, res, next) {
  var categoryData, categories;
  return regeneratorRuntime.async(
    function _callee11$(_context11) {
      while (1) {
        switch ((_context11.prev = _context11.next)) {
          case 0:
            console.log(chalk.blue('processGetAllCategory running'));
            _context11.prev = 1;
            _context11.next = 4;
            return regeneratorRuntime.awrap(productServices.getAllCategory());

          case 4:
            categoryData = _context11.sent;

            if (categoryData) {
              console.log(chalk.yellow('Category data: ', categoryData));
              categories = categoryData.map(function (category) {
                return {
                  category_id: category.category_id,
                  category_name: category.category_name,
                };
              });
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read category details successful',
                data: categories,
              });
            } else {
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No categories exists',
              });
            }

            _context11.next = 12;
            break;

          case 8:
            _context11.prev = 8;
            _context11.t0 = _context11['catch'](1);
            console.error(
              chalk.red('Error in getAllCategory: ', _context11.t0)
            );
            return _context11.abrupt('return', next(_context11.t0));

          case 12:
          case 'end':
            return _context11.stop();
        }
      }
    },
    null,
    null,
    [[1, 8]]
  );
}; // search results

exports.processGetSearchResults = function _callee12(req, res, next) {
  var _req$query,
    product_name,
    category_id,
    brand_id,
    max_price,
    min_price,
    searchResultData,
    searchResults;

  return regeneratorRuntime.async(
    function _callee12$(_context12) {
      while (1) {
        switch ((_context12.prev = _context12.next)) {
          case 0:
            console.log(chalk.blue('processGetSearchResults running'));
            (_req$query = req.query),
              (product_name = _req$query.product_name),
              (category_id = _req$query.category_id),
              (brand_id = _req$query.brand_id),
              (max_price = _req$query.max_price),
              (min_price = _req$query.min_price);
            _context12.prev = 2;
            _context12.next = 5;
            return regeneratorRuntime.awrap(
              productServices.getSearchResults(
                product_name,
                category_id,
                brand_id,
                max_price,
                min_price
              )
            );

          case 5:
            searchResultData = _context12.sent;

            if (searchResultData && searchResultData.length > 0) {
              console.log(
                chalk.yellow('Search result data: ', searchResultData)
              );
              searchResults = searchResultData.map(function (searchResult) {
                return {
                  product_id: searchResult.product_id,
                  product_name: searchResult.product_name,
                  price: searchResult.price,
                  description: searchResult.description,
                  category_name: searchResult.category_name,
                  brand_name: searchResult.brand_name,
                  image_url: searchResult.image_url,
                };
              });
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read search results details successful',
                data: searchResults,
              });
            } else {
              res.status(204).json({
                statusCode: 204,
                ok: true,
                message: 'No products exists',
                data: [],
              });
            }

            _context12.next = 13;
            break;

          case 9:
            _context12.prev = 9;
            _context12.t0 = _context12['catch'](2);
            console.error(
              chalk.red('Error in getSearchResults: ', _context12.t0)
            );
            return _context12.abrupt('return', next(_context12.t0));

          case 13:
          case 'end':
            return _context12.stop();
        }
      }
    },
    null,
    null,
    [[2, 9]]
  );
}; // get statistics

exports.processGetStatistics = function _callee13(req, res, next) {
  var statisticsData, data;
  return regeneratorRuntime.async(
    function _callee13$(_context13) {
      while (1) {
        switch ((_context13.prev = _context13.next)) {
          case 0:
            console.log(chalk.blue('processGetStatistics running'));
            _context13.prev = 1;
            _context13.next = 4;
            return regeneratorRuntime.awrap(productServices.getStatistics());

          case 4:
            statisticsData = _context13.sent;
            console.log(chalk.yellow(statisticsData));

            if (statisticsData) {
              _context13.next = 8;
              break;
            }

            return _context13.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No statistics exist',
              })
            );

          case 8:
            console.log(chalk.yellow('Statistics data: ', statisticsData));
            data = {
              total_sold: statisticsData.total_sold,
              total_inventory: statisticsData.total_inventory,
              total_payment: statisticsData.total_payment,
              total_order: statisticsData.total_order,
              total_products: statisticsData.total_products,
            };
            console.log(chalk.green(data));
            return _context13.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read statistics details successful',
                data: data,
              })
            );

          case 14:
            _context13.prev = 14;
            _context13.t0 = _context13['catch'](1);
            console.error(
              chalk.red('Error in getProductByID: ', _context13.t0)
            );
            return _context13.abrupt('return', next(_context13.t0));

          case 18:
          case 'end':
            return _context13.stop();
        }
      }
    },
    null,
    null,
    [[1, 14]]
  );
}; // get total revenue by year and month

exports.processGetTotalRevenue = function _callee14(req, res, next) {
  var revenueData, revenues;
  return regeneratorRuntime.async(
    function _callee14$(_context14) {
      while (1) {
        switch ((_context14.prev = _context14.next)) {
          case 0:
            console.log(chalk.blue('processGetTotalRevenue running'));
            _context14.prev = 1;
            _context14.next = 4;
            return regeneratorRuntime.awrap(productServices.getTotalRevenue());

          case 4:
            revenueData = _context14.sent;
            console.log(chalk.yellow(revenueData));

            if (revenueData) {
              _context14.next = 8;
              break;
            }

            return _context14.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No payments exist',
              })
            );

          case 8:
            console.log(chalk.yellow('revenueData data: ', revenueData));
            revenues = revenueData.map(function (revenue) {
              return {
                year: revenue.year,
                month: revenue.month,
                total: revenue.total,
              };
            });
            console.log(chalk.green(revenues));
            return _context14.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read revenue details successful',
                revenues: revenues,
              })
            );

          case 14:
            _context14.prev = 14;
            _context14.t0 = _context14['catch'](1);
            console.error(
              chalk.red('Error in getTotalRevenue: ', _context14.t0)
            );
            return _context14.abrupt('return', next(_context14.t0));

          case 18:
          case 'end':
            return _context14.stop();
        }
      }
    },
    null,
    null,
    [[1, 14]]
  );
}; // get total number of products by category

exports.processGetTotalNumberOfProductsByCategory = function _callee15(
  req,
  res,
  next
) {
  var categoryData, categories;
  return regeneratorRuntime.async(
    function _callee15$(_context15) {
      while (1) {
        switch ((_context15.prev = _context15.next)) {
          case 0:
            console.log(
              chalk.blue('processGetTotalNumberOfProductsByCategory running')
            );
            _context15.prev = 1;
            _context15.next = 4;
            return regeneratorRuntime.awrap(
              productServices.getTotalNumberOfProductsByCategory()
            );

          case 4:
            categoryData = _context15.sent;
            console.log(chalk.yellow(categoryData));

            if (categoryData) {
              _context15.next = 8;
              break;
            }

            return _context15.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No categories exist',
              })
            );

          case 8:
            console.log(chalk.yellow('categoryData data: ', categoryData));
            categories = categoryData.map(function (category) {
              return {
                category: category.category,
                count: category.count,
              };
            });
            console.log(chalk.green(categories));
            return _context15.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read category details successful',
                categories: categories,
              })
            );

          case 14:
            _context15.prev = 14;
            _context15.t0 = _context15['catch'](1);
            console.error(
              chalk.red(
                'Error in getTotalNumberOfProductsByCategory: ',
                _context15.t0
              )
            );
            return _context15.abrupt('return', next(_context15.t0));

          case 18:
          case 'end':
            return _context15.stop();
        }
      }
    },
    null,
    null,
    [[1, 14]]
  );
}; // get total number of orders by brand

exports.processGetTotalNumberOfOrdersByBrand = function _callee16(
  req,
  res,
  next
) {
  var brandData, brands;
  return regeneratorRuntime.async(
    function _callee16$(_context16) {
      while (1) {
        switch ((_context16.prev = _context16.next)) {
          case 0:
            console.log(
              chalk.blue('processGetTotalNumberOfOrdersByBrand running')
            );
            _context16.prev = 1;
            _context16.next = 4;
            return regeneratorRuntime.awrap(
              productServices.getTotalNumberOfOrdersByBrand()
            );

          case 4:
            brandData = _context16.sent;
            console.log(chalk.yellow(brandData));

            if (brandData) {
              _context16.next = 8;
              break;
            }

            return _context16.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No brands exist',
              })
            );

          case 8:
            console.log(chalk.yellow('brandData data: ', brandData));
            brands = brandData.map(function (brand) {
              return {
                brand: brand.brand,
                count: brand.count,
              };
            });
            console.log(chalk.green(brands));
            return _context16.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read brand details successful',
                brands: brands,
              })
            );

          case 14:
            _context16.prev = 14;
            _context16.t0 = _context16['catch'](1);
            console.error(
              chalk.red(
                'Error in getTotalNumberOfOrdersByBrand: ',
                _context16.t0
              )
            );
            return _context16.abrupt('return', next(_context16.t0));

          case 18:
          case 'end':
            return _context16.stop();
        }
      }
    },
    null,
    null,
    [[1, 14]]
  );
}; // get total number of bookmarks by brand

exports.processGetTotalNumberOfBookmarksByBrand = function _callee17(
  req,
  res,
  next
) {
  var brandData, brands;
  return regeneratorRuntime.async(
    function _callee17$(_context17) {
      while (1) {
        switch ((_context17.prev = _context17.next)) {
          case 0:
            console.log(
              chalk.blue('processGetTotalNumberOfBookmarksByBrand running')
            );
            _context17.prev = 1;
            _context17.next = 4;
            return regeneratorRuntime.awrap(
              productServices.getTotalNumberOfBookmarksByBrand()
            );

          case 4:
            brandData = _context17.sent;
            console.log(chalk.yellow(brandData));

            if (brandData) {
              _context17.next = 8;
              break;
            }

            return _context17.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No brands exist',
              })
            );

          case 8:
            console.log(chalk.yellow('brandData data: ', brandData));
            brands = brandData.map(function (brand) {
              return {
                brand: brand.brand,
                count: brand.count,
              };
            });
            console.log(chalk.green(brands));
            return _context17.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read brand details successful',
                brands: brands,
              })
            );

          case 14:
            _context17.prev = 14;
            _context17.t0 = _context17['catch'](1);
            console.error(
              chalk.red(
                'Error in getTotalNumberOfBookmarksByBrand: ',
                _context17.t0
              )
            );
            return _context17.abrupt('return', next(_context17.t0));

          case 18:
          case 'end':
            return _context17.stop();
        }
      }
    },
    null,
    null,
    [[1, 14]]
  );
}; // get total number of orders by shipping method

exports.processGetTotalNumberOfOrdersByShipping = function _callee18(
  req,
  res,
  next
) {
  var shippingData, methods;
  return regeneratorRuntime.async(
    function _callee18$(_context18) {
      while (1) {
        switch ((_context18.prev = _context18.next)) {
          case 0:
            console.log(
              chalk.blue('processGetTotalNumberOfOrdersByShipping running')
            );
            _context18.prev = 1;
            _context18.next = 4;
            return regeneratorRuntime.awrap(
              productServices.getTotalNumberOfOrdersByShipping()
            );

          case 4:
            shippingData = _context18.sent;
            console.log(chalk.yellow(shippingData));

            if (shippingData) {
              _context18.next = 8;
              break;
            }

            return _context18.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No shipping methods exist',
              })
            );

          case 8:
            console.log(chalk.yellow('shippingData data: ', shippingData));
            methods = shippingData.map(function (method) {
              return {
                shipping: method.shipping,
                count: method.count,
              };
            });
            console.log(chalk.green(methods));
            return _context18.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read shipping details successful',
                methods: methods,
              })
            );

          case 14:
            _context18.prev = 14;
            _context18.t0 = _context18['catch'](1);
            console.error(
              chalk.red(
                'Error in getTotalNumberOfOrdersByShipping: ',
                _context18.t0
              )
            );
            return _context18.abrupt('return', next(_context18.t0));

          case 18:
          case 'end':
            return _context18.stop();
        }
      }
    },
    null,
    null,
    [[1, 14]]
  );
}; // get total number of payments by payment method

exports.processGetTotalNumberOfPaymentsByMethod = function _callee19(
  req,
  res,
  next
) {
  var paymentData, methods;
  return regeneratorRuntime.async(
    function _callee19$(_context19) {
      while (1) {
        switch ((_context19.prev = _context19.next)) {
          case 0:
            console.log(
              chalk.blue('processGetTotalNumberOfPaymentsByMethod running')
            );
            _context19.prev = 1;
            _context19.next = 4;
            return regeneratorRuntime.awrap(
              productServices.getTotalNumberOfPaymentsByMethod()
            );

          case 4:
            paymentData = _context19.sent;
            console.log(chalk.yellow(paymentData));

            if (paymentData) {
              _context19.next = 8;
              break;
            }

            return _context19.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No payment methods exist',
              })
            );

          case 8:
            console.log(chalk.yellow('paymentData data: ', paymentData));
            methods = paymentData.map(function (method) {
              return {
                payment: method.payment,
                count: method.count,
              };
            });
            console.log(chalk.green(methods));
            return _context19.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read payment details successful',
                methods: methods,
              })
            );

          case 14:
            _context19.prev = 14;
            _context19.t0 = _context19['catch'](1);
            console.error(
              chalk.red(
                'Error in getTotalNumberOfPaymentsByMethod: ',
                _context19.t0
              )
            );
            return _context19.abrupt('return', next(_context19.t0));

          case 18:
          case 'end':
            return _context19.stop();
        }
      }
    },
    null,
    null,
    [[1, 14]]
  );
}; // get total number of orders by status

exports.processGetTotalNumberOfOrdersByStatus = function _callee20(
  req,
  res,
  next
) {
  var orderData, orders;
  return regeneratorRuntime.async(
    function _callee20$(_context20) {
      while (1) {
        switch ((_context20.prev = _context20.next)) {
          case 0:
            console.log(
              chalk.blue('processGetTotalNumberOfOrdersByStatus running')
            );
            _context20.prev = 1;
            _context20.next = 4;
            return regeneratorRuntime.awrap(
              productServices.getTotalNumberOfOrdersByStatus()
            );

          case 4:
            orderData = _context20.sent;
            console.log(chalk.yellow(orderData));

            if (orderData) {
              _context20.next = 8;
              break;
            }

            return _context20.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No orders methods exist',
              })
            );

          case 8:
            console.log(chalk.yellow('orderData data: ', orderData));
            orders = orderData.map(function (order) {
              return {
                status: order.status,
                count: order.count,
              };
            });
            console.log(chalk.green(orders));
            return _context20.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read order details successful',
                orders: orders,
              })
            );

          case 14:
            _context20.prev = 14;
            _context20.t0 = _context20['catch'](1);
            console.error(
              chalk.red(
                'Error in getTotalNumberOfOrdersByStatus: ',
                _context20.t0
              )
            );
            return _context20.abrupt('return', next(_context20.t0));

          case 18:
          case 'end':
            return _context20.stop();
        }
      }
    },
    null,
    null,
    [[1, 14]]
  );
}; // get total revenue by brand

exports.processGetTotalRevenueByBrand = function _callee21(req, res, next) {
  var orderData, orders;
  return regeneratorRuntime.async(
    function _callee21$(_context21) {
      while (1) {
        switch ((_context21.prev = _context21.next)) {
          case 0:
            console.log(chalk.blue('processGetTotalRevenueByBrand running'));
            _context21.prev = 1;
            _context21.next = 4;
            return regeneratorRuntime.awrap(
              productServices.getTotalRevenueByBrand()
            );

          case 4:
            orderData = _context21.sent;
            console.log(chalk.yellow(orderData));

            if (orderData) {
              _context21.next = 8;
              break;
            }

            return _context21.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No brands exist',
              })
            );

          case 8:
            console.log(chalk.yellow('orderData data: ', orderData));
            orders = orderData.map(function (order) {
              return {
                brand: order.brand,
                count: order.count,
              };
            });
            console.log(chalk.green(orders));
            return _context21.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read order details successful',
                orders: orders,
              })
            );

          case 14:
            _context21.prev = 14;
            _context21.t0 = _context21['catch'](1);
            console.error(
              chalk.red('Error in getTotalRevenueByBrand: ', _context21.t0)
            );
            return _context21.abrupt('return', next(_context21.t0));

          case 18:
          case 'end':
            return _context21.stop();
        }
      }
    },
    null,
    null,
    [[1, 14]]
  );
}; // get total revenue by category

exports.processGetTotalRevenueByCategory = function _callee22(req, res, next) {
  var orderData, orders;
  return regeneratorRuntime.async(
    function _callee22$(_context22) {
      while (1) {
        switch ((_context22.prev = _context22.next)) {
          case 0:
            console.log(chalk.blue('processGetTotalRevenueByCategory running'));
            _context22.prev = 1;
            _context22.next = 4;
            return regeneratorRuntime.awrap(
              productServices.getTotalRevenueByCategory()
            );

          case 4:
            orderData = _context22.sent;
            console.log(chalk.yellow(orderData));

            if (orderData) {
              _context22.next = 8;
              break;
            }

            return _context22.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No categories exist',
              })
            );

          case 8:
            console.log(chalk.yellow('orderData data: ', orderData));
            orders = orderData.map(function (order) {
              return {
                category: order.category,
                count: order.count,
              };
            });
            console.log(chalk.green(orders));
            return _context22.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read order details successful',
                orders: orders,
              })
            );

          case 14:
            _context22.prev = 14;
            _context22.t0 = _context22['catch'](1);
            console.error(
              chalk.red('Error in getTotalRevenueByCategory: ', _context22.t0)
            );
            return _context22.abrupt('return', next(_context22.t0));

          case 18:
          case 'end':
            return _context22.stop();
        }
      }
    },
    null,
    null,
    [[1, 14]]
  );
}; // get total number of products by brand or category

exports.processGetTotalNumberOfProducts = function _callee23(req, res, next) {
  var _req$params2, categoryID, brandID, productData, data, response;

  return regeneratorRuntime.async(
    function _callee23$(_context23) {
      while (1) {
        switch ((_context23.prev = _context23.next)) {
          case 0:
            console.log(chalk.blue('processGetTotalNumberOfProducts running'));
            (_req$params2 = req.params),
              (categoryID = _req$params2.categoryID),
              (brandID = _req$params2.brandID);

            if (!(!categoryID || !brandID)) {
              _context23.next = 4;
              break;
            }

            return _context23.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Category ID or Brand ID is missing',
              })
            );

          case 4:
            if (!(isNaN(parseInt(categoryID)) || isNaN(parseInt(brandID)))) {
              _context23.next = 6;
              break;
            }

            return _context23.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Category ID or Brand ID is not a number',
              })
            );

          case 6:
            _context23.prev = 6;
            _context23.next = 9;
            return regeneratorRuntime.awrap(
              productServices.getTotalNumberOfProducts(categoryID, brandID)
            );

          case 9:
            productData = _context23.sent;
            console.log(chalk.yellow('Total Products: ', productData));
            data = {
              total_products: productData.total_products,
            };
            console.log(chalk.green(data));
            response = {
              statusCode: 200,
              ok: true,
              message: 'Read total products details successful',
              data: data.total_products,
            };
            console.log(chalk.yellow(productData.length));

            if (productData.length === 0) {
              response.statusCode = 200;
              response.message = 'No categories or brands exist';
            }

            return _context23.abrupt(
              'return',
              res.status(response.statusCode).json(response)
            );

          case 19:
            _context23.prev = 19;
            _context23.t0 = _context23['catch'](6);
            console.error(
              chalk.red('Error in getTotalNumberOfProducts: ', _context23.t0)
            );
            return _context23.abrupt('return', next(_context23.t0));

          case 23:
          case 'end':
            return _context23.stop();
        }
      }
    },
    null,
    null,
    [[6, 19]]
  );
}; // get images by product ID

exports.processGetImagesByProductID = function _callee24(req, res, next) {
  var productID, imageData, images;
  return regeneratorRuntime.async(
    function _callee24$(_context24) {
      while (1) {
        switch ((_context24.prev = _context24.next)) {
          case 0:
            console.log(chalk.blue('processGetImagesByProductID running'));
            productID = req.params.productID;
            _context24.prev = 2;
            _context24.next = 5;
            return regeneratorRuntime.awrap(
              productServices.getImagesByProductID(productID)
            );

          case 5:
            imageData = _context24.sent;

            if (!(!imageData || imageData.length === 0)) {
              _context24.next = 8;
              break;
            }

            return _context24.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No images exist',
              })
            );

          case 8:
            console.log(chalk.yellow('Image data: ', imageData));
            images = imageData.map(function (image) {
              return {
                product_id: image.product_id,
                image_id: image.image_id,
                image_url: image.image_url,
              };
            });
            return _context24.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read image details successful',
                data: images,
              })
            );

          case 13:
            _context24.prev = 13;
            _context24.t0 = _context24['catch'](2);
            console.error(
              chalk.red('Error in getImagesByProductID: ', _context24.t0)
            );
            return _context24.abrupt('return', next(_context24.t0));

          case 17:
          case 'end':
            return _context24.stop();
        }
      }
    },
    null,
    null,
    [[2, 13]]
  );
}; // get related products

exports.processGetRelatedProducts = function _callee25(req, res, next) {
  var productID, productData, products;
  return regeneratorRuntime.async(
    function _callee25$(_context25) {
      while (1) {
        switch ((_context25.prev = _context25.next)) {
          case 0:
            console.log(chalk.blue('processGetRelatedProducts running')); // const { productID } = req.params;

            productID = req.params.productID;
            _context25.prev = 2;
            _context25.next = 5;
            return regeneratorRuntime.awrap(
              productServices.getRelatedProducts(productID)
            );

          case 5:
            productData = _context25.sent;

            if (productData) {
              console.log(chalk.yellow('Product data: ', productData));
              products = productData.map(function (product) {
                return {
                  product_id: product.product_id,
                  product_name: product.product_name,
                  price: product.price,
                  description: product.description,
                  category_name: product.category_name,
                  brand_name: product.brand_name,
                  image_url: product.image_url,
                  category_id: product.category_id,
                  brand_id: product.brand_id,
                };
              });
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Read product details successful',
                data: products,
              });
            } else {
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No related products exists',
              });
            }

            _context25.next = 13;
            break;

          case 9:
            _context25.prev = 9;
            _context25.t0 = _context25['catch'](2);
            console.error(
              chalk.red('Error in getRelatedProducts: ', _context25.t0)
            );
            return _context25.abrupt('return', next(_context25.t0));

          case 13:
          case 'end':
            return _context25.stop();
        }
      }
    },
    null,
    null,
    [[2, 9]]
  );
}; // DELETE
// Delete product by ID

exports.processDeleteProductByID = function _callee26(req, res, next) {
  var productID, deletedProductData;
  return regeneratorRuntime.async(
    function _callee26$(_context26) {
      while (1) {
        switch ((_context26.prev = _context26.next)) {
          case 0:
            console.log(chalk.blue('processDeleteProductByID running'));
            productID = req.params.productID;

            if (productID) {
              _context26.next = 4;
              break;
            }

            return _context26.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Product ID is missing',
              })
            );

          case 4:
            _context26.prev = 4;
            _context26.next = 7;
            return regeneratorRuntime.awrap(
              productServices.deleteProductByID(parseInt(productID))
            );

          case 7:
            deletedProductData = _context26.sent;

            if (deletedProductData) {
              _context26.next = 10;
              break;
            }

            return _context26.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No such product exists',
              })
            );

          case 10:
            return _context26.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Product Deletion successful',
                data: deletedProductData,
              })
            );

          case 13:
            _context26.prev = 13;
            _context26.t0 = _context26['catch'](4);
            console.error(
              chalk.red('Error in deleteProductByID: ', _context26.t0)
            );
            return _context26.abrupt('return', next(_context26.t0));

          case 17:
          case 'end':
            return _context26.stop();
        }
      }
    },
    null,
    null,
    [[4, 13]]
  );
}; // Delete brand by ID

exports.processDeleteBrandByID = function _callee27(req, res, next) {
  var brandID, deletedBrandData;
  return regeneratorRuntime.async(
    function _callee27$(_context27) {
      while (1) {
        switch ((_context27.prev = _context27.next)) {
          case 0:
            console.log(chalk.blue('processDeleteBrandByID running'));
            brandID = req.params.brandID;

            if (brandID) {
              _context27.next = 4;
              break;
            }

            return _context27.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Brand ID is missing',
              })
            );

          case 4:
            _context27.prev = 4;
            _context27.next = 7;
            return regeneratorRuntime.awrap(
              productServices.deleteBrandByID(parseInt(brandID))
            );

          case 7:
            deletedBrandData = _context27.sent;

            if (deletedBrandData) {
              _context27.next = 10;
              break;
            }

            return _context27.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No such brand exists',
              })
            );

          case 10:
            return _context27.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Brand Deletion successful',
                data: deletedBrandData,
              })
            );

          case 13:
            _context27.prev = 13;
            _context27.t0 = _context27['catch'](4);
            console.error(
              chalk.red('Error in deleteBrandByID: ', _context27.t0)
            );
            return _context27.abrupt('return', next(_context27.t0));

          case 17:
          case 'end':
            return _context27.stop();
        }
      }
    },
    null,
    null,
    [[4, 13]]
  );
}; // Delete category by ID

exports.processDeleteCategoryByID = function _callee28(req, res, next) {
  var categoryID, deletedCategoryData;
  return regeneratorRuntime.async(
    function _callee28$(_context28) {
      while (1) {
        switch ((_context28.prev = _context28.next)) {
          case 0:
            console.log(chalk.blue('processDeleteCategoryByID running'));
            categoryID = req.params.categoryID;

            if (categoryID) {
              _context28.next = 4;
              break;
            }

            return _context28.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Category ID is missing',
              })
            );

          case 4:
            _context28.prev = 4;
            _context28.next = 7;
            return regeneratorRuntime.awrap(
              productServices.deleteCategoryByID(parseInt(categoryID))
            );

          case 7:
            deletedCategoryData = _context28.sent;

            if (deletedCategoryData) {
              _context28.next = 10;
              break;
            }

            return _context28.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No such category exists',
              })
            );

          case 10:
            return _context28.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Category Deletion successful',
                data: deletedCategoryData,
              })
            );

          case 13:
            _context28.prev = 13;
            _context28.t0 = _context28['catch'](4);
            console.error(
              chalk.red('Error in deleteCategoryByID: ', _context28.t0)
            );
            return _context28.abrupt('return', next(_context28.t0));

          case 17:
          case 'end':
            return _context28.stop();
        }
      }
    },
    null,
    null,
    [[4, 13]]
  );
}; // delete images by image id

exports.processDeleteImagesByID = function _callee29(req, res, next) {
  var imageID, deletedImageData;
  return regeneratorRuntime.async(
    function _callee29$(_context29) {
      while (1) {
        switch ((_context29.prev = _context29.next)) {
          case 0:
            console.log(chalk.blue('processDeleteImagesByID running'));
            imageID = req.params.imageID;

            if (imageID) {
              _context29.next = 4;
              break;
            }

            return _context29.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Image ID is missing',
              })
            );

          case 4:
            _context29.prev = 4;
            _context29.next = 7;
            return regeneratorRuntime.awrap(
              productServices.deleteImageByID(parseInt(imageID))
            );

          case 7:
            deletedImageData = _context29.sent;

            if (deletedImageData) {
              _context29.next = 10;
              break;
            }

            return _context29.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No such images exist',
              })
            );

          case 10:
            return _context29.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Image Deletion successful',
                data: deletedImageData,
              })
            );

          case 13:
            _context29.prev = 13;
            _context29.t0 = _context29['catch'](4);
            console.error(
              chalk.red('Error in deleteImagesByID: ', _context29.t0)
            );
            return _context29.abrupt('return', next(_context29.t0));

          case 17:
          case 'end':
            return _context29.stop();
        }
      }
    },
    null,
    null,
    [[4, 13]]
  );
}; // delete images by product id

exports.processDeleteImagesByProductID = function _callee30(req, res, next) {
  var productID, deletedImageData;
  return regeneratorRuntime.async(
    function _callee30$(_context30) {
      while (1) {
        switch ((_context30.prev = _context30.next)) {
          case 0:
            console.log(chalk.blue('processDeleteImagesByProductID running'));
            productID = req.params.productID;

            if (productID) {
              _context30.next = 4;
              break;
            }

            return _context30.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Product ID is missing',
              })
            );

          case 4:
            _context30.prev = 4;
            _context30.next = 7;
            return regeneratorRuntime.awrap(
              productServices.deleteImagesByProductID(parseInt(productID))
            );

          case 7:
            deletedImageData = _context30.sent;

            if (deletedImageData) {
              _context30.next = 10;
              break;
            }

            return _context30.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No such products exist',
              })
            );

          case 10:
            return _context30.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Image Deletion successful',
                data: deletedImageData,
              })
            );

          case 13:
            _context30.prev = 13;
            _context30.t0 = _context30['catch'](4);
            console.error(
              chalk.red('Error in deleteImagesByProductID: ', _context30.t0)
            );
            return _context30.abrupt('return', next(_context30.t0));

          case 17:
          case 'end':
            return _context30.stop();
        }
      }
    },
    null,
    null,
    [[4, 13]]
  );
}; // PUT
// update product by ID

exports.processUpdateProductByID = function _callee31(req, res, next) {
  var productID,
    _req$body,
    product_name,
    price,
    description,
    category_id,
    brand_id,
    quantity,
    floatPrice,
    intCategoryID,
    intBrandID,
    intQuantity,
    updatedProductData;

  return regeneratorRuntime.async(
    function _callee31$(_context31) {
      while (1) {
        switch ((_context31.prev = _context31.next)) {
          case 0:
            console.log(chalk.blue('processUpdateProductByID running'));
            productID = req.params.productID;
            (_req$body = req.body),
              (product_name = _req$body.product_name),
              (price = _req$body.price),
              (description = _req$body.description),
              (category_id = _req$body.category_id),
              (brand_id = _req$body.brand_id),
              (quantity = _req$body.quantity);
            floatPrice = price ? parseFloat(price) : null;
            intCategoryID = category_id ? parseInt(category_id) : null;
            intBrandID = brand_id ? parseInt(brand_id) : null;
            intQuantity = quantity ? parseInt(quantity) : null;

            if (productID) {
              _context31.next = 9;
              break;
            }

            return _context31.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Product ID is missing',
              })
            );

          case 9:
            if (
              !(
                product_name == '' &&
                price == '' &&
                description == '' &&
                category_id == '' &&
                brand_id == '' &&
                quantity == ''
              )
            ) {
              _context31.next = 11;
              break;
            }

            return _context31.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'All input fields cannot be blank.',
              })
            );

          case 11:
            _context31.prev = 11;
            _context31.next = 14;
            return regeneratorRuntime.awrap(
              productServices.updateProductByID(
                product_name,
                floatPrice,
                description,
                intCategoryID,
                intBrandID,
                quantity,
                parseInt(productID)
              )
            );

          case 14:
            updatedProductData = _context31.sent;

            if (updatedProductData) {
              _context31.next = 17;
              break;
            }

            return _context31.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No such product exists',
              })
            );

          case 17:
            return _context31.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Update product details successful',
              })
            );

          case 20:
            _context31.prev = 20;
            _context31.t0 = _context31['catch'](11);
            console.error(
              chalk.red('Error in updateProductByID: ', _context31.t0)
            );
            return _context31.abrupt('return', next(_context31.t0));

          case 24:
          case 'end':
            return _context31.stop();
        }
      }
    },
    null,
    null,
    [[11, 20]]
  );
}; // update inventory - increase 1

exports.processUpdateInventoryUp = function _callee32(req, res, next) {
  var productID, updatedInventoryData;
  return regeneratorRuntime.async(
    function _callee32$(_context32) {
      while (1) {
        switch ((_context32.prev = _context32.next)) {
          case 0:
            console.log(chalk.blue('processUpdateInventoryUp running'));
            productID = req.params.productID;

            if (productID) {
              _context32.next = 4;
              break;
            }

            return _context32.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Product ID is missing',
              })
            );

          case 4:
            _context32.prev = 4;
            _context32.next = 7;
            return regeneratorRuntime.awrap(
              productServices.updateInventoryUp(productID)
            );

          case 7:
            updatedInventoryData = _context32.sent;

            if (updatedInventoryData) {
              _context32.next = 10;
              break;
            }

            return _context32.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No such product exists',
              })
            );

          case 10:
            return _context32.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Update product details successful',
              })
            );

          case 13:
            _context32.prev = 13;
            _context32.t0 = _context32['catch'](4);
            console.error(
              chalk.red('Error in updateInventoryUp: ', _context32.t0)
            );
            return _context32.abrupt('return', next(_context32.t0));

          case 17:
          case 'end':
            return _context32.stop();
        }
      }
    },
    null,
    null,
    [[4, 13]]
  );
}; // update inventory - decrease 1

exports.processUpdateInventoryDown = function _callee33(req, res, next) {
  var productID, updatedInventoryData;
  return regeneratorRuntime.async(
    function _callee33$(_context33) {
      while (1) {
        switch ((_context33.prev = _context33.next)) {
          case 0:
            console.log(chalk.blue('processUpdateInventoryDown running'));
            productID = req.params.productID;

            if (productID) {
              _context33.next = 4;
              break;
            }

            return _context33.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Product ID is missing',
              })
            );

          case 4:
            _context33.prev = 4;
            _context33.next = 7;
            return regeneratorRuntime.awrap(
              productServices.updateInventoryDown(productID)
            );

          case 7:
            updatedInventoryData = _context33.sent;

            if (updatedInventoryData) {
              _context33.next = 10;
              break;
            }

            return _context33.abrupt(
              'return',
              res.status(404).json({
                statusCode: 404,
                ok: true,
                message: 'No such product exists',
              })
            );

          case 10:
            return _context33.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Update product details successful',
              })
            );

          case 13:
            _context33.prev = 13;
            _context33.t0 = _context33['catch'](4);
            console.error(
              chalk.red('Error in updateInventoryDown: ', _context33.t0)
            );
            return _context33.abrupt('return', next(_context33.t0));

          case 17:
          case 'end':
            return _context33.stop();
        }
      }
    },
    null,
    null,
    [[4, 13]]
  );
}; // POST
// create new product

exports.processCreateProduct = function _callee34(req, res, next) {
  var _req$body2,
    name,
    price,
    description,
    category_id,
    brand_id,
    image,
    quantity,
    createdProductData;

  return regeneratorRuntime.async(
    function _callee34$(_context34) {
      while (1) {
        switch ((_context34.prev = _context34.next)) {
          case 0:
            console.log(chalk.blue('processCreateProduct running'));
            (_req$body2 = req.body),
              (name = _req$body2.name),
              (price = _req$body2.price),
              (description = _req$body2.description),
              (category_id = _req$body2.category_id),
              (brand_id = _req$body2.brand_id),
              (image = _req$body2.image),
              (quantity = _req$body2.quantity);

            if (
              !(
                name == '' ||
                !name ||
                price == '' ||
                !price ||
                description == '' ||
                !description ||
                category_id == '' ||
                !category_id ||
                brand_id == '' ||
                !brand_id
              )
            ) {
              _context34.next = 4;
              break;
            }

            return _context34.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Product data is missing',
              })
            );

          case 4:
            if (!(isNaN(price) || price <= 0)) {
              _context34.next = 6;
              break;
            }

            return _context34.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Price has to be a number greater than 0',
              })
            );

          case 6:
            if (!(isNaN(quantity) || quantity < 0)) {
              _context34.next = 8;
              break;
            }

            return _context34.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Inventory has to be a number greater than 0',
              })
            );

          case 8:
            console.log(req.body);
            console.log('test');
            _context34.prev = 10;
            _context34.next = 13;
            return regeneratorRuntime.awrap(
              productServices.createProduct(
                name,
                parseFloat(price),
                description,
                parseInt(category_id),
                parseInt(brand_id),
                image,
                quantity
              )
            );

          case 13:
            createdProductData = _context34.sent;
            console.log(chalk.yellow(createdProductData));
            return _context34.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Create product successful',
              })
            );

          case 18:
            _context34.prev = 18;
            _context34.t0 = _context34['catch'](10);
            console.error(chalk.red(_context34.t0.code));
            console.error(chalk.red('Error in createProduct: ', _context34.t0));
            return _context34.abrupt('return', next(_context34.t0));

          case 23:
          case 'end':
            return _context34.stop();
        }
      }
    },
    null,
    null,
    [[10, 18]]
  );
}; // create rating

exports.processCreateRating = function _callee35(req, res, next) {
  var _req$body3,
    comment,
    rating_score,
    customer_id,
    product_id,
    createdRatingData;

  return regeneratorRuntime.async(
    function _callee35$(_context35) {
      while (1) {
        switch ((_context35.prev = _context35.next)) {
          case 0:
            console.log(chalk.blue('processCreateRating running'));
            (_req$body3 = req.body),
              (comment = _req$body3.comment),
              (rating_score = _req$body3.rating_score),
              (customer_id = _req$body3.customer_id),
              (product_id = _req$body3.product_id);

            if (!(!comment || !rating_score || !customer_id || !product_id)) {
              _context35.next = 4;
              break;
            }

            return _context35.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Rating data is missing',
              })
            );

          case 4:
            if (!(isNaN(rating_score) || rating_score < 0)) {
              _context35.next = 6;
              break;
            }

            return _context35.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Rating score has to be a number greater than 0',
              })
            );

          case 6:
            _context35.prev = 6;
            _context35.next = 9;
            return regeneratorRuntime.awrap(
              productServices.createRating(
                comment,
                rating_score,
                customer_id,
                product_id
              )
            );

          case 9:
            createdRatingData = _context35.sent;
            console.log(chalk.yellow(createdRatingData));
            return _context35.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Create rating successful',
              })
            );

          case 14:
            _context35.prev = 14;
            _context35.t0 = _context35['catch'](6);
            console.error(chalk.red(_context35.t0.code));
            console.error(chalk.red('Error in createRating: ', _context35.t0));
            return _context35.abrupt('return', next(_context35.t0));

          case 19:
          case 'end':
            return _context35.stop();
        }
      }
    },
    null,
    null,
    [[6, 14]]
  );
}; // create brand or category

exports.processCreateBrandOrCategory = function _callee36(req, res, next) {
  var _req$body4, name, type, createdData;

  return regeneratorRuntime.async(
    function _callee36$(_context36) {
      while (1) {
        switch ((_context36.prev = _context36.next)) {
          case 0:
            console.log(chalk.blue('processCreateBrandOrCategory running'));
            (_req$body4 = req.body),
              (name = _req$body4.name),
              (type = _req$body4.type);

            if (!(!name || !type)) {
              _context36.next = 4;
              break;
            }

            return _context36.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: true,
                message: 'Data is missing',
              })
            );

          case 4:
            console.log(req.body);
            _context36.prev = 5;
            _context36.next = 8;
            return regeneratorRuntime.awrap(
              productServices.createBrandOrCategory(name, type)
            );

          case 8:
            createdData = _context36.sent;
            console.log(chalk.yellow('createdData:', createdData));

            if (!(createdData == -1)) {
              _context36.next = 13;
              break;
            }

            console.log(chalk.yellow('createdData:', createdData));
            return _context36.abrupt(
              'return',
              res.status(409).json({
                statusCode: 409,
                ok: true,
                message: 'Duplicate',
              })
            );

          case 13:
            return _context36.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Create successful',
              })
            );

          case 16:
            _context36.prev = 16;
            _context36.t0 = _context36['catch'](5);
            console.error(chalk.red('error code', _context36.t0.code));
            console.error(
              chalk.red('Error in createBrandOrCategory: ', _context36.t0)
            );
            return _context36.abrupt('return', next(_context36.t0));

          case 21:
          case 'end':
            return _context36.stop();
        }
      }
    },
    null,
    null,
    [[5, 16]]
  );
}; // add new image to product

exports.processCreateImageForProduct = function _callee37(req, res, next) {
  var _req$body5, product_id, image_url, createdImageData;

  return regeneratorRuntime.async(
    function _callee37$(_context37) {
      while (1) {
        switch ((_context37.prev = _context37.next)) {
          case 0:
            console.log(chalk.blue('processCreateImageForProduct running'));
            (_req$body5 = req.body),
              (product_id = _req$body5.product_id),
              (image_url = _req$body5.image_url);

            if (!(!product_id || !image_url)) {
              _context37.next = 4;
              break;
            }

            return _context37.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: false,
                message: 'Image data is missing',
              })
            );

          case 4:
            if (!(isNaN(product_id) || product_id < 0)) {
              _context37.next = 6;
              break;
            }

            return _context37.abrupt(
              'return',
              res.status(400).json({
                statusCode: 400,
                ok: false,
                message: 'Product ID has to be a number greater than 0',
              })
            );

          case 6:
            console.log(chalk.yellow(image_url));
            _context37.prev = 7;
            _context37.next = 10;
            return regeneratorRuntime.awrap(
              productServices.createImageForProduct(image_url, product_id)
            );

          case 10:
            createdImageData = _context37.sent;
            console.log(chalk.yellow(createdImageData));

            if (!createdImageData) {
              _context37.next = 16;
              break;
            }

            return _context37.abrupt(
              'return',
              res.status(200).json({
                statusCode: 200,
                ok: true,
                message: 'Create image successful',
              })
            );

          case 16:
            return _context37.abrupt(
              'return',
              res.status(500).json({
                statusCode: 500,
                ok: false,
                message: 'Failed to create image',
              })
            );

          case 17:
            _context37.next = 23;
            break;

          case 19:
            _context37.prev = 19;
            _context37.t0 = _context37['catch'](7);
            console.error(
              chalk.red(
                'Error in processCreateImageForProduct: ',
                _context37.t0
              )
            );
            return _context37.abrupt('return', next(_context37.t0));

          case 23:
          case 'end':
            return _context37.stop();
        }
      }
    },
    null,
    null,
    [[7, 19]]
  );
};
