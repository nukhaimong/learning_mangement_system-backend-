import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { CategoryRoutes } from '../modules/category/category.routes';
import { FavoritesRoutes } from '../modules/favorites/favorites.routes';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/category', CategoryRoutes);
router.use('/favorites', FavoritesRoutes);

export const IndexRoutes = router;
