import z from 'zod';

const updateLearnerZodSchema = z.object({
  name: z.string('name must be a string').optional(),
  address: z.string('address must be a string').optional(),
  contact_number: z.string('contact_number must be a string').optional(),
});

export const LearnerValidation = {
  updateLearnerZodSchema,
};
