import z from 'zod';
import { Level } from '../../../generated/prisma/enums';

export const createCourseZodSchema = z.object({
  title: z
    .string('Title is required')
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be less than 200 characters'),

  description: z
    .string('Description is required')
    .min(1, 'Description cannot be empty'),

  thumbnail: z.url('Thumbnail must be a valid URL'),

  intro_video: z.url('Intro video is required'),

  course_fee: z
    .number('Course fee is required')
    .nonnegative('Course fee cannot be negative'),

  isFree: z.boolean().optional(),

  level: z.enum([Level.Advance, Level.Intermediate, Level.Beginner]),

  isPublished: z.boolean().optional(),

  category_id: z.uuid('category id must a uuid'),
});

export const CourseValidation = {
  createCourseZodSchema,
};
