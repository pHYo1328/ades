const express = require('express');
const bookmarkEmailController = require('./src/controller/updateProductEmail.controller');
const cron = require('node-cron');
const app = express();

app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
  cron.schedule('* * * * * *', () => {
    bookmarkEmailController.updateProductsEmailSender().catch((error) => {
      console.error('Error in updateProductsEmailSender:', error);
    });
  });
});
