const { ApolloServer } = require('@apollo/server');  // Apollo Server 4
const { buildSubgraphSchema } = require('@apollo/federation');  // Federated schema
const express = require('express');
const app = express();
const port = 3003;
const cors = require('cors');

// Import expressMiddleware from @apollo/server/express4
const { expressMiddleware } = require('@apollo/server/express4');

// Import gql tag from graphql-tag
const { gql } = require('graphql-tag');

app.use(cors());

// Use express.json() middleware to parse incoming JSON requests before Apollo Server middleware
app.use(express.json());

// Define your schema
const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
  }

  type Query {
    products: [Product]
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    products: () => [
      { id: 1, name: 'Product 1' },
      { id: 2, name: 'Product 2' },
      { id: 3, name: 'Product 3' },
    ],
  },
};

// Create a new ApolloServer instance
const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),  // Use federated schema
});

// Start Apollo Server and apply middleware
async function startServer() {
  await server.start();
  
  // Use expressMiddleware to integrate Apollo Server with Express
  app.use('/graphql', expressMiddleware(server));  // Correct integration for Apollo Server 4 with Express

  // Start Express server and log the correct GraphQL path
  app.listen(port, () => {
    console.log(`Product microservice ready at http://localhost:${port}/graphql`);
  });
}

startServer();
