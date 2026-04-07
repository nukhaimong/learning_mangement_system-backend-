import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth.js';
import { Role } from '../../../generated/prisma/enums.js';
import { LearnerController } from './learner.controller.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { LearnerValidation } from './learner.validation.js';
import { multerUpload } from '../../../config/multer.config.js';

const router = Router();

router.get(
  '/',
  checkAuth(Role.Admin, Role.Admin),
  LearnerController.getLearners,
);
router.get(
  '/:learner_id',
  checkAuth(Role.Admin, Role.Super_admin, Role.Learner),
  LearnerController.getLearnerById,
);
router.put(
  '/update/:learner_id',
  checkAuth(Role.Learner),
  multerUpload.single('profile_photo'),
  validateRequest(LearnerValidation.updateLearnerZodSchema),
  LearnerController.updateLearner,
);
router.delete(
  '/delete/:learner_id',
  checkAuth(Role.Learner, Role.Admin, Role.Super_admin),
  LearnerController.deleteLearner,
);

export const LearnerRoutes = router;
