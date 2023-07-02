export const getObjectWithoutProperties = <T>(obj: T, keys: Array<keyof T>) => {
  const target: Partial<T> = {};

  for (const i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};
