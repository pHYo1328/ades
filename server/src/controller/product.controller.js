// THINZAR HNIN YU (P2201014)
const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   secure: true,
//   // upload_preset: CLOUDINARY_UPLOAD_PRESET,
//   api_key: CLOUDINARY_API_KEY,
//   api_secret: CLOUDINARY_API_SECRET

// })

const chalk = require('chalk');
const productServices = require('../services/product.services');
const cloudinary_url = process.env.CLOUDINARY_URL;

// GET

// // Get product by ID
exports.processGetProductByID = async (req, res, next) => {
  const { productID } = req.params;
  console.log(chalk.blue('processGetProductByID running'));

  if (!productID) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Product ID is missing',
    });
  }

  try {
    let [productData, imageData] = await productServices.getProductByID(
      productID
    );

    if (!productData) {
      return res.status(204).json({
        statusCode: 204,
        ok: true,
        message: 'No such product exists',
      });
    }

    console.log(chalk.green(Object.values(productData)));
    console.log(chalk.green(Object.values(imageData)));

    let data = {
      product_name: productData.product_name,
      price: productData.price,
      description: productData.description,
      category_name: productData.category_name,
      brand_name: productData.brand_name,
      average_rating: productData.average_rating,
      rating_count: productData.rating_count,
      quantity: productData.quantity,
      category_id: productData.category_id,
      brand_id: productData.brand_id,
      image_url: imageData.map((u) => u.image_url),
    };

    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Read product details successful',
      data,
    });
  } catch (error) {
    console.error(chalk.red('Error in getProductByID: ', error));
    return next(error);
  }
};

// get all products
exports.processGetAllProducts = async (req, res, next) => {
  console.log(chalk.blue('processGetAllProducts running'));
  try {
    const productData = await productServices.getAllProducts();
    if (!productData || productData.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No products exist',
      });
    }
    console.log(chalk.yellow('Product data: ', productData));
    const products = productData.map((product) => ({
      product_id: product.product_id,
      product_name: product.product_name,
      price: product.price,
      description: product.description,
      category_name: product.category_name,
      brand_name: product.brand_name,
      image_url: product.image_url,
      quantity: product.quantity,
    }));
    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Read product details successful',
      data: products,
    });
  } catch (error) {
    console.error(chalk.red('Error in getAllProducts: ', error));
    return next(error);
  }
};

// get products by category or brand
exports.processGetProductsByCategoryOrBrand = async (req, res, next) => {
  console.log(chalk.blue('processGetProductsByCategoryOrBrand running'));
  const { categoryID, brandID, limit, offset, sort } = req.params;
  if (!categoryID || !brandID) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Category ID or Brand ID is missing',
    });
  }
  if (isNaN(parseInt(categoryID)) || isNaN(parseInt(brandID))) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Category ID or Brand ID is not a number',
    });
  }

  try {
    const productData = await productServices.getProductsByCategoryOrBrand(
      categoryID,
      brandID,
      parseInt(limit),
      parseInt(offset),
      parseInt(sort)
    );
    console.log(chalk.yellow('Product data: ', productData));
    if (!productData || productData.length === 0) {
      return res.status(200).json({
        statusCode: 200,
        ok: true,
        message: 'No products exist',
      });
    }
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
    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Read product details successful',
      data: products,
    });
  } catch (error) {
    console.error(chalk.red('Error in getProductsByCategoryOrBrand: ', error));
    return next(error);
  }
};

// get products by category
exports.processGetProductsByCategoryID = async (req, res, next) => {
  console.log(chalk.blue('processGetProductsByCategoryID running'));
  const { categoryID } = req.params;
  if (!categoryID) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Category ID is missing',
    });
  }
  if (isNaN(parseInt(categoryID))) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Category ID is not a number',
    });
  }
  try {
    const productData = await productServices.getProductsByCategoryID(
      categoryID
    );
    console.log(chalk.yellow('Product data: ', productData));
    if (!productData || productData.length === 0) {
      return res.status(200).json({
        statusCode: 200,
        ok: true,
        message: 'No products exist',
      });
    }
    console.log(chalk.yellow('Product data: ', productData));
    const products = productData.map((product) => ({
      product_id: product.product_id,
      product_name: product.product_name,
      price: product.price,
      description: product.description,
      category_name: product.category_name,
      brand_name: product.brand_name,
      image_url: product.image_url,
      quantity: product.quantity,
    }));
    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Read product details successful',
      data: products,
    });
  } catch (error) {
    console.error(chalk.red('Error in getProductsByCategoryID: ', error));
    return next(error);
  }
};

// get products by brand
exports.processGetProductsByBrandID = async (req, res, next) => {
  console.log(chalk.blue('processGetProductsByBrandID running'));
  const { brandID } = req.params;

  if (!brandID) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Brand ID is missing',
    });
  }
  if (isNaN(parseInt(brandID))) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Brand ID is not a number',
    });
  }

  try {
    const productData = await productServices.getProductsByBrandID(brandID);
    console.log(chalk.yellow('Product data: ', productData));

    if (!productData || productData.length === 0) {
      return res.status(200).json({
        statusCode: 200,
        ok: true,
        message: 'No products exist',
      });
    }
    console.log(chalk.yellow('Product data: ', productData));
    const products = productData.map((product) => ({
      product_id: product.product_id,
      product_name: product.product_name,
      price: product.price,
      description: product.description,
      category_name: product.category_name,
      brand_name: product.brand_name,
      image_url: product.image_url,
      quantity: product.quantity,
    }));
    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Read product details successful',
      data: products,
    });
  } catch (error) {
    console.error(chalk.red('Error in getProductsByBrandID: ', error));
    return next(error);
  }
};

// get 5 newest product arrivals
exports.processGetNewArrivals = async (req, res, next) => {
  console.log(chalk.blue('processGetNewArrivals running'));
  try {
    const productData = await productServices.getNewArrivals();
    if (!productData || productData.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No products exist',
      });
    }
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
    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Read product details successful',
      data: products,
    });
  } catch (error) {
    console.error(chalk.red('Error in getNewArrivals: ', error));
    return next(error);
  }
};

// get brand name by brand ID
exports.processGetBrandByID = async (req, res, next) => {
  console.log(chalk.blue('processGetBrandByID running'));

  const { brandID } = req.params;

  if (!brandID) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Brand ID is missing',
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
    console.error(chalk.red('Error in getBrandByID: ', error));
    return next(error);
  }
};

// get category name by category ID
exports.processGetCategoryByID = async (req, res, next) => {
  console.log(chalk.blue('processGetCategoryByID running'));

  const { categoryID } = req.params;

  if (!categoryID) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Category ID is missing',
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
    console.error(chalk.red('Error in getCategoryByID: ', error));
    return next(error);
  }
};

// get all ratings
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

// get all brands
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

// get all category
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
        data: [],
      });
    }
  } catch (error) {
    console.error(chalk.red('Error in getSearchResults: ', error));
    return next(error);
  }
};

// get statistics
exports.processGetStatistics = async (req, res, next) => {
  console.log(chalk.blue('processGetStatistics running'));
  try {
    const statisticsData = await productServices.getStatistics();
    console.log(chalk.yellow(statisticsData));
    if (!statisticsData) {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No statistics exist',
      });
    }
    console.log(chalk.yellow('Statistics data: ', statisticsData));
    const data = {
      total_sold: statisticsData.total_sold,
      total_inventory: statisticsData.total_inventory,
      total_payment: statisticsData.total_payment,
      total_order: statisticsData.total_order,
      total_products: statisticsData.total_products,
    };

    console.log(chalk.green(data));

    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Read statistics details successful',
      data,
    });
  } catch (error) {
    console.error(chalk.red('Error in getProductByID: ', error));
    return next(error);
  }
};

// get total revenue by year and month
exports.processGetTotalRevenue = async (req, res, next) => {
  console.log(chalk.blue('processGetTotalRevenue running'));
  try {
    const revenueData = await productServices.getTotalRevenue();
    console.log(chalk.yellow(revenueData));
    if (!revenueData) {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No payments exist',
      });
    }
    console.log(chalk.yellow('revenueData data: ', revenueData));
    const revenues = revenueData.map((revenue) => ({
      year: revenue.year,
      month: revenue.month,
      total: revenue.total,
    }));

    console.log(chalk.green(revenues));

    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Read revenue details successful',
      revenues,
    });
  } catch (error) {
    console.error(chalk.red('Error in getTotalRevenue: ', error));
    return next(error);
  }
};

// get total number of products by category
exports.processGetTotalNumberOfProductsByCategory = async (req, res, next) => {
  console.log(chalk.blue('processGetTotalNumberOfProductsByCategory running'));
  try {
    const categoryData =
      await productServices.getTotalNumberOfProductsByCategory();
    console.log(chalk.yellow(categoryData));
    if (!categoryData) {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No categories exist',
      });
    }
    console.log(chalk.yellow('categoryData data: ', categoryData));
    const categories = categoryData.map((category) => ({
      category: category.category,
      count: category.count,
    }));

    console.log(chalk.green(categories));

    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Read category details successful',
      categories,
    });
  } catch (error) {
    console.error(
      chalk.red('Error in getTotalNumberOfProductsByCategory: ', error)
    );
    return next(error);
  }
};

// get total number of orders by brand
exports.processGetTotalNumberOfOrdersByBrand = async (req, res, next) => {
  console.log(chalk.blue('processGetTotalNumberOfOrdersByBrand running'));
  try {
    const brandData = await productServices.getTotalNumberOfOrdersByBrand();
    console.log(chalk.yellow(brandData));
    if (!brandData) {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No brands exist',
      });
    }
    console.log(chalk.yellow('brandData data: ', brandData));
    const brands = brandData.map((brand) => ({
      brand: brand.brand,
      count: brand.count,
    }));

    console.log(chalk.green(brands));

    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Read brand details successful',
      brands,
    });
  } catch (error) {
    console.error(chalk.red('Error in getTotalNumberOfOrdersByBrand: ', error));
    return next(error);
  }
};

// get total number of bookmarks by brand
exports.processGetTotalNumberOfBookmarksByBrand = async (req, res, next) => {
  console.log(chalk.blue('processGetTotalNumberOfBookmarksByBrand running'));
  try {
    const brandData = await productServices.getTotalNumberOfBookmarksByBrand();
    console.log(chalk.yellow(brandData));
    if (!brandData) {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No brands exist',
      });
    }
    console.log(chalk.yellow('brandData data: ', brandData));
    const brands = brandData.map((brand) => ({
      brand: brand.brand,
      count: brand.count,
    }));

    console.log(chalk.green(brands));

    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Read brand details successful',
      brands,
    });
  } catch (error) {
    console.error(
      chalk.red('Error in getTotalNumberOfBookmarksByBrand: ', error)
    );
    return next(error);
  }
};

// get total number of orders by shipping method
exports.processGetTotalNumberOfOrdersByShipping = async (req, res, next) => {
  console.log(chalk.blue('processGetTotalNumberOfOrdersByShipping running'));
  try {
    const shippingData =
      await productServices.getTotalNumberOfOrdersByShipping();
    console.log(chalk.yellow(shippingData));
    if (!shippingData) {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No shipping methods exist',
      });
    }
    console.log(chalk.yellow('shippingData data: ', shippingData));
    const methods = shippingData.map((method) => ({
      shipping: method.shipping,
      count: method.count,
    }));

    console.log(chalk.green(methods));

    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Read shipping details successful',
      methods,
    });
  } catch (error) {
    console.error(
      chalk.red('Error in getTotalNumberOfOrdersByShipping: ', error)
    );
    return next(error);
  }
};

// get total number of orders by status
exports.processGetTotalNumberOfOrdersByStatus = async (req, res, next) => {
  console.log(chalk.blue('processGetTotalNumberOfOrdersByStatus running'));
  try {
    const orderData = await productServices.getTotalNumberOfOrdersByStatus();
    console.log(chalk.yellow(orderData));
    if (!orderData) {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No orders methods exist',
      });
    }
    console.log(chalk.yellow('orderData data: ', orderData));
    const orders = orderData.map((order) => ({
      status: order.status,
      count: order.count,
    }));

    console.log(chalk.green(orders));

    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Read order details successful',
      orders,
    });
  } catch (error) {
    console.error(
      chalk.red('Error in getTotalNumberOfOrdersByStatus: ', error)
    );
    return next(error);
  }
};

// get total revenue by brand
exports.processGetTotalRevenueByBrand = async (req, res, next) => {
  console.log(chalk.blue('processGetTotalRevenueByBrand running'));
  try {
    const orderData = await productServices.getTotalRevenueByBrand();
    console.log(chalk.yellow(orderData));
    if (!orderData) {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No brands exist',
      });
    }
    console.log(chalk.yellow('orderData data: ', orderData));
    const orders = orderData.map((order) => ({
      brand: order.brand,
      count: order.count,
    }));

    console.log(chalk.green(orders));

    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Read order details successful',
      orders,
    });
  } catch (error) {
    console.error(chalk.red('Error in getTotalRevenueByBrand: ', error));
    return next(error);
  }
};

// get total revenue by category
exports.processGetTotalRevenueByCategory = async (req, res, next) => {
  console.log(chalk.blue('processGetTotalRevenueByCategory running'));
  try {
    const orderData = await productServices.getTotalRevenueByCategory();
    console.log(chalk.yellow(orderData));
    if (!orderData) {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No categories exist',
      });
    }
    console.log(chalk.yellow('orderData data: ', orderData));
    const orders = orderData.map((order) => ({
      category: order.category,
      count: order.count,
    }));

    console.log(chalk.green(orders));

    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Read order details successful',
      orders,
    });
  } catch (error) {
    console.error(chalk.red('Error in getTotalRevenueByCategory: ', error));
    return next(error);
  }
};

// get total number of products by brand or category
exports.processGetTotalNumberOfProducts = async (req, res, next) => {
  console.log(chalk.blue('processGetTotalNumberOfProducts running'));
  const { categoryID, brandID } = req.params;
  if (!categoryID || !brandID) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Category ID or Brand ID is missing',
    });
  }
  if (isNaN(parseInt(categoryID)) || isNaN(parseInt(brandID))) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Category ID or Brand ID is not a number',
    });
  }

  try {
    const productData = await productServices.getTotalNumberOfProducts(
      categoryID,
      brandID
    );
    console.log(chalk.yellow('Total Products: ', productData));
    const data = {
      total_products: productData.total_products,
    };

    console.log(chalk.green(data));

    const response = {
      statusCode: 200,
      ok: true,
      message: 'Read total products details successful',
      data: data.total_products,
    };

    console.log(chalk.yellow(productData.length));

    if (productData.length === 0) {
      response.statusCode = 200;
      response.message = 'No categories or brands exist';
    }

    return res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(chalk.red('Error in getTotalNumberOfProducts: ', error));
    return next(error);
  }
};

// get images by product ID
exports.processGetImagesByProductID = async (req, res, next) => {
  console.log(chalk.blue('processGetImagesByProductID running'));
  const { productID } = req.params;
  try {
    const imageData = await productServices.getImagesByProductID(productID);
    if (!imageData || imageData.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No images exist',
      });
    }
    console.log(chalk.yellow('Image data: ', imageData));
    const images = imageData.map((image) => ({
      product_id: image.product_id,
      image_id: image.image_id,
      image_url: image.image_url,
    }));
    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Read image details successful',
      data: images,
    });
  } catch (error) {
    console.error(chalk.red('Error in getImagesByProductID: ', error));
    return next(error);
  }
};

// get related products
exports.processGetRelatedProducts = async (req, res, next) => {
  console.log(chalk.blue('processGetRelatedProducts running'));
  // const { productID } = req.params;
  const { productID } = req.params;
  try {
    const productData = await productServices.getRelatedProducts(productID);
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
        category_id: product.category_id,
        brand_id: product.brand_id,
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
        message: 'No related products exists',
      });
    }
  } catch (error) {
    console.error(chalk.red('Error in getRelatedProducts: ', error));
    return next(error);
  }
};

// DELETE

// Delete product by ID
exports.processDeleteProductByID = async (req, res, next) => {
  console.log(chalk.blue('processDeleteProductByID running'));

  const { productID } = req.params;

  if (!productID) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Product ID is missing',
    });
  }

  try {
    const deletedProductData = await productServices.deleteProductByID(
      parseInt(productID)
    );

    if (!deletedProductData) {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No such product exists',
      });
    }

    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Product Deletion successful',
      data: deletedProductData,
    });
  } catch (error) {
    console.error(chalk.red('Error in deleteProductByID: ', error));
    return next(error);
  }
};

// Delete brand by ID
exports.processDeleteBrandByID = async (req, res, next) => {
  console.log(chalk.blue('processDeleteBrandByID running'));

  const { brandID } = req.params;

  if (!brandID) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Brand ID is missing',
    });
  }

  try {
    const deletedBrandData = await productServices.deleteBrandByID(
      parseInt(brandID)
    );

    if (!deletedBrandData) {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No such brand exists',
      });
    }

    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Brand Deletion successful',
      data: deletedBrandData,
    });
  } catch (error) {
    console.error(chalk.red('Error in deleteBrandByID: ', error));
    return next(error);
  }
};

// Delete category by ID
exports.processDeleteCategoryByID = async (req, res, next) => {
  console.log(chalk.blue('processDeleteCategoryByID running'));

  const { categoryID } = req.params;

  if (!categoryID) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Category ID is missing',
    });
  }

  try {
    const deletedCategoryData = await productServices.deleteCategoryByID(
      parseInt(categoryID)
    );

    if (!deletedCategoryData) {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No such category exists',
      });
    }

    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Category Deletion successful',
      data: deletedCategoryData,
    });
  } catch (error) {
    console.error(chalk.red('Error in deleteCategoryByID: ', error));
    return next(error);
  }
};

// delete images by image id
exports.processDeleteImagesByID = async (req, res, next) => {
  console.log(chalk.blue('processDeleteImagesByID running'));
  const { imageID } = req.params;
  if (!imageID) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Image ID is missing',
    });
  }

  try {
    const deletedImageData = await productServices.deleteImageByID(
      parseInt(imageID)
    );
    if (!deletedImageData) {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No such images exist',
      });
    }
    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Image Deletion successful',
      data: deletedImageData,
    });
  } catch (error) {
    console.error(chalk.red('Error in deleteImagesByID: ', error));
    return next(error);
  }
};

// delete images by product id
exports.processDeleteImagesByProductID = async (req, res, next) => {
  console.log(chalk.blue('processDeleteImagesByProductID running'));
  const { productID } = req.params;
  if (!productID) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Product ID is missing',
    });
  }

  try {
    const deletedImageData = await productServices.deleteImagesByProductID(
      parseInt(productID)
    );
    if (!deletedImageData) {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No such products exist',
      });
    }
    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Image Deletion successful',
      data: deletedImageData,
    });
  } catch (error) {
    console.error(chalk.red('Error in deleteImagesByProductID: ', error));
    return next(error);
  }
};

// PUT

// update product by ID
exports.processUpdateProductByID = async (req, res, next) => {
  console.log(chalk.blue('processUpdateProductByID running'));
  const { productID } = req.params;
  const { product_name, price, description, category_id, brand_id, quantity } =
    req.body;
  var floatPrice, intCategoryID, intBrandID, intQuantity;
  floatPrice = price ? parseFloat(price) : null;
  intCategoryID = category_id ? parseInt(category_id) : null;
  intBrandID = brand_id ? parseInt(brand_id) : null;
  intQuantity = quantity ? parseInt(quantity) : null;

  if (!productID) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Product ID is missing',
    });
  }

  if (
    product_name == '' &&
    price == '' &&
    description == '' &&
    category_id == '' &&
    brand_id == '' &&
    quantity == ''
  ) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'All input fields cannot be blank.',
    });
  }
  try {
    const updatedProductData = await productServices.updateProductByID(
      product_name,
      floatPrice,
      description,
      intCategoryID,
      intBrandID,
      quantity,
      parseInt(productID)
    );
    if (!updatedProductData) {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No such product exists',
      });
    }
    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Update product details successful',
    });
  } catch (error) {
    console.error(chalk.red('Error in updateProductByID: ', error));
    return next(error);
  }
};

// update inventory - increase 1
exports.processUpdateInventoryUp = async (req, res, next) => {
  console.log(chalk.blue('processUpdateInventoryUp running'));
  const { productID } = req.params;
  if (!productID) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Product ID is missing',
    });
  }
  try {
    const updatedInventoryData = await productServices.updateInventoryUp(
      productID
    );
    if (!updatedInventoryData) {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No such product exists',
      });
    }
    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Update product details successful',
    });
  } catch (error) {
    console.error(chalk.red('Error in updateInventoryUp: ', error));
    return next(error);
  }
};

// update inventory - decrease 1
exports.processUpdateInventoryDown = async (req, res, next) => {
  console.log(chalk.blue('processUpdateInventoryDown running'));
  const { productID } = req.params;
  if (!productID) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Product ID is missing',
    });
  }
  try {
    const updatedInventoryData = await productServices.updateInventoryDown(
      productID
    );
    if (!updatedInventoryData) {
      return res.status(404).json({
        statusCode: 404,
        ok: true,
        message: 'No such product exists',
      });
    }
    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Update product details successful',
    });
  } catch (error) {
    console.error(chalk.red('Error in updateInventoryDown: ', error));
    return next(error);
  }
};

// POST

// create new product
exports.processCreateProduct = async (req, res, next) => {
  console.log(chalk.blue('processCreateProduct running'));
  const { name, price, description, category_id, brand_id, image, quantity } =
    req.body;
  if (
    name == '' ||
    !name ||
    price == '' ||
    !price ||
    description == '' ||
    !description ||
    category_id == '' ||
    !category_id ||
    brand_id == '' ||
    !brand_id
  ) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Product data is missing',
    });
  }
  if (isNaN(price) || price <= 0) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Price has to be a number greater than 0',
    });
  }
  if (isNaN(quantity) || quantity < 0) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Inventory has to be a number greater than 0',
    });
  }
  console.log(req.body);
  console.log('test');
  try {
    const createdProductData = await productServices.createProduct(
      name,
      parseFloat(price),
      description,
      parseInt(category_id),
      parseInt(brand_id),
      image,
      quantity
    );
    console.log(chalk.yellow(createdProductData));
    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Create product successful',
    });
  } catch (error) {
    console.error(chalk.red(error.code));
    console.error(chalk.red('Error in createProduct: ', error));
    return next(error);
  }
};

// create rating
exports.processCreateRating = async (req, res, next) => {
  console.log(chalk.blue('processCreateRating running'));
  const { comment, rating_score, customer_id, product_id } = req.body;
  if (!comment || !rating_score || !customer_id || !product_id) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Rating data is missing',
    });
  }
  if (isNaN(rating_score) || rating_score < 0) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Rating score has to be a number greater than 0',
    });
  }
  try {
    const createdRatingData = await productServices.createRating(
      comment,
      rating_score,
      customer_id,
      product_id
    );
    console.log(chalk.yellow(createdRatingData));
    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Create rating successful',
    });
  } catch (error) {
    console.error(chalk.red(error.code));
    console.error(chalk.red('Error in createRating: ', error));
    return next(error);
  }
};

// create brand or category
exports.processCreateBrandOrCategory = async (req, res, next) => {
  console.log(chalk.blue('processCreateBrandOrCategory running'));
  const { name, type } = req.body;
  if (!name || !type) {
    return res.status(400).json({
      statusCode: 400,
      ok: true,
      message: 'Data is missing',
    });
  }
  console.log(req.body);
  try {
    const createdData = await productServices.createBrandOrCategory(name, type);
    console.log(chalk.yellow('createdData:', createdData));
    if (createdData == -1) {
      console.log(chalk.yellow('createdData:', createdData));
      return res.status(409).json({
        statusCode: 409,
        ok: true,
        message: 'Duplicate',
      });
    }
    return res.status(200).json({
      statusCode: 200,
      ok: true,
      message: 'Create successful',
    });
  } catch (error) {
    console.error(chalk.red('error code', error.code));
    console.error(chalk.red('Error in createBrandOrCategory: ', error));
    return next(error);
  }
};

// add new image to product
exports.processCreateImageForProduct = async (req, res, next) => {
  console.log(chalk.blue('processCreateImageForProduct running'));
  const { product_id, image_url } = req.body;
  if (!product_id || !image_url) {
    return res.status(400).json({
      statusCode: 400,
      ok: false,
      message: 'Image data is missing',
    });
  }
  if (isNaN(product_id) || product_id < 0) {
    return res.status(400).json({
      statusCode: 400,
      ok: false,
      message: 'Product ID has to be a number greater than 0',
    });
  }
  console.log(chalk.yellow(image_url));
  try {
    const createdImageData = await productServices.createImageForProduct(
      image_url,
      product_id
    );
    console.log(chalk.yellow(createdImageData));
    if (createdImageData) {
      return res.status(200).json({
        statusCode: 200,
        ok: true,
        message: 'Create image successful',
      });
    } else {
      return res.status(500).json({
        statusCode: 500,
        ok: false,
        message: 'Failed to create image',
      });
    }
  } catch (error) {
    console.error(chalk.red('Error in processCreateImageForProduct: ', error));
    return next(error);
  }
};
