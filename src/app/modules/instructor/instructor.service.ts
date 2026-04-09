import status from 'http-status';
import { Role } from '../../../generated/prisma/enums.js';
import AppError from '../../errorHelpers/appError.js';
import { IRequestUser } from '../../interfaces/requestUser.interface.js';
import { prisma } from '../../lib/prisma.js';
import { IUpdateInstructorPayload } from './instructor.interface.js';
import { deleteFileFromCloudinary } from '../../../config/cloudinary.config.js';
import { Prisma } from '@prisma/client/extension.js';

const getInstructors = async () => {
  return await prisma.instructor.findMany();
};

const getInstructorById = async (instructor_id: string) => {
  return await prisma.instructor.findUnique({
    where: {
      id: instructor_id,
    },
  });
};

const updateInstructor = async (
  user: IRequestUser,
  instructor_id: string,
  payload: IUpdateInstructorPayload,
) => {
  const { name, profile_photo, address, contact_number, profession, about_me } =
    payload;

  if (
    !name &&
    !profile_photo &&
    !address &&
    !contact_number &&
    !profession &&
    !about_me
  ) {
    throw new AppError(status.BAD_REQUEST, 'No field provided to update');
  }

  const instructorExist = await prisma.instructor.findUnique({
    where: { id: instructor_id },
  });

  if (!instructorExist) {
    throw new AppError(status.NOT_FOUND, 'Instructor not found');
  }

  if (instructorExist?.user_id !== user.user_id) {
    throw new AppError(status.UNAUTHORIZED, 'You can only update your account');
  }

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const updatedInstructor = await tx.instructor.update({
      where: { id: instructor_id },
      data: payload,
    });
    if (name) {
      await tx.user.update({
        where: {
          id: instructorExist.user_id,
        },
        data: {
          name,
        },
      });
    }
    if (profile_photo && instructorExist.profile_photo !== null) {
      await deleteFileFromCloudinary(instructorExist.profile_photo);
    }
    return updatedInstructor;
  });
};

const deleteInstructor = async (user: IRequestUser, instructor_id: string) => {
  const instructorExist = await prisma.instructor.findUnique({
    where: { id: instructor_id },
  });

  if (!instructorExist) {
    throw new AppError(status.NOT_FOUND, 'Instructor not found');
  }

  if (
    instructorExist?.user_id !== user.user_id &&
    user.role !== Role.Admin &&
    user.role !== Role.Super_admin
  ) {
    throw new AppError(status.UNAUTHORIZED, 'You can only delete your account');
  }
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const deletedInstructor = await tx.instructor.update({
      where: { id: instructor_id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    if (instructorExist.profile_photo !== null) {
      await deleteFileFromCloudinary(instructorExist.profile_photo);
    }
    return deletedInstructor;
  });
};

export const InstructorService = {
  getInstructorById,
  getInstructors,
  updateInstructor,
  deleteInstructor,
};
