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
  id: ID!
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

The query:
```
mutation UploadFile($file: Upload, $meta: FileMeta) {
   uploadFile(file: $file, meta: $meta) {
        key,
        updated,
        size,
        publicLink,
        tags,
        mimeType,
        namespace
    }
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

### Public storage

```
query GetFileMeta($key: String) {
    getFileMeta(key: $key) {
        updated,
        size,
        publicLink,
        tags,
        mimeType,
        namespace
    }
}
```

To retrieve a file in the namespace ```libero``` and with key of ```directory/file.pdf```, the path input shoulde be:
``` libero/directory/file.pdf ```

The returned FileMeta should be:
```json
{
    "id": "bd1c9a15-bc18-4151-a4eb-9f45cedb9700",
    "key": "directory/file.pdf",
    "updated": "2019-08-19T14:40:04.123456",
    "size": 12345,
    "publicLink": "http://storage-url/path/to/file",
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

By default, the ```signedLink``` member is not returned (see below).


### Retrieving a signed link

You need to specify signedLink in your graphql request

```
query GetFileMeta($key: String) {
    getFileMeta(key: $key) {
        signedLink
        // other fields if needed
    }
}
```

Response should be:

```
{
    "signedLink": "http://storage-url/path/to/file?token=abcdef",
}
```

If the underlying storage is public then an erro should be returned:
```
{
    "error": "Storage is public"
}
```

### Fetching the file

The file can then be downloaded either through the ```signedLink``` or ```publicLink``` via an HTTP request.
