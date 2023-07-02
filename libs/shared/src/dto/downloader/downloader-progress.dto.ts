import { DownloaderFileDto } from '../uploader';

export class DownloaderProgressDto {
  completedFiles: number;
  totalProgress: number;
  fileProgress: number;
  file: DownloaderFileDto;
}
