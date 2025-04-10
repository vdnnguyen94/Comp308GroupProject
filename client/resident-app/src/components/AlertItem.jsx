import React from 'react';
import { useMutation } from '@apollo/client';
import { DISMISS_ALERT, EXPIRE_ALERT } from '../graphql/queries';
import { formatDate } from '../utils/dateFormatter';

const AlertItem = ({ alert, refetch }) => {
  const [dismissAlert] = useMutation(DISMISS_ALERT);
  const [expireAlert] = useMutation(EXPIRE_ALERT);

  const handleDismiss = async () => {
    try {
      await dismissAlert({
        variables: { alertId: alert.id }
      });
      refetch();
    } catch (err) {
      console.error('Error dismissing alert:', err);
    }
  };

  const handleExpire = async () => {
    try {
      await expireAlert({
        variables: { alertId: alert.id }
      });
      refetch();
    } catch (err) {
      console.error('Error expiring alert:', err);
    }
  };

  const isOwner = alert.owner.id === localStorage.getItem('userId');

  return (
    <div className="alert-card">
      <h3>{alert.title}</h3>
      <p className="alert-description">{alert.description}</p>
      <div className="alert-meta">
        <span>City: {alert.city}</span>
        <span>Posted: {formatDate(alert.createdAt)}</span>
        <span>By: {alert.owner.name}</span>
      </div>
      <div className="alert-actions">
        <button onClick={handleDismiss} className="dismiss-btn">
          Dismiss
        </button>
        {isOwner && (
          <button onClick={handleExpire} className="expire-btn">
            Mark as Expired
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertItem;