import z from 'zod';

const createLectureSchema = z.object({
  title: z.string('Title must be a string'),
  module_id: z.uuid('module_id must be uuid'),
});

const insertLectureSchema = z.object({
  title: z.string('Title must be a string'),
});

const updateLectureSchema = z.object({
  title: z.string('Title must be a string').optional(),
});

export const LectureValidation = {
  createLectureSchema,
  insertLectureSchema,
  updateLectureSchema,
};
