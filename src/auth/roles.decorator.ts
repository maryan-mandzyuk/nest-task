import { SetMetadata } from '@nestjs/common';
import { USER_ROLES } from '../constants';

export const Roles = (...roles: USER_ROLES[]) => SetMetadata('roles', roles);
