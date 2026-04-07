import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinaryUpload } from './cloudinary.config.js';
import AppError from '../app/errorHelpers/appError.js';
import status from 'http-status';
import multer from 'multer';

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split('.').pop()?.toLowerCase();

    if (!extension) {
      throw new AppError(status.BAD_REQUEST, 'File must an extension');
    }

    const fileNameWithoutExtension = originalName
      .split('.')
      .slice(0, -1)
      .join('.')
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9\-]/g, '');

    const uniqueName =
      Math.random().toString(36).substring(2) +
      '_' +
      Date.now() +
      '_' +
      fileNameWithoutExtension;

    let folder = 'others';
    let resource_type = 'auto';

    if (['jpg', 'jpeg', 'png', 'webp'].includes(extension as string)) {
      folder = 'images';
      resource_type = 'image';
    } else if (['mp4', 'mov', 'avi', 'mkv'].includes(extension as string)) {
      folder = 'videos';
      resource_type = 'video';
    } else if (extension === 'pdf') {
      ((folder = 'pdf'), (resource_type = 'raw'));
    }

    return {
      folder: `Learning_management/${folder}`,
      public_id: uniqueName,
      resource_type: resource_type,
    };
  },
});

export const multerUpload = multer({ storage });
