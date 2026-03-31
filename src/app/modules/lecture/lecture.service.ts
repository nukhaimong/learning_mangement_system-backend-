import status from 'http-status';
import AppError from '../../errorHelpers/appError';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { prisma } from '../../lib/prisma';
import {
  ICreateLecturePayload,
  IInsertLecturePayload,
  IUpdateLecturePayload,
} from './lecture.interface';
import { deleteFileFromCloudinary } from '../../../config/cloudinary.config';

const createLecture = async (
  user: IRequestUser,
  payload: ICreateLecturePayload,
) => {
  const moduleExist = await prisma.module.findUnique({
    where: { id: payload.module_id },
  });

  if (!moduleExist) {
    throw new AppError(status.NOT_FOUND, 'Module not found');
  }
  const courseExist = await prisma.course.findUnique({
    where: { id: moduleExist.course_id },
    include: {
      instructor: {
        include: {
          user: {
            select: { id: true },
          },
        },
      },
    },
  });

  if (!courseExist) {
    throw new AppError(status.NOT_FOUND, 'Course not found for this module');
  }
  if (courseExist.instructor.user.id !== user.user_id) {
    throw new AppError(
      status.UNAUTHORIZED,
      'You can only create your course lecture',
    );
  }

  return await prisma.$transaction(async (tx) => {
    const lastLecture = await tx.lecture.findFirst({
      where: { module_id: payload.module_id },
      orderBy: {
        order_index: 'desc',
      },
    });

    const nextIndex = (lastLecture?.order_index ?? 0) + 100;

    return await tx.lecture.create({
      data: {
        ...payload,
        order_index: nextIndex,
      },
    });
  });
};
const getLecturesByModuleId = async (module_id: string) => {
  return await prisma.lecture.findMany({
    where: { module_id },
    orderBy: {
      order_index: 'asc',
    },
  });
};
const insertLecture = async (
  user: IRequestUser,
  payload: IInsertLecturePayload,
  lecture_id: string,
) => {
  const lectureExist = await prisma.lecture.findUnique({
    where: { id: lecture_id },
    include: {
      module: {
        include: {
          course: {
            include: {
              instructor: {
                include: {
                  user: {
                    select: { id: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!lectureExist) {
    throw new AppError(status.NOT_FOUND, 'Lecture not found');
  }

  if (lectureExist.module.course.instructor.user.id !== user.user_id) {
    throw new AppError(
      status.UNAUTHORIZED,
      'You can only insert your course lecture',
    );
  }

  return await prisma.$transaction(async (tx) => {
    const nextLecture = await tx.lecture.findFirst({
      where: {
        module_id: lectureExist.module_id,
        order_index: {
          gt: lectureExist.order_index,
        },
      },
      orderBy: {
        order_index: 'asc',
      },
    });
    const nextLectureIndex = nextLecture
      ? (lectureExist.order_index + nextLecture.order_index) / 2
      : lectureExist.order_index + 100;

    return await tx.lecture.create({
      data: {
        ...payload,
        module_id: lectureExist.module_id,
        order_index: nextLectureIndex,
      },
    });
  });
};

const updateLecture = async (
  user: IRequestUser,
  payload: IUpdateLecturePayload,
  lecture_id: string,
) => {
  const { title, video_url } = payload;
  if (!title && !video_url) {
    throw new AppError(status.BAD_REQUEST, 'No field provided to update');
  }

  const lectureExist = await prisma.lecture.findUnique({
    where: { id: lecture_id },
    include: {
      module: {
        include: {
          course: {
            include: {
              instructor: {
                include: {
                  user: {
                    select: { id: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!lectureExist) {
    throw new AppError(status.NOT_FOUND, 'Lecture not found');
  }

  if (lectureExist.module.course.instructor.user.id !== user.user_id) {
    throw new AppError(
      status.UNAUTHORIZED,
      'You can only update your course lecture',
    );
  }
  return await prisma.$transaction(async (tx) => {
    const updatedLecture = await tx.lecture.update({
      where: { id: lecture_id },
      data: payload,
    });
    if (video_url) {
      await deleteFileFromCloudinary(lectureExist.video_url);
    }
    return updatedLecture;
  });
};

const deleteLecture = async (user: IRequestUser, lecture_id: string) => {
  const lectureExist = await prisma.lecture.findUnique({
    where: { id: lecture_id },
    include: {
      module: {
        include: {
          course: {
            include: {
              instructor: {
                include: {
                  user: {
                    select: { id: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!lectureExist) {
    throw new AppError(status.NOT_FOUND, 'Lecture not found');
  }

  if (lectureExist.module.course.instructor.user.id !== user.user_id) {
    throw new AppError(
      status.UNAUTHORIZED,
      'You can only delete your course lecture',
    );
  }

  return await prisma.$transaction(async (tx) => {
    const deletedLecture = await tx.lecture.delete({
      where: { id: lecture_id },
    });
    await deleteFileFromCloudinary(lectureExist.video_url);

    return deletedLecture;
  });
};

export const LectureService = {
  createLecture,
  insertLecture,
  updateLecture,
  deleteLecture,
  getLecturesByModuleId,
};
