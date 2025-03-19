// server/gateway.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ApolloGateway } = require('@apollo/gateway');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { RemoteGraphQLDataSource } = require('@apollo/gateway');
const jwt = require('jsonwebtoken');
const config = require('./config')

// Initialize an Express application
console.log("Waiting for 10 seconds before starting the server...");
setTimeout(() => {

  const app = express();
  app.use(cookieParser());
  const allowedOrigins = [
    'http://localhost:3010', 
    'http://localhost:3015', 
    'http://localhost:4000', 
    'https://studio.apollographql.com',
  ];
  app.use((req, res, next) => {
    // Set the necessary CORS headers
    const origin = req.headers.origin;  
    if (allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);  // Set the allowed origin dynamically
    }
    res.header("Access-Control-Allow-Origin", allowedOrigins);  
    res.header("Access-Control-Allow-Credentials", "true"); 
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");  
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With"); 

    // Pass to the next middleware (Apollo Server will handle the request after this)
    next();
  });
  app.use(cors());
  // Method 1: CookieProcessorDataSource
  // Uncomment the below block to use the first method
  /*
  const { CookieProcessorDataSource } = require('./path/to/CookieProcessorDataSource');

  const gateway = new ApolloGateway({
    serviceList: [
      { name: 'student', url: 'http://localhost:3001/graphql' },
      { name: 'vitalSigns', url: 'http://localhost:3002/graphql' },
      { name: 'products', url: 'http://localhost:3003/graphql' },
      { name: 'auth', url: 'http://localhost:3004/graphql' }
    ],
    buildService({ name, url }) {
      return new CookieProcessorDataSource({ url });
    }
  });
  */

  // Method 2: gateway2 (RemoteGraphQLDataSource)
  // Uncomment the below block to use the second method
  const gateway = new ApolloGateway({
    serviceList: [
      { name: 'student', url: 'http://localhost:3001/graphql' },
      { name: 'vitalSigns', url: 'http://localhost:3002/graphql' },
      { name: 'products', url: 'http://localhost:3003/graphql' },
      { name: 'auth', url: 'http://localhost:3004/graphql' }
    ],
    buildService({ name, url }) {
      return new RemoteGraphQLDataSource({
        url,
        willSendRequest({ request, context }) {
          // Forward incoming cookies (if needed)
          if (context.req && context.req.headers.cookie) {
            request.http.headers.set('Cookie', context.req.headers.cookie);
          }
        },
        didReceiveResponse({ response, context }) {
          // Explicitly forward 'Set-Cookie' header from the Auth microservice
          const setCookieHeader = response.http.headers.get('set-cookie');
          if (setCookieHeader && context.res) {
            context.res.setHeader('Set-Cookie', setCookieHeader);
          }
          return response;
        },
      });
    },
  });

  // Setup context for Apollo Server
  const context = ({ req, res }) => {
    console.log("Cookies in GATEWAY:", req.cookies);
    const token = req.cookies.SchoolSystem;  // Get token from cookies
    let user = null;

    if (token) {
      try {
        user = jwt.verify(token, config.jwtSecret);  // Verify JWT token
      } catch (err) {
        console.log("Invalid token:", err);
        user = null;  // Token is invalid
      }
    }

    return { req, res, user };  // Pass user (null or authenticated) to context
  };


const corsOptions = {
  origin: ['http://localhost:3010','http://localhost:3015', 'http://localhost:4000', 'https://studio.apollographql.com'], // Apollo Sandbox URL
  credentials: true,  // Allow credentials (cookies) to be sent with the request
};

app.use(cors(corsOptions));


  // Initialize Apollo Server with the Apollo Gateway
  const server = new ApolloServer({
    gateway,
    subscriptions: false,
    context,

  });
  // Apply Apollo GraphQL middleware to the Express app
  server.start().then(() => {
    server.applyMiddleware({ app, path: '/graphql' });

    // Start the Express server
    app.listen({ port: 4000 }, () =>
      console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
  });
}, 10000);
// const gateway2= new ApolloGateway({
//   serviceList: [
//     { name: 'auth', url: 'http://localhost:3001/graphql' },
//     { name: 'otherService', url: 'http://localhost:3002/graphql' },
//   ],
  
//   buildService({ name, url }) {
//     return new RemoteGraphQLDataSource({
//       url,
      
//       willSendRequest({ request, context }) {
//         // Forward incoming cookies (if needed)
//         if (context.req && context.req.headers.cookie) {
//           request.http.headers.set('Cookie', context.req.headers.cookie);
//         }
//       },
      
//       didReceiveResponse({ response, context }) {
//         // Explicitly forward 'Set-Cookie' header from Auth microservice
//         const setCookieHeader = response.http.headers.get('set-cookie');
//         if (setCookieHeader && context.res) {
//           context.res.setHeader('Set-Cookie', setCookieHeader);
//         }
//         return response;
//       },
//     });
//   },
// });