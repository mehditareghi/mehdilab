export type Note = {
  slug: string
  title: string
  excerpt: string
  date: string
  /** Optional body copy for the detail page; otherwise a generic placeholder is shown. */
  paragraphs?: string[]
  /** GitHub-flavored markdown: headings, lists, fenced code, inline `code`. */
  bodyMarkdown?: string
}

export const notes: Note[] = [
  {
    slug: 'appearance-tokens-lab',
    title: 'Implementing appearance: Radix → CSS variables → localStorage',
    excerpt:
      'A frontend-oriented sketch of how to wire accent palettes, shared radius, and type scale through tokens — without rewriting every component.',
    date: '2026-03-25',
    bodyMarkdown: `
## Problem

You want **user-tunable accent**, **one radius knob** that updates every \`rounded-*\` token, and **readable type scale** — without forking your design system or hard-coding \`blue-500\` everywhere.

## Data model

- **Persist** a small JSON blob in \`localStorage\` (here: \`mehdi-lab-prefs\`) with fields like \`accent\`, \`radius\`, \`fontScale\`.
- **Hydrate** on the client: read once in a layout effect and apply to \`document.documentElement\` so SSR HTML can stay neutral and you avoid flash of wrong theme if you later add SSR.

## Mapping accent → tokens

- **Source of truth**: Radix (or similar) **step** variables per hue — e.g. \`--blue-9\`, \`--violet-9\`.
- **Semantic layer**: your app already uses \`--primary\`, \`--ring\`, \`--accent\`, etc. In the effect, **reassign** those to the selected scale:

\`\`\`ts
// Pseudocode: pick a palette id, then map semantic tokens from that Radix scale.
root.style.setProperty('--primary', 'var(--' + accent + '-9)')
\`\`\`

- **Theme vs accent**: keep **light/dark** as \`class\` / \`color-scheme\` on \`html\`. **Accent** only swaps **which** Radix steps back the same semantic names — don’t mix accent changes with toggling the whole dark stylesheet unless that’s intentional.

## Radius as one multiplier

- Define **base** \`--radius\` in CSS (e.g. \`0.625rem\`).
- Expose **derived** tokens: \`--radius-sm\`, \`--radius-md\`, \`--radius-lg\` as \`calc(var(--radius) * …)\` so one **user factor** updates \`--radius\` and everything that references the derived tokens moves together.

## Type scale

- Set \`font-size\` on \`html\` to a **percentage** (e.g. \`100%\` → \`112%\`) so \`rem\`-based layouts scale without touching every component.

## Selection highlight

- Keep text selection aligned with the chosen accent by deriving it from \`--primary\`:

\`\`\`css
::selection {
  background: color-mix(in oklab, var(--primary) 35%, transparent);
  color: var(--foreground);
}
\`\`\`

## Pitfalls

- **FOUC**: if prefs are client-only, expect a frame of default theme before hydration; optional inline script in \`index.html\` can read \`localStorage\` before React if you need zero flash.
- **Contrast**: not every Radix accent pair passes AA against your fixed \`primary-foreground\`; either derive foreground from the scale or validate pairs.
- **New UI**: always consume **semantic** tokens in components (\`bg-primary\`, \`rounded-[var(--radius-md)]\`) so future palette/radius changes propagate.

\`\`\`tsx
<button className="bg-primary text-primary-foreground rounded-[var(--radius-md)]">
  Save
</button>
\`\`\`
`.trim(),
  },
]
