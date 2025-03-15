const { ApolloServer, gql } = require('apollo-server-express');
const { buildSubgraphSchema } = require('@apollo/federation');
const express = require('express');
const mongoose = require('mongoose');
const config = require('../config.js');  // Corrected require
const studentTypeDefs = require('./graphql/studentTypeDefs.js'); 
const studentResolvers = require('./graphql/studentResolver.js');

const app = express();
const port = 3001;
const cors = require('cors');
app.use(cors());



mongoose.connect(config.mongoUri, { dbName: 'SchoolSystem' })
  .then(() => {
    console.log("SUCCESS Connected to MongoDB:", config.mongoUri);
    console.log("Using Database:", mongoose.connection.db.databaseName); 
  })
  .catch(err => {
    console.error("ERROR MongoDB connection error:", err);
  });

mongoose.connection.on('error', () => {
  throw new Error(`Unable to connect to database: ${config.mongoUri}`);
});



// Create a new ApolloServer instance, and pass in your schema and resolvers
const server = new ApolloServer({
    typeDefs: studentTypeDefs,  
    resolvers: studentResolvers,
  });

app.listen(process.env.PORT || port, async () => {
    await server.start();
    server.applyMiddleware({ app });
    console.log(`Student microservice ready at http://localhost:${port}${server.graphqlPath}`)
});
