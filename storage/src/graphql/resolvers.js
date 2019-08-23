const db_connection = require('../database');

const { getFileMeta, uploadFile, getSharedLink } = require('../controller');

module.exports = {
  Query: {
    getFileMeta: (_, { key, namespace }, ___) => {
      return getFileMeta(db_connection, namespace, key);
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
