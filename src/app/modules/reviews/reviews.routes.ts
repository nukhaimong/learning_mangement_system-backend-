import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth.js';
import { Role } from '../../../generated/prisma/enums.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { ReviewsValidation } from './reviews.validation.js';
import { ReviewsController } from './reviews.controller.js';

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
