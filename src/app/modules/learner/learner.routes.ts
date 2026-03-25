import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/enums';
import { LearnerController } from './learner.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { LearnerValidation } from './learner.validation';
import { multerUpload } from '../../../config/multer.config';

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
