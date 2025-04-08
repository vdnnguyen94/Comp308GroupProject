import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainLayout.css';

import { FaHome, FaNewspaper, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const MainLayout = () => {
  const { currentUser, handleLogout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100 w-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3 w-100">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand fw-bold d-flex align-items-center text-primary">
            <span className="me-2 fs-4">🏙️</span>
            <span className="fs-5">Community Connect</span>
          </Link>

          <div className="d-flex align-items-center gap-4">
            <Link to="/" className="text-decoration-none text-dark d-flex align-items-center">
              <FaHome className="me-2" /> <span>Home</span>
            </Link>
            <Link to="/discussions" className="text-decoration-none text-dark d-flex align-items-center">
              <FaNewspaper className="me-2" /> <span>Discussions</span>
            </Link>

            <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 shadow-sm">
              <FaUserCircle className="me-2 text-secondary" />
              <span className="me-3">{currentUser?.username || 'User'}</span>
              <button
                className="btn btn-sm btn-outline-danger rounded-pill d-flex align-items-center"
                onClick={() => {
                  handleLogout();
                  navigate('/login');
                }}
              >
                <FaSignOutAlt className="me-1" /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow-1 w-100 px-4 py-5">
        <div className="container-fluid">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-top text-center py-3 mt-auto text-muted w-100">
        Community Connect © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default MainLayout;
