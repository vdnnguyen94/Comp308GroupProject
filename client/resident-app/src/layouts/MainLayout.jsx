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
    <div className="d-flex flex-column min-vh-100 w-100 main-container">
      {/* Navbar with refined styling */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm w-100 elegant-navbar">
        <div className="container-fluid px-4">
          <Link to="/" className="navbar-brand fw-bold d-flex align-items-center">
            <div className="logo-container me-2">
              <svg className="community-logo" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2Z" fill="#FFE0E7" />
                <path d="M8 11H12V24H8V11Z" fill="#FF85A2" />
                <path d="M14 7H18V24H14V7Z" fill="#82C4FF" />
                <path d="M20 14H24V24H20V14Z" fill="#A5DB8E" />
                <path d="M5.5 24H26.5" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="10" cy="8" r="1.5" fill="#FF85A2" />
                <circle cx="16" cy="4" r="1.5" fill="#82C4FF" />
                <circle cx="22" cy="11" r="1.5" fill="#A5DB8E" />
              </svg>
            </div>
            <span className="brand-name">Community Connect</span>
          </Link>

          <div className="d-flex align-items-center">
            <div className="nav-links me-4">
              <Link to="/" className="nav-item me-4">
                <FaHome className="nav-icon" /> <span>Home</span>
              </Link>
              <Link to="/discussions" className="nav-item">
                <FaNewspaper className="nav-icon" /> <span>Discussions</span>
              </Link>
            </div>

            <div className="user-profile d-flex align-items-center">
              <FaUserCircle className="user-icon" />
              <span className="username">{currentUser?.username || 'User'}</span>
              <button
                className="logout-btn"
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

      {/* Main Content - full width */}
      <main className="flex-grow-1 w-100">
        <div className="container-fluid px-4 py-4">
          <Outlet />
        </div>
      </main>

      {/* Footer with refined styling */}
      <footer className="elegant-footer w-100">
        <div className="container-fluid px-4">
          <div className="d-flex justify-content-center align-items-center">
            <svg className="footer-logo me-2" width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2Z" fill="#FFE0E7" />
              <path d="M8 11H12V24H8V11Z" fill="#FF85A2" />
              <path d="M14 7H18V24H14V7Z" fill="#82C4FF" />
              <path d="M20 14H24V24H20V14Z" fill="#A5DB8E" />
              <path d="M5.5 24H26.5" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="10" cy="8" r="1.5" fill="#FF85A2" />
              <circle cx="16" cy="4" r="1.5" fill="#82C4FF" />
              <circle cx="22" cy="11" r="1.5" fill="#A5DB8E" />
            </svg>
            <p className="mb-0">Community Connect © {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;