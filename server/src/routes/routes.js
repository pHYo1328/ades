const productController = require("../controller/product.controller");
const cartController = require("../controller/cart.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken");

module.exports = (app, router) => {
  router.get(
    "./api/products",
    verifyAccessToken.verifyToken,
    productController.processGetAllProducts
  );
  router.get(
    "./api/product/:product_id",
    verifyAccessToken.verifyToken,
    productController.processGetProductByID
  );
  router.get(
    "./api/products/:category_id",
    verifyAccessToken.verifyToken,
    productController.processGetProductsByCategoryID
  );
  // router.post(
  //   "./api/products",
  //   verifyAccessToken.verifyToken,
  //   productController.processAddProduct
  // );
  router.delete(
    "./api/product/:product_id",
    verifyAccessToken.verifyToken,
    productController.processDeleteProductByID
  );
  // router.put(
  //   "./api/product/:product_id",
  //   verifyAccessToken.verifyToken,
  //   productController.processEditProductByID
  // );

  router.post(
    "./api/cart/:userID",
    verifyAccessToken.verifyToken,
    cartController.processAddCartData
  );

  router.get(
    "./api/cart/:userID",
    verifyAccessToken.verifyToken,
    cartController.processGetCartData
  );

  router.delete(
    "./api/cart/:userID",
    verifyAccessToken.verifyToken,
    cartController.processDeleteCartData
  );
};
