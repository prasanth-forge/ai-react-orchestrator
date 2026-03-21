import dotenv from "dotenv";
import readline from "readline";
import { createPrompt, updatePrompt } from "./services/promptService.js";
import { writeFiles } from "./core/fileWriter.js";
import { ensureProject } from "./core/projectManager.js";
import { generateWithRetry } from "./core/aiOrchestrator.js";
import { installDependencies } from "./core/dependencyInstaller.js";
import { logError, logSuccess } from "./utils/logger.js";
import { PROJECT_NAME, SUPPORTED_MODES } from "./config/constants.js";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(`Mode (${SUPPORTED_MODES.join("/")}): `, (mode) => {
  rl.question("What to build? ", async (answer) => {
    try {
      const prompt = mode === "c" ? createPrompt(answer) : updatePrompt(answer);

      const result = await generateWithRetry(prompt);

      const outputDir = `${PROJECT_NAME}/src`;

      const { files, dependencies } = result;

      ensureProject(PROJECT_NAME, mode);
      writeFiles(files, outputDir, mode);
      installDependencies(PROJECT_NAME, dependencies);

      logSuccess("Done");
    } catch (err) {
      logError(`Error: ${err.message}`);
    } finally {
      rl.close();
    }
  });
});
