import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { envVars } from './env';
import AppError from '../app/errorHelpers/appError';
import status from 'http-status';

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_CLOUD_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_CLOUD_API_SECRET,
});

export const cloudinaryUpload = cloudinary;

export const uploadFileCloudinary = async (
  buffer: Buffer,
  fileName: string,
): Promise<UploadApiResponse> => {
  if (!buffer || !fileName) {
    throw new AppError(
      status.BAD_REQUEST,
      'File butter and fileName are required to upload',
    );
  }
  const extension = fileName.split('.').pop()?.toLowerCase();

  if (!extension) {
    throw new AppError(status.BAD_REQUEST, 'File must an extension');
  }

  const fileNameWithoutExtension = fileName
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
  let resource_type: 'auto' | 'image' | 'video' | 'raw' = 'auto';

  if (['jpg', 'jpeg', 'png', 'webp'].includes(extension as string)) {
    folder = 'images';
    resource_type = 'image';
  } else if (['mp4', 'mov', 'avi', 'mkv'].includes(extension as string)) {
    folder = 'videos';
    resource_type = 'video';
  } else if (extension === 'pdf') {
    ((folder = 'pdf'), (resource_type = 'raw'));
  }
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `Learning_management/${folder}`,
          public_id: uniqueName,
          resource_type: resource_type,
        },
        (error, result) => {
          if (error) {
            return reject(
              new AppError(
                status.INTERNAL_SERVER_ERROR,
                'Failed to upload image',
              ),
            );
          }
          resolve(result as UploadApiResponse);
        },
      )
      .end(buffer);
  });
};

export const deleteFileFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;

    const match = url.match(regex);

    if (match && match[1]) {
      const public_id = match[1];

      let resource_type: 'image' | 'video' | 'raw' = 'image';

      if (url.includes('/video/')) {
        resource_type = 'video';
      } else if (url.includes('/raw/')) {
        resource_type = 'raw';
      }

      await cloudinary.uploader.destroy(public_id, {
        resource_type,
      });
      console.log(`File ${public_id} deleted`);
    }
  } catch (error) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to delete image from cloudinary',
    );
  }
};
