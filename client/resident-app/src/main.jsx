// Example modification in main.jsx or App.jsx of user-app for standalone testing
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';

// Set up Apollo Client
const graphqlLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', 
  credentials: 'include', 
});
const client = new ApolloClient({
  link: graphqlLink,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
    <ApolloProvider client={client}>

        <App />

    </ApolloProvider>
  </React.StrictMode>,
);
