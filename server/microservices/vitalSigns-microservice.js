const { ApolloServer } = require('@apollo/server');  // Apollo Server 4
const { buildSubgraphSchema } = require('@apollo/federation');  // Federated schema
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { expressMiddleware } = require('@apollo/server/express4');  // Apollo Server 4 Express integration
const config = require('../config.js');  // Use your existing MongoDB config
const vitalSignsTypeDefs = require('./graphql/vitalSignsTypeDefs.js');  // VitalSigns typedefs
const vitalSignsResolvers = require('./graphql/vitalSignsResolver.js');  // VitalSigns resolvers

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());
// MongoDB Connection Setup
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

// Create a new ApolloServer instance for VitalSigns service
const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs: vitalSignsTypeDefs, resolvers: vitalSignsResolvers }]), // Federated schema
});

// Start Apollo Server and apply middleware
async function startServer() {
  await server.start();
  
  // Use expressMiddleware to integrate Apollo Server 4 with Express
  app.use('/graphql', expressMiddleware(server));  // Correct integration for Apollo Server 4 with Express

  // Start the server and log the GraphQL path
  app.listen(port, () => {
    console.log(`VitalSigns microservice ready at http://localhost:${port}/graphql`);
  });
}

startServer();
