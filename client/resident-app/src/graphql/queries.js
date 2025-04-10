import { gql } from '@apollo/client';

export const GET_ACTIVE_ALERTS = gql`
  query GetActiveAlerts($city: String!) {
    getActiveAlerts(city: $city) {
      id
      title
      description
      city
      state
      createdAt
      owner {
        id
        name
      }
    }
  }
`;

export const CREATE_ALERT = gql`
  mutation CreateAlert($title: String!, $description: String!, $city: String!) {
    createAlert(title: $title, description: $description, city: $city) {
      id
      title
      description
      city
      state
    }
  }
`;

export const DISMISS_ALERT = gql`
  mutation DismissAlert($alertId: ID!) {
    dismissAlert(alertId: $alertId) {
      id
      state
    }
  }
`;

export const EXPIRE_ALERT = gql`
  mutation ExpireAlert($alertId: ID!) {
    expireAlert(alertId: $alertId) {
      id
      state
    }
  }
`;