const pool = require('../config/database');

// try to refetch gor three times before show error
async function queryWithRetry(query, params, retries) {
  try {
    return await pool.query(query, params);
  } catch (error) {
    if (error.code === 'ETIMEDOUT' && retries > 0) {
      console.log('Query timed out, retrying...');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return await queryWithRetry(query, params, retries - 1);
    } else {
      throw error;
    }
  }
}

// fetch the latest date of data insertion
module.exports.getLatestUpdate = async () => {
  const updateCheckingQuery =
    'SELECT MAX(created_at) AS latest_update FROM product';
  try {
    const latestUpdateTime = await queryWithRetry(updateCheckingQuery, [], 3);
    return latestUpdateTime;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// fetch customerDetails according to the brand id
module.exports.getCustomerDetails = async (previousUpdate) => {
  const fetchCustomerDetailsQuery = `
    SELECT users.customer_id,users.email,users.username,bookmark.brand_id, brand.brand_name
    FROM users
    INNER JOIN bookmark on bookmark.customer_id = users.customer_id
    INNER JOIN brand on brand.brand_id = bookmark.brand_id
    WHERE bookmark.brand_id IN (
    SELECT DISTINCT product.brand_id
    FROM product 
    WHERE product.created_at > ?)`;
  try {
    const customerDetails = await queryWithRetry(
      fetchCustomerDetailsQuery,
      [previousUpdate],
      3
    );
    return customerDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// select the new inserted products from that particular brand
module.exports.getUpdatedProductsByBrandID = async (previousUpdate) => {
  const fetchUpdatedProductsByBrandIDQuery = `
    select product.product_name,product.description,MAX(product_image.image_url) as image_url,product.brand_id from product
    left join product_image on product_image.product_id = product.product_id
    where brand_id in (SELECT DISTINCT brand_id FROM product WHERE created_at > ?) 
    and created_at > ?
    GROUP BY product.product_name, product.description, product.brand_id
    ;`;

  try {
    const updatedProducts = await pool.query(
      fetchUpdatedProductsByBrandIDQuery,
      [previousUpdate, previousUpdate]
    );
    return updatedProducts;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
