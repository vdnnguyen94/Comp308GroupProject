import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

const Home = () => {
  const { currentUser, loading } = useAuth();
  console.log("🔐 AuthContext:", { currentUser, loading });
  return (
    <div className="container-fluid py-5 home-container">
      {/* Header Section */}
      <section className="text-center mb-5">
        <div className="cute-bubble mb-4">
          <span className="bubble-emoji">🏡</span>
        </div>
        <h1 className="display-5 fw-bold mb-3">
          Hello, {currentUser?.fullName || currentUser?.username}! 
          <span className="wave-hand ms-2">👋</span>
        </h1>
        <p className="subtitle mb-4">
          Community Connect in {currentUser?.city || 'your neighborhood'}
        </p>
      </section>
      {/* Main Banner with Graphics */}
      <section className="cute-banner rounded-5 shadow-sm mb-5 p-4 p-md-5 position-relative">
        <div className="row align-items-center">
          <div className="col-lg-7 text-center text-lg-start mb-4 mb-lg-0">
            <h2 className="fw-bold mb-3">Building Our Community Together</h2>
            <p className="mb-4">Chat with friends, exchange help with neighbors, and create a happier community!</p>
            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
              <Link to="/discussions" className="btn btn-light rounded-pill px-4 py-2 shadow-sm">
                <i className="bi bi-chat-heart me-2"></i>Browse Discussions
              </Link>
              <Link to="/discussions/create" className="btn btn-primary rounded-pill px-4 py-2 shadow-sm">
                <i className="bi bi-pencil-fill me-2"></i>Start a Discussion
              </Link>
            </div>
          </div>
          <div className="col-lg-5 text-center">
            <div className="cute-illustration">
              {/* Illustration is implemented in CSS */}
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="decoration-dot dot1"></div>
        <div className="decoration-dot dot2"></div>
        <div className="decoration-dot dot3"></div>
        <div className="decoration-circle circle1"></div>
        <div className="decoration-circle circle2"></div>
      </section>
      {/* Feature Cards with Icons */}
      <div className="row g-4 justify-content-center">
        <div className="col-md-4">
          <div className="card border-0 feature-card h-100">
            <div className="card-body text-center p-4">
              <div className="cute-icon chat-icon mb-3">
                <i className="bi bi-chat-square-heart-fill"></i>
              </div>
              <h3 className="fw-bold h5 mb-3">Local Discussions</h3>
              <p className="text-muted small mb-3">
                Share your daily life and start enjoyable conversations with your neighbors.
              </p>
              <Link to="/discussions" className="btn btn-sm btn-outline-primary rounded-pill px-3">
                Join Discussions
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 feature-card h-100">
            <div className="card-body text-center p-4">
              <div className="cute-icon help-icon mb-3">
                <i className="bi bi-gift-fill"></i>
              </div>
              <h3 className="fw-bold h5 mb-3">Neighbor Help</h3>
              <p className="text-muted small mb-3">
                Request assistance or offer help to those living nearby.
              </p>
              <Link to="/help" className="btn btn-sm btn-outline-success rounded-pill px-3">
                Help Center
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 feature-card h-100">
            <div className="card-body text-center p-4">
              <div className="cute-icon alert-icon mb-3">
                <i className="bi bi-bell-fill"></i>
              </div>
              <h3 className="fw-bold h5 mb-3">Alert Service</h3>
              <p className="text-muted small mb-3">
                Stay updated with important news and emergency situations in your area.
              </p>
              <Link to="/alerts" className="btn btn-sm btn-outline-danger rounded-pill px-3">
                View Alerts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;