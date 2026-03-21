import { execSync } from "child_process";
import fs from "fs";
import { logInfo } from "../utils/logger.js";

export const ensureProject = (projectName, mode) => {
  if (mode === "c") {
    fs.rmSync(projectName, { recursive: true, force: true });
  }

  if (!fs.existsSync(projectName)) {
    logInfo("Creating project...");

    execSync(
      `printf "n\n" | npm_config_yes=true npx create-vite@latest ${projectName} --template react`,
      {
        stdio: "inherit",
        shell: true,
      },
    );

    execSync(`cd ${projectName} && npm install`, {
      stdio: "inherit",
      shell: true,
    });
  }
};
