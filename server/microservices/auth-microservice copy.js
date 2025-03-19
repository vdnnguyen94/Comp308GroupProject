// server/microservices/auth-microservice.js
// Import ApolloServer and gql
const { ApolloServer, gql } = require('apollo-server-express');
// Import buildFederatedSchema
const { buildFederatedSchema } = require('@apollo/federation');
//
const express = require('express');
const app = express();
const port = 3004;
const cors = require('cors');

app.use(cors());

// Updated schema with a dummy Query type
const typeDefs = gql`
  type Query {
    _dummy: String
  }

`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    // Dummy resolver for the dummy Query
    _dummy: () => 'This is a dummy query',
  },
};

// Create a new ApolloServer instance, and pass in your schema and resolvers
const server = new ApolloServer({
  // Use buildFederatedSchema to combine your schema and resolvers
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});
app.listen(process.env.PORT || port, async () => {
  await server.start();
  server.applyMiddleware({ app });
  //
  console.log(`Authentication microservice ready at http://localhost:${port}${server.graphqlPath}`)
});
