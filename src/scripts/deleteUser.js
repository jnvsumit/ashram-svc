const { connectDB } = require('../persistence');
const { User } = require('../persistence/models');
const logger = require('../utils/logger');

const deleteUser = async (email) => {
  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      logger.info(`User with email ${email} not found`);
      return;
    }

    // Delete user
    await User.deleteOne({ email });

    logger.info(`User with email ${email} deleted successfully`);
  } catch (err) {
    logger.error(`Error deleting user: ${err.message}`, err);
  }
};

// Example usage
const email = 'johndoe@example.com';

connectDB(config.mongo.uri, config.mongo.dbName)
  .then(() => deleteUser(email))
  .catch((err) => logger.error(`Error deleting user: ${err.message}`, err));
