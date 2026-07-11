# ReFleek — Run & Deploy

ReFleek is migrating to a Vite/React frontend with a Convex domain backend.
The legacy single-page workflow remains available until frontend parity is
complete.

## New stack

```text
Vite + React
  → Convex catalog queries and deterministic production calculation
  → Convex hybrid recommendation action
    → Vercel AI Gateway → openai/gpt-5.4
    → deterministic fallback on missing credentials or any AI failure
```

### Local development

```bash
npm install
cp .env.example .env.local
npx convex dev
npm run dev
```

Set the development URL printed by Convex as `VITE_CONVEX_URL` in
`.env.local`. In another terminal, seed the catalog once:

```bash
npx convex run seed:seedCatalogData
```

The seed is internal and idempotent: it inserts missing slugs and updates
existing catalog rows. It does not expose an unauthenticated write API.

For optional AI recommendations, set `AI_GATEWAY_API_KEY` in the Convex
environment. Convex actions do not run inside Vercel, so Vercel project
variables are not automatically available to them. `VERCEL_OIDC_TOKEN` is only
an optional alternative in a compatible Vercel runtime and should not be
relied on by the Convex action.

### Verification

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

### Production

1. Deploy the Convex backend to the production deployment only after checks
   pass. `npx convex deploy` is production-only; use `npx convex dev` during
   development.
2. Set `AI_GATEWAY_API_KEY` in the production Convex environment.
3. Import the repository in Vercel. `vercel.json` builds the Vite app to
   `dist/` and applies an SPA fallback after filesystem routes.
4. Set the production `VITE_CONVEX_URL` in Vercel and deploy the frontend.

Never put API keys or deployment credentials in repository files.

## Legacy implementation during migration

The existing `UI/ReFleek.dc.html`, `api/generate.js`, and `dev-server.cjs`
remain supported until parity is approved. The Vite multi-page build includes
the legacy UI route, and Vercel continues to detect the legacy serverless API.

```bash
# deterministic mock image mode
node dev-server.cjs

# optional live legacy image generation
OPENROUTER_API_KEY=... node dev-server.cjs
```

The legacy endpoint uses OpenRouter image generation and returns deterministic
mock SVG artwork when `OPENROUTER_API_KEY` is absent. Its material inventory is
built from source data via `npm run build:materials` into `data/materials.json`.

## Craft constraint rules (surface finishes)

| Material stream           | Embroidery | Digital print | Laser etching |
| ------------------------- | :--------: | :-----------: | :-----------: |
| Unfinished deadstock      |     ✅     |      ✅       |      ✅       |
| Upcycled reclaimed fabric |     ✅     |   ✕ blocked   |      ✅       |

Selecting an upcycled material auto-removes digital print and shows the reason;
the print chip stays visible but locked in the Technique node.

## Legacy demo path

Product → Material → Technique (print locks/unlocks by material) → Pattern
(Generate solid embroidery artwork) → **Colours** (thread separation, max 4)
→ Layout → Render (Generate AI render) → Tech Pack
(Export PDF + SVG + JSON, ~2 MB with images embedded) → Producer.

### Embroidery export (Custex-style)

When surface finish is **embroidery**, the tech pack export includes:

- `ReFleek-TechPack-TP001.pdf` — production brief
- `ReFleek-TechPack-TP001-embroidery.svg` — solid colour-separated vector for digitizing
- `ReFleek-TechPack-TP001.json` — thread palette, layout, and producer metadata
