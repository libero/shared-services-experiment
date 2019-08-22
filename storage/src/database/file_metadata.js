const { Option, None } = require("funfix");

const fileMetadataKnexRepository = {
  getMetadataByKey: async (knex, key) => {
    const result = Option.of(
      (await knex("metadata").where({
        key
      }))[0]
    );

    return result;
  },

  setMetadata: async (knex, data) => {
    // Check if there's anything on this key?
    const fileEntry = await fileMetadataKnexRepository.getMetadataByKey(knex, data.key);

    if (fileEntry) {
      // Use an existing one
      return await knex('metadata').where({id: fileEntry.id}).update(data);
    } 
    // Create a new thing
    return await knex('metadata').insert(data);
  }
};

module.exports = fileMetadataKnexRepository;
