import z from 'zod';

const updateInstructorZodSchema = z.object({
  name: z.string('name must be a string').optional(),
  address: z.string('address must be a string').optional(),
  contact_number: z.string('contact_number must be a string').optional(),
  profession: z.string('profession must be a string').optional(),
  about_me: z.string('about_me must me string').optional(),
});

export const InstructorValidation = {
  updateInstructorZodSchema,
};
