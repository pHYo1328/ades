class OrderStatus {
  static ORDER_RECEIVED = new OrderStatus('order_received', 'Order received');
  static ORDER_PAID = new OrderStatus('paid', 'Order paid');
  static ORDER_DELIVERING = new OrderStatus(
    'delivering',
    'Order is delivering to customer'
  );
  static ORDER_DELIVERED = new OrderStatus(
    'success',
    'Order delivered to customer'
  );
  constructor(key, description) {
    this.key = key;
    this.description = description;
    Object.freeze(this);
  }
}

module.exports = { OrderStatus };
