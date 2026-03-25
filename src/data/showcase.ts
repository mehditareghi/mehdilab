export type ShowcaseItem = {
  title: string
  description: string
  stack: string[]
  highlight: string
}

export const showcaseItems: ShowcaseItem[] = [
  {
    title: 'This site',
    description:
      'A playground for interactive experiments, readable notes, and curated highlights — built to browse, not just to look at.',
    stack: ['Vite', 'React', 'Tailwind v4', 'Motion', 'Radix colors'],
    highlight:
      'Experiments are first-class pages; polish shows up where you click and scroll.',
  },
  // {
  //   title: 'Your next case study',
  //   description:
  //     'Swap this card for a shipped product or concept: a short story, the stack, what was hard, and a link or embed visitors can try.',
  //   stack: ['Your stack'],
  //   highlight:
  //     'Use this slot for work you want strangers to remember after they leave.',
  // },
]
