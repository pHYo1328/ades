const express = require('express');
const http = require('http'); // Import the http module
const socketIo = require('socket.io');
const bookmarkEmailController = require('./src/controller/updateProductEmail.controller');
const updateProductEmailController = require('./src/controller/unpaidOrderCleaner.controller');
const allowedOrigins = require('./src/config/allowedOrigins');
const cron = require('node-cron');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const userSockets = {};
app.use(cors({ origin: allowedOrigins }));
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.emit('test', { message: 'Test message from server' });
  socket.on('register', (userId) => {
    userSockets[userId.userId] = socket;
    console.log('userID: ' + JSON.stringify(userId.userId));
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(8000, () => {
  // Use server.listen instead of app.listen
  console.log(`Server is running on port 8000`);

  cron.schedule('* * * * * *', () => {
    bookmarkEmailController
      .updateProductsEmailSender(io, userSockets)
      .catch((error) => {
        console.error('Error in updateProductsEmailSender:', error);
      });
  });

  // cron.schedule('0 1 * * *', () => {
  //   unpaidOrdersController.cleanUnpaidOrders().catch((error) => {
  //     console.error('Error in scheduled task cleanUnpaidOrders:', error);
  //   });
  // });
});
