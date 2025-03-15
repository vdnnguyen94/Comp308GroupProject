// server/gateway.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ApolloGateway } = require('@apollo/gateway');

// Initialize an Express application
const app = express();

// Configure the Apollo Gateway
const gateway = new ApolloGateway({
  serviceList: [
    { name: 'products', url: 'http://localhost:3002/graphql' },
    { name: 'auth', url: 'http://localhost:3003/graphql' }
    // Additional services can be listed here
  ],
});

// Initialize Apollo Server with the Apollo Gateway
const server = new ApolloServer({ gateway, subscriptions: false });

// Apply Apollo GraphQL middleware to the Express app
server.start().then(() => {
  server.applyMiddleware({ app });

  // Start the Express server
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});
