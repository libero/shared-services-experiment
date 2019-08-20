# GraphQL Api

## /graphql endpoint

```
type Tag {
  key: String!
  value: String!
}

type FileMeta {
  id: ID!
  updated: String!
  size: Int!
  internalLink: String // link from the service
  sharedLink: String // signed url, generated when requested
  publicLink: String // accessbile to anyone if underlying storage publicly accessible
  tags: [Tag]
  mimeType: String!
  namespace: String!
}

type Query {
  getFileMeta(id: String): FileMeta!
}

type Mutation {
  uploadFile(file: Upload, meta: FileMeta): FileMeta!
}
```

## /files endpoint

```
GET <provider url>

Response:
Code: 200
Content-Type: application/pdf
Content-Length: 12345
Last-Modified: 2019-08-19T14:40:04.123456
ETag: <etag>

FILE DATA
```
