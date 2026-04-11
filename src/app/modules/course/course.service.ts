import status from 'http-status';
import AppError from '../../errorHelpers/appError.js';
import { IRequestUser } from '../../interfaces/requestUser.interface.js';
import { prisma } from '../../lib/prisma.js';
import {
  ICourseUpdatePayload,
  ICreateCoursePayload,
} from './course.interface.js';
import { deleteFileFromCloudinary } from '../../../config/cloudinary.config.js';
import { QueryBuilder } from '../../utils/queryBuilder.js';
import { Course, Prisma } from '../../../generated/prisma/client.js';
import {
  courseFilterableFields,
  courseSearchableFields,
} from './course.constant.js';
import { IQueryParams } from '../../interfaces/query.interface.js';
import { Prisma as PrismaEx } from '@prisma/client/extension';

const createCourse = async (
  user: IRequestUser,
  payload: ICreateCoursePayload,
) => {
  const instructorData = await prisma.instructor.findFirstOrThrow({
    where: {
      email: user.email,
    },
  });
  const course = await prisma.course.create({
    data: {
      ...payload,
      instructor_id: instructorData.id,
    },
  });

  return course;
};

const getCourses = async (query: IQueryParams) => {
  // return await prisma.course.findMany({
  //   include: {
  //     category: true,
  //     instructor: {
  //       select: {
  //         id: true,
  //         name: true,
  //       },
  //     },
  //   },
  // });
  const queryBuilder = new QueryBuilder<
    Course,
    Prisma.CourseWhereInput,
    Prisma.CourseInclude
  >(prisma.course, query, {
    searchableFields: courseSearchableFields,
    filterableFields: courseFilterableFields,
  });
  const result = await queryBuilder
    .search()
    .filter()
    .include({
      instructor: {
        select: {
          id: true,
          name: true,
        },
      },
      category: {
        select: { id: true, title: true },
      },
    })
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};
const getFreeCourses = async (query: IQueryParams) => {
  // return await prisma.course.findMany({
  //   include: {
  //     category: true,
  //     instructor: {
  //       select: {
  //         id: true,
  //         name: true,
  //       },
  //     },
  //   },
  // });
  const queryBuilder = new QueryBuilder<
    Course,
    Prisma.CourseWhereInput,
    Prisma.CourseInclude
  >(prisma.course, query, {
    searchableFields: courseSearchableFields,
    filterableFields: courseFilterableFields,
  });
  const result = await queryBuilder
    .where({
      isFree: true,
    })
    .search()
    .filter()
    .include({
      instructor: {
        select: {
          id: true,
          name: true,
        },
      },
      category: {
        select: { id: true, title: true },
      },
    })
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

const getCourseById = async (course_id: string) => {
  return prisma.course.findUnique({
    where: { id: course_id },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
        },
      },
      category: {
        select: {
          id: true,
          title: true,
        },
      },
      reviews: {
        select: {
          id: true,
          content: true,
          learner: {
            select: { name: true },
          },
        },
      },
      modules: {
        include: {
          lectures: {
            select: {
              id: true,
              title: true,
              order_index: true,
            },
            orderBy: {
              order_index: 'asc',
            },
          },
        },
        orderBy: {
          order_index: 'asc',
        },
      },
      enrollments: {
        select: {
          id: true,
        },
      },
    },
  });
};
const getCourseByCategoryId = async (catefory_id: string) => {
  return prisma.course.findMany({
    where: {
      category_id: catefory_id,
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
        },
      },
      category: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

const getCourseByInstructoId = async (user: IRequestUser) => {
  const instructorData = await prisma.instructor.findUnique({
    where: {
      user_id: user.user_id,
    },
  });
  if (!instructorData) {
    throw new AppError(status.NOT_FOUND, 'Instructor not found');
  }
  return await prisma.course.findMany({
    where: {
      instructor_id: instructorData.id,
    },
    include: {
      enrollments: {
        select: {
          id: true,
          payment: {
            select: { amount: true },
          },
        },
      },
    },
  });
};

const updateCourse = async (
  user: IRequestUser,
  course_id: string,
  payload: ICourseUpdatePayload,
) => {
  const {
    title,
    description,
    thumbnail,
    intro_video,
    isFree,
    isPublished,
    level,
    course_fee,
    category_id,
  } = payload;
  if (
    !title &&
    !description &&
    !thumbnail &&
    !intro_video &&
    !isFree &&
    isPublished === null &&
    !level &&
    !course_fee &&
    !category_id
  ) {
    throw new AppError(status.BAD_REQUEST, 'No field provided to update');
  }
  const instructorData = await prisma.instructor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const courseExist = await prisma.course.findUnique({
    where: { id: course_id },
  });

  if (!courseExist) {
    throw new AppError(status.NOT_FOUND, 'Course not found');
  }
  if (courseExist.instructor_id !== instructorData.id) {
    throw new AppError(status.UNAUTHORIZED, 'You can update only your courses');
  }

  return await prisma.$transaction(async (tx: PrismaEx.TransactionClient) => {
    const updatedCourse = await tx.course.update({
      where: {
        id: course_id,
      },
      data: payload,
    });

    if (thumbnail) {
      await deleteFileFromCloudinary(courseExist.thumbnail);
    }
    if (intro_video) {
      await deleteFileFromCloudinary(courseExist.intro_video);
    }
    return updatedCourse;
  });
};

const deleteCourse = async (user: IRequestUser, course_id: string) => {
  const instructorData = await prisma.instructor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const courseExist = await prisma.course.findUnique({
    where: { id: course_id },
    include: {
      enrollments: true,
    },
  });

  const enrollmentExistInTheCourse = await prisma.enrollment.findFirst({
    where: {
      course_id: course_id,
    },
  });

  if (!courseExist) {
    throw new AppError(status.NOT_FOUND, 'Course not found');
  }
  if (courseExist.instructor_id !== instructorData.id) {
    throw new AppError(status.UNAUTHORIZED, 'You can delete only your courses');
  }
  if (enrollmentExistInTheCourse) {
    throw new AppError(
      status.FORBIDDEN,
      "Learners already exist in this course. You can't delete this course any more, you can update instead",
    );
  }

  return await prisma.course.delete({
    where: { id: course_id },
  });
};

export const CourseService = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseByCategoryId,
  getCourseByInstructoId,
  getFreeCourses,
};
