import { Role } from '../../generated/prisma/enums';

export interface IRequestUser {
  name: string;
  role: Role;
  email: string;
  id: string;
}
