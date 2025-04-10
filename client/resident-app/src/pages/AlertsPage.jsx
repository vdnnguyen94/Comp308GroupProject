import React from 'react';
import { Link } from 'react-router-dom';
import AlertList from '../components/AlertList';

const AlertsPage = () => {
  return (
    <div className="alerts-page">
      <div className="alerts-header">
        <h1>Community Alerts</h1>
        <Link to="/create-alert" className="create-alert-btn">
          Create New Alert
        </Link>
      </div>
      <AlertList />
    </div>
  );
};

export default AlertsPage;