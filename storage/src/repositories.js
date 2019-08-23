const fileMetadataKnexRepository = require('./database/file_metadata');
const fileDataRepository = require('./s3Repository')

const fileMetaRepo = {
  get: (knex, namespace, key) => fileMetadataKnexRepository.getMetadataByKey(knex, namespace, key),
  set: (knex, data) => fileMetadataKnexRepository.setMetadata(knex, data),
}

const fileDataRepo = {
  getFile: (namespace, key) => fileDataRepository.getFile(namespace, key),
  getSharedLink: (namespace, key) => fileDataRepository.getSharedLink(namespace, key),
  putFile: (fileStream, data) => fileDataRepository.putFile(fileStream, data),
}

module.exports = {fileMetaRepo, fileDataRepo};
