export const createPrompt = (answer) => `
You are generating a NEW React 18 (Vite) application.

STRICT RULES:
- Split code into multiple files
- DO NOT combine everything into one file
- Use separate components
- MUST use React 18
- MUST use ReactDOM.createRoot
- MUST import from "react-dom/client"
- DO NOT use ReactDOM.render

Required files:
- App.jsx
- main.jsx
- Additional components as needed (e.g. LoginForm.jsx)

Each file must:
- Be complete and valid
- Have correct imports/exports

Output ONLY JSON:
{
  "files": {
    "App.jsx": "...",
    "LoginForm.jsx": "...",
    "main.jsx": "..."
  },
  "dependencies": ["package-name"]
}

More Rules:
- All values must be strings.
- "files" must contain full valid file contents
- "dependencies" must include ALL external npm packages used
- Do NOT include react or react-dom
- Do NOT include local imports (./...)

Task:
${answer}
`;

export const updatePrompt = (answer) => `
You are modifying an existing React project.

STRICT RULES:
- Return ONLY full file contents
- Each file must be a COMPLETE valid file
- DO NOT return partial structures
- DO NOT return nested objects
- DO NOT include explanations or markdown
- ONLY return JSON
- MUST use React 18
- MUST use ReactDOM.createRoot
- MUST import from "react-dom/client"
- DO NOT use ReactDOM.render

CRITICAL:
- File names MUST NOT include "src/"
- File names MUST be relative to the src folder
- Example:
  "LoginForm.jsx" ✅
  "components/LoginForm.jsx" ✅
  "src/components/LoginForm.jsx" ❌

Output ONLY JSON:
{
  "files": {
    "App.jsx": "...",
    "LoginForm.jsx": "...",
    "main.jsx": "..."
  },
  "dependencies": ["package-name"]
}

More Rules:
- All values must be strings.
- "files" must contain full valid file contents
- "dependencies" must include ALL external npm packages used
- Do NOT include react or react-dom
- Do NOT include local imports (./...)

Task:
${answer}
`;

export const retryPrompt = (originalPrompt, error) => `
Your previous response was INVALID.

Error:
${error}

Fix your response.

STRICT RULES:
- Return ONLY JSON
- Format must be:
{
  "files": {
    "App.jsx": "...",
    "LoginForm.jsx": "...",
    "main.jsx": "..."
  },
  "dependencies": ["package-name"]
}

More Rules:
- All values must be strings.
- "files" must contain full valid file contents
- "dependencies" must include ALL external npm packages used
- Do NOT include react or react-dom
- Do NOT include local imports (./...)
- NO nested objects
- NO "fileName"/"fileContent"
- NO explanations
- All values must be strings

Retry original task:
${originalPrompt}
`;
