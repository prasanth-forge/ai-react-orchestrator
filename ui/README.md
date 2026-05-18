# Orchestrator Dashboard UI

This is the dashboard UI layer for the **AI React Orchestrator** — a tool that generates and updates React apps from natural language descriptions using GPT-4o-mini.

## Purpose

This UI will provide a browser-based interface for interacting with the orchestrator, replacing the current CLI prompt with a visual dashboard for submitting build/update tasks and viewing generated output.

## Stack

- React 18 + TypeScript
- Vite (dev server + build)

## Getting started

```bash
npm install
npm run dev
```

## Project structure

```
ui/
├── src/
│   ├── App.tsx        # Root component
│   └── main.tsx       # Entry point
├── index.html
├── vite.config.ts
└── tsconfig.json
```

## Relationship to the orchestrator

The orchestrator lives at the repo root (`/index.js`). This UI is intended to communicate with it via an API layer (not yet implemented) rather than the current stdin-based CLI.
