import { get } from 'config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const appConfig = {
  PORT: get('appConfig.port'),
  JWT_SECRET: get('appConfig.jwtSecret'),
  ACCESS_TOKEN_EXPIRE_MIN: get('appConfig.accessTokenExpireMin'),
  REFRESH_TOKEN_EXPIRE_MIN: get('appConfig.refreshTokenExpireMin'),
  EMAIL_TOKEN_EXPIRE_DAY: get('appConfig.emailTokenExpireDay'),
  RESET_TOKEN_EXPIRE_DAY: get('appConfig.resetTokenExpireDay'),
  PRODUCTS_EXPORT_FILE: get('appConfig.exportProductsFileName'),
  PRODUCTS_IMPORT_FILE: get('appConfig.importProductsFileName'),
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

export const emailData = {
  email: get('emailConfig.email'),
  password: get('emailConfig.password'),
  host: get('emailConfig.host'),
  fromMessage: get('emailConfig.fromMessage'),
  confirmUrl: get('emailConfig.confirmUrl'),
  confirmMessageSubject: get('emailConfig.confirmMessageSubject'),
  confirmMessageText: get('emailConfig.confirmMessageText'),
  confirmationMessage: get('emailConfig.confirmationMessage'),
  resetMessageSubject: get('emailConfig.resetMessageSubject'),
  resetMessageText: get('emailConfig.resetMessageText'),
};

export const emailTransport = `smtps://${emailData.email}:${emailData.password}@smtp.${emailData.host}`;

export const emailConfig = {
  transport: emailTransport,
  defaults: {
    from: `${emailData.fromMessage} <${emailData.email}>`,
  },
};
