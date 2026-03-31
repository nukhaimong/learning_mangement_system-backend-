import { Router } from 'express';
import { multerUpload } from '../../../config/multer.config';
import {
  createCourseMiddleware,
  updateCourseMiddleware,
} from './course.middleware';
import { validateRequest } from '../../middleware/validateRequest';
import { CourseValidation } from './course.validation';
import { CourseController } from './course.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

router.get('/', CourseController.getCourses);
router.get(
  '/instructor',
  checkAuth(Role.Instructor),
  CourseController.getCourseByInstructorId,
);
router.get('/:course_id', CourseController.getCourseById);
router.get('/category/:category_id', CourseController.getCourseByCategoryId);

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
router.put(
  '/update/:course_id',
  checkAuth(Role.Instructor),
  multerUpload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'intro_video', maxCount: 1 },
  ]),
  updateCourseMiddleware,
  validateRequest(CourseValidation.updateCourseZodSchema),
  CourseController.updateCourse,
);
router.delete(
  '/delete/:course_id',
  checkAuth(Role.Instructor),
  CourseController.deleteCourse,
);

export const CourseRoutes = router;
