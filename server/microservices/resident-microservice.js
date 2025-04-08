const { ApolloServer } = require('@apollo/server');
const { buildSubgraphSchema } = require('@apollo/federation');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../config.js');


// Import your GraphQL pieces

const userTypeDefs =require('./graphql/userTypeDefs.js');
const userResolvers = require('./graphql/userResolver');
const discussionTypeDefs = require('./graphql/discussionTypeDefs');
const discussionResolvers = require('./graphql/discussionResolver');
const volunteerRequestTypeDefs = require('./graphql/volunteerRequestTypeDefs');
const volunteerRequestResolver = require('./graphql/volunteerRequestResolver');
const app = express();
const port = 3001;

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const allowedOrigins = [
  'http://localhost:3010',
  'http://localhost:3001',
  'http://localhost:3015',
  'http://localhost:4000',
  'https://studio.apollographql.com',
  'https://sandbox.embed.apollographql.com',
];
app.use(function(req, res, next) {
  console.log("Debug: Incoming request URL:", req.originalUrl);
  // console.log("Debug: Incoming request headers:", req.headers); 
  // console.log("Debug: Incoming request Origin:", req.headers.origin);  
  // console.log("Debug: Incoming request Referer:", req.headers.referer);
  const origin = req.headers.origin;  
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);  
  }
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  });

// MongoDB Connection Setup
mongoose.connect(config.mongoUri, { dbName: 'Comp308GroupProject' })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware for checking user authentication via token
app.use((req, res, next) => {
  console.log("Debug: Cookies received:", req.cookies); 
  const token = req.cookies?.CommunityApp;
  console.log("Debug: Community Cookie:", token); 
  // res.on('finish', () => {
  //   console.log('Response headers:', res.getHeaders());
  // });
  if (token) {
    try {
      req.user = jwt.verify(token, config.jwtSecret);
      console.log("Debug: Token is valid, user:", req.user);
    } catch (e) {
      req.user = null;
    }
  }else {
    console.log("Debug: No token found in cookies");
  }
  next();
});
// const schema = new GraphQLSchema({
//   query: studentTypeDefs, // Query type
//   mutation: studentResolvers, // Mutation type
// });
const server = new ApolloServer({
  schema: buildSubgraphSchema([
    { typeDefs: userTypeDefs, resolvers: userResolvers },
    { typeDefs: discussionTypeDefs, resolvers: discussionResolvers },
    { typeDefs: volunteerRequestTypeDefs, resolvers: volunteerRequestResolver },
  ]),
  // schema,
  introspection: true, 
  context: ({ req, res }) => ({ req, res, user: req.user  }),
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },

});


async function startServer() {
  await server.start();
  app.use('/graphql', 
    cors({
      origin: allowedOrigins, 
      credentials: true,
    }),
    expressMiddleware(server, { 
      context: async ({ req, res }) => ({ req, res, user: req.user || null })
    })
  );
  app.listen(port, () => {
    console.log(`Resident microservice ready at http://localhost:${port}/graphql`);
  });
}

startServer();
