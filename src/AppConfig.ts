import { get } from 'config'
export const appConfig = {
    PORT: get('appConfig.port'),
    JWT_SECRET: get('appConfig.jwtSecret')
}