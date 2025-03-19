import React , { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useQuery, gql , useMutation  } from '@apollo/client';
import UserComponent from './UserComponent';
import StudentList from './StudentList';
import StudentDetail from './StudentDetail';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './App.css'; // Import the CSS file

const IS_LOGGED_IN = gql`
  query {
    isLoggedIn {
      isLoggedIn
      studentNumber
    }
  }
`;
const LOGOUT_MUTATION = gql`
  mutation {
    logOut {
      message
    }
  }
`;

const App = () => {
  const { data, loading, error,refetch  } = useQuery(IS_LOGGED_IN);
  const [logout] = useMutation(LOGOUT_MUTATION);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentNumber, setStudentNumber] = useState(null);

  useEffect(() => {
    if (data) {
      setIsLoggedIn(data.isLoggedIn.isLoggedIn);
      setStudentNumber(data.isLoggedIn.studentNumber);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      setIsLoggedIn(data.isLoggedIn.isLoggedIn);
      setStudentNumber(data.isLoggedIn.studentNumber);
    }
  }, [data]);

  const handleLogout = async () => {
    try {
      await logout();  // Trigger the logout mutation
      setIsLoggedIn(false);  // Update local state to reflect the logout
      alert("Logged out successfully!");  // Show window alert on successful logout
      refetch();
    } catch (err) {
      console.error("Error during logout", err);
    }
  };

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
              {!isLoggedIn ? (
                  <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                      <Link className="nav-link text-white" to="/register">Register</Link>
                    </li>
                </>
                ) : (
                  <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/">Student List</Link>
                </li>
                <li className="nav-item">
                      <button className="nav-link text-white btn btn-link" onClick={handleLogout}>Logout</button>
                </li>
                </>
                )}

              </ul>
            </div>
          </div>
        </nav>

        <div className="my-4 flex-grow-1">
          <Routes>
            <Route path="/login" element={<UserComponent />} />
            <Route path="/" element={<StudentList />} />
            <Route path="/students/:studentNumber" element={<StudentDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;