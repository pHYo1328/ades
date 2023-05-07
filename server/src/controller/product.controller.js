const client = require("../config/client");
const chalk = require("chalk");
const productManager = require("../services/product.service");

// Get product by ID
exports.processGetProductByID = async (req, res, next) => {
  console.log(chalk.blue("processGetProductByID running"));

  const { productID } = req.body;
  const product_id = productID;

  let errors = [];

  if (product_id == "") {
    errors.push({
      parameter: "product_id",
      value: "Empty product_id",
      message: "product_id is empty",
    });
  }

  try {
    const productData = await productManager.getProductByID(product_id);
    if (productData) {
      console.log(chalk.green("Product data: ", productData));
      const data = {
        name: productData.name,
        price: productData.price,
        description: productData.description,
        category: productData.category,
        image_url: productData.image_url,
      };
      return res.status(200).json({
        statusCode: 200,
        ok: true,
        message: "Read product details successful",
        data,
      });
    }
    return res.status(404).json({
      statusCode: 404,
      ok: true,
      message: "No such product exists",
    });
  } catch (error) {
    console.log(chalk.red("Error in getProductByID: ", error));
    return next(error);
  }
};

// Delete product by ID
exports.processDeleteProductByID = async (req, res, next) => {
  console.log(chalk.blue("processDeleteProductByID running"));

  const { productID } = req.body;
  const product_id = productID;

  let errors = [];

  if (product_id == "") {
    errors.push({
      parameter: "product_id",
      value: "Empty product_id",
      message: "product_id is empty",
    });
  }

  try {
    const deletedProductData = await productManager.deleteProductByID(
      product_id
    );

    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: "Product Deletion successful",
      data: deletedProductData,
    });
  } catch (error) {
    console.log(chalk.red("Error in deleteProductByID: ", error));
    if (error.message === "Product not found") {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: "No such product exists",
      });
    }
    return next(error);
  }
};

// // Get details of all products
// exports.processGetAllProducts = async (req, res, next) => {
//   console.log("processGetAllProducts running...");

//   let errors = [];

//   // check if there are errors
//   if (errors.length > 0) {
//     const dataError = new E.DataError({ errors });
//     console.log(util.inspect(dataError));
//     return next(dataError);
//   }

//   try {
//     const results = await productManager.getAllProducts();
//     if (results.length > 0) {
//       return res.status(200).json({
//         statusCode: 200,
//         ok: true,
//         message: "Read products details successful",
//         data,
//       });
//     }
//     return res
//       .status(404)
//       .json({ statusCode: 404, ok: true, message: "No products found" });
//   } catch (error) {
//     return next(error);
//   }
// };

// // Get products by category
// exports.processGetProductsByCategoryID = async (req, res, next) => {
//   console.log("processGetProductsByCategoryID running...");

//   const { categoryID } = req.body;
//   const uuid = categoryID;

//   let errors = [];

//   if (uuid == "") {
//     // check if the uuid exists
//     errors = [
//       ...errors,
//       new E.BadRequestError({
//         parameter: "uuid",
//         value: "Empty uuid",
//         message: "Uuid is empty",
//       }),
//     ];
//   }

//   if (errors.length > 0) {
//     const dataError = new E.DataError({ errors });
//     console.log(util.inspect(dataError));
//     return next(dataError);
//   }

//   try {
//     const results = await productManager.getProductsByCategoryID(uuid);
//     if (results.length > 0) {
//       console.log(results);
//       const data = {
//         name: results[0].name,
//         email: results[0].email,
//         last_updated: results[0].last_updated,
//         created_at: results[0].created_at,
//       };
//       return res.status(200).json({
//         statusCode: 200,
//         ok: true,
//         message: "Read products details successful",
//         data,
//       });
//     }
//     return res
//       .status(404)
//       .json({ statusCode: 404, ok: true, message: "No such category exists" });
//   } catch (error) {
//     return next(error);
//   }
// };

// // Get products by brand
// exports.processGetProductsByBrandID = async (req, res, next) => {
//   console.log("processGetProductsByBrandID running...");

//   const { brandID } = req.body;
//   const uuid = brandID;

//   let errors = [];

//   if (uuid == "") {
//     // check if the uuid exists
//     errors = [
//       ...errors,
//       new E.BadRequestError({
//         parameter: "uuid",
//         value: "Empty uuid",
//         message: "Uuid is empty",
//       }),
//     ];
//   }

//   if (errors.length > 0) {
//     const dataError = new E.DataError({ errors });
//     console.log(util.inspect(dataError));
//     return next(dataError);
//   }

//   try {
//     const results = await productManager.getProductsByBrandID(uuid);
//     if (results.length > 0) {
//       console.log(results);
//       const data = {
//         name: results[0].name,
//         email: results[0].email,
//         last_updated: results[0].last_updated,
//         created_at: results[0].created_at,
//       };
//       return res.status(200).json({
//         statusCode: 200,
//         ok: true,
//         message: "Read products details successful",
//         data,
//       });
//     }
//     return res
//       .status(404)
//       .json({ statusCode: 404, ok: true, message: "No such brand exists" });
//   } catch (error) {
//     return next(error);
//   }
// };

// // Update product by ID
// exports.processUpdateProduct = async (req, res, next) => {
//   console.log("processUpdateProduct running...");

//   const { productID } = req.body;
//   const { name } = req.body;
//   const uuid = productID;

//   let errors = [];

//   if (uuid === "") {
//     // Check if uuid exists
//     errors = [
//       ...errors,
//       new E.BadRequestError({
//         parameter: "uuid",
//         value: "Empty uuid",
//         message: "Uuid is empty.",
//       }),
//     ];
//   } else if (name == "") {
//     errors = [
//       ...errors,
//       new E.ParameterError({
//         parameter: "Input fields",
//         value: "Empty input fields",
//         message: "All input fields is required to be filled.",
//       }),
//     ];
//   }

//   // Check if there are errors
//   if (errors.length > 0) {
//     const dataError = new E.DataError({ errors });
//     console.log(util.inspect(dataError));
//     return next(dataError);
//   }

//   try {
//     const results = await productManager.updateProduct(name, uuid);
//     if (results.affectedRows === 1) {
//       console.log(results);
//       return res.status(200).json({
//         statusCode: 200,
//         ok: true,
//         message: "Update product details successful",
//       });
//     }
//     return res
//       .status(404)
//       .json({ statusCode: 404, ok: true, message: "No such product exists" });
//   } catch (error) {
//     return next(error);
//   }
// };

// // Delete product by ID
// exports.processDeleteProductByID = async (req, res, next) => {
//   console.log("processDeleteProductByID is running...");
//   console.log(req.body);
//   const { product_id } = req.body;
//   try {
//     const results = await productManager.deleteProductByID(product_id);
//     console.log(results);
//     return res.status(200).send({
//       statusCode: 200,
//       ok: true,
//       message: "Deletion completed!",
//       data: "",
//     });
//   } catch (error) {
//     console.log(error);
//     return next(error);
//   }
// };

// // Upload new product by brand or category
// exports.processAddProduct = async (req, res, next) => {
//   console.log("processAddProduct is running...");

//   const { productName } = req.body;
//   const { address } = req.body;

//   let errors = [];

//   if (productName == "" || address == "") {
//     errors = [
//       ...errors,
//       new E.ParameterError({
//         parameter: "Input fields",
//         value: "Empty input fields",
//         message: "All input fields is required to be filled.",
//       }),
//     ];
//   }

//   if (errors.length > 0) {
//     const dataError = new E.DataError({ errors });
//     console.log(util.inspect(dataError));
//     return next(dataError);
//   }

//   try {
//     const results = await productManager.addProduct(productName, address);
//     if (results.affectedRows == 1) {
//       console.log(results);
//       return res.status(201).json({
//         statusCode: 201,
//         ok: true,
//         message: "Product creation successful",
//       });
//     }
//   } catch (error) {
//     return next(error);
//   }
// };

// // Get best sale products
// exports.processGetBestSaleProducts = async (req, res, next) => {
//   console.log("processGetBestSaleProducts running...");

//   let errors = [];

//   // check if there are errors
//   if (errors.length > 0) {
//     const dataError = new E.DataError({ errors });
//     console.log(util.inspect(dataError));
//     return next(dataError);
//   }

//   try {
//     const results = await productManager.getBestSaleProducts();
//     if (results.length > 0) {
//       return res.status(200).json({
//         statusCode: 200,
//         ok: true,
//         message: "Read products details successful",
//         data,
//       });
//     }
//     return res
//       .status(404)
//       .json({ statusCode: 404, ok: true, message: "No products found" });
//   } catch (error) {
//     return next(error);
//   }
// };

// // Get new arrivals
// exports.processGetNewArrivals = async (req, res, next) => {
//   console.log("processGetNewArrivals running...");

//   let errors = [];

//   // check if there are errors
//   if (errors.length > 0) {
//     const dataError = new E.DataError({ errors });
//     console.log(util.inspect(dataError));
//     return next(dataError);
//   }

//   try {
//     const results = await productManager.getNewArrivals();
//     if (results.length > 0) {
//       return res.status(200).json({
//         statusCode: 200,
//         ok: true,
//         message: "Read products details successful",
//         data,
//       });
//     }
//     return res
//       .status(404)
//       .json({ statusCode: 404, ok: true, message: "No products found" });
//   } catch (error) {
//     return next(error);
//   }
// };
