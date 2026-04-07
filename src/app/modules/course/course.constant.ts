import { Prisma } from '../../../generated/prisma/client.js';

export const courseSearchableFields = [
  'title',
  'description',
  'category.title',
];

export const courseFilterableFields = [
  'category.title',
  'course_fee',
  'level',
  'isFree',
];

export const courseIncludeConfig: Partial<
  Record<
    keyof Prisma.CourseInclude,
    Prisma.CourseInclude[keyof Prisma.CourseInclude]
  >
> = {
  category: {
    select: {
      id: true,
      title: true,
    },
  },
  enrollments: {
    select: {
      id: true,
      learner_id: true,
      course_id: true,
    },
  },
  reviews: {
    select: {
      id: true,
      content: true,
    },
  },
  favourites: {
    select: {
      id: true,
      course_id: true,
      learner_id: true,
    },
  },
  modules: {
    select: {
      title: true,
      course: true,
    },
  },
};
