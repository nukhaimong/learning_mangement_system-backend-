import { Role } from '../../../generated/prisma/enums.js';

export interface IRegistrationPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface ILoginPayload {
  email: string;
  password: string;
}
