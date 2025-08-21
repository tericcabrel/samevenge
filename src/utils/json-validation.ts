export type JsonValidationResult = {
  isValid: boolean;
  error?: string;
  formatted?: string;
};

export const validateJson = (jsonString: string): JsonValidationResult => {
  try {
    // Try to parse the JSON
    const parsed = JSON.parse(jsonString);

    // Format it with proper indentation
    const formatted = JSON.stringify(parsed, null, 2);

    return {
      isValid: true,
      formatted,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON',
    };
  }
};

export const formatJson = (jsonString: string): string => {
  const result = validateJson(jsonString);
  return result.formatted || jsonString;
};

export const minifyJson = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed);
  } catch {
    return jsonString;
  }
};
