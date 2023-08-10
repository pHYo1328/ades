const amqp = require('amqplib/callback_api');
const { cloudamqp_url } = require('./config');

let channel = null;

function connect(callback) {
  if (channel) return callback(null, channel);

  amqp.connect(cloudamqp_url, (error0, connection) => {
    if (error0) return callback(error0);

    connection.createChannel((error1, ch) => {
      if (error1) return callback(error1);

      channel = ch;
      callback(null, ch);
    });
  });
}

function getChannel() {
  if (!channel) throw new Error('channel is not initialized');
  return channel;
}
module.exports = {
  connect,
  getChannel,
};
