# AI Harness Lab

AI Harness Lab is the interactive systems manual in the wider AI Knowledge Hub
ecosystem, focused on how reliable AI is engineered inside marketing systems.
It is designed for builders, experimenters, and learners who want to understand
deterministic algorithms, data structures, orchestration patterns, memory
strategies, permissions, and practical harness design for campaigns, content,
analytics, reporting, and martech operations.

The site is marketing-first by design, but the underlying engineering patterns
remain portable to adjacent AI products and operational systems.

It complements:

- [AI News Hub](https://ai-news-hub.performics-labs.com/) for editorial analysis on AI, marketing technology, and applied systems change
- [AI Skills Guide](https://skills.ai-knowledge-hub.org/) for the implementation catalogue of skills, tools, MCP, and plugins

This app currently includes the `Algorithms` module, based on the Performics
Labs article "The Deterministic Core: Algorithms and Data Structures That Make
Marketing Agents Fast, Safe, and Scalable."

## Local development

Install dependencies:

```sh
pnpm install
```

Run the Vite dev server:

```sh
pnpm dev 
```

Build for production:

```sh
pnpm build
```

## Tests

Run the unit and component test suite:

```sh
pnpm test:run
```

Run browser smoke tests:

```sh
pnpm test:e2e
```

Run the standard verification stack:

```sh
pnpm check
```

## Structure

- `/` — AI Harness Lab homepage and positioning
- `/algorithms` — interactive deterministic core visualizer built around marketing AI workloads
- `/patterns` — planned module for memory, permissions, orchestration, and control in marketing AI systems
- `/examples` — planned case-study library for reporting, content, campaign, and analytics systems

## Deployment

The project is set up as a Vite single-page app and can be deployed to Vercel.
`vercel.json` keeps direct route access working.
