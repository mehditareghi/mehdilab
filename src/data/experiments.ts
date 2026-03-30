export type Experiment = {
  slug: string
  title: string
  summary: string
  tags: string[]
  status: 'live' | 'wip'
}

export const experiments: Experiment[] = [
  {
    slug: 'scroll-choreography',
    title: 'Scroll choreography',
    summary:
      'Scroll-linked parallax, tilt, and scale in one timeline — tune depth and copy the Motion pattern for heroes and product stories.',
    tags: ['motion', 'scroll', 'layout'],
    status: 'live',
  },
  {
    slug: 'glass-spotlight',
    title: 'Glass spotlight',
    summary:
      'Glassmorphism panel with a cursor-driven light pass — quick feel of depth.',
    tags: ['CSS', 'motion', 'interaction'],
    status: 'live',
  },
  {
    slug: 'gradient-field',
    title: 'Gradient field',
    summary:
      'Layered radial gradients that drift slowly — ambient hero energy without WebGL.',
    tags: ['motion', 'layout'],
    status: 'live',
  },
  {
    slug: 'cursor-distortion',
    title: 'Cursor distortion',
    summary:
      'WebGL2 fragment displacement: ripples and refraction-like UV push around the pointer, boosted by smoothed velocity.',
    tags: ['WebGL', 'shader', 'interaction'],
    status: 'live',
  },
]

export function getExperiment(slug: string) {
  return experiments.find((e) => e.slug === slug)
}
