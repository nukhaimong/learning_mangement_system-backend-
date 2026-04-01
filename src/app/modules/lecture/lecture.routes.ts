import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth.js';
import { Role } from '../../../generated/prisma/enums.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { LectureValidation } from './lecture.validation.js';
import { multerUpload } from '../../../config/multer.config.js';
import { LectureController } from './lecture.controller.js';

const router = Router();

router.get(
  '/:module_id',
  checkAuth(Role.Instructor),
  LectureController.getLecturesByModuleId,
);

router.post(
  '/',
  checkAuth(Role.Instructor),
  multerUpload.single('video_url'),
  validateRequest(LectureValidation.createLectureSchema),
  LectureController.createLecture,
);

router.post(
  '/:lecture_id',
  checkAuth(Role.Instructor),
  multerUpload.single('video_url'),
  validateRequest(LectureValidation.insertLectureSchema),
  LectureController.insertLecture,
);

router.put(
  '/update/:lecture_id',
  checkAuth(Role.Instructor),
  multerUpload.single('video_url'),
  validateRequest(LectureValidation.updateLectureSchema),
  LectureController.updateLecture,
);

router.delete(
  '/delete/:lecture_id',
  checkAuth(Role.Instructor),
  LectureController.deleteLecture,
);

export const LectureRoutes = router;
