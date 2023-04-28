const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async (dbUrl, dbName) => {
  const _mongoose = await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName
  });

  logger.info('Database connected');

  return _mongoose.connection;
};

module.exports = {
  connectDB
};
