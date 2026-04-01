import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth.js';
import { Role } from '../../../generated/prisma/enums.js';
import { FavoritesController } from './favorites.controller.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { FavoritesValidation } from './favorites.validation.js';

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
