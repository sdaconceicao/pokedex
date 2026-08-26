# Claude Code Instructions

Follow the package-level instructions in `AGENT.md`.

Before making changes to the frontend:

1. Read `AGENT.md`.
2. Read any applicable package-level docs (`docs/NEXTJS.md`, `docs/REACT.md`, `docs/STYLING_CSS_MODULES.md`).
3. Inspect existing implementations before introducing new patterns.

For architectural questions, consult `../../docs/ARCHITECTURE.md`.

Do not treat generated files as source of truth.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
