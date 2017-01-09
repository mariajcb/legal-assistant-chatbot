module.exports = {
  development: {
    client: `pg`,
    connection: `postgres://localhost/lawbot`
  },
  production: {
    client: `pg`,
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: `./migrations`
    },
    seeds: {
      directory: `./seeds`
    }
  }
};
