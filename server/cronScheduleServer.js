const express = require('express');
const http = require('http'); // Import the http module
const socketIo = require('socket.io');
const bookmarkEmailController = require('./src/controller/updateProductEmail.controller');
const unpaidOrdersController = require('./src/controller/unpaidOrderCleaner.controller');
const allowedOrigins = require('./src/config/allowedOrigins');
const cron = require('node-cron');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'https://techzero.onrender.com',
    methods: ['GET', 'POST'],
  },
});
const userSockets = {};
app.use(cors({ origin: allowedOrigins }));
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('register', (userId) => {
    userSockets[userId.userId] = socket;
    console.log(userId.userId);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(8000, () => {
  // Use server.listen instead of app.listen
  console.log(`Server is running on port 8000`);

  cron.schedule('* * * * *', () => {
    bookmarkEmailController
      .updateProductsEmailSender(io, userSockets)
      .catch((error) => {
        console.error('Error in updateProductsEmailSender:', error);
      });
  });

  cron.schedule('0 * * * *', () => {8
    unpaidOrdersController.cleanUnpaidOrders(io, userSockets).catch((error) => {
      console.error('Error in scheduled task cleanUnpaidOrders:', error);
    });
  });
});
