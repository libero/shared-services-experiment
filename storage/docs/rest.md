# REST Api

## Store a file

```
PUT /files/namespace/directory/file.ext
Content-Type: application/pdf
If-Match: <etag_value>|*
Libero-file-tags: "key=value,key2=value2,filename=bar.pdf"

Response:
Code: 201
Link: "<http://url/foo/bar.pdf>;rel=signed"
Last-Modified: 2019-08-19T14:40:04.123456
ETag: <etag>
```

## Get a file

```
GET /files/namespace/directory/file.ext
#Prefer: original

Response:
Code: 200
Content-Type: application/pdf
Content-Length: 12345
Libero-file-tags: "key=value,key2=value2,filename=bar.pdf"
Link: "<http://sharedlink>;rel=????"
Link: "<http://publiclink>;rel=????"
Last-Modified: 2019-08-19T14:40:04.123456
ETag: <etag>
FILE DATA
```

## Get file meta data

```
HEAD /files/namespace/directory/file.ext

Response:
Code: 200
Content-Type: application/pdf
Content-Length: 12345
Libero-file-tags: "key=value,key2=value2,filename=bar.pdf"
Link: "<http://sharedlink>;rel=????"
Link: "<http://publiclink>;rel=????"
Last-Modified: 2019-08-19T14:40:04.123456
ETag: <etag>
```

## Get file directly
> What is this?

```
GET http://url/foo/bar.pdf

Response:
Code: 200
Content-Type: application/pdf
Content-Length: 12345
Libero-file-tags: "key=value,key2=value2,filename=bar.pdf"
Link: "<http://sharedlink>;rel=????"
Link: "<http://publiclink>;rel=????"
Last-Modified: 2019-08-19T14:40:04.123456
ETag: <etag>

FILE DATA
```
