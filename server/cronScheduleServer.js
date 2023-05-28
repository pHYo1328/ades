const bookmarkEmailServices = require('./src/services/bookmarkEmail.services');
const cron = require('node-cron');
//cron.schedule('*/5 * * * * *', bookmarkEmailServices.updateProductsEmailSender); //for testing purposes
cron.schedule('0 */6 * * *', () => {
  bookmarkEmailServices.updateProductsEmailSender().catch((error) => {
    console.error('Error in updateProductsEmailSender:', error);
  });
});
