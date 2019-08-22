const AWS = require('aws-sdk');

// to be replaced by config service
const CONFIG = {
  someNameSpace:{
    AWS_CREDENTIALS: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      region: process.env.AWS_REGION || ''
    },
    S3_BUCKET: 'storage-service-demo',
    S3_ACL: 'public'
  }
}

const getS3Instance = (config = {}) => {
  return new AWS.S3({
    ...config,
    apiVersion: '2006-03-01',
    signatureVersion: 'v4',
  });
}

const putFile = (fStream, fData) => {
  const s3 = getS3Instance(CONFIG[fData.namespace].AWS_CREDENTIALS);
  return s3
    .putObject({
      Body: fStream,
      Bucket: CONFIG[fData.namespace].S3_BUCKET,
      Key: fData.key,
      ContentType: fData.mimeType,
      ContentLength: fData.size,
      ACL: CONFIG[fData.namespace].S3_ACL,
    })
    .promise()
}

const getFile = (namespace, key) => {
  const s3 = getS3Instance(CONFIG[namespace].AWS_CREDENTIALS);
  return s3.getObject({ Bucket: CONFIG[namespace].S3_BUCKET, Key: key })
}

const getSharedLink = (namespace, key) => {
  const s3 = getS3Instance(CONFIG[namespace].AWS_CREDENTIALS);
  return s3.getSignedUrl('getObject', {
    Bucket: CONFIG[namespace].S3_BUCKET,
    Key: key,
  })
}

module.exports = { getFile, putFile, getSharedLink }