import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from 'graphql-tag';

const GET_ACTIVE_ALERTS = gql`
  query GetActiveAlerts($city: String!) {
    getActiveAlerts(city: $city) {
      id
      title
      description
      city
      owner {
        id
        name
      }
      createdAt
    }
  }
`;

const DISMISS_ALERT = gql`
  mutation DismissAlert($alertId: ID!) {
    dismissAlert(alertId: $alertId) {
      id
    }
  }
`;

function AlertsPage() {
  const [city, setCity] = useState('Toronto');
  const { loading, error, data, refetch } = useQuery(GET_ACTIVE_ALERTS, {
    variables: { city }
  });

  const [dismissAlert] = useMutation(DISMISS_ALERT);

  const handleDismiss = async (alertId) => {
    try {
      await dismissAlert({ variables: { alertId } });
      refetch();
    } catch (error) {
      console.error("Error dismissing alert:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Community Alerts</h1>
      
      <div>
        <label>City: </label>
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="Toronto">Toronto</option>
          <option value="Vancouver">Vancouver</option>
          <option value="Montreal">Montreal</option>
        </select>
      </div>

      <div>
        <a href="/create-alert">Create New Alert</a>
      </div>

      <div>
        {data.getActiveAlerts && data.getActiveAlerts.length > 0 ? (
          data.getActiveAlerts.map(alert => (
            <div key={alert.id} style={{border: '1px solid #ccc', margin: '10px', padding: '10px'}}>
              <h3>{alert.title}</h3>
              <p>{alert.description}</p>
              <p>City: {alert.city}</p>
              <p>Posted by: {alert.owner.name}</p>
              <button onClick={() => handleDismiss(alert.id)}>Dismiss</button>
            </div>
          ))
        ) : (
          <p>No active alerts found for {city}.</p>
        )}
      </div>
    </div>
  );
}

export default AlertsPage;