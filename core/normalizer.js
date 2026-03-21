export const normalizeAIResponse = (data) => {
  // Case 1: already correct
  if (typeof data === "object" && !Array.isArray(data)) {
    const values = Object.values(data);

    if (values.every((v) => typeof v === "string")) {
      return data;
    }
  }

  // Case 2: { fileName, fileContent }
  if (data.fileName && data.fileContent) {
    return {
      [data.fileName]: data.fileContent,
    };
  }

  // Case 3: array of files
  if (Array.isArray(data)) {
    const result = {};
    for (const item of data) {
      if (item.fileName && item.fileContent) {
        result[item.fileName] = item.fileContent;
      }
    }
    return result;
  }

  throw new Error("Unsupported AI response format");
};
