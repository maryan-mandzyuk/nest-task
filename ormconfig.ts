const config = require('config');

module.exports = {
  type: 'postgres',
  port: config.get('dbConfig.port'),
  host: config.get('dbConfig.host'),
  username: config.get('dbConfig.username'),
  password: config.get('dbConfig.password'),
  database: config.get('dbConfig.database'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*.{ts,js}'],
  synchronize: false,
  migrationsRun: false,
  cli: {
    migrationsDir: 'migrations',
  },
};
