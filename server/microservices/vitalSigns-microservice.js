const { ApolloServer } = require('apollo-server-express');
const { buildSubgraphSchema } = require('@apollo/federation');
const { buildFederatedSchema } = require('@apollo/federation');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('../config.js');  // Use your existing MongoDB config
const vitalSignsTypeDefs = require('./graphql/vitalSignsTypeDefs.js'); // VitalSigns typedefs
const vitalSignsResolvers = require('./graphql/vitalSignsResolver.js'); // VitalSigns resolvers

const app = express();
const port = 3002;

app.use(cors());

mongoose.connect(config.mongoUri, { dbName: 'HealthSystem' })
  .then(() => {
    console.log("SUCCESS Connected to MongoDB:", config.mongoUri);
  })
  .catch(err => {
    console.error("ERROR MongoDB connection error:", err);
  });

mongoose.connection.on('error', () => {
  throw new Error(`Unable to connect to database: ${config.mongoUri}`);
});

// Create an Apollo Server for the VitalSigns service
const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs: vitalSignsTypeDefs, resolvers: vitalSignsResolvers }]),
});

server.start().then(() => {
  server.applyMiddleware({ app });
  console.log(`VitalSigns microservice ready at http://localhost:${port}${server.graphqlPath}`);
});

app.listen(port, () => {
  console.log(`VitalSigns microservice running at http://localhost:${port}`);
});
