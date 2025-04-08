const { gql } = require('graphql-tag');

const alertTypeDefs= gql`
type Alert {
    id: ID!
    title: String!
    description: String!
    city: String!
    state: String!
    owner: User!
    dismissedBy: [User]
    createdAt: String
  }
  
  extend type Query {
    getActiveAlerts(city: String!): [Alert]
  }
  
  extend type Mutation {
    createAlert(title: String!, description: String!, city: String!): Alert
    dismissAlert(alertId: ID!): Alert
    expireAlert(alertId: ID!): Alert
  }

`;


module.exports = alertTypeDefs;