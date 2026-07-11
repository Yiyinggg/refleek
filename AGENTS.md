# ReFleek Engineering Guide

## Architecture

- `src/` is the strict-TypeScript Vite/React application.
- `convex/` contains the reactive backend. Public catalog reads and production
  calculations are deterministic; `recommend.hybrid` can enrich a result with
  AI and always has a deterministic fallback.
- `convex/domain/` contains plain TypeScript business logic and catalog data.
  Keep Convex query, mutation, and action wrappers thin.
- `UI/ReFleek.dc.html`, `api/generate.js`, and `dev-server.cjs` are the legacy
  implementation. Preserve them until frontend parity is explicitly complete.

## Commands

- `npm run dev:all` — full dev stack in one tmux window (Convex, Vite, and the
  `/api/generate` proxy); requires `tmux`. Detach with `Ctrl-b d`.
- `npm run dev` — Vite development server
- `npx convex dev` — Convex development sync and generated bindings
- `npx convex run seed:seedCatalogData` — idempotent one-time catalog seed
- `npm run lint` / `npm run typecheck` / `npm test`
- `npm run test:e2e` — Playwright smoke tests
- `npm run build` — production Vite build
- `npm run check` — local lint, types, unit tests, and build
- `npm run format` — Prettier

Use `npx convex dev` for development. `npx convex deploy` is production-only
and must never be used as a development check.

## Environments and deployment

Copy `.env.example` to `.env.local` and set `VITE_CONVEX_URL`. This value is
public browser configuration, not a secret. Set `AI_GATEWAY_API_KEY` in the
Convex environment because actions run on Convex, separately from Vercel.
`VERCEL_OIDC_TOKEN` is optional only in runtimes where Vercel OIDC is actually
available; do not assume it reaches Convex actions.

Vercel builds `dist/` as a Vite SPA and preserves filesystem routes for the
legacy UI and serverless API. Configure production environment variables in
the relevant platform dashboard. Never commit keys, tokens, `.env.local`, or
deployment credentials.

## Code standards

- Keep TypeScript strict and do not use `any`.
- Every public Convex function needs argument and return validators.
- Await promises, use indexes, avoid query filters, paginate or bound reads,
  and never use current time inside a query.
- Keep code simple but not simplistic: model domain rules explicitly, avoid
  speculative abstractions, and use sparse comments only for non-obvious why.
- Prefer authored CSS that fits the ReFleek visual language over generic UI
  defaults. Preserve semantic HTML, keyboard access, visible focus, useful
  labels, sufficient contrast, and reduced-motion compatibility.
- Add pure-domain tests first for recommendations, craft constraints, costs,
  impact, producer matching, validation, and fallback paths.

The hybrid recommendation action currently has strict input bounds and a
deterministic fallback, but no distributed rate limiter. Add the Convex
ratelimiter component only after its installed-version API is verified; do not
describe input bounds as rate limiting.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
