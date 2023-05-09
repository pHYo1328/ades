const productController = require('../controller/product.controller');
const cartController = require('../controller/cart.controller');
//const verifyAccessToken = require("../middlewares/verifyAccessToken");

module.exports = (app, router) => {
  router.get(
    '/api/products',
    //verifyAccessToken.verifyToken,
    productController.processGetAllProducts
  );
  router.get(
    '/api/product/:product_id',
    // verifyAccessToken.verifyToken,
    productController.processGetProductByID
  );
  router.get(
    '/api/products_category/:category_id',
    //verifyAccessToken.verifyToken,
    productController.processGetProductsByCategoryID
  );
  router.get(
    '/api/products_brand/:brand_id',
    //verifyAccessToken.verifyToken,
    productController.processGetProductsByBrandID
  );
  router.get(
    '/api/products/new_arrivals',
    //verifyAccessToken.verifyToken,
    productController.processGetNewArrivals
  );
  // router.post(
  //   "./api/products",
  //   //verifyAccessToken.verifyToken,
  //   productController.processAddProduct
  // );
  router.delete(
    '/api/product/:product_id',
    // verifyAccessToken.verifyToken,
    productController.processDeleteProductByID
  );
  // router.put(
  //   "./api/product/:product_id",
  //   //verifyAccessToken.verifyToken,
  //   productController.processUpdateProductByID
  // );

  router.post(
    './api/cart/:userID',
    //verifyAccessToken.verifyToken,
    cartController.processAddCartData
  );

  router.get(
    './api/cart/:userID',
    //verifyAccessToken.verifyToken,
    cartController.processGetCartData
  );

  router.delete(
    './api/cart/:userID',
    //verifyAccessToken.verifyToken,
    cartController.processDeleteCartData
  );
};
