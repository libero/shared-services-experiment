const AWS = require('aws-sdk');

const CONFIG = {
  someNameSpace:{
    S3_BUCKET: 'storage-service-demo',
    S3_ACL: 'public'
  }
}

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  signatureVersion: 'v4',
});

const putFile = (fStream, fData) => {
  return s3
    .putObject({
      Body: fStream,
      Bucket: CONFIG[fData.namespace].S3_BUCKET,
      Key: fData.internalLink,
      ContentType: fData.mimeType,
      ContentLength: fData.size,
      ACL: CONFIG[fData.namespace].S3_ACL,
    })
    .promise()
}

const getFile = (namespace, id) => {
  return s3.getObject({ Bucket: CONFIG[namespace].S3_BUCKET, Key: id })
}

const getSharedLink = (namespace, id) => {
  return s3.getSignedUrl('getObject', {
    Bucket: CONFIG[namespace].S3_BUCKET,
    Key: id,
  })
}

module.exports = { getFile, putFile, getSharedLink }