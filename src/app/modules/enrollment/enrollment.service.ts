import status from 'http-status';
import AppError from '../../errorHelpers/appError';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { prisma } from '../../lib/prisma';
import { UserStatus } from '../../../generated/prisma/enums';
import { stripe } from '../../../config/stripe.config';
import { envVars } from '../../../config/env';

const enrollCourse = async (user: IRequestUser, course_id: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: { id: user.user_id },
  });

  if (
    userData.status === UserStatus.DELETED ||
    userData.status === UserStatus.BLOCKED
  ) {
    throw new AppError(status.NOT_FOUND, 'User is blocked or deleted');
  }
  if (userData.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }
  const learnerData = await prisma.learner.findUnique({
    where: {
      user_id: user.user_id,
    },
  });
  if (!learnerData) {
    throw new AppError(status.NOT_FOUND, 'Learner not found');
  }

  const alreadyEnrolled = await prisma.enrollment.findUnique({
    where: {
      course_id_learner_id: {
        course_id,
        learner_id: learnerData.id,
      },
    },
  });

  if (alreadyEnrolled) {
    throw new AppError(status.BAD_REQUEST, 'Already enrolled');
  }

  const courseData = await prisma.course.findUnique({
    where: { id: course_id },
  });
  if (!courseData) {
    throw new AppError(status.NOT_FOUND, 'Course not found');
  }
  if (courseData.isFree) {
    return await prisma.enrollment.create({
      data: {
        learner_id: learnerData.id,
        course_id: course_id,
      },
    });
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'bdt',
          product_data: {
            name: `Enrollment to the course ${courseData.title}`,
          },
          unit_amount: courseData.course_fee * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      course_id: courseData.id,
      learner_id: learnerData.id,
      amount: courseData.course_fee,
    },
    success_url: `${envVars.FRONTEND_URL}/dashboard/payment?success=true&course_id=${courseData.id}`,
    cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment?error=cancelled`,
  });
  return session.url;
};

const getAllEnrollments = async () => {
  return await prisma.enrollment.findMany({
    include: {
      payment: {
        select: {
          amount: true,
          transaction_id: true,
          createdAt: true,
        },
      },
      learner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
        },
      },
    },
  });
};

const getEnrollmentsByLearnerId = async (user: IRequestUser) => {
  const learnerData = await prisma.learner.findUnique({
    where: {
      user_id: user.user_id,
    },
  });
  if (!learnerData) {
    throw new AppError(status.NOT_FOUND, 'Learner not found');
  }
  return await prisma.enrollment.findMany({
    where: {
      learner_id: learnerData.id,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
        },
      },
    },
  });
};

const getEnrollmentById = async (enrollment_id: string) => {
  return await prisma.enrollment.findUnique({
    where: { id: enrollment_id },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
          modules: {
            select: {
              id: true,
              title: true,
              lectures: {
                select: {
                  id: true,
                  title: true,
                  video_url: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const EnrollmentService = {
  enrollCourse,
  getEnrollmentsByLearnerId,
  getEnrollmentById,
  getAllEnrollments,
};
