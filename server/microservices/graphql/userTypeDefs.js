const { gql } = require('graphql-tag');

const userTypeDefs = gql`
  type Query {
    isLoggedIn: AuthStatus
    getUserByUsername(username: String!): User
    getUserByToken: User
    getUsers: [User] 
  }

  type Mutation {
    createUser(
      username: String!
      email: String!
      password: String!
      fullName: String
      city: String!
    ): User

    login(email: String!, password: String!): LoginResponse
    logout: LoginResponse
    updatePassword(currentPassword: String!, newPassword: String!): UpdatePasswordResponse
  }

  type User @key(fields: "username") {
    id: ID
    username: String
    email: String
    fullName: String
    city: String
    createdAt: String
  }

  type AuthStatus {
    isLoggedIn: Boolean
    username: String
  }

type LoginResponse {
  success: Boolean!
  message: String
}

  type UpdatePasswordResponse {
    message: String
  }
`;

module.exports = userTypeDefs;
