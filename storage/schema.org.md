# REST API using Schema.org

Request the root:

```
GET /files HTTP/2
accept: application/ld+json
```

```
HTTP/2 200
content-type: application/ld+json

{
    "@context": "http://schema.org",
    "@type": "WebAPI",
    "potentialAction": [
        {
            "@type": "CreateAction",
            "target": {
                "@type": "EntryPoint",
                "httpMethod": "POST",
                "urlTemplate": "/files/actions",
                "encodingType": "multipart/related; type=application/ld+json",
                "contentType": "application/ld+json"
            },
            "agent-input": "required"
            "result": {
                "@type": "MediaObject",
                "name-input": "required",
                "isPartOf-input": "required",
            }
        }
    ]
}
```

Not sure of the best way of combining data and a file; other option is multi-step (ie create the action, then attach the file).

---

Perform a [`CreateAction`](https://schema.org/CreateAction):

```
POST /files/actions HTTP/2
accept: application/ld+json
content-type: multipart/related; boundary=foo_bar_baz; type=application/ld+json

--foo_bar_baz
content-type: application/ld+json

{
    "@context": "http://schema.org",
    "@type": "CreateAction",
    "agent": "http://example.com/users/67890",
    "result": {
        "@type": "MediaObject",
        "name": "image.jpg",
        "alternateName": "My file",
        "isPartOf": "http://example.com/articles/12345"
    }
}

--foo_bar_baz
content-type: image/jpeg

[DATA]
--foo_bar_baz
```

`alternateName` wasn't exposed as an input type, but we can still include it (hello custom properties).

Assuming the action isn't immediately completed, the response is:

```
HTTP/2 202
content-type: application/ld+json

{
    "@context": "http://schema.org",
    "@type": "CreateAction",
    "@id": "http://example.com/files/action/1234567890",
    "actionStatus": "ActiveActionStatus",
    "startTime": "2019-08-21T14:34:47Z",
    "agent": "http://example.com/users/67890",
    "result": {
        "@type": "MediaObject",
        "name": "image.jpg",
        "alternateName": "My file",
        "isPartOf": "http://example.com/articles/12345"
    },
    "potentialAction": {
        "@type": "CancelAction",
        "target": {
            "@type": "EntryPoint",
            "httpMethod": "POST",
            "urlTemplate": "/files/actions",
            "encodingType": "application/json+ld",
            "contentType": "application/json+ld"
        },
        "agent-input": "required"
        "object": "http://example.com/files/action/1234567890"
    }
}
```

(A separate [`CancelAction`](https://schema.org/CancelAction) can be used to stop it from completing. Might not be technical possible of course, but might make sense for scheduled actions.)

---

Request the `CreateAction` again to see if it's completed:

```
GET /files/action/1234567890 HTTP/2
accept: application/ld+json
```

```
HTTP/2 200
content-type: application/ld+json

{
    "@context": "http://schema.org",
    "@type": "CreateAction",
    "@id": "http://example.com/files/action/1234567890",
    "actionStatus": "CompletedActionStatus",
    "startTime": "2019-08-21T14:34:47Z",
    "endTime": "2019-08-21T14:34:49Z",
    "agent": "http://example.com/users/67890",
    "result": "http://example.com/files/12345"
}
```

It has, there's a new resource at http://example.com/files/12345.

---

Request the new resource:

```
GET /files/12345 HTTP/2
accept: application/ld+json
```

```
HTTP/2 200
content-type: application/ld+json

{
    "@context": "http://schema.org",
    "@type": "ImageObject",
    "@id": "http://example.com/files/12345",
    "name": "image.jpg",
    "alternateName": "My file",
    "isPartOf": "http://example.com/articles/12345",
    "contentSize": 12345,
    "contentUrl": "http://example.com/public/files/12345.jpg",
    "encodingFormat": "image/jpeg",
    "width": 1000,
    "height": 500,
    "dateCreated": "2019-08-21T14:34:49Z",
    "potentialAction": {
        "@type": "DeleteAction",
        "target": {
            "@type": "EntryPoint",
            "httpMethod": "POST",
            "urlTemplate": "/files/actions",
            "encodingType": "application/json+ld",
            "contentType": "application/json+ld"
        },
        "agent-input": "required"
        "object": "http://example.com/files/12345"
    }
}
```

This has made the type more specific (`ImageObject`) and created new properties (eg `width` and `height`).

---

Follow the potential action:

```
POST /files/actions HTTP/2
accept: application/ld+json
content-type: application/ld+json

{
    "@context": "http://schema.org",
    "@type": "DeleteAction",
    "agent": "http://example.com/users/67890",
    "object": "http://example.com/files/12345"
}
```

```
HTTP/2 201
content-type: application/ld+json

{
    "@context": "http://schema.org",
    "@type": "DeleteAction",
    "@id": "http://example.com/files/action/1234567891",
    "actionStatus": "CompletedActionStatus",
    "startTime": "2019-08-21T16:27:24Z",
    "endTime": "2019-08-21T16:27:24Z",
    "object": {
        "@type": "ImageObject"
    }
}
```

---

Request the resource:

```
GET /files/12345 HTTP/2
accept: application/ld+json
```

```
HTTP/2 410
content-type: application/problem+json

{
    "title": "The file is no longer available",
    "action": "http://example.com/files/action/1234567891"
}
```
