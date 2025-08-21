import copy from 'copy-to-clipboard';

export const copyToClipboard = (text: string): boolean => {
  return copy(text, {
    format: 'text/plain',
    onCopy: () => {
      // Optional: Add any additional logic after copying
    },
  });
};

export const copyToClipboardWithFeedback = (text: string): boolean => {
  try {
    const success = copyToClipboard(text);
    if (success) {
      // You can add toast notification here later
      console.log('Copied to clipboard');
    }
    return success;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};
