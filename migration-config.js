// migration-config.js
module.exports = {
    databaseUrl: process.env.DATABASE_URL || "postgres://nandahoyos:password@localhost:5432/nandahoyos",
    migrationsTable: 'pgmigrations',
    dir: 'migrations',
  };
  