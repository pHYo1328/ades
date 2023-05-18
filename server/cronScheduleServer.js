const bookmarkEmailServices = require('./src/services/bookmarkEmail.services');
const cron = require('node-cron');
cron.schedule('* */6 * * *', bookmarkEmailServices.updateProductsEmailSender);