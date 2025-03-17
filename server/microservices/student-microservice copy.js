const { ApolloServer, gql } = require('apollo-server-express');
const { buildSubgraphSchema } = require('@apollo/federation');
const { buildFederatedSchema } = require('@apollo/federation');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const mongoose = require('mongoose');
const config = require('../config.js');  // Corrected require
const studentTypeDefs = require('./graphql/studentTypeDefs.js'); 
const studentResolvers = require('./graphql/studentResolver.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

const port = 3001;

app.use(cors());

const corsOptions = {
  origin: 'http://localhost:5173',  // Apollo Sandbox domain
  credentials: true,  // Allow cookies to be sent with requests
};

app.use(cors(corsOptions));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  });
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
  schema: buildFederatedSchema([{ typeDefs: studentTypeDefs, resolvers: studentResolvers }]),
  context: ({ req, res }) => {
    let user = null;
    console.log("Cookie Test: ", req.cookies);
    const token = req.cookies.SchoolSystem;
    console.log("JWT Secrete: ", config.jwtSecret);
    console.log("DEBUG Token: ", token);
    if (token) {
      try {
        user = jwt.verify(token, config.jwtSecret);
        console.log("Verified Cookie: ", user);
      } catch (err) {
        console.log("Invalid token", err);
      }
    }
    return { user, req, res }; // Make user available in resolvers
  },
});
await server.start();
app.use(
  '/graphql',
  cors({
    origin: ['http://localhost:5173', 'http://www.localhost:5173'], // Allow both variations
    credentials: true,
  }),

  expressMiddleware(server, { 
    context: async ({ req, res }) => ({ req, res, user: req.user || null })
  })
);

app.listen(process.env.PORT || port, async () => {
    
    server.applyMiddleware({ app });
    console.log(`Student microservice ready at http://localhost:${port}${server.graphqlPath}`)
});
