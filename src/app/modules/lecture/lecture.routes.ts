import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/enums';
import { validateRequest } from '../../middleware/validateRequest';
import { LectureValidation } from './lecture.validation';
import { multerUpload } from '../../../config/multer.config';
import { LectureController } from './lecture.controller';

const router = Router();

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
