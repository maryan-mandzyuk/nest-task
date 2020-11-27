import { get } from 'config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const appConfig = {
  PORT: get('appConfig.port'),
  JWT_SECRET: get('appConfig.jwtSecret'),
  LOGS_PER_PAGE: 10,
  PRODUCTS_PER_PAGE: 10,
  ACCESS_TOKEN_EXPIRE_MIN: 30,
};

export const dbConfig: PostgresConnectionOptions = {
  type: 'postgres',
  port: get('dbConfig.port'),
  host: get('dbConfig.host'),
  username: get('dbConfig.username'),
  password: get('dbConfig.password'),
  database: get('dbConfig.database'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*.{ts,js}'],
  synchronize: false,
  migrationsRun: false,
  cli: {
    migrationsDir: 'migrations',
  },
};

export const redisConfig = {
  port: get('redisConfig.port'),
  host: get('redisConfig.host'),
};
