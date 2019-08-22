
const DATABASE_CONFIG = {
  DB_TYPE: 'pg',
  DB_HOST: process.env.PG_HOST || 'localhost',
  DB_USER: "postgres",
  DB_DATABASE: "storage_service"
}

// Worth noting, theres a chance this will change at runtime
const knex = require("knex")({
  client: DATABASE_CONFIG.DB_TYPE,
  connection: {
    host: DATABASE_CONFIG.DB_HOST,
    user: DATABASE_CONFIG.DB_USER,
    database: DATABASE_CONFIG.DB_DATABASE,
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
