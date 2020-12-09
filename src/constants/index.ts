import { CreatePurchaseDto } from 'src/purchases/dto/create-purchase.dto';
import { Purchase } from 'src/purchases/entities/purchase.entity';
import { PurchaseItem } from 'src/purchases/entities/purchaseItem.entity';

export const ERROR_MESSAGES = {
  DELETE_PRODUCT: 'Can not delete product!',
  WRONG_PASSWORD: 'Wrong password',
  USER_NOT_FOUND: 'User does not exist',
  USER_NOT_UNIQUE: 'Username must be unique',
  SERVER_ERROR: 'Server error',
  TOKEN_INVALID: 'Invalid token',
  EMAIL_NOT_CONFIRMED: 'Email not confirmed. Pleas confirm email!',
  BAD_REQUEST: 'Bad request',
};

export const SUCCESS_MESSAGES = {
  RESET_PASS: 'Password successfully reset',
  RESET_EMAIL_MESSAGE: 'On your email was sent token for reset password',
};
export const LOGS_PER_PAGE = 10;
export const PRODUCTS_PER_PAGE = 10;

export enum TOKEN_KEY {
  REFRESH = 'x-refresh-token',
  ACCESS = 'authorization',
  ACTIVATION = 'activationToken',
  RESET = 'x-reset-token',
}

export enum TOKEN_TYPES {
  ACCESS = 'access',
  REFRESH = 'refresh',
  ACTIVATION = 'activation',
  RESET = 'reset',
}
export const USER_REFRESH_TOKEN_KEY = (userId) => `refreshToken_${userId}`;

export const CONFIRM_EMAIL_HTML_HANDLER = (url: string, token: string) =>
  `<p><a href="${url}${token}">Click here to confirm email</a></p>`;

export const RESET_HTML_HANDLER = (token: string) =>
  `<p>${EMAIL_MESSAGES.resetMessageText} ${token}</p>`;
export enum ORDER {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum LOG_OPERATION {
  insert = 'insert',
  update = 'update',
  delete = 'delete',
}

export enum USER_ROLES {
  seller = 'seller',
  customer = 'customer',
}

export enum PURCHASE_STATUS {
  received = 'received',
  shipped = 'shipped',
  completed = 'completed',
}
export const ID_PARAM = { type: 'string', name: 'id' };

export const EMAIL_MESSAGES = {
  confirmMessageSubject: 'Email confirmation',
  confirmMessageText: 'Email confirmation',
  confirmationMessage: 'Email successfully confirmed!',
  resetMessageSubject: 'Reset password',
  resetMessageText: 'Token for reset your password:',
  customerOrderSubject: 'Confirmation of your order',
  customerOrderText: 'Order',
  sellerOrderSubject: 'New order',
  sellerOrderText: 'Order',
};

export const customerOrderHtml = (
  purchaseDto: CreatePurchaseDto,
  purchaseItems: PurchaseItem[],
) => `<div>
        <p>You order created, Address: ${purchaseDto.address}, 
        Phone number: ${purchaseDto.phoneNumber}</p>
        <p>Products ordered: ${purchaseItems.map(
          (item) => `${item.product.name}; Quantity: ${item.quantity} `,
        )}</p>
       </div>`;

export const sellerOrderHtml = (
  purchase: Purchase,
  purchaseItems: PurchaseItem[],
) => `<div>
       <p>You received new order from customer email: ${
         purchase.email
       } address: ${purchase.address} phone number: ${purchase.phoneNumber}</p>
       <p>Products ordered: ${purchaseItems.map(
         (i) => `${i.product.name}; Quantity: ${i.quantity} `,
       )}</p>
      </div>`;
