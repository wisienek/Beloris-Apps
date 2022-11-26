export const fileSizeFormat = (rawSizeBytes: number, decimals = 2) => {
  if (!+rawSizeBytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(rawSizeBytes) / Math.log(k));

  return `${parseFloat((rawSizeBytes / Math.pow(k, i)).toFixed(dm))} ${
    sizes[i]
  }`;
};
