export const ERROR_MESSAGES = {
  DELETE_PRODUCT: 'Can not delete product!',
  WRONG_PASSWORD: 'Wrong password',
  USER_NOT_FOUND: 'User does not exist',
  USER_NOT_UNIQUE: 'Username must be unique',
  SEVER_ERROR: 'Server error',
  TOKEN_INVALID: 'Invalid token',
};
export const LOGS_PER_PAGE = 10;
export const PRODUCTS_PER_PAGE = 10;

export const REFRESH_TOKEN_HEADER = 'x-refresh-token';
export const TOKEN_TYPE = {
  ACCESS: 'access',
  REFRESH: 'refresh',
};
export const USER_REFRESH_TOKEN_KEY = (userId) => `refreshToken_${userId}`;
