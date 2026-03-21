import fs from "fs";
import path from "path";
import { logInfo, logSuccess } from "../utils/logger.js";
import { PROTECTED_FILES } from "../config/constants.js";

export const writeFiles = (files, outputDir, mode) => {
  for (const [fileName, content] of Object.entries(files)) {
    // normalize: remove leading src/ if AI adds it
    let normalizedFileName = fileName.replace(/^src\//, "");

    const filePath = path.join(outputDir, normalizedFileName);
    const backupPath = `${filePath}.bak`;

    // 🔒 protect core files in update mode
    if (mode === "u" && PROTECTED_FILES.includes(normalizedFileName)) {
      logInfo(`Skipped (protected): ${normalizedFileName}`);
      continue;
    }

    // 🔁 backup existing file before overwrite
    if (mode === "u" && fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, backupPath);
    }

    // 🔥 CRITICAL FIX: ensure directory exists
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });

    // ✍️ write file
    fs.writeFileSync(filePath, content, "utf-8");

    logSuccess(`Updated: ${normalizedFileName}`);
  }
};
