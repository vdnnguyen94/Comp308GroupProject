import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider ,createHttpLink} from '@apollo/client';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Create an instance of ApolloClient
const graphqlLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', 
  credentials: 'include', 
})
const client = new ApolloClient({
  link: graphqlLink,
  cache: new InMemoryCache(),
});


// Set up Apollo Client
;

// Lazy load components for better performance
const HomePage = lazy(() => import('./HomePage'));
const StudentApp = lazy(() => import('studentApp/App'));
const VitalApp = lazy(() => import('vitalSignApp/App'));

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="app-wrapper">
          {/* Navigation Bar */}
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow w-100">
            <div className="container-fluid">
              <Link className="navbar-brand fw-bold text-white" to="/">
                <i className="bi bi-heart-pulse me-2"></i>
                VitalSigns Hub
              </Link>
              <button 
                className="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav" 
                aria-controls="navbarNav" 
                aria-expanded="false" 
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/">
                      <i className="bi bi-house-door me-1"></i> Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/studentapp">
                      <i className="bi bi-shield-lock me-1"></i> Authentication
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/vitalapp">
                      <i className="bi bi-activity me-1"></i> VitalSigns
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <div className="content-wrapper w-100">
            <div className="content-container">
              <Suspense fallback={
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" role="status" className="mb-3" />
                  <p className="text-muted">Loading content...</p>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/studentapp" element={<StudentApp />} />
                  <Route path="/vitalapp" element={<VitalApp />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Suspense>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="footer w-100">
            <div className="container-fluid">
              <div className="text-center py-3">
                <span className="text-muted">© {new Date().getFullYear()} VitalSigns Hub. All rights reserved.</span>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;