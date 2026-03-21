import { execSync } from "child_process";
import { logInstallation, logWarning } from "../utils/logger.js";

export const installDependencies = (projectName, deps) => {
  if (!deps || deps.length === 0) {
    logWarning("No dependencies returned by AI");
  }

  const depList = deps.join(" ");

  logInstallation(`Installing: ${depList}`);

  execSync(`cd ${projectName} && npm install ${depList}`, {
    stdio: "inherit",
    shell: true,
  });
};
