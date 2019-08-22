# GraphQL Api

## Data types


```
type Tag {
  key: String!
  value: String!
}

input FileMetaInput {
  key: String! # link from the service
  namespace: String!
  tags: [Tag]
}

type FileMeta {
  key: String!
  updated: String!
  size: Int!
  sharedLink: String // signed url, generated when requested
  publicLink: String // accessbile to anyone if underlying storage publicly accessible
  tags: [Tag]
  mimeType: String!
  namespace: String!
}
```

## Uploading a file

```
type Mutation {
  uploadFile(file: Upload, meta: FileMetaInput): FileMeta!
}
```

To store a file with a namespace of ```libero``` and a key of ```directory/file.pdf```, the FileMetaInput structure
should contain:

```json
{
    "key": "directory/file.pdf",
    "namespace": "libero"
}
```

With tags, it becomes:

```json
{
    "key": "directory/file.pdf",
    "namespace": "libero",
    "tags": [
        {
            "key": "original-filename",
            "value": "original-file.pdf"
        }
    ]
}
```


## Retrieving a file

To retrieve a file, the following query is available:

```
type Query {
  getFileMeta(path: String): FileMeta!
}
```

To retrieve a file in the namespace ```libero``` and with key of ```directory/file.pdf```, the path input shoulde be:
``` libero/directory/file.pdf ```

The returned FileMeta should be:
```json
{
    "key": "directory/file.pdf",
    "updated": "2019-08-19T14:40:04.123456",
    "size": 12345,
    "publicLink": "http://storage-url/path/to/file>",
    "signedLink": "http://storage-url/path/to/file?token=abcdef>",
    "namespace": "libero",
    "mimeType": "application/pdf",
    "tags": [
        {
            "key": "original-filename",
            "value": "original-file.pdf"
        }
    ]
}
```

The file can then be downloaded either through the ```signedLink``` or ```publicLink``` via an HTTP request.


