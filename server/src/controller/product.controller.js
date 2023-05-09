const chalk = require('chalk');
const productServices = require('../services/product.services');

// Get product by ID (done)
exports.processGetProductByID = async (req, res, next) => {
  console.log(chalk.blue("processGetProductByID running"));

  const { productID } = req.params;

  let errors = [];

  if (productID == "") {
    errors.push({
      parameter: "productID",
      value: "Empty productID",
      message: "productID is empty",
    });
  }

  try {
    const productData = await productServices.getProductByID(productID);
    if (productData) {
      console.log(chalk.yellow("Product data: ", productData));
      const data = {
        product_name: productData.product_name,
        price: productData.price,
        description: productData.description,
        category_name: productData.category_name,
        brand_name: productData.brand_name,
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
    if (error.message === "productID is empty") {
      return res.status(400).json({
        statusCode: 400,
        ok: true,
        message: "Product ID is missing",
      });
    }
    console.error(chalk.red("Error in getProductByID: ", error));
    return next(error);
  }
};

// Delete product by ID (done)
exports.processDeleteProductByID = async (req, res, next) => {
  console.log(chalk.blue("processDeleteProductByID running"));
  console.log(chalk.blue("processDeleteProductByID running"));

  const { productID } = req.params;

  let errors = [];

  if (productID == "") {
    errors.push({
      parameter: "productID",
      value: "Empty productID",
      message: "productID is empty",
    });
  }

  try {
    const deletedProductData = await productServices.deleteProductByID(
      productID
    );

    if (deletedProductData) {
      return res.status(200).json({
        statusCode: 200,
        ok: true,
        message: "Product Deletion successful",
        data: deletedProductData,
      });
    }
    return res.status(404).json({
      statusCode: 404,
      ok: true,
      message: "No such product exists",
    });
  } catch (error) {
    if (error.message === "productID is empty") {
      return res.status(400).json({
        statusCode: 400,
        ok: true,
        message: "Product ID is missing",
      });
    }
    console.error(chalk.red("Error in deleteProductByID: ", error));
    return next(error);
  }
};

// get all products (done)
exports.processGetAllProducts = async (req, res, next) => {
  console.log(chalk.blue("processGetAllProducts running"));
  try {
    const productData = await productServices.getAllProducts();
    if (productData) {
      console.log(chalk.yellow("Product data: ", productData));
      const products = productData.map((product) => ({
        product_name: product.product_name,
        price: product.price,
        description: product.description,
        category_name: product.category_name,
        brand_name: product.brand_name,
        image_url: product.image_url,
      }));
      res.status(200).json({
        statusCode: 200,
        ok: true,
        message: "Read product details successful",
        data: products,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        ok: true,
        message: "No products exists",
      });
    }
  } catch (error) {
    console.error(chalk.red("Error in getAllProducts: ", error));
    return next(error);
  }
};

// get products by category (done)
exports.processGetProductsByCategoryID = async (req, res, next) => {
  console.log(chalk.blue("processGetProductsByCategoryID running"));
  const { categoryID } = req.params;

  let errors = [];
  if (categoryID == "") {
    errors.push({
      parameter: "categoryID",
      value: "Empty categoryID",
      message: "categoryID is empty",
    });
  }

  try {
    const productData = await productServices.getProductsByCategoryID(
      categoryID
    );
    if (productData != "") {
      console.log(chalk.yellow("Product data: ", productData));
      const products = productData.map((product) => ({
        product_name: product.product_name,
        price: product.price,
        description: product.description,
        category_name: product.category_name,
        brand_name: product.brand_name,
        image_url: product.image_url,
      }));
      res.status(200).json({
        statusCode: 200,
        ok: true,
        message: "Read product details successful",
        data: products,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        ok: true,
        message: "No products exists",
      });
    }

    return res.status(404).json({
      statusCode: 404,
      ok: true,
      message: "No such category exists",
    });
  } catch (error) {
    if (error.message === "categoryID is empty") {
      return res.status(400).json({
        statusCode: 400,
        ok: true,
        message: "Category ID is missing",
      });
    }
    console.error(chalk.red("Error in getProductsByCategoryID: ", error));
    return next(error);
  }
};

// get products by brand (done)
exports.processGetProductsByBrandID = async (req, res, next) => {
  console.log(chalk.blue("processGetProductsByBrandID running"));
  const { brandID } = req.params;

  let errors = [];
  if (brandID == "") {
    errors.push({
      parameter: "brandID",
      value: "Empty brandID",
      message: "brandID is empty",
    });
  }

  try {
    const productData = await productServices.getProductsByBrandID(brandID);
    if (productData != "") {
      console.log(chalk.yellow("Product data: ", productData));
      const products = productData.map((product) => ({
        product_name: product.product_name,
        price: product.price,
        description: product.description,
        category_name: product.category_name,
        brand_name: product.brand_name,
        image_url: product.image_url,
      }));
      res.status(200).json({
        statusCode: 200,
        ok: true,
        message: "Read product details successful",
        data: products,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        ok: true,
        message: "No products exists",
      });
    }
    return res.status(404).json({
      statusCode: 404,
      ok: true,
      message: "No such brand exists",
    });
  } catch (error) {
    if (error.message === "brandID is empty") {
      return res.status(400).json({
        statusCode: 400,
        ok: true,
        message: "Brand ID is missing",
      });
    }
    console.error(chalk.red("Error in getProductsByBrandID: ", error));
    return next(error);
  }
};

// get 3 newest product arrivals (done)
exports.processGetNewArrivals = async (req, res, next) => {
  console.log(chalk.blue("processGetNewArrivals running"));
  try {
    const productData = await productServices.getNewArrivals();
    if (productData) {
      console.log(chalk.yellow("Product data: ", productData));
      const products = productData.map((product) => ({
        product_name: product.product_name,
        price: product.price,
        description: product.description,
        category_name: product.category_name,
        brand_name: product.brand_name,
        image_url: product.image_url,
      }));
      res.status(200).json({
        statusCode: 200,
        ok: true,
        message: "Read product details successful",
        data: products,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        ok: true,
        message: "No products exists",
      });
    }
  } catch (error) {
    console.error(chalk.red("Error in getNewArrivals: ", error));
    return next(error);
  }
};

// update product by ID
exports.processUpdateProductByID = async (req, res, next) => {
  console.log(chalk.blue("processUpdateProductByID running"));
  const { productID } = req.params;
  const product_id = productID;
  const { name, price, description, category_id, brand_id, image_url } =
    req.body;
  let errors = [];
  if (product_id == "") {
    errors.push({
      parameter: "product_id",
      value: "Empty product_id",
      message: "product_id is empty",
    });
  } else if (
    name == "" ||
    price == "" ||
    description == "" ||
    category_id == "" ||
    brand_id == "" ||
    image_url == ""
  ) {
    errors.push({
      parameter: "Input fields",
      value: "Empty input fields",
      message: "All input fields is required to be filled.",
    });
  }
  try {
    const updatedProductData = await productServices.updateProductByID(
      name,
      price,
      description,
      category_id,
      brand_id,
      image_url,
      product_id
    );
    if (updatedProductData) {
      return res.status(200).json({
        statusCode: 200,
        ok: true,
        message: "Update product details successful",
      });
    }
    return res.status(404).json({
      statusCode: 404,
      ok: true,
      message: "No such product exists",
    });
  } catch (error) {
    if (error.message === "product_id is empty") {
      return res.status(400).json({
        statusCode: 400,
        ok: true,
        message: "Product ID is missing",
      });
    } else if (error.message === "All input fields is required to be filled.") {
      return res.status(400).json({
        statusCode: 400,
        ok: true,
        message: "Product data is missing",
      });
    }
    console.error(chalk.red("Error in updateProductByID: ", error));
    return next(error);
  }
};

// create new product
exports.processCreateProduct = async (req, res, next) => {
  console.log(chalk.blue("processCreateProduct running"));
  const { name, price, description, category_id, brand_id, image } = req.body;

  let errors = [];
  if (
    name == "" ||
    price == "" ||
    description == "" ||
    category_id == "" ||
    brand_id == "" ||
    image_url == ""
  ) {
    errors.push({
      parameter: "Input fields",
      value: "Empty input fields",
      message: "All input fields is required to be filled.",
    });
  }
  try {
    const createdProductData = await productServices.createProduct(
      name,
      price,
      description,
      category_id,
      brand_id,
      image
    );
    if (createdProductData) {
      return res.status(200).json({
        statusCode: 200,
        ok: true,
        message: "Create product successful",
      });
    }
  } catch (error) {
    if (error.message === "All input fields is required to be filled.") {
      return res.status(400).json({
        statusCode: 400,
        ok: true,
        message: "Product data is missing",
      });
    }
    console.error(chalk.red("Error in createProduct: ", error));
    return next(error);
  }
};
