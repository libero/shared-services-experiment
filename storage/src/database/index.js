const knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: "postgres",
    database: "storage_service"
  }
});

const dbSetup = async () => {
  await knex.schema.createTable("meta", table => {
    table.string("id");
    table.string("udpated"); // datetime
    table.integer("size");
    table.string("internalLink");
    table.string("sharedLink");
    table.string("publicLink");
    table.jsonb("tags");
    table.string("mimeType");
    table.string("namespace");
  });
};

dbSetup()
  .then(() => console.log("dbsetup complete!"))
  .catch((e) => console.error(e));

module.exports = knex;
