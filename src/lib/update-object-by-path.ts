export const updateObjectByPath = (obj: object, path: string, value: object | string) => {
  const keys = path.split('.');
  let current: Record<string, any> = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]!;

    // Handle array notation like "Records[0]"
    if (key.includes('[')) {
      const arrayKeys = key.split('['); // ['Records', '0]']
      const arrayName = arrayKeys[0]!; // 'Records'
      const index = parseInt(arrayKeys[1]!.split(']')[0]!); // 0

      current = current[arrayName][index]; // current['Records'][0]
    } else {
      current = current[key]; // current['whatever']
    }
  }

  const finalKey = keys.at(-1);
  if (!finalKey) {
    throw new Error('Invalid path');
  }

  current[finalKey] = value;

  return obj;
};
