const chalk = require('chalk');
const pool = require('../config/database');
const cron = require('node-cron');
let previousUpdate =  null;
cron.schedule('0 * * * * ',()=>{
    console.log(chalk.blue('Cron schedule Started'));
    const updateCheckingQuery = 'SELECT MAX(created_at) AS lastest_update FROM product';
    const fetchAllBrandUpdatedQuery = 'SELECT DISTINCT brand_id FROM product WHERE created_at > ?';
})
