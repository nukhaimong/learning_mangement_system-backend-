import status from 'http-status';
import AppError from '../../errorHelpers/appError';
import { auth } from '../../lib/auth';
import { ILoginPayload, IRegistrationPayload } from './auth.interface';
import { Role, UserStatus } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { User } from '../../../generated/prisma/client';

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
  const alreadyExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (alreadyExist) {
    throw new AppError(
      status.BAD_REQUEST,
      'User already exist with this email',
    );
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
    await prisma.$transaction(async (tx) => {
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
    return data;
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

const isProfileExist = async (user: User) => {
  const isLearnerExist = await prisma.learner.findUnique({
    where: {
      user_id: user.id,
    },
  });
  const isInstructorExist = await prisma.learner.findUnique({
    where: {
      user_id: user.id,
    },
  });
  if (!isInstructorExist && !isLearnerExist) {
    return false;
  }
  return true;
};

const updateRole = async (role: Role, user: User) => {
  if (
    ![Role.Learner, Role.Instructor, Role.Admin, Role.Super_admin].includes(
      role,
    )
  ) {
    throw new AppError(status.BAD_REQUEST, 'Invalid role');
  }

  if (role === Role.Learner) {
    return await prisma.learner.create({
      data: {
        name: user.name,
        email: user.email,
        user_id: user.id,
      },
    });
  } else if (role === Role.Instructor) {
    return await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          role,
        },
      });
      const instructor = await prisma.instructor.create({
        data: {
          name: user.name,
          email: user.email,
          user_id: user.id,
        },
      });
      return instructor;
    });
  }
};

const verifyEmail = async (email: string, otp: string) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp,
    },
  });
  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
      },
    });
  }
  return result;
};

const forgotPassword = async (email: string) => {
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });
  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, 'User Not Found');
  }
  if (!isUserExist.emailVerified) {
    throw new AppError(status.NOT_FOUND, 'User email is not varified');
  }
  if (isUserExist.isDeleted && isUserExist.status === UserStatus.DELETED) {
    throw new AppError(status.NOT_FOUND, 'User Not Found');
  }

  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email,
    },
  });
};

const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });
  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, 'User Not Found');
  }
  if (!isUserExist.emailVerified) {
    throw new AppError(status.NOT_FOUND, 'User email is not varified');
  }
  if (isUserExist.isDeleted && isUserExist.status === UserStatus.DELETED) {
    throw new AppError(status.NOT_FOUND, 'User Not Found');
  }

  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword,
    },
  });
  await prisma.session.deleteMany({
    where: {
      userId: isUserExist.id,
    },
  });
};

const getMe = async (user: IRequestUser) => {
  const userExist = await prisma.user.findUnique({
    where: { id: user.user_id },
    include: {
      learner: true,
      instructor: true,
      admin: true,
    },
  });
  if (!userExist) {
    throw new AppError(status.NOT_FOUND, 'user not found');
  }
  return userExist;
};
export const AuthService = {
  registration,
  login,
  updateRole,
  isProfileExist,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
};
