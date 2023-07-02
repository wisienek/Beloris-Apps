import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { basename, join, relative, resolve } from 'path';
import { finished as _finished } from 'stream';
import { promisify } from 'util';
import { sortBy } from 'lodash';
import { DownloaderFileDto, DownloaderProgressDto, VersionDto } from '@bella/dto';
import { FileAction, IPCChannels } from '@bella/enums';
import { packerFiles } from '@bella/data';
import { getFileHash } from '@bella/core';
import { readUserSettings, saveUserSettings } from './user-settings';
import { BaseHandler } from './base-handler';
import App from '../app/app';
import { extract } from 'tar';
import { VersionSettings } from '@bella/schema';

const finished = promisify(_finished);

export interface FileMapItem {
  name: string;
  hash: string;
  size: number;
}

export type FileMap = Record<string, FileMapItem>;

export class DownloaderHandler extends BaseHandler {
  private static readonly TempDir = 'updater-temp';

  constructor() {
    super(DownloaderHandler.name);
  }

  async downloadFiles(files: DownloaderFileDto[], latestVersion: VersionDto) {
    const mcFolder = await this.getMcFolder();

    const totalFiles = files.length;
    let completedFiles = 0;
    let totalProgress = 0;

    this.logger.debug(`Will update files: ${JSON.stringify(files, null, 2)} to folder: ${mcFolder}`);

    await Promise.allSettled(
      files.map((fileDto) => {
        const dest = resolve(mcFolder, fileDto.savePath);
        const existsFile = existsSync(dest);

        switch (fileDto.fileAction) {
          case FileAction.DELETE: {
            if (existsFile) {
              unlinkSync(dest);
              this.logger.debug(`Removed file ${dest} because of an update`);
            }

            totalProgress = (completedFiles * 100 + 100 * (1 / totalFiles)) / (completedFiles + 1);
            completedFiles++;

            const responseStreamData = this.prepareDownloadProgressDto(completedFiles, totalProgress, 100, fileDto);

            App.mainWindow.webContents.send(IPCChannels.DOWNLOAD_PROGRESS, responseStreamData);

            return Promise.resolve();
          }
          default:
          case FileAction.MODIFY:
          case FileAction.DOWNLOAD: {
            if (existsFile) {
              const buffer = readFileSync(dest);
              const originHash = getFileHash(buffer);
              const sameHash = originHash === fileDto?.hash;

              if (sameHash) {
                this.logger.debug(
                  `File with action: ${fileDto.fileAction} with dest: ${dest} has the same hash: ${fileDto.hash}, will skip download`
                );
                return Promise.resolve();
              }

              this.logger.debug(
                `File with action: ${fileDto.fileAction} with dest: ${dest} has different hashes, will modify, onDisk:${originHash} onCloud:${fileDto.hash}`
              );

              unlinkSync(dest);
            }

            const file = createWriteStream(dest);

            return this.axiosInstance
              .request({
                method: 'get',
                url: fileDto.downloadPath,
                responseType: 'stream',
              })
              .then((response) => {
                const totalSize = parseInt(response.headers['content-length'] as string, 10);
                let downloadedSize = 0;

                response.data.on('data', (chunk) => {
                  downloadedSize += chunk.length;
                  const fileProgress = (downloadedSize / totalSize) * 100;
                  totalProgress = (completedFiles * 100 + fileProgress * (1 / totalFiles)) / (completedFiles + 1);
                  // this.logger.debug(`Update progress for ${fileDto.name}: ${fileProgress}, ${totalProgress}`);

                  const responseStreamData = this.prepareDownloadProgressDto(
                    completedFiles,
                    totalProgress,
                    fileProgress,
                    fileDto
                  );

                  App.mainWindow.webContents.send(IPCChannels.DOWNLOAD_PROGRESS, responseStreamData);
                });

                response.data.pipe(file);

                return finished(file);
              })
              .catch((error) => {
                this.logger.error(`Error downloading file: ${fileDto.downloadPath}`, error);
                throw error;
              })
              .finally(() => {
                completedFiles++;
                this.logger.debug(`Completed downloading file ${fileDto.name} -> ${dest}`);

                if (fileDto.isPrimaryBundle) {
                  extract({
                    file: dest,
                    cwd: mcFolder,
                    sync: true,
                  });

                  this.logger.debug(`Extracted files!`);

                  unlinkSync(dest);
                }
              });
          }
        }
      })
    );

    return this.saveCurrentVersion(latestVersion);
  }

  async saveCurrentVersion(version: VersionDto) {
    const { data: settings } = await readUserSettings();

    const newVersion: VersionSettings = {
      downloadedDate: new Date().toISOString(),
      currentVersion: {
        major: version.major,
        minor: version.minor,
        isCurrent: true,
        createdAt: typeof version.createdAt === 'string' ? version.createdAt : version.createdAt.toISOString(),
        updatedAt: typeof version.updatedAt === 'string' ? version.updatedAt : version.updatedAt.toISOString(),
      },
      omittedFilesUUIDS: [],
    };

    await saveUserSettings({
      ...settings,
      version: newVersion,
    });
  }

  private prepareDownloadProgressDto(
    completedFiles: number,
    totalProgress: number,
    fileProgress: number,
    file: DownloaderFileDto
  ): DownloaderProgressDto {
    return {
      completedFiles,
      totalProgress,
      fileProgress,
      file,
    };
  }

  async prepareFilesToDownload(versions: VersionDto[]): Promise<DownloaderFileDto[]> {
    const sortedVersions = sortBy(versions, [(version) => version.major, (version) => version.minor]);

    const fileMap = await this.mapCurrentFiles();
    let toDownload: DownloaderFileDto[] = [];

    for (const version of sortedVersions) {
      for (const file of version.files) {
        const existingFile = fileMap[file.savePath];
        const lastRecordOnFile = toDownload.find((i) => i.savePath === file.savePath);

        if (!existingFile) {
          if (file.fileAction !== FileAction.DELETE) {
            if (lastRecordOnFile) toDownload = toDownload.filter((item) => item.savePath !== file.savePath);

            toDownload.push(file);
          }

          continue;
        }

        if (existingFile.hash !== file.hash || existingFile.size !== file.fileSize) {
          if (lastRecordOnFile) toDownload = toDownload.filter((item) => item.savePath !== file.savePath);

          toDownload.push({ ...file, fileAction: FileAction.MODIFY });

          continue;
        }

        if (!lastRecordOnFile) {
          toDownload.push(file);
        }
      }
    }

    return toDownload;
  }

  async mapCurrentFiles(): Promise<FileMap> {
    const mainDir = await this.getMcFolder();

    const readDirectory = readdirSync(mainDir);
    const existingFiles = readDirectory.filter((f) => packerFiles.includes(f));

    const fileMap: FileMap = {};

    for (const file of existingFiles) {
      const filePath = join(mainDir, file);

      this.traverseFileOrDirectory(filePath, fileMap, mainDir);
    }

    const tempDir = await this.getTempDir();
    writeFileSync(join(tempDir, 'file-map.json'), JSON.stringify(fileMap, null, 2), { encoding: 'utf-8' });

    return fileMap;
  }

  private traverseFileOrDirectory(filePath: string, fileMap: FileMap, mainDir: string): void {
    const fileStats = statSync(filePath);

    if (fileStats.isFile()) {
      const fileContent = readFileSync(filePath);

      const relativePath = relative(mainDir, filePath);
      const fileName = basename(filePath);

      fileMap[fileName] = {
        name: relativePath,
        hash: getFileHash(fileContent),
        size: fileStats.size,
      };
    } else if (fileStats.isDirectory()) {
      const files = readdirSync(filePath);

      for (const file of files) {
        const subPath = join(filePath, file);
        this.traverseFileOrDirectory(subPath, fileMap, mainDir);
      }
    }
  }

  private async getTempDir() {
    const saveLocation = await this.getMcFolder();
    const tempFolder = join(saveLocation, DownloaderHandler.TempDir);

    if (!existsSync(tempFolder)) mkdirSync(tempFolder, { recursive: true });

    return tempFolder;
  }

  private async getMcFolder() {
    const { data: userSettings } = await readUserSettings();

    return userSettings.downloadTo.modpackFolder;
  }
}

export const downloaderHandler = new DownloaderHandler();
