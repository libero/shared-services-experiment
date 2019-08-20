const { Option, None } = require("funfix");

const fileMetadataKnexRepository = {
  getMetadata: async (knex, id) => {
    const result = Option.of(
      (await knex("metadata").where({
        id
      }))[0]
    );

    return result;
  },

  setMetadata: async (knex, data) => {
    return knex("metadata").insert(data);
  }
};

module.exports = fileMetadataKnexRepository;
