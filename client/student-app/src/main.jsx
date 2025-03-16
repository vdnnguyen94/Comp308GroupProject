// Example modification in main.jsx or App.jsx of user-app for standalone testing
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// Set up Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Set this to your actual GraphQL endpoint
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
);
