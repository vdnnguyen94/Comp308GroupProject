const { ApolloServer } = require('@apollo/server');  // Apollo Server 4
const { buildSubgraphSchema } = require('@apollo/federation');  // Federated schema (buildSubgraphSchema)
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const app = express();
const port = 3004;
const cors = require('cors');

// Import gql tag from graphql-tag
const { gql } = require('graphql-tag');

app.use(cors());
app.use(express.json());
// Define schema with a dummy Query type for testing
const typeDefs = gql`
  type Query {
    _dummy: String
  }
`;

const resolvers = {
  Query: {
    _dummy: () => 'This is a dummy query',
  },
};

// Create a new ApolloServer instance, and pass in your schema and resolvers
const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),  // Use federated schema
});

// Start Apollo Server and apply middleware
async function startServer() {
  await server.start();

  // Use expressMiddleware to integrate Apollo Server 4 with Express
  app.use('/graphql', expressMiddleware(server));  // Correct integration for Apollo Server 4 with Express

  // Start Express server and log the correct GraphQL path
  app.listen(port, () => {
    console.log(`Authentication microservice ready at http://localhost:${port}/graphql`);
  });
}

startServer();
