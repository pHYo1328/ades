const chalk = require('chalk');
const productServices = require('../services/product.services');

// Get product by ID (done)
exports.processGetProductByID = async (req, res, next) => {
  console.log(chalk.blue('processGetProductByID running'));

  const { productID } = req.params;

  let errors = [];

  if (productID == '') {
    errors.push({
      parameter: 'productID',
      value: 'Empty productID',
      message: 'productID is empty',
    });
  }

  try {
    const productData = await productServices.getProductByID(productID);
    if (productData) {
      console.log(chalk.yellow('Product data: ', productData));
      const data = {
        product_name: productData.product_name,
        price: productData.price,
        description: productData.description,
        category_name: productData.category_name,
        brand_name: productData.brand_name,
        image_url: productData.image_url,
        average_rating: productData.average_rating,
        rating_count: productData.rating_count,
      };
      return res.status(200).json({
        statusCode: 200,
        ok: true,
        message: 'Read product details successful',
        data,
      });
    }
    return res.status(404).json({
      statusCode: 404,
      ok: true,
      message: 'No such product exists',
    });
  } catch (error) {
    if (error.message === 'productID is empty') {
      return res.status(400).json({
        statusCode: 400,
        ok: true,
        message: 'Product ID is missing',
      });
    }
    console.error(chalk.red('Error in getProductByID: ', error));
    return next(error);
  }
};

// Delete product by ID (done)
exports.processDeleteProductByID = async (req, res, next) => {
  console.log(chalk.blue('processDeleteProductByID running'));

  const { productID } = req.params;

  let errors = [];

  if (productID == '') {
    errors.push({
      parameter: 'productID',
      value: 'Empty productID',
      message: 'productID is empty',
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
        message: 'Product Deletion successful',
        data: deletedProductData,
      });
    }
    return res.status(404).json({
      statusCode: 404,
      ok: true,
      message: 'No such product exists',
    });
  } catch (error) {
    if (error.message === 'productID is empty') {
      return res.status(400).json({
        statusCode: 400,
        ok: true,
        message: 'Product ID is missing',
      });
    }
    console.error(chalk.red('Error in deleteProductByID: ', error));
    return next(error);
  }
};

// get all products (done)
exports.processGetAllProducts = async (req, res, next) => {
  console.log(chalk.blue('processGetAllProducts running'));
  try {
    const productData = await productServices.getAllProducts();
    if (productData) {
      console.log(chalk.yellow('Product data: ', productData));
      const products = productData.map((product) => ({
        product_id: product.product_id,
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
        message: 'Read product details successful',
        data: products,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No products exists',
      });
    }
  } catch (error) {
    console.error(chalk.red('Error in getAllProducts: ', error));
    return next(error);
  }
};

// get products by category (done)
exports.processGetProductsByCategoryID = async (req, res, next) => {
  console.log(chalk.blue('processGetProductsByCategoryID running'));
  const { categoryID } = req.params;

  let errors = [];
  if (categoryID == '') {
    errors.push({
      parameter: 'categoryID',
      value: 'Empty categoryID',
      message: 'categoryID is empty',
    });
  }

  try {
    const productData = await productServices.getProductsByCategoryID(
      categoryID
    );
    if (productData != '') {
      console.log(chalk.yellow('Product data: ', productData));
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
        message: 'Read product details successful',
        data: products,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No products exists',
      });
    }

    return res.status(404).json({
      statusCode: 404,
      ok: true,
      message: 'No such category exists',
    });
  } catch (error) {
    if (error.message === 'categoryID is empty') {
      return res.status(400).json({
        statusCode: 400,
        ok: true,
        message: 'Category ID is missing',
      });
    }
    console.error(chalk.red('Error in getProductsByCategoryID: ', error));
    return next(error);
  }
};

// get products by brand (done)
exports.processGetProductsByBrandID = async (req, res, next) => {
  console.log(chalk.blue('processGetProductsByBrandID running'));
  const { brandID } = req.params;

  let errors = [];
  if (brandID == '') {
    errors.push({
      parameter: 'brandID',
      value: 'Empty brandID',
      message: 'brandID is empty',
    });
  }

  try {
    const productData = await productServices.getProductsByBrandID(brandID);
    if (productData != '') {
      console.log(chalk.yellow('Product data: ', productData));
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
        message: 'Read product details successful',
        data: products,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No products exists',
      });
    }
    return res.status(404).json({
      statusCode: 404,
      ok: true,
      message: 'No such brand exists',
    });
  } catch (error) {
    if (error.message === 'brandID is empty') {
      return res.status(400).json({
        statusCode: 400,
        ok: true,
        message: 'Brand ID is missing',
      });
    }
    console.error(chalk.red('Error in getProductsByBrandID: ', error));
    return next(error);
  }
};

// get 3 newest product arrivals (done)
exports.processGetNewArrivals = async (req, res, next) => {
  console.log(chalk.blue('processGetNewArrivals running'));
  try {
    const productData = await productServices.getNewArrivals();
    if (productData) {
      console.log(chalk.yellow('Product data: ', productData));
      const products = productData.map((product) => ({
        product_name: product.product_name,
        price: product.price,
        description: product.description,
        category_name: product.category_name,
        brand_name: product.brand_name,
        image_url: product.image_url,
        product_id: product.product_id,
      }));
      res.status(200).json({
        statusCode: 200,
        ok: true,
        message: 'Read product details successful',
        data: products,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No products exists',
      });
    }
  } catch (error) {
    console.error(chalk.red('Error in getNewArrivals: ', error));
    return next(error);
  }
};

// update product by ID
exports.processUpdateProductByID = async (req, res, next) => {
  console.log(chalk.blue('processUpdateProductByID running'));
  const { productID } = req.params;
  const { name, price, description, category_id, brand_id, image_url } =
    req.body;
  var floatPrice, intCategoryID, intBrandID;
  let errors = [];
  floatPrice = price ? parseFloat(price) : null;
  intCategoryID = category_id ? parseInt(category_id) : null;
  intBrandID = brand_id ? parseInt(brand_id) : null;

  if (productID == '') {
    errors.push({
      parameter: 'productID',
      value: 'Empty productID',
      message: 'productID is empty',
    });
  } else if (
    name == '' ||
    price == '' ||
    description == '' ||
    category_id == '' ||
    brand_id == '' ||
    image_url == ''
  ) {
    errors.push({
      parameter: 'Input fields',
      value: 'Empty input fields',
      message: 'All input fields is required to be filled.',
    });
  }
  try {
    const updatedProductData = await productServices.updateProductByID(
      name,
      floatPrice,
      description,
      intCategoryID,
      intBrandID,
      image_url,
      parseInt(productID)
    );
    if (updatedProductData) {
      return res.status(200).json({
        statusCode: 200,
        ok: true,
        message: 'Update product details successful',
      });
    }
    return res.status(404).json({
      statusCode: 404,
      ok: true,
      message: 'No such product exists',
    });
  } catch (error) {
    if (error.message === 'productID is empty') {
      return res.status(400).json({
        statusCode: 400,
        ok: true,
        message: 'Product ID is missing',
      });
    } else if (error.message === 'All input fields is required to be filled.') {
      return res.status(400).json({
        statusCode: 400,
        ok: true,
        message: 'Product data is missing',
      });
    }
    console.error(chalk.red('Error in updateProductByID: ', error));
    return next(error);
  }
};

// create new product
exports.processCreateProduct = async (req, res, next) => {
  console.log(chalk.blue('processCreateProduct running'));
  const { name, price, description, category_id, brand_id, image_url } =
    req.body;

  let errors = [];
  if (
    name == '' ||
    price == '' ||
    description == '' ||
    category_id == '' ||
    brand_id == '' ||
    image_url == ''
  ) {
    errors.push({
      parameter: 'Input fields',
      value: 'Empty input fields',
      message: 'All input fields is required to be filled.',
    });
  }
  try {
    const createdProductData = await productServices.createProduct(
      name,
      parseFloat(price),
      description,
      parseInt(category_id),
      parseInt(brand_id),
      image_url
    );
    console.log(chalk.yellow(createdProductData));
    if (createdProductData == 'ER_BAD_FIELD_ERROR') {
      return res.status(400).json({
        statusCode: 400,
        ok: true,
        message: 'Product data is missing',
      });
    } else {
      return res.status(200).json({
        statusCode: 200,
        ok: true,
        message: 'Create product successful',
      });
    }
  } catch (error) {
    console.error(chalk.red(error.code));
    console.error(chalk.red('Error in createProduct: ', error));
    return next(error);
  }
};

// get brand name by brand ID (done)
exports.processGetBrandByID = async (req, res, next) => {
  console.log(chalk.blue('processGetBrandByID running'));

  const { brandID } = req.params;

  let errors = [];

  if (brandID == '') {
    errors.push({
      parameter: 'brandID',
      value: 'Empty brandID',
      message: 'brandID is empty',
    });
  }

  try {
    const brandData = await productServices.getBrandByID(brandID);
    if (brandData) {
      console.log(chalk.yellow('Brand data: ', brandData));
      const data = {
        brand_name: brandData.brand_name,
      };
      return res.status(200).json({
        statusCode: 200,
        ok: true,
        message: 'Read brand name successful',
        data,
      });
    }
    return res.status(404).json({
      statusCode: 404,
      ok: true,
      message: 'No such brand exists',
    });
  } catch (error) {
    if (error.message === 'brandID is empty') {
      return res.status(400).json({
        statusCode: 400,
        ok: true,
        message: 'Brand ID is missing',
      });
    }
    console.error(chalk.red('Error in getBrandByID: ', error));
    return next(error);
  }
};

// get category name by category ID (done)
exports.processGetCategoryByID = async (req, res, next) => {
  console.log(chalk.blue('processGetCategoryByID running'));

  const { categoryID } = req.params;

  let errors = [];

  if (categoryID == '') {
    errors.push({
      parameter: 'categoryID',
      value: 'Empty categoryID',
      message: 'categoryID is empty',
    });
  }

  try {
    const categoryData = await productServices.getCategoryByID(categoryID);
    if (categoryID) {
      console.log(chalk.yellow('Category data: ', categoryID));
      const data = {
        category_name: categoryData.category_name,
      };
      return res.status(200).json({
        statusCode: 200,
        ok: true,
        message: 'Read category name successful',
        data,
      });
    }
    return res.status(404).json({
      statusCode: 404,
      ok: true,
      message: 'No such category exists',
    });
  } catch (error) {
    if (error.message === 'categoryID is empty') {
      return res.status(400).json({
        statusCode: 400,
        ok: true,
        message: 'Category ID is missing',
      });
    }
    console.error(chalk.red('Error in getCategoryByID: ', error));
    return next(error);
  }
};

// get all ratings (done)
exports.processGetAllRatingsByProductID = async (req, res, next) => {
  console.log(chalk.blue('processGetAllRatingsByProductID running'));
  const { productID } = req.params;
  try {
    const ratingData = await productServices.getAllRatingsByProductID(
      productID
    );
    if (ratingData) {
      console.log(chalk.yellow('Rating data: ', ratingData));
      const ratings = ratingData.map((rating) => ({
        rating_id: rating.rating_id,
        product_id: rating.product_id,
        rating_score: rating.rating_score,
        comment: rating.comment,
      }));
      res.status(200).json({
        statusCode: 200,
        ok: true,
        message: 'Read rating details successful',
        data: ratings,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No ratings exists',
      });
    }
  } catch (error) {
    console.error(chalk.red('Error in getAllRatingsByProductID: ', error));
    return next(error);
  }
};

// get all brands (done)
exports.processGetAllBrands = async (req, res, next) => {
  console.log(chalk.blue('processGetAllBrands running'));
  try {
    const brandData = await productServices.getAllBrands();
    if (brandData) {
      console.log(chalk.yellow('Brand data: ', brandData));
      const brands = brandData.map((brand) => ({
        brand_id: brand.brand_id,
        brand_name: brand.brand_name,
      }));
      res.status(200).json({
        statusCode: 200,
        ok: true,
        message: 'Read brand details successful',
        data: brands,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No brands exists',
      });
    }
  } catch (error) {
    console.error(chalk.red('Error in getAllBrands: ', error));
    return next(error);
  }
};

// get all category (done)
exports.processGetAllCategory = async (req, res, next) => {
  console.log(chalk.blue('processGetAllCategory running'));
  try {
    const categoryData = await productServices.getAllCategory();
    if (categoryData) {
      console.log(chalk.yellow('Category data: ', categoryData));
      const categories = categoryData.map((category) => ({
        category_id: category.category_id,
        category_name: category.category_name,
      }));
      res.status(200).json({
        statusCode: 200,
        ok: true,
        message: 'Read category details successful',
        data: categories,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No categories exists',
      });
    }
  } catch (error) {
    console.error(chalk.red('Error in getAllCategory: ', error));
    return next(error);
  }
};

// search results
exports.processGetSearchResults = async (req, res, next) => {
  console.log(chalk.blue('processGetSearchResults running'));
  const { product_name, category_id, brand_id, max_price, min_price } =
    req.query;

  try {
    const searchResultData = await productServices.getSearchResults(
      product_name,
      category_id,
      brand_id,
      max_price,
      min_price
    );
    if (searchResultData && searchResultData.length > 0) {
      console.log(chalk.yellow('Search result data: ', searchResultData));
      const searchResults = searchResultData.map((searchResult) => ({
        product_id: searchResult.product_id,
        product_name: searchResult.product_name,
        price: searchResult.price,
        description: searchResult.description,
        category_name: searchResult.category_name,
        brand_name: searchResult.brand_name,
        image_url: searchResult.image_url,
      }));
      res.status(200).json({
        statusCode: 200,
        ok: true,
        message: 'Read search results details successful',
        data: searchResults,
      });
    } else {
      res.status(204).json({
        statusCode: 204,
        ok: true,
        message: 'No products exists',
      });
    }
  } catch (error) {
    console.error(chalk.red('Error in getSearchResults: ', error));
    return next(error);
  }
};
