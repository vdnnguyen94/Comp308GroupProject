import React from 'react';
import { Link } from 'react-router-dom';
import CreateAlert from '../components/CreateAlert';

const CreateAlertPage = () => {
  return (
    <div className="create-alert-page">
      <div className="page-header">
        <h1>Create New Community Alert</h1>
        <Link to="/alerts" className="back-link">
          Back to Alerts
        </Link>
      </div>
      <CreateAlert />
    </div>
  );
};

export default CreateAlertPage;