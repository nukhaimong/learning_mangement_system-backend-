import status from 'http-status';
import AppError from '../../errorHelpers/appError';
import { auth } from '../../lib/auth';
import { ILoginPayload, IRegistrationPayload } from './auth.interface';
import { Role, UserStatus } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';

const registration = async (payload: IRegistrationPayload) => {
  const { name, email, password, role } = payload;

  if (!name || !email || !password || !role) {
    throw new AppError(status.BAD_REQUEST, 'Missing required fields');
  }

  if (
    ![Role.Learner, Role.Instructor, Role.Admin, Role.Super_admin].includes(
      role,
    )
  ) {
    throw new AppError(status.BAD_REQUEST, 'Invalid role');
  }
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role,
    },
  });
  if (!data.user) {
    throw new AppError(
      status.BAD_REQUEST,
      'Registration failed, please try again',
    );
  }
  try {
    const profile = await prisma.$transaction(async (tx) => {
      if (data.user.role === Role.Learner) {
        const learner = await tx.learner.create({
          data: {
            name: data.user.name,
            email: data.user.email,
            user_id: data.user.id,
          },
        });
        return learner;
      } else if (data.user.role === Role.Instructor) {
        const instructor = await tx.instructor.create({
          data: {
            name: data.user.name,
            email: data.user.email,
            user_id: data.user.id,
          },
        });
        return instructor;
      } else {
        throw new AppError(
          status.BAD_REQUEST,
          'Invalid role provided, only learner and instructor are allowed to self registration',
        );
      }
    });
    return profile;
  } catch (error) {
    console.log('Failed To Create Learner/Instructor: ', error);
    await prisma.user.delete({
      where: { id: data.user.id },
    });
    throw error;
  }
};

const login = async (payload: ILoginPayload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });
  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError(status.FORBIDDEN, "Opps, seems you're blocked");
  }
  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError(status.NOT_FOUND, 'This user account is deleted');
  }
  return data;
};

export const AuthService = {
  registration,
  login,
};
