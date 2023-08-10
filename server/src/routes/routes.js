const bodyParser = require('body-parser');
const path = require('path');
const productController = require('../controller/product.controller');
const cartController = require('../controller/cart.controller');
const orderController = require('../controller/order.controller');
const inventoryController = require('../controller/inventory.controller.js');
const bookmarkController = require('../controller/bookmark.controller');
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
const shippingController = require('../controller/shipping.controller');
const getUserInfo = require('../controller/customerInfo');
const updateUser = require('../controller/updateUserController');
const deleteUser = require('../controller/deleteUserController');
const verificationEmail = require('../controller/emailVerificationController');
const verificationEmailAdmin = require('../controller/admin/emailVerificationAdminController');
const customerProfile = require('../controller/customerProfile');
const notificationController = require('../controller/notification.controller');
const resentOTPEmailController = require('../controller/resendOTPEmailController');
const stripe = require('../config/stripe');
const { handleWebhooks } = require('../controller/checkout.controller');

//MIDDLEWARES
const authenticateUser = require('../middlewares/authenticateUser');
const verifyRoles = require('../middlewares/verifyRoles');
//const verifyAccessToken = require("../middlewares/verifyAccessToken");

//to use the middleware, see below

// router.get('/api', verifyRoles('customer'), (req, res) => {
//   //This route can only be accessed by users with the 'customer' role
//   // request logic here
// });
module.exports = (app, router) => {
  // Thinzar
  // GET
  router.get('/api/allProducts', productController.processGetAllProducts);
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
    '/api/products/:categoryID/:brandID/:limit/:offset/:sort',
    productController.processGetProductsByCategoryOrBrand
  );
  router.get(
    '/api/products/total/:categoryID/:brandID',
    productController.processGetTotalNumberOfProducts
  );
  router.get(
    '/api/products/rating/:productID',
    productController.processGetAllRatingsByProductID
  );
  router.get(
    '/api/products/related/:productID',
    productController.processGetRelatedProducts
  );
  router.get('/api/admin/revenue', productController.processGetTotalRevenue);
  router.get(
    '/api/admin/categories/count',
    productController.processGetTotalNumberOfProductsByCategory
  );
  router.get(
    '/api/admin/orders/count',
    productController.processGetTotalNumberOfOrdersByBrand
  );
  router.get(
    '/api/admin/bookmarks/count',
    productController.processGetTotalNumberOfBookmarksByBrand
  );
  router.get(
    '/api/admin/shipping/count',
    productController.processGetTotalNumberOfOrdersByShipping
  );
  router.get(
    '/api/admin/orders/status/count',
    productController.processGetTotalNumberOfOrdersByStatus
  );
  router.get(
    '/api/admin/revenue/brand/count',
    productController.processGetTotalRevenueByBrand
  );
  router.get(
    '/api/admin/revenue/category/count',
    productController.processGetTotalRevenueByCategory
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
  router.delete(
    '/api/products/:productID/images',
    productController.processDeleteImagesByProductID
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
  router.post('/api/products/ratings', productController.processCreateRating);

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

  // PHYO
  //Get
  router.get(
    '/api/cart/:userID',
    //verifyAccessToken.verifyToken,
    cartController.processGetCartData
  );
  router.get(
    '/api/cartdetails/getCartProductData',
    //verifyAccessToken.verifyToken,
    cartController.processGetCartProductData
  );
  router.get(
    '/api/inventory/checkQuantity',
    inventoryController.processCheckInventory
  );
  router.get(
    '/api/admin/order',
    orderController.processGetOrderDetailsForAdmin
  );
  router.get(
    '/api/order/getOrderDetailByOrderStatus',
    //verifyAccessToken.verifyToken,
    orderController.processGetOrderDetailsByOrderStatus
  );
  router.get(
    '/api/bookmark/:customerId',
    bookmarkController.processFetchBookmarks
  );
  router.get(
    '/api/shipping',
    //verifyAccessToken.verifyToken,
    shippingController.processFetchShippingMethod
  );

  router.get(
    '/api/notifications/:customerId',
    notificationController.getNotifications
  );
  // post
  router.post('/api/cart/:userID', cartController.processAddCartData);
  router.post(
    '/api/order/:customerId',
    //verifyAccessToken.verifyToken,
    orderController.processAddCustomerOrder
  );
  router.post('/api/bookmark/add', bookmarkController.processAddBookMark);

  // PUT
  router.put('/api/admin/order', orderController.processUpdateOrderStatus);
  router.put(
    '/api/order/updateShippingDetails/:customerID',
    //verifyAccessToken.verifyToken,
    orderController.processUpdateShippingDetails
  );

  //DELETE
  router.delete(
    '/api/cart/:userID',
    //verifyAccessToken.verifyToken,
    cartController.processDeleteCartData
  );
  router.delete(
    '/api/order',
    //verifyAccessToken.verifyToken,
    orderController.processCancelOrder
  );

  router.delete(
    '/api/bookmark/remove/:customerId/:brandId',
    bookmarkController.processRemoveBookMark
  );

  router.delete(
    '/api/notifications/:customerId',
    notificationController.removeNotifications
  );

  //Carolyn

  router.get(
    '/api/payment/:orderID',
    // verifyAccessToken.verifyToken,
    paymentController.processGetPaymentByID
  );

  router.get(
    '/api/paymentTotal/:orderID',
    //verifyAccessToken.verifyToken,
    paymentController.processGetPaymentTotal
  );

  router.get(
    '/api/idAndAmount/:productID',
    //verifyAccessToken.verifyToken,
    paymentController.processGetIDAndAmount
  );

  router.get('/config', checkoutController.getConfig);

  router.get('/api/admin/refund', paymentController.processGetOrderForRefund);

  router.put('/api/admin/refund', paymentController.processUpdateRefundStatus);

  router.post(
    '/createPaymentIntent/:orderID',
    checkoutController.createPaymentIntent
  );

  //inserting data from stripe to back_end
  router.post(
    '/addPayment',
    bodyParser.raw({ type: 'application/json' }),
    checkoutController.storePayment
  ),
  router.post('/addRefund', paymentController.processCreateRefund);
  router.get(
    '/api/paymentByStatus/:orderID',
    // verifyAccessToken.verifyToken,
    paymentController.processGetPaymentByStatus
  );

  router.get(
    '/api/refundStatusByID/:orderID',
    // verifyAccessToken.verifyToken,
    paymentController.processGetRefundStatusByID
  );

  router.post('/processRefund/:orderID', checkoutController.processRefund);

  router.post(
    '/processPartialRefund/:productID',
    checkoutController.processPartialRefund
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

  router.get('/users', getUserInfo.retrieveUsersInformation);

  router.get('/order-history', customerProfile.retrieveOrderHistory);

  router.put('/updateUser', updateUser.updateUser);

  router.delete('/deleteUser', deleteUser.deleteUser);

  router.post('/verify-email', verificationEmail.sendForgotPasswordEmail);

  router.post('/send-otp-email', resentOTPEmailController.loginOTPEmail);

  router.get('/user-profile', customerProfile.userProfileInformation);

  router.put('/update-userProfile', customerProfile.updateUserProfile);

  router.put('/update-userProfileImage', customerProfile.updateProfileImage);



  // ADMIN ROUTES
  router.post('/register-admin', registerAdminController.handleNewAdmin);
  router.post('/login-admin', authAdminController.handleLogin);
  router.get('/refresh-admin', refreshTokenAdminController.handleRefreshToken);
  router.put('/logout-admin', logoutAdminController.handleLogout);
  router.put(
    '/forgot-admin',
    forgotPasswordAdminController.handleForgotPassword
  );
  router.post('/verify-otp-admin', verifyOTPAdminController.verifyOTP);
  router.post(
    '/verify-email-admin',
    verificationEmailAdmin.sendForgotPasswordEmail
  );
};
