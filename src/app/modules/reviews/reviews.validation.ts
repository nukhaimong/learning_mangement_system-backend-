import z from 'zod';

const createReviewsSchema = z.object({
  content: z
    .string('content must be string')
    .min(5, 'content must be more than 5 characters'),
  course_id: z.uuid('course_id must be uuid'),
  learner_id: z.string('learner_id must be uuid'),
});
const updateReviewsSchema = z.object({
  content: z
    .string('content must be string')
    .min(5, 'content must be more than 5 characters'),
  reviews_id: z.uuid('reviews_id must be a uuid'),
  learner_id: z.uuid('learner_id must be a uuid'),
});

export const ReviewsValidation = {
  createReviewsSchema,
  updateReviewsSchema,
};
