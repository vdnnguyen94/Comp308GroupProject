const { gql } = require('graphql-tag');

const studentTypeDefs = gql`
  type Query {
    _dummy: String
    listStudents: [Student]
    getStudent(studentNumber: String!): Student
    isLoggedIn: AuthStatus
    getStudentByToken(studentNumber: String!): Student
  }

  type Mutation {
    login(studentNumber: String!, password: String!): LoginResponse
    logOut: LoginResponse
    createStudent(
      studentNumber: String!
      firstName: String
      lastName: String
      email: String!
      password: String!
      address: String
      city: String
      phoneNumber: String
      program: String
      hobbies: String
      techSkills: String
      isAdmin: Boolean
    ): Student

    deleteStudent(studentNumber: String!): Student
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
