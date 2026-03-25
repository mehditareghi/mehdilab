# Mehdi Lab

**Mehdi Tareghi** · [mehditareghi@gmail.com](mailto:mehditareghi@gmail.com)

Personal site: interactive lab experiments, a small showcase, notes, and an about page. Built as a creative playground with motion, Radix-based theming, and content-driven routes.

## Stack

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **React Router**
- **Motion** (animations)
- **Radix UI** primitives + **@radix-ui/colors** (accent palettes)
- **Shiki** (syntax highlighting in lab code blocks)
- **Geist** / **Geist Mono** (fonts)

## Project layout

| Path | Purpose |
|------|---------|
| `src/pages/` | Route screens (home, lab, experiment detail, showcase, notes, about, …) |
| `src/components/` | Layout, UI primitives, lab helpers, experiments |
| `src/data/` | Site copy, experiments registry, notes, showcase entries (`site.ts` for name, contact, GitHub star widget) |
| `src/lib/` | Preferences (accent, radius, type scale), utilities |
| `src/index.css` | Design tokens, global styles (including `::selection` tied to `--primary`) |

## Scripts

```bash
pnpm dev          # local dev (Vite)
pnpm build        # typecheck + production build
pnpm lint         # ESLint
pnpm preview      # preview production build
pnpm animate-ui:add   # helper for Animate UI registry installs
```

Uses **pnpm** (`packageManager` is pinned in `package.json`).

## Local development

```bash
pnpm install
pnpm dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Configuration

- **Site metadata & GitHub repo** for the header star control: `src/data/site.ts`
- **Accent / corner radius / font scale** (persisted in `localStorage`): appearance menu in the header; implementation in `src/lib/site-preferences.ts`

## License

Private project; all rights reserved unless you add a license file.
