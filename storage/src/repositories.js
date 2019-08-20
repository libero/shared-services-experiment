const fileMetadataKnexRepository = require('./database/file_metadata');
const fileDataRepository = require('./s3Repository')

const fileMetaRepo = {
  get: (knex, id) => fileMetadataKnexRepository.getMetadata(knex, id),
  set: (knex, data) => fileMetadataKnexRepository.setMetadata(knex, data),
}

const fileDataRepo = {
  get: (id) => fileDataRepository.getFile(id),
  set: (fileStream, data) => fileDataRepository.getFile(fileStream, data),
}

module.exports = {fileMetaRepo, fileDataRepo};
