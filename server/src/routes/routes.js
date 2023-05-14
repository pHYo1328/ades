const productController = require("../controller/product.controller");
const cartController = require("../controller/cart.controller");
const orderController = require("../controller/order.controller");
const paymentController = require("../controller/payment.controller");
const checkoutController = require('../controller/checkout.controller')
//const verifyAccessToken = require("../middlewares/verifyAccessToken");

module.exports = (app, router) => {
  router.get(
    "/api/products",
    //verifyAccessToken.verifyToken,
    productController.processGetAllProducts
  );
  router.get("/api/search", productController.processGetSearchResults);
  router.get(
    "/api/brands",
    //verifyAccessToken.verifyToken,
    productController.processGetAllBrands
  );
  router.get(
    "/api/category",
    //verifyAccessToken.verifyToken,
    productController.processGetAllCategory
  );
  router.get(
    "/api/products/category/:categoryID",
    //verifyAccessToken.verifyToken,
    productController.processGetProductsByCategoryID
  );

  router.get(
    "/api/products/brand/:brandID",
    //verifyAccessToken.verifyToken,
    productController.processGetProductsByBrandID
  );
  router.get(
    "/api/product/:productID",
    // verifyAccessToken.verifyToken,
    productController.processGetProductByID
  );
  router.get(
    "/api/category/:categoryID",
    // verifyAccessToken.verifyToken,
    productController.processGetCategoryByID
  );
  router.get(
    "/api/brand/:brandID",
    // verifyAccessToken.verifyToken,
    productController.processGetBrandByID
  );
  router.get(
    "/api/products/new",
    //verifyAccessToken.verifyToken,
    productController.processGetNewArrivals
  );
  router.post(
    "/api/products",

    //verifyAccessToken.verifyToken,
    productController.processCreateProduct
  );
  router.delete(
    "/api/products/:productID",
    //verifyAccessToken.verifyToken,
    productController.processDeleteProductByID
  );
  router.put(
    "/api/products/:productID",
    //verifyAccessToken.verifyToken,
    productController.processUpdateProductByID
  );

  router.post(
    "/api/cart/:userID",
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
    '/api/cartdetails/getCartProductData',
    //verifyAccessToken.verifyToken,
    cartController.processGetCartProductData
  );

  router.post(
    "/api/order/:customerId",
    //verifyAccessToken.verifyToken,
    orderController.processAddCustomerOrder
  );
  router.get(
    "/api/payment/:paymentID",
    // verifyAccessToken.verifyToken,
    paymentController.processGetPaymentByID
  );
  router.get(
    "/api/payment_received/getListsByDeliStatus/",
    // verifyAccessToken.verifyToken,
    paymentController.processGetListsByDeliStatus
  );

  router.get(
    "/api/order/getOrderDetailBeforePickUp/:customerID",
    //verifyAccessToken.verifyToken,
    orderController.processGetOrderDetailsBeforePickUp
  );

  router.get(
    "/api/order/getOrderDetailsByDeliverStatus/:customerID",
    //verifyAccessToken.verifyToken,
    orderController.processGetOrderDetailsByDeliverStatus
  );

  router.put(
    "/api/order/updateShippingDetails/:customerID",
    //verifyAccessToken.verifyToken,
    orderController.processUpdateShippingDetails
  );

  router.delete(
    "/api/order",
    //verifyAccessToken.verifyToken,
    orderController.processCancelOrder
  );

  router.get(
    "/config", 
    checkoutController.getConfig
    );
  
  router.post(
  "/create-payment-intent", 
  checkoutController.createPaymentIntent
  );
};
