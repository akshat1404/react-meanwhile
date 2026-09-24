# react-meanwhile

Auto-generating loaders for React. `<Meanwhile type="skeleton">` measures a
wrapped component's real rendered layout and shows a matching shimmer
skeleton while `loading` is true — no hand-drawn skeleton markup to keep in sync
with your real UI.

```tsx
import { Meanwhile } from 'react-meanwhile';
import 'react-meanwhile/styles.css';

<Meanwhile type="skeleton" loading={isLoading}>
  <ProfileCard user={user} />
</Meanwhile>;
```

**Live examples:** https://akshat1404.github.io/react-meanwhile/

More loader types are planned under the same `<Meanwhile type="...">` API.
Only `type="skeleton"` exists today.

## Loaders

`<Meanwhile>` is the single entry point for every loader; `type` selects
which one. `skeleton` is the only type implemented so far. Spinners and
progressive blur are planned, as are producer-driven loaders that take an
explicit progress value instead of `loading` (not built yet).

### `type="skeleton"`

| Prop       | Type         | Description                                                                  |
| ---------- | ------------ | ---------------------------------------------------------------------------- |
| `type`     | `'skeleton'` | Selects the skeleton loader.                                                 |
| `loading`  | `boolean`    | Show the skeleton while `true`, the real content while `false`.              |
| `children` | `ReactNode`  | The real content. It is measured once rendered and stays mounted throughout. |
| `cacheKey` | `string?`    | Identity of the measured shape. Defaults to the child component's name.      |

How it works: the children always stay mounted and are only hidden while
`loading` is true, so their effects (e.g. data fetches) fire once, not on
every loading cycle. Their rendered leaf elements are measured into text
bars, rectangles and circles, cached by `cacheKey`, and drawn as shimmer
shapes in the same positions.

### Examples

The [live site](https://akshat1404.github.io/react-meanwhile/) shows the
skeleton across five structurally different layouts, each with an editable
source you can change and watch the skeleton follow:

| Example         | Shape                                                        |
| --------------- | ------------------------------------------------------------ |
| Profile card    | Rounded avatar (circle) next to stacked text lines.          |
| Data table      | Grid of short text cells at varying widths.                  |
| Chat thread     | Irregular-width bubbles alternating left and right.          |
| Image gallery   | Grid of image tiles, each with a two-line caption.           |
| Dashboard stats | Row of compact widgets, each with an icon, label and value.  |

### Repeated instances need their own `cacheKey`

The default key comes from the child's component name, so every instance
of the same component shares one cached shape. When you wrap the same
component more than once (list items, chat messages, stat boxes), give each
wrapper an explicit key:

```tsx
{messages.map((message) => (
  <Meanwhile
    key={message.id}
    type="skeleton"
    loading={isLoading}
    cacheKey={`chat-message-${message.id}`}
  >
    <ChatMessage message={message} />
  </Meanwhile>
))}
```

### Limitations

- Only leaf elements are drawn. Backgrounds, borders and other container
  styling do not appear in the skeleton.
- Each text element becomes one line-height bar, so multi-line text shows as
  a single bar.
- Content is measured while positioned absolutely, so content that stretches
  to fill its parent may measure narrower. Give it an explicit width.

## Monorepo layout

- `packages/react-meanwhile` — the published library (npm: `react-meanwhile`).
- `packages/examples` — the public demo site, deployed to GitHub Pages.
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
- `pnpm --filter examples dev` — the examples site locally (serves at `/react-meanwhile/`).
- `pnpm --filter examples build` — production build of the examples site.
