const { gql } = require('apollo-server-express');

const vitalSignsTypeDefs = gql`
  type Query {
    listVitalSigns: [VitalSign]
    getVitalSign(userId: String!): VitalSign
  }

  type Mutation {
    createVitalSign(userId: String!, heartRate: Int!, bloodPressure: String!, temperature: Float!): VitalSign
    updateVitalSign(userId: String!, heartRate: Int!, bloodPressure: String!, temperature: Float!): VitalSign
    deleteVitalSign(userId: String!): String
  }

  type VitalSign @key(fields: "userId") {
    userId: String
    heartRate: Int
    bloodPressure: String
    temperature: Float
    timestamp: String
  }
`;

module.exports = vitalSignsTypeDefs;
