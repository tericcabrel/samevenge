import { saveAs } from 'file-saver';

export const downloadJsonFile = (data: any, filename: string): void => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, `${filename}.json`);
  } catch (error) {
    console.error('Failed to download file:', error);
    throw new Error('Failed to download file');
  }
};

export const downloadTextFile = (content: string, filename: string, extension = 'txt'): void => {
  try {
    const blob = new Blob([content], { type: 'text/plain' });
    saveAs(blob, `${filename}.${extension}`);
  } catch (error) {
    console.error('Failed to download file:', error);
    throw new Error('Failed to download file');
  }
};
