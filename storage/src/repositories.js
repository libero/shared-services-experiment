const fileMetadataKnexRepository = require('./database/file_metadata');
const fileDataRepository = require('./s3Repository')

const fileMetaRepo = {
  get: (knex, id) => fileMetadataKnexRepository.getMetadata(knex, id),
  set: (knex, data) => fileMetadataKnexRepository.setMetadata(knex, data),
}

const fileDataRepo = {
  getFile: (namespace, id) => fileDataRepository.getFile(namespace, id),
  getSharedLink: (namespace, id) => fileDataRepository.getSharedLink(namespace, id),
  putFile: (fileStream, data) => fileDataRepository.putFile(fileStream, data),
}

module.exports = {fileMetaRepo, fileDataRepo};
