import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { CategoryRoutes } from '../modules/category/category.routes';
import { FavoritesRoutes } from '../modules/favorites/favorites.routes';
import { ReviewsRoutes } from '../modules/reviews/reviews.routes';
import { CourseRoutes } from '../modules/course/course.routes';
import { LearnerRoutes } from '../modules/learner/learner.routes';
import { InstructorRoutes } from '../modules/instructor/instructor.routes';
import { ModuleRoutes } from '../modules/module/module.routes';
import { LectureRoutes } from '../modules/lecture/lecture.routes';
import { EnrollmentRoutes } from '../modules/enrollment/enrollment.routes';

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
