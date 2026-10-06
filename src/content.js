export const profile = {
  firstName: 'Muhammad',
  lastName: 'Fikri',
  role: 'Machine Learning Engineer and AI Researcher',
  focus: 'Clinical signal processing on edge devices, and spatiotemporal forecasting over remote sensing imagery.',
  statement:
    'Two research tracks: clinical signal processing that has to run on a wearable, and spatiotemporal forecasting over coastal imagery.',
  bio: 'I work on machine learning for healthcare and environmental applications. Winner of the Harvard Health Systems Innovation Lab Hackathon, published at ICICoS, and holder of two registered software copyrights for edge AI healthcare systems.',
  ledger: [
    { value: '1st', label: 'Place, Harvard Health Systems Innovation Lab Hackathon' },
    { value: 'ICICoS 2026', label: 'Published research' },
    { value: '2', label: 'Registered software copyrights' },
  ],
}

export const entries = [
  {
    id: 'ecg',
    category: 'Healthcare AI',
    title: 'Edge AI wearable ECG',
    description:
      'Real time arrhythmia detection from a single channel ECG, trained as a 1D-CNN and quantised to run inside a wearable budget.',
    tags: ['Python', 'TensorFlow', '1D-CNN', 'Embedded'],
  },
  {
    id: 'sealvl',
    category: 'Environmental AI',
    title: 'ConvLSTM sea level forecasting',
    description:
      'Spatio-temporal forecasting of coastal sea level extremes from remote sensing imagery, modelled as a ConvLSTM over stacked tiles.',
    tags: ['Python', 'TensorFlow', 'ConvLSTM', 'Remote sensing'],
  },
  {
    id: 'ecg-dash',
    category: 'Full stack',
    title: 'ECG monitoring dashboard',
    description:
      'Live telemetry dashboard for wearable ECG streams, with a Rust ingest service and a TypeScript front end.',
    tags: ['TypeScript', 'React', 'Rust', 'Docker'],
  },
]

export const capabilities = [
  {
    title: 'Machine learning',
    items: ['TensorFlow', 'Deep learning', '1D-CNN', 'ConvLSTM', 'Computer vision'],
  },
  {
    title: 'Development',
    items: ['React', 'TypeScript', 'Node.js', 'Rust', 'Docker'],
  },
  {
    title: 'Tooling',
    items: ['Git', 'MongoDB', 'Nginx', 'Figma', 'VS Code'],
  },
]

export const channels = [
  { label: 'Email', value: 'moehammad.fikr@gmail.com', href: 'mailto:moehammad.fikr@gmail.com' },
  { label: 'LinkedIn', value: 'linkedin.com/in/muhffikkri', href: 'https://linkedin.com/in/muhffikkri/' },
  { label: 'GitHub', value: 'github.com/muhffikkri', href: 'https://github.com/muhffikkri' },
]

export const availability = 'Open to machine learning, AI engineering, and full stack roles.'

export const floatingFragments = [
  { id: 'frag-a', label: 'Healthcare AI' },
  { id: 'frag-b', label: 'Environmental AI' },
  { id: 'frag-c', label: 'Computer vision' },
  { id: 'frag-d', label: 'Edge inference' },
  { id: 'frag-e', label: 'Full stack' },
  { id: 'frag-f', label: 'Research' },
]
