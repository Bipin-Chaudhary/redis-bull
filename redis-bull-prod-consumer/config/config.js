const Bull = require('bull')

const connectQueue = (name) => new Bull(name, {
  redis: { port: 6379, host: '127.0.0.1', db: 12 }
})

module.exports = { connectQueue }