import { Course } from '../../../generated/prisma/client';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { prisma } from '../../lib/prisma';
import { ICreateCoursePayload } from './course.interface';

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

export const CourseService = {
  createCourse,
};
