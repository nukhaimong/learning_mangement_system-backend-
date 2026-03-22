import { Level } from '../../../generated/prisma/enums';

export interface ICreateCoursePayload {
  title: string;
  description: string;
  thumbnail: string;
  intro_video: string;
  course_fee: number;
  isFree?: boolean;
  level: Level;
  isPublished?: boolean;
  category_id: string;
}
