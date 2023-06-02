const chalk = require('chalk');
const pool = require('../config/database');

// select product id and quantity for inventory checking
module.exports.checkInventory = async (productIDs) => {
  console.log(chalk.blue('checkInventory is called'));
  const checkInventoryQuery = `
                              SELECT inventory.product_id,inventory.quantity,product.product_name FROM inventory 
                              inner join product on product.product_id = inventory.product_id
                              WHERE inventory.product_id in ?;
                              `;
  try {
    console.log(
      chalk.blue(
        'Creating connection...\n',
        'database is connected in inventory.services.js checkInventory function'
      )
    );
    console.log(chalk.blue('Executing query >>>>>>'), checkInventoryQuery);
    const result = await pool.query(checkInventoryQuery, [[productIDs]]);
    console.log(
      chalk.green('Fetched Data to check inventory status>>>', result)
    );
    return result[0];
  } catch (error) {
    console.error(chalk.red('Errors in fetch inventory quantity', error));
  }
};
