export const validateResponse = ({ files }) => {
  if (typeof files !== "object" || Array.isArray(files)) {
    throw new Error("Response must be an object");
  }

  const keys = Object.keys(files);

  if (keys.includes("fileName") || keys.includes("fileContent")) {
    throw new Error("Invalid format: fileName/fileContent pattern not allowed");
  }

  for (const [file, content] of Object.entries(files)) {
    if (typeof content !== "string") {
      throw new Error("Invalid file name");
    }

    if (typeof content !== "string") {
      throw new Error(`Invalid congtent for ${file}`);
    }

    if (content.includes("ReactDOM.render")) {
      throw new Error("ReactDOM.render is not allowed. Use createRoot.");
    }

    if (content.includes('from "react-dom"')) {
      throw new Error('Use "react-dom/client" instead of "react-dom"');
    }

    if (file.includes("src/")) {
      throw new Error(`File path must not include src/: ${file}`);
    }
  }

  return true;
};
