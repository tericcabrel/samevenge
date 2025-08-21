export const updateObjectByPath = (obj: object, path: string, value: object | string) => {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]!;

    // Handle array notation like "Records[0]"
    if (key.includes('[')) {
      const arrayName = key.split('[')[0]!;
      const index = parseInt(key.split('[')[1]!.split(']')[0]!);

      current = current[arrayName][index];
    } else {
      current = current[key];
    }
  }

  // Set the final property
  const finalKey = keys[keys.length - 1];
  current[finalKey] = value;

  return obj;
};
