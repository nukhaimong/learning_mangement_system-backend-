import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth.js';
import { Role } from '../../../generated/prisma/enums.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { ModuleValidation } from './module.validation.js';
import { ModuleController } from './module.controller.js';

const router = Router();
router.get(
  '/:course_id',
  checkAuth(Role.Instructor),
  ModuleController.getModulesByCourseId,
);

router.post(
  '/',
  checkAuth(Role.Instructor),
  validateRequest(ModuleValidation.createModuleSchema),
  ModuleController.createModule,
);
router.post(
  '/:module_id',
  checkAuth(Role.Instructor),
  validateRequest(ModuleValidation.insertModuleSchema),
  ModuleController.insertModule,
);

router.put(
  '/update/:module_id',
  checkAuth(Role.Instructor),
  validateRequest(ModuleValidation.updateModuleSchema),
  ModuleController.updateModule,
);

router.delete(
  '/delete/:module_id',
  checkAuth(Role.Instructor),
  ModuleController.deleteModule,
);

export const ModuleRoutes = router;
