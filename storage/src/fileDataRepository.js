const AWS = require('aws-sdk');

const CONFIG = {
  S3_BUCKET: 'storage-service-demo',
  S3_ACL: 'public'
}

const s3 = new AWS.S3({
  s3: {
    s3ForcePathStyle: true,
    params: {
      Bucket: CONFIG.S3_BUCKET,
    },
  },
  apiVersion: '2006-03-01',
  signatureVersion: 'v4',
});

const set = (fStream, fData) => {
  return s3
    .putObject({
      Body: fStream,
      Key: fData.internalLink,
      ContentType: fData.mimeType,
      ContentLength: fData.size,
      ACL: CONFIG.S3_ACL,
    })
    .promise()
}

const get = (key) => {
  return s3.getObject({ key })
}

module.exports = { get, set }