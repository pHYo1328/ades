const orderServices = require('../services/order.services');

module.exports.cleanUnpaidOrders = async (io, userSockets) => {
  const threeDayOldOrders = await orderServices.getUnpaidOrders(3);
  console.log(threeDayOldOrders);
  const fourDayOldOrders = await orderServices.getOrdersToClean(4);
  await Promise.all([
    // Process 3-day-old orders
    ...Object.entries(
      threeDayOldOrders.reduce((acc, order) => {
        acc[order.customer_id] = acc[order.customer_id] || {
          customerEmail: order.email,
          orderIds: [],
        };
        acc[order.customer_id].orderIds.push(order.order_id);
        return acc;
      }, {})
    ).map(([customerID, customerOrders]) => {
      orderServices.sendReminderEmail(
        customerOrders.orderIds,
        customerOrders.customerEmail
      );
      const socket = userSockets[customerID];
      const message = `Dear customer,your orders are still pending. Please complete the payments or the orders will be cancelled.`;
      if (socket) {
        socket.emit('message', {
          message: message,
        });
      }
    }),

    //Delete 4-day-old orders
    ...fourDayOldOrders.map((order) =>
      orderServices.deleteOrder(order.order_id)
    ), // ensure that 'id' is the correct key for the order's id
  ]);
};
