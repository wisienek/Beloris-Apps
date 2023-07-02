import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { debounce, filter, inRange } from 'lodash';
import useFetch from 'react-fetch-hook';
import { DownloaderFileDto, DownloaderProgressDto, VersionDto } from '@bella/dto';
import { ApiRoutes } from '@bella/data';
import { SettingsContext, SettingsContextValue } from '../../settings/settings';
import { ErrorSeverity } from '../single/error-message';
import { ErrorContext } from '../combined/error-box';

export interface IDownloaderContext {
  isDownloading: boolean;
  downloadFiles: (files: Array<DownloaderFileDto>) => void;
  prepareDownloadFiles: () => Promise<DownloaderFileDto[]>;
  downloadingProgress: number;
  preparedFiles: DownloaderFileDto[];
  versionHistory: VersionDto[];
  currentVersion: VersionDto;
  isSameVersion: boolean;
}

export const DownloaderContext = createContext<IDownloaderContext>({
  isDownloading: false,
  downloadFiles: (files) => null,
  prepareDownloadFiles: () => null,
  downloadingProgress: 0,
  preparedFiles: [],
  versionHistory: [],
  currentVersion: null,
  isSameVersion: false,
});

export const DownloaderProvider = ({ children }: { children: ReactNode }) => {
  const { settings } = useContext<SettingsContextValue>(SettingsContext);
  const { addError } = useContext(ErrorContext);

  const { data: versionHistory } = useFetch<VersionDto[]>(ApiRoutes.VERSION_HISTORY);
  const { data: currentVersion } = useFetch<VersionDto>(ApiRoutes.VERSION);

  const [preparedFiles, setPreparedFiles] = useState<DownloaderFileDto[]>([]);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadingProgress, setDownloadingProgress] = useState<number>(0);

  const isSameVersion = useMemo<boolean>(() => {
    if (!settings?.version?.currentVersion || !currentVersion) return false;

    return (
      settings.version.currentVersion.minor === currentVersion.minor &&
      settings.version.currentVersion.major === currentVersion.major
    );
  }, [settings?.version?.currentVersion, currentVersion]);

  const prepareDownloadFiles = async (): Promise<DownloaderFileDto[]> => {
    if (!versionHistory || !currentVersion || !settings) {
      console.error(`No version history: ${!versionHistory}, current: ${!currentVersion} or settings: ${!settings}`);
      return null;
    }
    if (preparedFiles.length > 0) return preparedFiles;

    console.log(`All versions`, versionHistory);

    const filteredVersions = filter(versionHistory, (version) => {
      if (version.major !== currentVersion.major) return version.major === settings.version.currentVersion.major;

      return inRange(version.minor, settings.version.currentVersion.minor, currentVersion.minor + 1);
    });

    console.log(`filtered history`, filteredVersions);

    const files = await window.api.files.prepareDownloadFiles(filteredVersions);
    setPreparedFiles(files);

    return files;
  };

  const downloadFiles = (files: Array<DownloaderFileDto>) => {
    setIsDownloading(true);

    window.api.files
      .downloadFiles(files, currentVersion)
      .then((res) => {
        console.log(`Finished downloading files!`);
      })
      .catch((error) => {
        addError(ErrorSeverity.ERROR, error.message, false, null, `Błąd przy pobieraniu plików!`);
      })
      .finally(() => {
        setIsDownloading(false);
        setDownloadingProgress(0);
      });
  };

  const onDownloadProgress = debounce((progressed: DownloaderProgressDto) => {
    setDownloadingProgress((prev) => progressed.totalProgress);
  }, 15);

  useEffect(() => {
    prepareDownloadFiles();
    window.api.files.downloadFilesListener((data) => onDownloadProgress(data));
  }, [versionHistory, currentVersion, settings]);

  return (
    <DownloaderContext.Provider
      value={{
        isDownloading,
        downloadFiles,
        prepareDownloadFiles,
        downloadingProgress,
        preparedFiles,
        versionHistory,
        currentVersion,
        isSameVersion,
      }}>
      {children}
    </DownloaderContext.Provider>
  );
};
