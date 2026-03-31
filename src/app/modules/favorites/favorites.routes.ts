import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/enums';
import { FavoritesController } from './favorites.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { FavoritesValidation } from './favorites.validation';

const router = Router();

router.post(
  '/',
  checkAuth(Role.Learner),
  validateRequest(FavoritesValidation.createFavoritesSchema),
  FavoritesController.addToFavorites,
);
router.get(
  '/',
  checkAuth(Role.Learner),
  FavoritesController.getAllFavoritesByLearnerId,
);
router.delete(
  '/delete',
  checkAuth(Role.Learner),
  validateRequest(FavoritesValidation.deleteFavoritesSchema),
  FavoritesController.deleteFavorites,
);

export const FavoritesRoutes = router;
