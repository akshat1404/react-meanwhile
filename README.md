# react-meanwhile

Auto-generating loaders for React. `SkeletonWrapper` measures a wrapped
component's real rendered layout and shows a matching shimmer skeleton
while `loading` is true — no hand-drawn skeleton markup to keep in sync
with your real UI.

```tsx
import { SkeletonWrapper } from 'react-meanwhile';
import 'react-meanwhile/styles.css';

<SkeletonWrapper loading={isLoading}>
  <ProfileCard user={user} />
</SkeletonWrapper>;
```

## Monorepo layout

- `packages/react-meanwhile` — the published library (npm: `react-meanwhile`).
- `packages/playground` — a Vite app for manual/visual testing. Not published.

See [CLAUDE.md](./CLAUDE.md) for architecture notes and known gotchas.

## Getting started

```bash
pnpm install
pnpm dev
```

`pnpm dev` runs the library in `tsup --watch` and the playground's
`vite dev` concurrently, so edits to the library show up live in the
playground.

## Other commands

- `pnpm --filter react-meanwhile test` — unit tests for the library.
- `pnpm --filter react-meanwhile build` — production build (ESM + CJS + `.d.ts`).
- `pnpm --filter playground dev` — playground only.
