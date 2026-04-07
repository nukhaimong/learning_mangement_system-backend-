import z from 'zod';

const createCategorySchema = z.object({
  title: z
    .string('Title must be string')
    .min(2, 'Title must be more than 2 characters')
    .max(100, 'Title must be less than 100 characters'),
});
const updateCategorySchema = z.object({
  title: z
    .string('Title must be string')
    .min(2, 'Title must be more than 2 characters')
    .max(100, 'Title must be less than 100 characters'),
});

export const CategoryValidation = {
  createCategorySchema,
  updateCategorySchema,
};
