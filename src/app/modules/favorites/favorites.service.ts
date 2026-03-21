import status from 'http-status';
import { Favorites } from '../../../generated/prisma/client';
import AppError from '../../errorHelpers/appError';
import { prisma } from '../../lib/prisma';

const addToFavorites = async ({ course_id, learner_id }: Favorites) => {
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

const deleteFavorites = async (course_id: string, learner_id: string) => {
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

export const FavoritesService = {
  addToFavorites,
  deleteFavorites,
};
