const { ApolloServer, gql } = require('apollo-server-express');
const { buildSubgraphSchema } = require('@apollo/federation');
const { buildFederatedSchema } = require('@apollo/federation');
const express = require('express');
const mongoose = require('mongoose');
const config = require('../config.js');  // Corrected require
const studentTypeDefs = require('./graphql/studentTypeDefs.js'); 
const studentResolvers = require('./graphql/studentResolver.js');
const { expressMiddleware } = require('@apollo/server/express4');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const port = 3001;
const cors = require('cors');

const app = express();
app.use(express.json());
// app.use((req, res, next) => {
//   // Set the necessary CORS headers
//   res.header("Access-Control-Allow-Origin", "https://studio.apollographql.com");  
//   res.header("Access-Control-Allow-Credentials", "true"); 
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");  
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With"); 

//   // Pass to the next middleware (Apollo Server will handle the request after this)
//   next();
// });
const allowedOrigins = [
  'http://localhost:3010', 
  'http://localhost:3015', 
  'http://localhost:4000', 
  'https://studio.apollographql.com',
];
app.use((req, res, next) => {
  const origin = req.headers.origin;  
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);  // Set the allowed origin dynamically
  }
  // Set the necessary CORS headers

  res.header("Access-Control-Allow-Credentials", "true"); 
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");  
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With"); 

  // Pass to the next middleware (Apollo Server will handle the request after this)
  next();
});

app.use(cookieParser());
app.use(cors());


const corsOptions = {
  origin: ['http://localhost:3010','http://localhost:3015', 'http://localhost:4000', 'https://studio.apollographql.com'], // Apollo Sandbox URL
  credentials: true,  // Allow credentials (cookies) to be sent with the request
};

app.use(cors(corsOptions));

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


const context = ({ req, res }) => {
  console.log("Cookies in Microservice:", req.cookies);
  const token = req.cookies.SchoolSystem;  // Get token from cookies
  let user = null;

  // If the token exists, verify it
  if (token) {
    try {
      user = jwt.verify(token, config.jwtSecret);  // Verify JWT token
    } catch (err) {
      console.log("Invalid token:", err);
      user = null; // Token is invalid
    }
  }

  return { req, res, user };  // Pass user (null or authenticated) to context
};

// Create a new ApolloServer instance, and pass in your schema and resolvers
const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs: studentTypeDefs, resolvers: studentResolvers }]),
  cors: { 
    origin: allowedOrigins,  
    credentials: true,  
  },
  context,
});
// const server = new ApolloServer({
//     typeDefs: studentTypeDefs,  
//     resolvers: studentResolvers,
//   });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, cors: corsOptions });

  app.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}/graphql`);
  });
}

startServer();