import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/enums';
import { EnrollmentController } from './enrollment.controller';

const router = Router();

router.post(
  '/:course_id',
  checkAuth(Role.Learner),
  EnrollmentController.enrollCourse,
);

export const EnrollmentRoutes = router;
