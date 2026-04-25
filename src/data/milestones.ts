export interface Milestone {
  type: string;
  msg: string;
  date: string;
  tag?: string;
}

export const milestones: Milestone[] = [
  {
    type: 'feat(career)',
    msg: 'joining T-Mobile as SWE',
    date: 'May 2025',
    tag: 'HEAD',
  },
  {
    type: 'feat(research)',
    msg: 'member of technical staff - agentic AI @ UIUC',
    date: 'Jan 2025',
  },
  {
    type: 'feat(startup)',
    msg: 'founded KidsKoding - 1,000+ students taught',
    date: '2022',
  },
  {
    type: 'chore(edu)',
    msg: 'started CS + Education @ UIUC',
    date: 'Aug 2023',
  },
];

export const commitTypeColor: Record<string, string> = {
  'feat(career)': 'var(--color-nvim-orange)',
  'feat(research)': 'var(--color-nvim-aqua)',
  'feat(startup)': 'var(--color-nvim-green)',
  'chore(edu)': 'var(--color-nvim-fg3)',
};
