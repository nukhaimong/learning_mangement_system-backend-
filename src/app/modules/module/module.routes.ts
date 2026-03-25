import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/enums';
import { validateRequest } from '../../middleware/validateRequest';
import { ModuleValidation } from './module.validation';
import { ModuleController } from './module.controller';

const router = Router();

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
