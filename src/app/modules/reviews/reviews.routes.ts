import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/enums';
import { validateRequest } from '../../middleware/validateRequest';
import { ReviewsValidation } from './reviews.validation';
import { ReviewsController } from './reviews.controller';

const router = Router();

router.post(
  '/',
  checkAuth(Role.Learner),
  validateRequest(ReviewsValidation.createReviewsSchema),
  ReviewsController.createReviews,
);
router.put(
  '/update',
  checkAuth(Role.Learner),
  validateRequest(ReviewsValidation.updateReviewsSchema),
  ReviewsController.updateReviews,
);
router.delete(
  '/delete',
  checkAuth(Role.Learner),
  ReviewsController.deleteReviews,
);

export const ReviewsRoutes = router;
