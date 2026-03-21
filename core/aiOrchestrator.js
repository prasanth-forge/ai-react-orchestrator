import { generateCode } from "../services/aiService.js";
import { retryPrompt } from "../services/promptService.js";
import { logError, logStep } from "../utils/logger.js";
import { validateResponse } from "./validator.js";

export const generateWithRetry = async (initialPrompt, retries = 2) => {
  let prompt = initialPrompt;

  for (let attempt = 0; attempt <= retries; attempt++) {
    logStep(`Attempt ${attempt + 1}`);
    const raw = await generateCode(prompt);

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      if (attempt === retries) {
        throw new Error("Invalid JSON from AI");
      }

      prompt = retryPrompt(prompt, "Response was not valid JSON");
      continue;
    }

    try {
      validateResponse(parsed);
      return parsed;
    } catch (err) {
      logError(`Attempt ${attempt + 1} failed: ${err.message}`);

      if (attempt === retries) throw err;

      prompt = retryPrompt(prompt, err.message);
    }
  }
};
