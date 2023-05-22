const productController = require('../controller/product.controller');
const cartController = require('../controller/cart.controller');
const orderController = require('../controller/order.controller');
const paymentController = require('../controller/payment.controller');
const checkoutController = require('../controller/checkout.controller');
const registerController = require('../controller/registerController');
const authController = require('../controller/authController');
const refreshTokenController = require('../controller/refreshTokenController');
const logoutController = require('../controller/logoutController');
const forgotPasswordController = require('../controller/forgotPasswordController');
const verifyOTPController = require('../controller/verifyOTPController');
const registerAdminController = require('../controller/admin/registerAdminController');
const authAdminController = require('../controller/admin/authAdminController');
const refreshTokenAdminController = require('../controller/admin/refreshTokenAdminController');
const logoutAdminController = require('../controller/admin/logoutAdminController');
const forgotPasswordAdminController = require('../controller/admin/forgotPasswordAdminController');
const verifyOTPAdminController = require('../controller/admin/verifyOTPAdminController');

const getUserInfo = require('../controller/customerInfo');

//MIDDLEWARES
const verifyRoles = require("../middlewares/verifyRoles");
//const verifyAccessToken = require("../middlewares/verifyAccessToken");


//to use the middleware, see below 

// router.get('/api', verifyRoles('customer'), (req, res) => {
//   //This route can only be accessed by users with the 'customer' role
//   // request logic here
// });
module.exports = (app, router) => {
  // Thinzar
  // GET
  router.get('/api/products', productController.processGetAllProducts);
  router.get('/api/search', productController.processGetSearchResults);
  router.get('/api/brands', productController.processGetAllBrands);
  router.get('/api/category', productController.processGetAllCategory);
  router.get(
    '/api/products/category/:categoryID',
    productController.processGetProductsByCategoryID
  );
  router.get(
    '/api/products/brand/:brandID',
    productController.processGetProductsByBrandID
  );
  router.get(
    '/api/product/:productID',
    productController.processGetProductByID
  );
  router.get(
    '/api/category/:categoryID',
    productController.processGetCategoryByID
  );
  router.get('/api/brand/:brandID', productController.processGetBrandByID);
  router.get('/api/products/new', productController.processGetNewArrivals);

  router.get('/api/admin/statistics', productController.processGetStatistics);
  router.get(
    '/api/products/:productID/images',
    productController.processGetImagesByProductID
  );
  router.get(
    '/api/products/:categoryID/:brandID',
    productController.processGetProductsByCategoryOrBrand
  );

  // DELETE
  router.delete(
    '/api/brands/:brandID',
    productController.processDeleteBrandByID
  );
  router.delete(
    '/api/categories/:categoryID',
    productController.processDeleteCategoryByID
  );
  router.delete(
    '/api/products/:productID',
    productController.processDeleteProductByID
  );
  router.delete(
    '/api/products/images/:imageID',
    productController.processDeleteImagesByID
  );

  // POST
  router.post('/api/products', productController.processCreateProduct);
  router.post(
    '/api/products/admin/type',
    productController.processCreateBrandOrCategory
  );
  router.post(
    '/api/products/images',
    productController.processCreateImageForProduct
  );
  // PUT
  router.put(
    '/api/products/:productID',
    productController.processUpdateProductByID
  );
  router.put(
    '/api/products/inventory/plus/:productID',
    productController.processUpdateInventoryUp
  );
  router.put(
    '/api/products/inventory/minus/:productID',
    productController.processUpdateInventoryDown
  );
  router.put(
    '/api/products/:productID/images',
    productController.processDeleteProductImages
  );

  // PHYO

  router.post('/api/cart/:userID', cartController.processAddCartData);

  router.get(
    '/api/cart/:userID',
    //verifyAccessToken.verifyToken,
    cartController.processGetCartData
  );

  router.delete(
    '/api/cart/:userID',
    //verifyAccessToken.verifyToken,
    cartController.processDeleteCartData
  );

  router.get(
    '/api/cartdetails/getCartProductData',
    //verifyAccessToken.verifyToken,
    cartController.processGetCartProductData
  );

  router.post(
    '/api/order/:customerId',
    //verifyAccessToken.verifyToken,
    orderController.processAddCustomerOrder
  );
  router.get(
    '/api/payment/:paymentID',
    // verifyAccessToken.verifyToken,
    paymentController.processGetPaymentByID
  );
  router.get(
    '/api/payment_received/getListsByDeliStatus/',
    // verifyAccessToken.verifyToken,
    paymentController.processGetListsByDeliStatus
  );
  router.put(
    '/api/admin/updateDeliByID/:paymentID',
    // verifyAccessToken.verifyToken,
    paymentController.processUpdateDeliByID
  );

  router.get(
    '/api/paymentTotal/:orderID',
    //verifyAccessToken.verifyToken,
    paymentController.processGetPaymentTotal
  );

  router.get(
    '/api/order/getOrderDetailBeforePickUp/:customerID',
    //verifyAccessToken.verifyToken,
    orderController.processGetOrderDetailsBeforePickUp
  );

  router.get(
    '/api/order/getOrderDetailsByDeliverStatus/:customerID',
    //verifyAccessToken.verifyToken,
    orderController.processGetOrderDetailsByDeliverStatus
  );

  router.put(
    '/api/order/updateShippingDetails/:customerID',
    //verifyAccessToken.verifyToken,
    orderController.processUpdateShippingDetails
  );

  router.delete(
    '/api/order',
    //verifyAccessToken.verifyToken,
    orderController.processCancelOrder
  );

  router.get('/config', checkoutController.getConfig);

  router.post(
    '/createPaymentIntent/:orderID',
    checkoutController.createPaymentIntent
  );

  router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
  });

  router.post('/register', registerController.handleNewUser);

  router.post('/login', authController.handleLogin);

  router.get('/refresh', refreshTokenController.handleRefreshToken);

  router.put('/logout', logoutController.handleLogout);

  router.put('/forgot', forgotPasswordController.handleForgotPassword);

  router.post('/verify-otp', verifyOTPController.verifyOTP);

  router.get('/users', getUserInfo.retrieveUserInformation);

  // ADMIN ROUTES
  router.post('/register-admin', registerAdminController.handleNewAdmin);
  router.post('/login-admin', authAdminController.handleLogin);
  router.get('/refresh-admin', refreshTokenAdminController.handleRefreshToken);
  router.put('/logout-admin', logoutAdminController.handleLogout);
  router.put('/forgot-admin', forgotPasswordAdminController.handleForgotPassword);
  router.post('/verify-otp-admin', verifyOTPAdminController.verifyOTP);
};
