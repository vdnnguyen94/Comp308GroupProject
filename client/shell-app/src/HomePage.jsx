import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './HomePage.css'; // Import the CSS file

const HomePage = () => {
  return (
    <div className="home-page-container text-center">
      <h1>Welcome to VitalSigns Hub</h1>
      <p>Please log in to access your account. If you want to check your vital signs directly, click the VitalSigns button below.</p>
      <div className="d-flex justify-content-center">
        <Link to="/studentapp" className="btn btn-primary mx-2">Authentication</Link>
        <Link to="/vitalapp" className="btn btn-secondary mx-2">VitalSigns</Link>
      </div>
    </div>
  );
};

export default HomePage;