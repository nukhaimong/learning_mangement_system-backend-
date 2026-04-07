import status from 'http-status';
import AppError from '../../errorHelpers/appError.js';
import { prisma } from '../../lib/prisma.js';
import { IRequestUser } from '../../interfaces/requestUser.interface.js';

const addToFavorites = async (course_id: string, user: IRequestUser) => {
  const learnerData = await prisma.learner.findUnique({
    where: {
      user_id: user.user_id,
    },
  });
  if (!learnerData) {
    throw new AppError(status.NOT_FOUND, 'Learner not found');
  }
  const learner_id = learnerData.id;
  const isFavoriteExist = await prisma.favorites.findUnique({
    where: {
      course_id_learner_id: {
        course_id,
        learner_id,
      },
    },
  });
  if (isFavoriteExist) {
    throw new AppError(
      status.BAD_REQUEST,
      'You have already added this course to your favorites',
    );
  }
  return await prisma.favorites.create({
    data: {
      course_id,
      learner_id,
    },
  });
};

const deleteFavorites = async (course_id: string, user: IRequestUser) => {
  const learnerData = await prisma.learner.findUnique({
    where: {
      user_id: user.user_id,
    },
  });
  if (!learnerData) {
    throw new AppError(status.NOT_FOUND, 'Learner not found');
  }
  const learner_id = learnerData.id;

  const favoriteToDelete = await prisma.favorites.findUnique({
    where: {
      course_id_learner_id: {
        course_id,
        learner_id,
      },
    },
  });
  if (!favoriteToDelete) {
    throw new AppError(status.NOT_FOUND, 'Favorites not found');
  }
  return await prisma.favorites.delete({
    where: {
      course_id_learner_id: {
        course_id,
        learner_id,
      },
    },
  });
};

const getAllFavoritesByLearnerId = async (user: IRequestUser) => {
  const learnerData = await prisma.learner.findUnique({
    where: {
      user_id: user.user_id,
    },
  });
  if (!learnerData) {
    throw new AppError(status.NOT_FOUND, 'Learner not found');
  }
  return await prisma.favorites.findMany({
    where: {
      learner_id: learnerData.id,
    },
    include: {
      course: true,
    },
  });
};

export const FavoritesService = {
  addToFavorites,
  deleteFavorites,
  getAllFavoritesByLearnerId,
};
