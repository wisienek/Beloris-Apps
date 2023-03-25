import { Logger, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUnsupportedMimeException, FileUnsupportedExtensionException } from '../errors';
import { getFileExtension } from '../utils';

export function UploadedFileInterceptor(
  maxFileSize = 80_000_000,
  maxFiles = 1,
  allowedMimeTypes?: string[],
  allowedFileExtensions?: string[],
) {
  return UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: maxFiles,
        fileSize: maxFileSize,
      },
      fileFilter: (request: Request, file: Express.Multer.File, callback) => {
        if (!allowedFileExtensions && !allowedMimeTypes) return callback(null, true);

        if (allowedMimeTypes?.length > 0) {
          const fileTypesPattern = new RegExp(`${allowedMimeTypes.map((type) => `${type}`).join('|')}`);

          if (!fileTypesPattern.test(file.mimetype)) {
            Logger.warn('Unsupported mime type', file.mimetype, file.filename, file.originalname);
            return callback(new FileUnsupportedMimeException(file.mimetype, allowedMimeTypes), false);
          }
        }

        if (allowedFileExtensions?.length > 0) {
          const fileExtensionsPattern = new RegExp(`${allowedFileExtensions.map((ext) => `${ext}`).join('|')}`);
          const extension = getFileExtension(file);

          if (!fileExtensionsPattern.test(extension)) {
            Logger.warn(
              `Unsupported file type: ext=${extension}, name=${file.filename}, originalName=${file.originalname}`,
            );
            return callback(new FileUnsupportedExtensionException(extension, allowedFileExtensions), false);
          }
        }

        return callback(null, true);
      },
    }),
  );
}
