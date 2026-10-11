export type Milestone = {
  id: string
  period: string
  role: string
  org: string
  detail: string
  /** Lateral placement, as a percentage of the viewport width. */
  x: number
  /** Vertical placement, as a percentage of the viewport height. */
  y: number
}

/**
 * World units between milestones. The experience scene holds for the whole
 * sequence so each milestone gets read on its own, and a wider gap is what
 * buys that scene its screen time.
 */
export const MILESTONE_GAP = 20

/**
 * Spatial milestones. Each sits at its own z inside the Experience scene, so
 * the camera passes them one at a time down the corridor.
 */
export const MILESTONES: Milestone[] = [
  {
    id: 'm1',
    period: '2023 — present',
    role: 'Machine Learning Engineer',
    org: 'Clinical signal research',
    detail: 'Seizure detection from EEG with 1D-CNN architectures.',
    x: -28,
    y: 8,
  },
  {
    id: 'm2',
    period: '2022 — 2023',
    role: 'Research Assistant',
    org: 'Spatiotemporal forecasting lab',
    detail: 'ConvLSTM models for spatial and temporal prediction.',
    x: 26,
    y: -12,
  },
  {
    id: 'm3',
    period: '2021 — 2022',
    role: 'Software Engineer',
    org: 'Data platform team',
    detail: 'Training pipelines, evaluation harnesses, deployment.',
    x: -22,
    y: 20,
  },
]