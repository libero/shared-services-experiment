// Graphql schema

const { gql } = require('apollo-server-express');

const typeDefs = gql`

type Tag {
  key: String!
  value: String!
}

type FileMeta {
  id: ID!
  updated: String!
  size: Int!
  internalLink: String # link from the service
  sharedLink: String # signed url, generated when requested
  publicLink: String # accessbile to anyone if underlying storage publicly accessible
  tags: [Tag]
  mimeType: String!
  namespace: String!
}

input FileMetaInput {
  id: ID!
  updated: String!
  size: Int!
  internalLink: String # link from the service
  sharedLink: String # signed url, generated when requested
  publicLink: String # accessbile to anyone if underlying storage publicly accessible
  tags: [TagInput]
  mimeType: String!
  namespace: String!
}
input TagInput {
  key: String!
  value: String!
}

type Query {
  getFileMeta(id: String): FileMeta!
}

type Mutation {
  uploadFile(file: Upload, meta: FileMetaInput): FileMeta!
}

`;

module.exports = typeDefs;
