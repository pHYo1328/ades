const orderServices = require("../services/order.services");

module.exports.cleanUnpaidOrders = async () => {
  const threeDayOldOrders = await orderServices.getUnpaidOrders(3);
  const fourDayOldOrders = await orderServices.getOrdersToClean(4);
  await Promise.all([
    // Process 3-day-old orders
    ...Object.entries(
      threeDayOldOrders.reduce((acc, order) => {
        acc[order.customer_id] = acc[order.customer_id] || {customerEmail: order.email, orderIds: []};
        acc[order.customer_id].orderIds.push(order.order_id);
        return acc;
      }, {})
    ).map(([customerID,customerOrders]) => {
      orderServices.sendReminderEmail(customerOrders.orderIds,customerOrders.customerEmail)
    }),

   // Delete 4-day-old orders
    ...fourDayOldOrders.map((order) => orderServices.deleteOrder(order.order_id)),  // ensure that 'id' is the correct key for the order's id
  ]);
};
