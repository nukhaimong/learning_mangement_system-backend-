import status from 'http-status';
import { Role } from '../../../generated/prisma/enums';
import AppError from '../../errorHelpers/appError';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { prisma } from '../../lib/prisma';
import { IUpdateLearnerPayload } from './learner.interface';
import { deleteFileFromCloudinary } from '../../../config/cloudinary.config';

const getLearners = async () => {
  return await prisma.learner.findMany();
};

const getLearnerById = async (learner_id: string) => {
  return await prisma.learner.findUnique({
    where: {
      id: learner_id,
    },
  });
};

const updateLearner = async (
  user: IRequestUser,
  learner_id: string,
  payload: IUpdateLearnerPayload,
) => {
  const { name, profile_photo, address, contact_number } = payload;

  if (!name && !profile_photo && !address && !contact_number) {
    throw new AppError(status.BAD_REQUEST, 'No field provided to update');
  }

  const learnerExist = await prisma.learner.findUnique({
    where: { id: learner_id },
  });

  if (!learnerExist) {
    throw new AppError(status.NOT_FOUND, 'Learner not found');
  }

  if (learnerExist?.user_id !== user.user_id) {
    throw new AppError(status.UNAUTHORIZED, 'You can only update your account');
  }

  return await prisma.$transaction(async (tx) => {
    const updatedLearner = await tx.learner.update({
      where: { id: learner_id },
      data: payload,
    });
    if (name) {
      await tx.user.update({
        where: {
          id: learnerExist.user_id,
        },
        data: {
          name,
        },
      });
    }
    if (profile_photo && learnerExist.profile_photo !== null) {
      await deleteFileFromCloudinary(learnerExist.profile_photo);
    }
    return updatedLearner;
  });
};

const deleteLearner = async (user: IRequestUser, learner_id: string) => {
  const learnerExist = await prisma.learner.findUnique({
    where: { id: learner_id },
  });

  if (!learnerExist) {
    throw new AppError(status.NOT_FOUND, 'Learner not found');
  }

  if (
    learnerExist?.user_id !== user.user_id &&
    user.role !== Role.Admin &&
    user.role !== Role.Super_admin
  ) {
    throw new AppError(status.UNAUTHORIZED, 'You can only delete your account');
  }

  return await prisma.$transaction(async (tx) => {
    const deletedLearner = await tx.instructor.update({
      where: { id: learner_id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    if (learnerExist.profile_photo !== null) {
      await deleteFileFromCloudinary(learnerExist.profile_photo);
    }
    return deletedLearner;
  });
};

export const LearnerService = {
  getLearners,
  getLearnerById,
  updateLearner,
  deleteLearner,
};
