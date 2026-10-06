export type SkillGroup = {
  label: string
  skills: string[]
}

/**
 * Skill constellation. The first group holds the current focus, so its
 * entries read largest and nearest when the camera is on the scene.
 */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: 'Core',
    skills: ['Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', '1D-CNN', 'ConvLSTM'],
  },
  {
    label: 'Applied',
    skills: ['Computer Vision', 'Data Science', 'Signal Processing', 'Time Series'],
  },
  {
    label: 'Engineering',
    skills: ['Python', 'TypeScript', 'React', 'Node.js', 'Laravel', 'SQL', 'Docker', 'Linux', 'Git'],
  },
]