import { sep } from 'path';

export const getPackagePath = (modpackFolder: string, major: string | number) =>
  `${modpackFolder}${sep}${getPackageName(major)}`;

export const getPackageName = (major: string | number) =>
  `beloris_${major}.tar.gz`;
