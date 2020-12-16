import { get } from 'config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const appConfig = {
  PORT: get('appConfig.port'),
  JWT_SECRET: get('appConfig.jwtSecret'),
  ACCESS_TOKEN_EXPIRE: get('appConfig.accessTokenExpire'),
  REFRESH_TOKEN_EXPIRE: get('appConfig.refreshTokenExpire'),
  ACTIVATION_TOKEN_EXPIRE: get('appConfig.activationTokenExpire'),
  OAUTH_SECRET: 'OAuthSecret',
  RESET_TOKEN_EXPIRE: get('appConfig.resetTokenExpire'),
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
};

export const googleAuthConfig = {
  clientID: get('googleAuthConfig.clientID'),
  clientSecret: get('googleAuthConfig.clientSecret'),
  callbackURL: get('googleAuthConfig.callbackURL'),
  scope: ['email', 'profile'],
};

export const emailTransport = `smtps://${emailData.email}:${emailData.password}@smtp.${emailData.host}`;

export const emailConfig = {
  transport: emailTransport,
  defaults: {
    from: `${emailData.fromMessage} <${emailData.email}>`,
  },
};
