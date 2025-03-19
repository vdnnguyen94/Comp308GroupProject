import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserComponent from './UserComponent';
import StudentList from './StudentList';
import StudentDetail from './StudentDetail';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './App.css'; // Import the CSS file

const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100 min-vw-100 content-container">
        <nav className="navbar navbar-expand-lg navbar-light bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand text-white" to="/">Authentication App</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/students">Student List</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="my-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<UserComponent />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/students/:studentNumber" element={<StudentDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;