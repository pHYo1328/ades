const { builtinModules } = require("module");
const client = require("../config/client");
const chalk = require("chalk");

// get product by ID
module.exports.getProductByID = async (product_id) => {
  console.log(chalk.blue("getProductByID is called"));
  try {
    await client.get(`product:${product_id}`, (err, productData) => {
      if (err) console.error(chalk.red("Error in getting product data: ", err));
      else {
        console.log(chalk.green("Product data: ", productData));
        return productData;
      }
    });
  } catch (error) {
    console.error(chalk.red("Error in getProductByID: ", error));
    throw error;
  } finally {
    client.quit();
  }
};

// delete product by ID
module.exports.deleteProductByID = async (product_id) => {
  console.log(chalk.blue("deleteProductByID is called"));
  try {
    await client.del(`product:${product_id}`, (err, reply) => {
      if (err)
        console.error(chalk.red("Error in deleting product data: ", err));
      else {
        console.log(chalk.green("Deleted product: ", reply));
        return productData;
      }
    });
  } catch (error) {
    console.error(chalk.red("Error in deleteProductByID: ", error));
    throw error;
  } finally {
    client.quit();
  }
};

// // Get all products details
// module.exports.processGetAllProducts = async function () {
//   console.log("GetAllProducts method is called...");'

//   const promisePool = pool.promise();
//   const connection = await promisePool.getConnection();

//   try {
//     const productsDataQuery = "SELECT name FROM product";
//     const results = await connection.query(productsDataQuery);
//     return results;
//   } catch (error) {
//     console.log(error);
//     throw new E.InternalError({ originalError: error });
//   } finally {
//     await connection.release();
//   }
// };

// // Search product by ID
// module.exports.processGetProductByID = async function (product_id) {
//   console.log("GetProductByID method is called...");

//   const promisePool = pool.promise();
//   const connection = await promisePool.getConnection();

//   try {
//     const productDataQuery = "SELECT name FROM product where product_id=?;";
//     const results = await connection.query(productDataQuery, [product_id]);
//     return results[0];
//   } catch (error) {
//     console.log(error);
//     throw new E.InternalError({ originalError: error });
//   } finally {
//     await connection.release();
//   }
// };

// // Get products by category
// module.exports.processGetProductsByCategoryID = async function (category_id) {
//   console.log("GetProductsByCategoryID method is called...");

//   const promisePool = pool.promise();
//   const connection = await promisePool.getConnection();

//   try {
//     const productsDataQuery = "SELECT * FROM product where category_id=?;";
//     const results = await connection.query(productsDataQuery, [category_id]);
//     return results[0];
//   } catch (error) {
//     console.log(error);
//     throw new E.InternalError({ originalError: error });
//   } finally {
//     await connection.release();
//   }
// };

// // Get products by brand
// module.exports.processGetProductsByBrandID = async function (brand_id) {
//   console.log("GetProductsByCategoryID method is called...");

//   const promisePool = pool.promise();
//   const connection = await promisePool.getConnection();

//   try {
//     const productsDataQuery = "SELECT * FROM product where brand_id=?;";
//     const results = await connection.query(productsDataQuery, [brand_id]);
//     return results[0];
//   } catch (error) {
//     console.log(error);
//     throw new E.InternalError({ originalError: error });
//   } finally {
//     await connection.release();
//   }
// };

// // Update product by ID
// module.exports.updateProduct = async function (name, uuid) {
//   console.log("updateProfile method is called...");

//   const promisePool = pool.promise();
//   const connection = await promisePool.getConnection();

//   try {
//     const productDataQuery = "UPDATE product SET name = ? where uuid = ?";
//     const results = await connection.query(productDataQuery, [name, uuid]);
//     return results[0];
//   } catch (error) {
//     console.log(error);
//     // need to validate error, but haven't done yet
//   } finally {
//     await connection.release();
//   }
// };

// // Delete product by ID
// module.exports.deleteProductByID = async function (product_id) {
//   console.log("deleteTask method is called...");

//   const promisePool = pool.promise();
//   const connection = await promisePool.getConnection();

//   try {
//     const productDeleteQuery = "DELETE FROM product where product-id =?";
//     const results = await connection.query(productDeleteQuery, [product_id]);
//     return results[0];
//   } catch (error) {
//     console.log(error);
//   } finally {
//     await connection.release();
//   }
// };

// // Create product by brand or category
// exports.processAddProduct = async function (productName, address) {
//   console.log("addProduct method is called...");

//   const promisePool = pool.promise();
//   const connection = await promisePool.getConnection();

//   try {
//     const productDataQuery =
//       "INSERT INTO product (productName, address) VALUES (?,?)";
//     const results = await connection.query(productDataQuery, [
//       productName,
//       address,
//     ]);
//     return results[0];
//   } catch (error) {
//     console.log(error);
//     throw new E.InternalError({ originalError: error });
//   } finally {
//     await connection.release();
//   }
// };

// // Get best sale products
// module.exports.processGetBestSaleProducts = async function () {
//   console.log("GetBestSaleProducts method is called...");

//   const promisePool = pool.promise();
//   const connection = await promisePool.getConnection();

//   try {
//     const productsDataQuery =
//       "SELECT name FROM product ORDER BY qty_sold LIMIT 3";
//     const results = await connection.query(productsDataQuery);
//     return results;
//   } catch (error) {
//     console.log(error);
//     throw new E.InternalError({ originalError: error });
//   } finally {
//     await connection.release();
//   }
// };

// // Get new arrivals
// module.exports.processGetNewArrivals = async function () {
//   console.log("GetNewArrivals method is called...");

//   const promisePool = pool.promise();
//   const connection = await promisePool.getConnection();

//   try {
//     const productsDataQuery =
//       "SELECT name FROM product ORDER BY arrival_date LIMIT 3";
//     const results = await connection.query(productsDataQuery);
//     return results;
//   } catch (error) {
//     console.log(error);
//     throw new E.InternalError({ originalError: error });
//   } finally {
//     await connection.release();
//   }
// };
