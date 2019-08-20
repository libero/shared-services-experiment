const fileMetadataKnexRepository = require('./database/file_metadata');

const fileMetaRepo = {
  get: (knex, id) => fileMetadataKnexRepository.getMetadata(knex, id),
  set: (knex, data) => fileMetadataKnexRepository.setMetadata(knex, data),
}

const fileDataRepo = {
  get: () => {},
  set: () => {},
}

module.exports = {fileMetaRepo, fileDataRepo};
