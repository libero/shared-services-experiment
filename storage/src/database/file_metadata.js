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
    // if data has an id, then it's an insert, if data doesn't have an ID then it's an update
    const existing_id = Option.of(data.id);

    return await existing_id.map(async (id) => {
      // Use an existing one
      return await knex('metadata').where({id}).update(data);

    }).getOrElseL(async () => {
      // Create a new thing
      // Prepare the data?
      return await knex('metadata').insert(data);

    })
  }
};

module.exports = fileMetadataKnexRepository;
