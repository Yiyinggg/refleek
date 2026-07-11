# Claude Instructions

Follow `AGENTS.md` as the repository source of truth.

Work in small, verified changes. Keep UI, backend wrappers, and pure domain
logic separated. Use test-first development for behavior, run the relevant
checks before reporting completion, and do not weaken strict TypeScript or
Convex validators to make a check pass.

Do not delete or rewrite the legacy UI/API stack until migration parity is
approved. Do not commit secrets. During development use `npx convex dev`, never
the production-only `npx convex deploy`.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
