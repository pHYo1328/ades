const productController = require("../controller/product.controller");
const cartController = require("../controller/cart.controller");
//const verifyAccessToken = require("../middlewares/verifyAccessToken");

module.exports = (app, router) => {
  router.get(
    "/api/products",
    //verifyAccessToken.verifyToken,
    productController.processGetAllProducts
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
    "./api/cart/:userID",
    //verifyAccessToken.verifyToken,
    cartController.processAddCartData
  );

  router.get(
    "./api/cart/:userID",
    //verifyAccessToken.verifyToken,
    cartController.processGetCartData
  );

  router.delete(
    "./api/cart/:userID",
    //verifyAccessToken.verifyToken,
    cartController.processDeleteCartData
  );
};
