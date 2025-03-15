// server/microservices/product-microservice.js
// Import ApolloServer and gql
const { ApolloServer, gql } = require('apollo-server-express');
const { buildFederatedSchema } = require('@apollo/federation');

const express = require('express');
const app = express();
// Define the port
const port = 3002;
const cors = require('cors');
// Enable CORS
app.use(cors());

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
// Create a new ApolloServer instance, 
// and pass in your schema and resolvers
const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});
// Apply the Apollo Server middleware to the Express server
app.listen(process.env.PORT || port, async () => {
  await server.start();
  server.applyMiddleware({ app });
  console.log(`Product microservice ready at http://localhost:${port}${server.graphqlPath}`)

});
