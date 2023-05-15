const { createClient } = require('@redis/client');
const config = require('./config');

let client = null;

async function getConnection() {
  if (process.env.NODE_ENV === 'test') {
    const RedisMock = require('ioredis-mock');
    client = new RedisMock();
  } else {
    client = createClient({
      password: config.redis_password,
      socket: {
        host: config.redis_host,
        port: config.redis_port,
      },
    });
    await client.connect();
  }
  client.on('error', function (err) {
    console.log('Redis error: ' + err);
  });

  return client;
}

module.exports = getConnection;
