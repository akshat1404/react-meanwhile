# react-meanwhile

Auto-generating loaders for React. The public API is a single component,
`<Meanwhile type="...">`, so every loader type shares one entry point.
**Only `type="skeleton"` is implemented today**: it measures a wrapped
component's real rendered layout and shows matching shimmer skeletons
while `loading` is true. Named `react-meanwhile` (not `react-skeleton`)
because other loader types are planned — see "Loader families" below.

## Monorepo layout

- `packages/react-meanwhile` — the published library. Only this package
  ships to npm.
- `packages/playground` — a Vite React app for manual/visual testing.
  Never published. Depends on `react-meanwhile` via `workspace:*` (pnpm
  symlink) — this is a dev convenience only, not how real consumers use
  the package. Real consumers `npm install react-meanwhile`.
- `packages/examples` — the public demo site (GitHub Pages), with live-
  editable examples. Never published. Also depends on `react-meanwhile`
  via `workspace:*`.

Package manager is **pnpm**. Always use `pnpm`, never `npm`/`yarn`, when
adding dependencies or running scripts — mixing lockfiles breaks the
workspace.

## Commands

- `pnpm dev` — runs the library in `tsup --watch` and the playground's
  `vite dev` concurrently. This is the main loop: edit library source,
  see it live in the playground immediately.
- `pnpm --filter react-meanwhile test` — vitest unit tests for the library.
- `pnpm --filter react-meanwhile build` — production build (ESM + CJS +
  .d.ts via tsup).

## Loader families

Loader types split into two families. Only `type="skeleton"` works today;
spinner, blur, scanner and csv-parser are planned and **do not exist yet**
— don't document or demo them as usable.

- **reveal** (`src/reveal/`) — real children already exist. They are
  mounted once, measured (DOM measurement + caching), then hidden behind a
  matching placeholder while `loading` is true. Implemented: `skeleton`.
  Planned: spinner, progressive blur.
- **progress** (`src/progress/`) — producer-driven types (scanner,
  csv-parser, long-running-query status). There is no real content yet to
  measure, so they involve no measurement and take an explicit progress
  prop instead of `loading`. Planned, not implemented: `src/progress/` is a
  README-only placeholder marking the intended architecture.

## Core architecture

`src/Meanwhile.tsx` is the public entry point: it switches on `type` and
renders the matching internal loader. `MeanwhileProps` is a discriminated
union; a member is added only when a loader type is actually implemented.

The skeleton loader lives in `src/reveal/skeleton/`:

1. `measure.ts` — pure function that walks a rendered DOM subtree and
   produces a shape descriptor: `{ x, y, width, height, type }[]`. Keep
   this side-effect-free and unit-testable in isolation from React.
2. `cache.ts` — in-memory cache of the last successfully measured shape,
   keyed by `cacheKey`. Exists so we don't re-measure (and re-mount) the
   real component every time `loading` flips back to true.
3. `SkeletonLoader.tsx` — internal, not exported from `src/index.ts`.
   Mounts the real children once and keeps them mounted (hidden while
   loading), measures + caches their shape, and renders `ShapeRenderer`
   from the cached descriptor while loading.

## Known gotchas — don't relearn these

- **JSDOM's `getBoundingClientRect` always returns zeros.** It doesn't do
  real layout. Unit tests for `measure.ts` must mock
  `Element.prototype.getBoundingClientRect` with explicit values per test
  case. Real layout verification happens visually in the playground (real
  browser), not in vitest.
- **Measuring means actually mounting the real component once**, which
  can double-fire side effects (data fetches in `useEffect`) on first
  load. This is why `cache.ts` exists — after the first successful
  measurement, we never need to mount-to-measure again for that
  component. The playground's fixture with a render counter exists
  specifically to catch regressions here.
- **`react` and `react-dom` are peerDependencies, never bundled deps** —
  if a change accidentally moves them to `dependencies`, consumers get
  two React copies. Check `packages/react-meanwhile/package.json` if
  bundle size or "invalid hook call" issues come up.
- Before publishing any version, run `npm pack` in
  `packages/react-meanwhile` and install the resulting `.tgz` into a
  scratch app — the pnpm workspace symlink hides `exports`-field and
  ESM/CJS packaging bugs that only show up for real external consumers.

## Conventions

- Public API surface lives only in `src/index.ts` — nothing else in the
  library is importable by consumers. Keep it minimal; it exports
  `Meanwhile` and `MeanwhileProps` (plus the shape types). Individual
  loader components such as `SkeletonLoader` stay internal.
- New loader types get their own subfolder in their family: reveal types
  under `src/reveal/<name>/` (e.g. `src/reveal/spinner/`, following
  `src/reveal/skeleton/`), progress types under `src/progress/<name>/`.
  Wiring one up means adding a member to the `MeanwhileProps` union and a
  case to the switch in `src/Meanwhile.tsx`.