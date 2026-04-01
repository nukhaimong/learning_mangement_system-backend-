import { Request } from 'express';
import { deleteFileFromCloudinary } from '../../config/cloudinary.config.js';

export const deleteUploadedFilesFromGlobalErrorHanlder = async (
  req: Request,
) => {
  try {
    const filesToDelete: string[] = [];

    if (req.file?.path) {
      filesToDelete.push(req.file?.path);
    } else if (
      req.files &&
      typeof req.files === 'object' &&
      !Array.isArray(req.files)
    ) {
      Object.values(req.files).forEach((fileArray) => {
        if (Array.isArray(fileArray)) {
          fileArray.forEach((file) => {
            filesToDelete.push(file.path);
          });
        }
      });
    } else if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        if (file.path) {
          filesToDelete.push(file.path);
        }
      });
    }

    if (filesToDelete.length > 0) {
      await Promise.all(
        filesToDelete.map((url) => deleteFileFromCloudinary(url)),
      );
    }
  } catch (error) {
    console.error(
      'Error deleting uploaded files from Global Error Handler: ',
      error,
    );
  }
};
