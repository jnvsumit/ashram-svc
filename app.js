const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const morgan = require('morgan');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./src/config');
const { connectDB } = require('./src/persistence/index');
const routes = require('./src/routes');
const logger = require('./src/utils/logger');
const app = express();

// Set up middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

// Serve the swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Set up routes
app.use('/api', routes);
// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema,
//     rootValue: resolvers,
//     graphiql: true,
//   })
// );

// Set up error handling middleware
app.use((err, _, res, ___) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal server error",
    messageCode: "InternalServerError",
    status: 500,
    success: false
  });
});

// Start the server
app.listen(config.port, async () => {
    await connectDB(config.mongo.uri, config.mongo.dbName);
    logger.info(`Server started on port ${config.port}`)
});
