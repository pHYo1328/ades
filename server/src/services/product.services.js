const pool = require("../config/database");
const chalk = require("chalk");

// get product by ID (done) (done)
module.exports.getProductByID = async (productID) => {
  console.log(chalk.blue("getProductByID is called"));
  try {
    const productDataQuery =
      "SELECT p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url FROM product p, category c, brand b where p.product_id=? and c.category_id = p.category_id and p.brand_id = b.brand_id;";
    const results = await pool.query(productDataQuery, [productID]);
    console.log(chalk.green(results));
    return results[0][0];
  } catch (error) {
    console.error(chalk.red("Error in getProductByID: ", error));
    throw error;
  }
};

// delete product by ID (done, but still need to delete from order)
module.exports.deleteProductByID = async (productID) => {
  console.log(chalk.blue("deleteProductByID is called"));
  try {
    const productDeleteQuery = "DELETE FROM product where product_id=?;";
    const orderItemsDeleteQuery = "DELETE from order where product_id = ?;";
    const ratingDeleteQuery = "DELETE from rating where product_id =?;";
    const results = await pool.query(productDeleteQuery, [productID]);
    console.log(chalk.green(results));
    console.log(chalk.yellow(results[0].affectedRows));
    return results[0].affectedRows > 0;
    console.log(chalk.yellow(results[0].affectedRows));
    return results[0].affectedRows > 0;
  } catch (error) {
    console.error(chalk.red("Error in deleteProductByID: ", error));
    throw error;
  }
};

// get all products (done)
module.exports.getAllProducts = async () => {
  console.log(chalk.blue("getAllProducts is called"));
  try {
    const productsDataQuery =
      "SELECT p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url FROM product p, category c, brand b where c.category_id = p.category_id and p.brand_id = b.brand_id;";
    const results = await pool.query(productsDataQuery);
    console.log(chalk.green(results[0]));
    return results[0];
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red("Error in getAllProducts: ", error));
    throw error;
  }
};

// get products by category (done)
module.exports.getProductsByCategoryID = async (categoryID) => {
  console.log(chalk.blue("getProductsByCategoryID is called"));
  try {
    const productsDataQuery =
      "SELECT p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url FROM product p, category c, brand b where c.category_id = p.category_id and p.brand_id = b.brand_id and c.category_id =?;";
    const results = await pool.query(productsDataQuery, [categoryID]);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red("Error in getProductsByCategoryID: ", error));
    throw error;
  }
};

// get products by brand (done)
module.exports.getProductsByBrandID = async (brandID) => {
  console.log(chalk.blue("getProductsByBrandID is called"));
  try {
    const productsDataQuery =
      "SELECT p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url FROM product p, category c, brand b where c.category_id = p.category_id and p.brand_id = b.brand_id and b.brand_id =?;";
    const results = await pool.query(productsDataQuery, [brandID]);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red("Error in getProductsByBrandID: ", error));
    throw error;
  }
};

// get 3 newest product arrivals (done)
module.exports.getNewArrivals = async () => {
  console.log(chalk.blue("getNewArrivals is called"));
  try {
    const productsDataQuery =
      "SELECT p.product_name, p.description, p.price, c.category_name, b.brand_name, p.image_url FROM product p, category c, brand b where c.category_id = p.category_id and p.brand_id = b.brand_id order by created_at desc limit 3";
    const results = await pool.query(productsDataQuery);
    console.log(chalk.green(results[0]));
    return results[0];
  } catch (error) {
    console.error(chalk.red("Error in getNewArrivals: ", error));
    throw error;
  }
};

// update product by ID
module.exports.updateProductByID = async (
  name,
  price,
  description,
  category_id,
  brand_id,
  image_url,
  product_id
) => {
  console.log(chalk.blue("updateProductByID is called"));
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  try {
    const productUpdateQuery =
      "UPDATE product SET name=COALESCE(?,name), price=COALESCE(?,price), description=COALESCE(?,description), category_id=COALESCE(?,category_id), brand_id=COALESCE(?,brand_id), image_url=COALESCE(?,image_url) where product_id = ?";
    const results = await connection.query(productUpdateQuery, [
      name,
      price,
      description,
      category_id,
      brand_id,
      image_url,
      product_id,
    ]);
    console.log(chalk.green(results));
    return results.affectedRows > 0;
  } catch (error) {
    console.error(chalk.red("Error in updateProductByID: ", error));
    throw error;
  } finally {
    connection.release();
  }
};

// create product
module.exports.createProduct = async (
  name,
  price,
  description,
  category_id,
  brand_id,
  image
) => {
  console.log(chalk.blue("createProduct is called"));
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  try {
    const cloudinaryResult = await cloudinary_api_key.uploader.upload(
      image.path
    );
    const productCreateQuery =
      "INSERT into product (name,price, description, category_id, brand_id, image_url) values (?,?,?,?,?,?)";
    const results = await connection.query(productCreateQuery, [
      name,
      price,
      description,
      category_id,
      brand_id,
      cloudinaryResult.secure_url,
    ]);
    console.log(chalk.green(results));
    return results.affectedRows > 0;
  } catch (error) {
    console.error(chalk.red("Error in createProduct: ", error));
    throw error;
  } finally {
    connection.release();
  }
};
