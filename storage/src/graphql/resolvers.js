const example_thing = {
  id: "something",
  updated: "yesterday",
  size: -0,
  tags: [],
  mimeType: "application/json",
  namespace: "reviewer"
};

module.exports = {
  Query: {
    getFileMeta: (_, { id }, ___) => {
      console.log(id);
      return example_thing;
    }
  },
  Mutation: {
    uploadFile: (_, {}, ___) => {
      console.log("uploadFile");
      return example_thing;
    }
  }
};
