const example_thing = {
  id: "something",
  updated: "yesterday",
  size: -0,
  tags: [],
  mimeType: "application/json",
  namespace: "reviewer"
};


const db_connection = require('../database');

const { getFileMeta } = require('../controller');

module.exports = {
  Query: {
    getFileMeta: async (_, { id }, ___) => {
      return await getFileMeta(db_connection, id);
    }
  },
  Mutation: {
    uploadFile: async (_, {file} , ___) => {
      const { stream, filename, mimetype, encoding } = await file;

      // TODO: Validate the file metadata and stuff

      // TODO: Pass the file into the thing

      console.log("uploadFile");
      return example_thing;
    }
  }
};
