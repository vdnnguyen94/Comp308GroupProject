const { gql } = require('graphql-tag');

const discussionTypeDefs = gql`
  extend type Query {
    getDiscussions(city: String): [Discussion]
    getDiscussion(id: ID!): Discussion
  }

 extend type Mutation {
    createDiscussion(title: String!, content: String, city: String): Discussion
    addComment(discussionId: ID!, content: String!): Comment
    deleteDiscussion(id: ID!): DeleteResponse
    deleteComment(id: ID!): DeleteResponse
    updateDiscussion(id: ID!, content: String!): Discussion
    updateComment(id: ID!, content: String!): Comment
    updateDiscussionSummary(id: ID!): Discussion


  }

  type Discussion {
    id: ID
    title: String
    content: String
    summary: String
    city: String
    author: User
    createdAt: String
    comments: [Comment]
  }

  type Comment {
    id: ID
    content: String
    author: User
    discussion: Discussion
    createdAt: String
  }

  type DeleteResponse {
  success: Boolean!
  message: String
  }

`;

module.exports = discussionTypeDefs;
