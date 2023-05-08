const chalk = require("chalk");
const productManager = require("../services/product.services");

// Get product by ID
exports.processGetProductByID = async (req, res, next) => {
  console.log(chalk.blue("processGetProductByID running"));

  const { productID } = req.params;
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
      console.log(chalk.yellow("Product data: ", productData));
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
    if (error.message === "product_id is empty") {
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

// Delete product by ID
exports.processDeleteProductByID = async (req, res, next) => {
  console.log(chalk.blue("processDeleteProductByID running"));

  const { productID } = req.params;
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
    if (error.message === "product_id is empty") {
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

// get all products
exports.processGetAllProducts = async (req, res, next) => {
  console.log(chalk.blue("processGetAllProducts running"));
  try {
    const productData = await productManager.getAllProducts();
    if (productData) {
      console.log(chalk.yellow("Product data: ", productData));
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
      message: "No products exists",
    });
  } catch (error) {
    console.error(chalk.red("Error in getProductByID: ", error));
    return next(error);
  }
};

// get products by category
exports.processGetProductsByCategoryID = async (req, res, next) => {
  console.log(chalk.blue("processGetProductsByCategoryID running"));
  const { categoryID } = req.params;
  const category_id = categoryID;

  let errors = [];
  if (category_id == "") {
    errors.push({
      parameter: "category_id",
      value: "Empty category_id",
      message: "category_id is empty",
    });
  }

  try {
    const productData = await productManager.getProductsByCategoryID(
      category_id
    );
    if (productData) {
      console.log(chalk.yellow("Product data: ", productData));
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
      message: "No such category exists",
    });
  } catch (error) {
    if (error.message === "category_id is empty") {
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

// get products by brand
exports.processGetProductsByBrandID = async (req, res, next) => {
  console.log(chalk.blue("processGetProductsByBrandID running"));
  const { brandID } = req.params;
  const brand_id = brandID;

  let errors = [];
  if (brand_id == "") {
    errors.push({
      parameter: "brand_id",
      value: "Empty brand_id",
      message: "brand_id is empty",
    });
  }

  try {
    const productData = await productManager.getProductsByBrandID(brand_id);
    if (productData) {
      console.log(chalk.yellow("Product data: ", productData));
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
      message: "No such brand exists",
    });
  } catch (error) {
    if (error.message === "brand_id is empty") {
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

// get 3 newest product arrivals
exports.processGetNewArrivals = async (req, res, next) => {
  console.log(chalk.blue("processGetNewArrivals running"));
  try {
    const productData = await productManager.getNewArrivals();
    if (productData) {
      console.log(chalk.yellow("Product data: ", productData));
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
      message: "No products exists",
    });
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
    const updatedProductData = await productManager.updateProductByID(
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
    image == ""
  ) {
    errors.push({
      parameter: "Input fields",
      value: "Empty input fields",
      message: "All input fields is required to be filled.",
    });
  }
  try {
    const createdProductData = await productManager.createProduct(
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
