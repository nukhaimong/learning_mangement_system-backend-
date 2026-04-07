import z from 'zod';

const createFavoritesSchema = z.object({
  course_id: z.uuid('course_id must be uuid'),
});
const deleteFavoritesSchema = z.object({
  course_id: z.uuid('course_id must be uuid'),
});

export const FavoritesValidation = {
  createFavoritesSchema,
  deleteFavoritesSchema,
};
