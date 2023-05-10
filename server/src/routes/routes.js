const productController = require('../controller/product.controller');
const cartController = require('../controller/cart.controller');
const orderController = require('../controller/order.controller');
//const verifyAccessToken = require("../middlewares/verifyAccessToken");

module.exports = (app, router) => {
  router.get(
    '/api/products',
    //verifyAccessToken.verifyToken,
    productController.processGetAllProducts
  );
  router.get(
    '/api/products/category/:categoryID',
    //verifyAccessToken.verifyToken,
    productController.processGetProductsByCategoryID
  );

  router.get(
    '/api/products/brand/:brandID',
    //verifyAccessToken.verifyToken,
    productController.processGetProductsByBrandID
  );
  router.get(
    '/api/product/:productID',
    // verifyAccessToken.verifyToken,
    productController.processGetProductByID
  );
  router.get(
    '/api/products/new',
    //verifyAccessToken.verifyToken,
    productController.processGetNewArrivals
  );
  // router.post(
  //   "./api/products",
  //   //verifyAccessToken.verifyToken,
  //   productController.processAddProduct
  // );
  router.delete(
    '/api/products/:productID',
    //verifyAccessToken.verifyToken,
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

  router.post(
    '/api/order/:customerId',
    //verifyAccessToken.verifyToken,
    orderController.processAddCustomerOrder
  );

  router.get(
    'api/order/getOrderDetailBeforePickUp/:customerID',
    //verifyAccessToken.verifyToken,
    orderController.processGetOrderDetailsBeforePickUp
  );

  router.get(
    'api/order/getOrderDetailsByDeliverStatus/:customerID',
    //verifyAccessToken.verifyToken,
    orderController.processGetOrderDetailsByDeliverStatus
  );

  router.put(
    'api/order/updateShippingDetails/:customerID',
    //verifyAccessToken.verifyToken,
    orderController.processUpdateShippingDetails
  );

  router.delete(
    'api/order',
    //verifyAccessToken.verifyToken,
    orderController.processCancelOrder
  );
};
