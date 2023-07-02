export enum IPCChannels {
  // default
  GET_DOWNLOAD_VERSION = 'get-download-version',
  SET_DOWNLOAD_VERSION = 'set-download-version',
  GET_APP_VERSION = 'get-app-version',
  // settings
  GET_USER_SETTINGS = 'get-user-settings',
  SAVE_USER_SETTINGS = 'save-user-settings',
  SETTINGS_UPDATED = 'settings-updated',
  // links
  OPEN_FILE_DIALOG = 'open-file-dialog',
  OPEN_EXTERNAL_LINK = 'open-external-link',
  OPEN_LOGIN_LINK = 'open-login-link',
  // session
  GET_SESSION = 'get-session',
  SET_SESSION = 'set-session',
  LOGOUT = 'logout',
  // files
  LIST_DOWNLOADER_FILES = 'list-downloader-files',
  BUILD_PACKAGE = 'build-package',
  // upload files
  UPLOAD_PACKAGE = 'upload-package',
  UPLOAD_FILES = 'upload-files',
  UPLOAD_PROGRESS = 'upload-progress',
  // download files
  DOWNLOAD_PROGRESS = 'download-progress',
  DOWNLOAD_FILES = 'download-files',
  DOWNLOAD_PREPARE_FILES = 'download-prepare-files',
  // Windows
  NOTIFICATION = 'notification',
}
