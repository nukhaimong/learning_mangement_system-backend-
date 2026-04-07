import { Role } from '../../generated/prisma/enums.js';

export interface IRequestUser {
  user_id: string;
  role: Role;
  email: string;
}
