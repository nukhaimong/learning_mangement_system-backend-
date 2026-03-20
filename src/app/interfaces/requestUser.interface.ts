import { Role } from '../../generated/prisma/enums';

export interface IRequestUser {
  user_id: string;
  role: Role;
  email: string;
}
