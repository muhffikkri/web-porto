export const PROFILE = {
  name: 'Muhammad Fikri',
  role: 'Machine Learning Engineer • AI Researcher • Software Engineering',
  channels: [
    { label: 'Email', href: 'mailto:fikri@example.com', external: false },
    { label: 'GitHub', href: 'https://github.com/muhffikkri', external: true },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/muhffikkri', external: true },
  ],
}

export type AboutField = {
  label: string
  value: string
  note: string
  /** Which viewport margin the panel sits in. */
  side: 'left' | 'right'
  /** Offset into the scene, in world units. Negative is deeper. */
  offsetZ: number
  /** Vertical placement as a percentage of the scene height. */
  y: number
}

export const ABOUT: AboutField[] = [
  {
    label: 'Focus',
    value: 'Clinical signal processing',
    note: 'EEG classification with 1D-CNN architectures.',
    side: 'left',
    offsetZ: -7,
    y: 15,
  },
  {
    label: 'Education',
    value: 'Computer Science',
    note: 'Research track, spatiotemporal forecasting.',
    side: 'right',
    offsetZ: 3,
    y: -18,
  },
  {
    label: 'Interests',
    value: 'Time series, vision, MLOps',
    note: 'Anything that has to survive contact with production.',
    side: 'left',
    offsetZ: -13,
    y: 33,
  },
]