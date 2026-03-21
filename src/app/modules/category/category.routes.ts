import { Router } from 'express';
import { CategoryController } from './category.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/enums';
import { validateRequest } from '../../middleware/validateRequest';
import { CategoryValidation } from './category.validation';

const router = Router();

router.get(
  '/',
  checkAuth(Role.Super_admin, Role.Admin),
  CategoryController.getAllCategory,
);
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
