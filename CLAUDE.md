# react-meanwhile

Auto-generating loaders for React. v1 ships one primitive:
`SkeletonWrapper`, which measures a wrapped component's real rendered
layout and shows matching shimmer skeletons while `loading` is true.
Named `react-meanwhile` (not `react-skeleton`) because future versions
will add other loader types (spinners, progressive blur) — skeleton is
just the first.

## Monorepo layout

- `packages/react-meanwhile` — the published library. Only this package
  ships to npm.
- `packages/playground` — a Vite React app for manual/visual testing.
  Never published. Depends on `react-meanwhile` via `workspace:*` (pnpm
  symlink) — this is a dev convenience only, not how real consumers use
  the package. Real consumers `npm install react-meanwhile`.

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

## Core architecture

1. `measure.ts` — pure function that walks a rendered DOM subtree and
   produces a shape descriptor: `{ x, y, width, height, type }[]`. Keep
   this side-effect-free and unit-testable in isolation from React.
2. `cache.ts` — in-memory cache of the last successfully measured shape,
   keyed by component identity. Exists so we don't re-measure (and
   re-mount) the real component every time `loading` flips back to true.
3. `SkeletonWrapper.tsx` — orchestrates: render real children once to
   measure + cache their shape, then render `ShapeRenderer` from the
   cached descriptor while loading.

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
  library is importable by consumers. Keep it minimal; v1 exports just
  `SkeletonWrapper` (and its prop types).
- New loader types (future) get their own subfolder under `src/` (e.g.
  `src/spinner/`), following the same pattern as `src/skeleton/`.