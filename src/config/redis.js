const Redis = require('ioredis');

let redisClient;

function getRedisClient() {
  if (!redisClient) {
    redisClient = new Redis(`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
  }
  return redisClient;
}

module.exports = getRedisClient;