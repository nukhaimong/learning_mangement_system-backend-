import { Router } from 'express';
import { multerUpload } from '../../../config/multer.config';
import { createCourseMiddleware } from './course.middleware';
import { validateRequest } from '../../middleware/validateRequest';
import { CourseValidation } from './course.validation';
import { CourseController } from './course.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

router.post(
  '/',
  checkAuth(Role.Instructor),
  multerUpload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'intro_video', maxCount: 1 },
  ]),
  createCourseMiddleware,
  validateRequest(CourseValidation.createCourseZodSchema),
  CourseController.createCourse,
);

export const CourseRoutes = router;
