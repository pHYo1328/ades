const express = require('express');
const bookmarkEmailController = require('./src/controller/updateProductEmail.controller');
const updateProductEmailController = require('./src/controller/unpaidOrderCleaner.controller');
const cron = require('node-cron');
const app = express();

app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
  cron.schedule('1 * * * *', () => {
    bookmarkEmailController.updateProductsEmailSender().catch((error) => {
      console.error('Error in updateProductsEmailSender:', error);
    });
    
  });
  cron.schedule('0 1 * * *', () => {
    unpaidOrdersController.cleanUnpaidOrders()
      .catch((error) => {
        console.error('Error in scheduled task cleanUnpaidOrders:', error);
      });
  });
});
