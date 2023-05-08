const {
  createClient
} = require('@redis/client');
const config = require("./config")
let client = createClient({
  password: config.redis_password,
  socket: {
    host: config.redis_host,
    port: config.redis_port
  }
});
if (process.env.NODE_ENV === 'test') {
  const RedisMock = require('ioredis-mock');
  client = new RedisMock();
}
module.exports = client;