import status from 'http-status';
import AppError from '../../errorHelpers/appError';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { prisma } from '../../lib/prisma';
import { ICourseUpdatePayload, ICreateCoursePayload } from './course.interface';
import { deleteFileFromCloudinary } from '../../../config/cloudinary.config';

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

const getCourses = async () => {
  return await prisma.course.findMany({
    include: {
      category: true,
      instructor: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
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
    !isPublished &&
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

  return await prisma.$transaction(async (tx) => {
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
};
