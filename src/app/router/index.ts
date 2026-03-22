import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { CategoryRoutes } from '../modules/category/category.routes';
import { FavoritesRoutes } from '../modules/favorites/favorites.routes';
import { ReviewsRoutes } from '../modules/reviews/reviews.routes';
import { CourseRoutes } from '../modules/course/course.routes';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/category', CategoryRoutes);
router.use('/favorites', FavoritesRoutes);
router.use('/reviews', ReviewsRoutes);
router.use('/course', CourseRoutes);

export const IndexRoutes = router;
