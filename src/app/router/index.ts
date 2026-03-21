import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { CategoryRoutes } from '../modules/category/category.routes';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/category', CategoryRoutes);

export const IndexRoutes = router;
