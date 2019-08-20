const knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: "postgres",
    database: "storage_service"
  }
});

const dbSetup = async () => {
  // This is no longer done here, it is now done by the `run_migrations.sh` script
  return {};
};

dbSetup()
  .then(() => console.log("dbsetup complete!"))
  .catch(e => console.error(e));

module.exports = knex;
