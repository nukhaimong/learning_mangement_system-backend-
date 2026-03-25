import z, { uuid } from 'zod';

const createModuleSchema = z.object({
  title: z.string('Title must be a string'),
  course_id: z.uuid('course_id must be a uuid'),
});

const insertModuleSchema = z.object({
  title: z.string('Title must be a string'),
});

const updateModuleSchema = z.object({
  title: z.string('Title must be a string').optional(),
});

export const ModuleValidation = {
  createModuleSchema,
  insertModuleSchema,
  updateModuleSchema,
};
