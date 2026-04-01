import status from 'http-status';
import { Reviews } from '../../../generated/prisma/client.js';
import AppError from '../../errorHelpers/appError.js';
import { prisma } from '../../lib/prisma.js';

const createReviews = async ({ content, course_id, learner_id }: Reviews) => {
  const isEnrollmentExist = await prisma.enrollment.findUnique({
    where: {
      course_id_learner_id: {
        course_id,
        learner_id,
      },
    },
  });
  if (!isEnrollmentExist) {
    throw new AppError(
      status.FORBIDDEN,
      "You're not enrolled to this course. please enroll to leave reviews",
    );
  }
  return await prisma.reviews.create({
    data: {
      content,
      course_id,
      learner_id,
    },
  });
};

const updateReviews = async (
  content: string,
  reviews_id: string,
  learner_id: string,
) => {
  const isReviewsExist = await prisma.reviews.findUnique({
    where: { id: reviews_id },
  });
  if (!isReviewsExist) {
    throw new AppError(status.NOT_FOUND, 'Review not found');
  }
  if (isReviewsExist.learner_id !== learner_id) {
    throw new AppError(status.FORBIDDEN, 'You can update only your reviews');
  }
  return await prisma.reviews.update({
    where: { id: reviews_id },
    data: {
      content,
    },
  });
};

const deleteReviews = async (reviews_id: string, learner_id: string) => {
  const isReviewsExist = await prisma.reviews.findUnique({
    where: { id: reviews_id },
  });
  if (!isReviewsExist) {
    throw new AppError(status.NOT_FOUND, 'Review not found');
  }
  if (isReviewsExist.learner_id !== learner_id) {
    throw new AppError(status.FORBIDDEN, 'You can delete only your reviews');
  }
  return await prisma.reviews.delete({
    where: {
      id: reviews_id,
    },
  });
};

export const ReviewsService = {
  createReviews,
  updateReviews,
  deleteReviews,
};
