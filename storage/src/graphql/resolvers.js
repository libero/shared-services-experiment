const example_thing = {
  id: "something",
  updated: "yesterday",
  size: -0,
  tags: [],
  mimeType: "application/json",
  namespace: "reviewer"
};


const db_connection = require('../database');

const { getFileMeta, uploadFile, getSharedLink } = require('../controller');

module.exports = {
  Query: {
    getFileMeta: (_, { key }, ___) => {
      return getFileMeta(db_connection, key);
    }
  },
  Mutation: {
    uploadFile: async (_, {file, meta} , ___) => {
      return uploadFile(file, meta);
    }
  },
  FileMeta: {
    sharedLink: (fileMeta) => {
      return getSharedLink(fileMeta);
    }
  }
};
