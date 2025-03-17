const { gql } = require('apollo-server-express');

const studentTypeDefs = gql`
  type Query {
    _dummy: String
    listStudents: [Student]
    getStudent(studentNumber: String!): Student
    isLoggedIn: AuthStatus
  }

  type Mutation {
    login(studentNumber: String!, password: String!): LoginResponse
    logOut: LoginResponse
  }

  type Student @key(fields: "studentNumber") {
    id: ID
    studentNumber: String
    firstName: String
    lastName: String
    address: String
    city: String
    phoneNumber: String
    email: String
    program: String
    hobbies: String
    techSkills: String
    isAdmin: Boolean
    created: String
    updated: String
  }

  type LoginResponse {
    message: String
  }
  type AuthStatus {
    isLoggedIn: Boolean
    studentNumber: String
  }
`;

module.exports = studentTypeDefs;
