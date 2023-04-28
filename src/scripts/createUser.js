const bcrypt = require('bcrypt');
const uuid = require('uuid').v4;
const config = require('../config');
const { connectDB } = require('../persistence');
const { User } = require('../persistence/models');
const logger = require('../utils/logger');

const createUser = async (userData) => {
  try {
    const { fullname, email, username, password } = userData;

    // Create a user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      userId: uuid(),
      fullname,
      email,
      username,
      password: hashedPassword,
    });
    await user.save();

    logger.info(`User created successfully, userId: ${user.userId}`);
  } catch (err) {
    logger.error(`Error creating user: ${err.message}`, err);
  }
};

const users = [
  {
    fullname: 'John Doe',
    email: 'johndoe@example.com',
    username: 'johndoe',
    password: 'password123',
  },
  {
    fullname: 'Jane Doe',
    email: 'janedoe@example.com',
    username: 'janedoe',
    password: 'password456',
  },
];

const createUsers = async () => {
    //Connecting database
    await connectDB(config.mongo.uri, config.mongo.dbName);
    for (const user of users) {
        await createUser(user);
    }
};

createUsers().then(() => {
  logger.info('All users created successfully');
}).catch((err) => {
  logger.error(`Error creating users: ${err.message}`, err);
});
