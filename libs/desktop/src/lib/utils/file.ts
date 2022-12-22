export const getPackagePath = (modpackFolder: string, major: string | number) =>
  `${modpackFolder}/${getPackageName(major)}`;

export const getPackageName = (major: string | number) =>
  `beloris_${major}.tar.gz`;
