import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ACTIVE_ALERTS } from '../graphql/queries';
import AlertItem from './AlertItem';
import CitySelector from './CitySelector';

const AlertList = () => {
  const [selectedCity, setSelectedCity] = useState('Toronto');
  const { loading, error, data, refetch } = useQuery(GET_ACTIVE_ALERTS, {
    variables: { city: selectedCity },
  });

  const handleCityChange = (city) => {
    setSelectedCity(city);
    refetch({ city });
  };

  if (loading) return <p>Loading alerts...</p>;
  if (error) return <p>Error loading alerts: {error.message}</p>;

  return (
    <div className="alert-list-container">
      <h2>Community Alerts</h2>
      <CitySelector selectedCity={selectedCity} onChange={handleCityChange} />
      
      {data && data.getActiveAlerts && data.getActiveAlerts.length > 0 ? (
        <div className="alerts-grid">
          {data.getActiveAlerts.map(alert => (
            <AlertItem key={alert.id} alert={alert} refetch={refetch} />
          ))}
        </div>
      ) : (
        <p>No active alerts for {selectedCity}</p>
      )}
    </div>
  );
};

export default AlertList;