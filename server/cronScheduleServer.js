const express = require('express');
const bookmarkEmailServices = require('./src/services/bookmarkEmail.services');
const cron = require('node-cron');
const app = express();

app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
  cron.schedule('0 */6 * * *', () => {
    bookmarkEmailServices.updateProductsEmailSender().catch((error) => {
      console.error('Error in updateProductsEmailSender:', error);
    });
  });
});