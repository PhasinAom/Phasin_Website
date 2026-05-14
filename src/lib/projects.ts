export interface Project {
  id: number;
  title: string;
  description: string;
  role: string[];
  year: string;
  bg: string;
  accent: string;
  image?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'Ship What Matters',
    description: 'Ideas without execution are just dreams. I design and build products that are fast, intentional, and built to last — no fluff, no filler.',
    role: ['Design', 'Development'],
    year: '2025',
    bg: '#000000',
    accent: '#E1E0CC',
    image: '/firstOne.png',
  },
  {
    id: 2,
    title: 'Code That Feels',
    description: 'Great products live at the intersection of design and engineering. I speak both languages — from wireframe to deployment.',
    role: ['UI/UX', 'Frontend'],
    year: '2025',
    bg: '#0a0f1a',
    accent: '#E1E0CC',
    image: '/SecondOne.png',
  },
  {
    id: 3,
    title: 'Craft At Scale',
    description: 'Whether it\'s an MVP or a polished product, the standard stays the same. Thoughtful craft, every time.',
    role: ['Full Stack'],
    year: '2025',
    bg: '#120f0a',
    accent: '#E1E0CC',
    image: '/ThirdOne.png',
  },
];
