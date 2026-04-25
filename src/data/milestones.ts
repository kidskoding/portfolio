export interface Milestone {
  hash: string;
  type: string;
  msg: string;
  date: string;
  tag?: string;
}

export const milestones: Milestone[] = [
  {
    hash: 'a7f3d2e',
    type: 'feat(career)',
    msg: 'accepted T-Mobile SWE Intern offer',
    date: 'May 2026',
    tag: 'HEAD',
  },
  {
    hash: 'b9c1e45',
    type: 'feat(ambassador)',
    msg: 'joined Microsoft Student Ambassador program',
    date: 'Apr 2026',
  },
  {
    hash: 'c4d8f12',
    type: 'feat(oss)',
    msg: 'contributing to Microsoft open source - Rust & automation',
    date: 'Mar 2026',
  },
  {
    hash: 'd2a9b67',
    type: 'feat(clubs)',
    msg: 'member of technical staff - agentic AI @ UIUC',
    date: 'Feb 2026',
  },
  {
    hash: 'e5c3f89',
    type: 'feat(career)',
    msg: 'interned at sapience - google cloud AI & data',
    date: 'Jun 2025',
  },
  {
    hash: 'f1b7e34',
    type: 'feat(clubs)',
    msg: 'joined Illini VEX Robotics - AI/ML R&D',
    date: 'Aug 2024',
  },
  {
    hash: '9e4d2c1',
    type: 'chore(edu)',
    msg: 'started CS + Education - learning sciences and learning technology @ UIUC',
    date: 'Aug 2023',
  },
  {
    hash: '3f8a5b6',
    type: 'feat(startup)',
    msg: 'founded KidsKoding - 1,000+ students taught',
    date: 'Sep 2018',
  },
];

export const commitTypeColor: Record<string, string> = {
  'feat(career)':     'var(--color-nvim-orange)',
  'feat(clubs)':      'var(--color-nvim-aqua)',
  'feat(ambassador)': 'var(--color-nvim-blue)',
  'feat(oss)':        'var(--color-nvim-purple)',
  'feat(startup)':    'var(--color-nvim-green)',
  'chore(edu)':       'var(--color-nvim-fg3)',
};
