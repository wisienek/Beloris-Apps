import { extname } from 'path';
import { MulterFile } from '../typings';
import { FileType } from '@bella/shared';

export const getFileExtension = (file: MulterFile | string) => {
  if (typeof file === 'string') return extname(file);
  return extname(file.originalname);
};

export const getBucketDownloadPath = (
  key: string,
  bucket: string,
  awsRegion: string,
) => `https://${bucket}.s3.${awsRegion}.amazonaws.com/${key}`;

export const getBundleKey = (major: number, file: MulterFile) =>
  `versions/${major}/bundle${getFileExtension(file)}`;

export const getFileKey = (
  major: number,
  minor: number,
  file: MulterFile,
  name: string,
) =>
  `versions/${major}/${minor}/${sanitizeName(
    `${name}${getFileExtension(file)}` ?? file.originalname,
  )}`;

export const sanitizeName = (fileName: string) => {
  const ext = getFileExtension(fileName);
  const name = fileName.replace(ext, '').replace(/[^a-zA-Z\d]+/g, '-');

  return `${name}${ext}`;
};

export const determineFileType = (file: MulterFile): FileType => {
  const ext = getFileExtension(file).replace('.', '').replace('_old', '');

  switch (ext) {
    case 'jar':
      return FileType.MOD;
    case '7z':
    case 'tar':
      return FileType.BUNDLE;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'ogg':
    case 'rar':
    case 'zip':
      return FileType.ASSET;

    case 'cfg':
    case 'json':
    case 'toml':
    case 'yaml':
    case 'dat':
      return FileType.CONFIG;

    default:
      return FileType.UNKNOWN;
  }
};
