import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/enums';
import { EnrollmentController } from './enrollment.controller';

const router = Router();

router.get(
  '/all-enrollments',
  checkAuth(Role.Admin, Role.Super_admin),
  EnrollmentController.getAllEnrollments,
);

router.get(
  '/',
  checkAuth(Role.Learner),
  EnrollmentController.getEnrollmentsByLearnerId,
);

router.get(
  '/:enrollment_id',
  checkAuth(Role.Learner),
  EnrollmentController.getEnrollmentById,
);
router.post(
  '/:course_id',
  checkAuth(Role.Learner),
  EnrollmentController.enrollCourse,
);

export const EnrollmentRoutes = router;
