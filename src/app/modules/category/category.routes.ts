import { Router } from 'express';
import { CategoryController } from './category.controller.js';
import { checkAuth } from '../../middleware/checkAuth.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { CategoryValidation } from './category.validation.js';
import { Role } from '../../../generated/prisma/enums.js';

const router = Router();

router.get('/', CategoryController.getAllCategory);
router.get(
  '/:category_id',
  checkAuth(Role.Super_admin, Role.Admin),
  CategoryController.getCategoryById,
);
router.post(
  '/',
  checkAuth(Role.Super_admin, Role.Admin),
  validateRequest(CategoryValidation.createCategorySchema),
  CategoryController.createCategory,
);
router.put(
  '/update/:category_id',
  checkAuth(Role.Super_admin, Role.Admin),
  validateRequest(CategoryValidation.updateCategorySchema),
  CategoryController.updateCategory,
);
router.delete(
  '/delete/:category_id',
  checkAuth(Role.Super_admin, Role.Admin),
  CategoryController.deleteCategory,
);
export const CategoryRoutes = router;
