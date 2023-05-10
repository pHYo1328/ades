const chalk = require('chalk');
const pool = require('../config/database');

module.export.checkInventory = async (data) => {
  console.log(chalk.blue('checkInventory is called'));
  const { productID } = data;
  const checkInventoryQuery = `
                        SELECT quantity FROM inventory 
                        WHERE product_id=?
                        `;
  try {
    console.log(
      chalk.blue(
        'Creating connection...\n',
        'database is connected in order.services.js getOrderDetailsBeforePickUp function'
      )
    );
    const IdRequired = [productID];
    console.log(chalk.blue('Executing query >>>>>>'), checkInventoryQuery);
    const result = await pool.query(checkInventoryQuery, IdRequired);
    console.log(
      chalk.green('Fetched Data to check inventory status>>>', result)
    );
  } catch (error) {
    console.error(chalk.red('Errors in fetch inventory quantity', error));
  }
};
