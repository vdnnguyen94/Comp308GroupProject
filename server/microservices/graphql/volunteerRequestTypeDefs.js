const { gql } = require('graphql-tag');

const volunteerRequestTypeDefs= gql`
type Volunteer {
    id: ID!
    user: User!
    city: String!
    interests: [String]
    availability: [AvailabilitySlot]
    createdAt: String
  }
  
  type AvailabilitySlot {
    day: String
    from: String
    to: String
  }
  
  type HelpRequest {
    id: ID!
    user: User!
    city: String!
    category: String
    description: String
    analysis: String
    bestMatches: [User]
    status: String
    createdAt: String
  }
  
  extend type Query {
    # VOLUNTEER
    getVolunteers(city: String): [Volunteer]
    getVolunteer(id: ID!): Volunteer
    getVolunteerByToken: [Volunteer]
  
    # HELP REQUEST
    getHelpRequests(city: String): [HelpRequest]
    getHelpRequest(id: ID!): HelpRequest
  }
  
  extend type Mutation {
    # VOLUNTEER
    createVolunteer(city: String!, interests: [String], availability: [AvailabilityInput]): Volunteer
  
    # HELP REQUEST
    createHelpRequest(city: String!, category: String, description: String): HelpRequest
    updateHelpRequestAnalysis(id: ID!): HelpRequest
    closeHelpRequest(id: ID!): HelpRequest
    deleteVolunteer(id: ID!): Boolean

  }
  
  input AvailabilityInput {
    day: String!
    from: String!
    to: String!
  }
`;


  module.exports = volunteerRequestTypeDefs;