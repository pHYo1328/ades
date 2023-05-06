const { createClient } = require('@redis/client');
const config=require("./config")
const client = createClient({
    password: config.redis_password,
    socket: {
      host: config.redis_host,
      port: config.redis_port
    }
  });
module.exports=client;