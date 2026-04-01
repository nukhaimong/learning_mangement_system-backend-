import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes.js';
import { CategoryRoutes } from '../modules/category/category.routes.js';
import { FavoritesRoutes } from '../modules/favorites/favorites.routes.js';
import { ReviewsRoutes } from '../modules/reviews/reviews.routes.js';
import { CourseRoutes } from '../modules/course/course.routes.js';
import { LearnerRoutes } from '../modules/learner/learner.routes.js';
import { InstructorRoutes } from '../modules/instructor/instructor.routes.js';
import { ModuleRoutes } from '../modules/module/module.routes.js';
import { LectureRoutes } from '../modules/lecture/lecture.routes.js';
import { EnrollmentRoutes } from '../modules/enrollment/enrollment.routes.js';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/category', CategoryRoutes);
router.use('/favorites', FavoritesRoutes);
router.use('/reviews', ReviewsRoutes);
router.use('/course', CourseRoutes);
router.use('/learner', LearnerRoutes);
router.use('/instructor', InstructorRoutes);
router.use('/module', ModuleRoutes);
router.use('/lecture', LectureRoutes);
router.use('/enrollment', EnrollmentRoutes);

export const IndexRoutes = router;
