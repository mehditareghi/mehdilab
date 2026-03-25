import { createCssVariablesTheme } from 'shiki/core'

/** Shiki theme whose colors are CSS variables — set on `.code-block-shiki` in `index.css`. */
export const mehdiCodeTheme = createCssVariablesTheme({
  name: 'mehdi-code',
  fontStyle: true,
})
