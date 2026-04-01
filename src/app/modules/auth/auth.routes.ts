import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { checkAuth } from '../../middleware/checkAuth.js';
import { Role } from '../../../generated/prisma/enums.js';

const router = Router();

router.get(
  '/get-me',
  checkAuth(Role.Learner, Role.Instructor, Role.Admin, Role.Super_admin),
  AuthController.getMe,
);
router.get('/login/google', AuthController.googleLogin);
router.get('/google/success', AuthController.googleLoginSuccess);
router.put('/update-role', AuthController.updateRole);
router.post('/registration', AuthController.registration);
router.post('/login', AuthController.login);
router.post('/verify-email', AuthController.verifyEmail);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

export const AuthRoutes = router;
