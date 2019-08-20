const knex = require('.');

const fileMetadataKnexRepository = {
  getMetadata: async (knex, id) => {
    return knex('metadata').where({
      id
    });

  },

  setMetadata: async (knex, data) => {
    return knex('metadata').insert(data);
  },
};
