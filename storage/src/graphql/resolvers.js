const example_thing = {
  id: "something",
  updated: "yesterday",
  size: -0,
  tags: [],
  mimeType: "application/json",
  namespace: "reviewer"
};


const db_connection = require('../database');

const { getFileMeta, uploadFile } = require('../controller');

module.exports = {
  Query: {
    getFileMeta: (_, { id }, ___) => {
      return getFileMeta(db_connection, id);
    }
  },
  Mutation: {
    uploadFile: async (_, {file, meta} , ___) => {
      return uploadFile(file, meta);
    }
  }
};
