const productController = require("../controllers/product.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken");

module.exports = (app, router) => {
  router.get(
    "./api/products",
    verifyAccessToken.verifyToken,
    productController.processGetAllProducts
  );
  router.get(
    "./api/product:id",
    verifyAccessToken.verifyToken,
    productController.processGetProductByID
  );
  router.get(
    "./api/products:category_id",
    verifyAccessToken.verifyToken,
    productController.processGetProductsByCategoryID
  );
  router.post(
    "./api/products",
    verifyAccessToken.verifyToken,
    productController.processAddProduct
  );
  router.delete(
    "./api/product:id",
    verifyAccessToken.verifyToken,
    productController.processDeleteProductByID
  );
  router.put(
    "./api/product:id",
    verifyAccessToken.verifyToken,
    productController.processEditProductByID
  );
};
