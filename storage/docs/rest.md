# REST Api

## URL scheme

The REST Api uses the following scheme for urls

``` /files/<namespace>/<key> ```

The `<namespace>` component cannot include the the `/` character, while the `<key>` can include zero
or more directories e.g:
* ``` /files/libero/foo.txt ```
* ``` /files/libero/baz/bar/foo.txt ```

The key is unique within the namespace and provides a mapping between the storage entity and the provider entity (e.g. S3).

## Storing a file

To store a file with a namespace of ```libero``` and a key of ```directory/file.pdf```, the following request should be
used

```http
PUT /files/libero/directory/file.pdf

Content-Type: application/pdf
Content-Length: 12345
If-Match: <etag_value>|*
Libero-file-tags: "filename=original-file.pdf,key1=value=1"
```

The Server should respond with:

```http
Code: 201
Link: "<http://storage-url/path/to/file>;rel=https://libero.pub/public"
Last-Modified: 2019-08-19T14:40:04.123456
ETag: <etag>
```

When uploading for the first time, the ```If-Match``` header should be set to `*`. If the ```If-Match``` fails,
then a 412 (Precondition Failed) should be returned.

If a there is no ```If-Match``` sent, then the storage service should send back a 428 (Precondition Required).

## Retrieving a file

To retrieve a file in the namespace ```libero``` and with key of ```directory/file.pdf```:

```http
GET /files/libero/directory/file.pdf
```

Response:
```http
Code: 200
Content-Type: application/pdf
Content-Length: 12345
Libero-file-tags: "filename=original-file.pdf,key1=value=1"
Link: "<http://storage-url/path/to/file>;rel=https://libero.pub/public"
Last-Modified: 2019-08-19T14:40:04.123456
ETag: <etag>

FILE DATA
```

The returned Link header value is the public url if the underlying storage is public.

## Retrieving a file's meta data

### Public storage

To retrieve the metadata of a file in the namespace ```libero``` and with key of ```directory/file.pdf```:

```http
HEAD /files/libero/directory/file.pdf
```

The response should be:

```http
Code: 200
Content-Type: application/pdf
Content-Length: 12345
Libero-file-tags: "filename=original-file.pdf,key1=value=1"
Link: "<http://storage-url/path/to/file>;rel=https://libero.pub/public"
Last-Modified: 2019-08-19T14:40:04.123456
ETag: <etag>
Vary: Prefer
```

The Link value is a direct url to the stored file.

### Private storage

If the underlying storage is private, then the following request should be used

```http
HEAD /files/libero/directory/file.pdf
Prefer: link=signed
```

The following response should be returned
```http
Code: 200
Content-Type: application/pdf
Content-Length: 12345
Libero-file-tags: "filename=original-file.pdf,key1=value=1"
Link: "<http://storage-url/path/to/file?token=abcdef>;rel=https://libero.pub/signed"
Last-Modified: 2019-08-19T14:40:04.123456
ETag: <etag>
Vary: Prefer
Preference-Applied: link=signed
```

The Link value should be a signed url that can subsquently be used to access the file directly from
the private storage entity.

Note that if the `Prefer` header, then it will return a public link if the underlying storage entity
is public and the `Preference-Applied` would not be returned.
