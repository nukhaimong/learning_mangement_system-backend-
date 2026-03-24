import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/enums';
import { InstructorController } from './instructor.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { InstructorValidation } from './instructor.validation';
import { multerUpload } from '../../../config/multer.config';

const router = Router();

router.get(
  '/',
  checkAuth(Role.Admin, Role.Super_admin),
  InstructorController.getInstructors,
);

router.get(
  '/:instructor_id',
  checkAuth(Role.Admin, Role.Super_admin),
  InstructorController.getInstructorById,
);

router.put(
  '/update/:instructor_id',
  checkAuth(Role.Instructor),
  multerUpload.single('profile_photo'),
  validateRequest(InstructorValidation.updateInstructorZodSchema),
  InstructorController.updateInstructor,
);

router.delete(
  '/delete/:instructor_id',
  checkAuth(Role.Instructor, Role.Admin, Role.Super_admin),
  InstructorController.deleteInstructor,
);

export const InstructorRoutes = router;
