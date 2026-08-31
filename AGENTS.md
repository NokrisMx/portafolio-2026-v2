# AGENTS.md

Angular 22 portfolio app (standalone, zoneless) styled with Tailwind CSS v4 and tested
with Vitest. Portfolio content is fetched from an external mock API documented in
`design/`.

## Commands

- Use npm only (`packageManager: npm@11.19.0`); no yarn/pnpm.
- `npm start` — dev server at http://localhost:4200
- `npm run build` — production build by default; also the de-facto typecheck since
  there is no lint or tsc script
- `npm run watch` — development build in watch mode
- `ng test --watch=false` — one-shot test run. Plain `ng test` stays in watch mode
  in a TTY. Single file: `ng test --include src/app/app.spec.ts`. Filter suites by
  name: `ng test --filter ^App`
- No ESLint. Format with `npx prettier --write .` (printWidth 100, single quotes,
  Angular template parser for HTML).

## Build budgets (production)

- Initial bundle: warn 500kB / error 1MB
- Component styles: warn 4kB / error 8kB — keep component CSS minimal; prefer
  Tailwind utilities in templates over large `*.css` files.

## Styling

- Tailwind v4, CSS-first config: plugin wired in `.postcssrc.json`, activated by
  `@import 'tailwindcss'` in `src/styles.css`. Do NOT create `tailwind.config.js`
  (v3-style config is not picked up); define theme tokens in an `@theme` block in
  `src/styles.css`.
- Design tokens (colors, typography, spacing, radii, component specs) live in
  `design/DESIGN.md` — follow it for new UI. `design/code.html` is the static HTML
  prototype of the target page.

## Data contract

- `design/portfolio-api.md` documents the external mock API (endpoint, response
  shape, example) and is the source of truth when modeling interfaces/services.
  Field names are Spanish (`nombreCompleto`, `experiencia`, `proyectos`,
  `habilidades`, `educacion`) and the response is a JSON array.

## Static assets

- `public/` is served at the site root (`public/foo.png` → `/foo.png`). API paths
  like `/assets/images/...` therefore go under `public/assets/...` (not `src/assets`).

## Angular conventions

- Angular 22, zoneless (no zone.js dependency): use signals for component state,
  as in `src/app/app.ts`.
- Modern CLI naming: `foo.ts` / `foo.html` / `foo.css` with `styleUrl`/`templateUrl`,
  class names without `Component` suffix, selector prefix `app`.
- Routes in `src/app/app.routes.ts`; app providers in `src/app/app.config.ts`.
- Specs use Vitest globals (`describe`/`it`/`expect` without imports, via
  `tsconfig.spec.json`) and run in jsdom — no browser required.
