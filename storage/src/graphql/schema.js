// Graphql schema

const { gql } = require('apollo-server-express');

const typeDefs = gql`

type Tag {
  key: String!
  value: String!
}

type FileMeta {
  key: String! # link from the service
  updated: String!
  size: Int!
  sharedLink: String # signed url, generated when requested
  publicLink: String # accessbile to anyone if underlying storage publicly accessible
  tags: [Tag]
  mimeType: String!
  namespace: String!
}

input FileMetaInput {
  key: String! # link from the service
  tags: [TagInput]
  namespace: String! # Will eventually come from the user session? context
}
input TagInput {
  key: String!
  value: String!
}

type Query {
  getFileMeta(namespace: String!, key: String!): FileMeta
}

type Mutation {
  uploadFile(file: Upload, meta: FileMetaInput): FileMeta!
}
`;

module.exports = typeDefs;
