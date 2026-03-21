# AI React Orchestrator 🚀

An AI-powered CLI tool that generates and incrementally updates React applications using natural language prompts — backed by strict validation, retry mechanisms, and dependency management.

---

## 🔥 Features

- Generate React apps from natural language
- Incrementally update existing applications
- Schema-based validation for AI outputs
- Self-healing retry mechanism
- Automatic dependency installation
- Safe file operations
- Modular architecture
- Enforces modern React patterns (React 18)

---

## 🧠 Core Idea

AI is probabilistic. Software systems are deterministic.

This project wraps AI with guardrails:

- Define strict output contracts
- Validate every response
- Retry on failure
- Apply only safe outputs

---

## 🏗 Architecture

User Input → Prompt Service → AI Orchestrator → Validator → File Writer → Dependency Manager

---

## 📁 Project Structure

ai-react-orchestrator/

- core/
- services/
- utils/
- config/
- index.js
- package.json
- README.md

---

## 🚀 Usage

Run:
node index.js

Example:

Mode (c/u): c  
What to build? Login form with email and password

Mode (c/u): u  
What to build? Add remember me checkbox

Mode (c/u): u  
What to build? Add sign up feature

---

## 📦 Example Workflow

1. Create login form
2. Add Remember Me
3. Add Sign Up

Ensures:

- Valid
- Non-breaking
- Incremental

---

## ⚠️ Challenges Solved

- Handling inconsistent AI responses
- Enforcing strict schema
- Preventing invalid React patterns
- Managing dependencies
- Safe file writing
- Retry-based correction

---

## 🧩 Tech Stack

- Node.js
- OpenAI API
- React (Vite)

---

## 💡 Future Improvements

- AST-based updates
- Better dependency management
- Multi-framework support
- UI layer

---

## 🎯 Why This Project Matters

Transforms AI from probabilistic outputs into deterministic engineering workflows.

---

## 👨‍💻 Author

Built as part of hands-on exploration into AI-assisted software engineering.
