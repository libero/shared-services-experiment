# REST Api

## URL scheme

The REST Api uses the following scheme for urls

``` /files/<namespace>/<key> ```

The '<namespace>' component cannot include the the '/' character, while the '<key>' can include zero
or more directories e.g:
* ``` /files/libero/foo.txt ```
* ``` /files/libero/baz/bar/foo.txt ```

## Storing a file

To store a file with a namespace of ```libero``` and a key of ```directory/file.pdf```, the following request should be
used

```
PUT /files/libero/directory/file.pdf

Content-Type: application/pdf
If-Match: <etag_value>|*
Libero-file-tags: "filename=original-file.pdf,key1=value=1"
```

The Server should respond with:

```
Response:
Code: 201
Link: "<http://storage-url/path/to/file>;rel=public"
Last-Modified: 2019-08-19T14:40:04.123456
ETag: <etag>
```

When uploading for the first time, the ```If-Match``` header should be set to '*'. If the ```If-Match``` fails,
then a 412 (Precondition Failed) should be returned.

## Get a file


To retrieve a file in the namespace ```libero``` and with key of ```directory/file.pdf```:

```
GET /files/libero/directory/file.pdf
#Prefer: original

Response:
Code: 200
Content-Type: application/pdf
Content-Length: 12345
Libero-file-tags: "filename=original-file.pdf,key1=value=1"
Link: "<http://storage-url/path/to/file>;rel=public"
Last-Modified: 2019-08-19T14:40:04.123456
ETag: <etag>

FILE DATA
```

The returned Link header value is the public url if the underlying storage is public.


## Get file meta data

To retrieve the metadata of a file in the namespace ```libero``` and with key of ```directory/file.pdf```:

```
HEAD /files/namespace/directory/file.pdf

Response:
Code: 200
Content-Type: application/pdf
Content-Length: 12345
Libero-file-tags: "filename=original-file.pdf,key1=value=1"
Link: "<http://storage-url/path/to/file>;rel=public"
Link: "<http://storage-url/path/to/file?token=abcdef>;rel=signed"
Last-Modified: 2019-08-19T14:40:04.123456
ETag: <etag>
```

An additional signed Link header that is the signed version of the url if the underlying storage is not
public. If the underlying storage is public then the signed url will be the same as the public one.
