import {
  Layout,
  Server,
  Code2,
  Database,
  BrainCircuit,
  Wrench,
  Palette,
  FileCode2,
  Terminal,
  Cpu,
  Globe,
  Sparkles,
  Layers,
  type LucideIcon
} from 'lucide-react';

export interface SkillCategoryItem {
  id: string;
  title: string;
  folderTitle: string;
  badge: string;
  icon: LucideIcon;
  description: string;
  skills: string[];
  color: string;
}

export const SKILL_CATEGORIES: SkillCategoryItem[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    folderTitle: 'Frontend Skills',
    badge: 'Selected Skill Category',
    icon: Layout,
    description:
      'Creating responsive, accessible, and visually engaging user interfaces using modern web technologies.',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React'],
    color: '#FF6A00'
  },
  {
    id: 'backend',
    title: 'Backend Development',
    folderTitle: 'Backend Skills',
    badge: 'Selected Skill Category',
    icon: Server,
    description:
      'Building application logic, APIs, and server-side functionality that power reliable web applications.',
    skills: ['Node.js', 'Express.js', 'REST APIs'],
    color: '#FF6A00'
  },
  {
    id: 'languages',
    title: 'Programming Languages',
    folderTitle: 'Languages',
    badge: 'Selected Skill Category',
    icon: Code2,
    description:
      'Learning and applying programming fundamentals to solve problems and develop software.',
    skills: ['Python', 'Java', 'JavaScript'],
    color: '#FF6A00'
  },
  {
    id: 'database',
    title: 'Database Management',
    folderTitle: 'Databases',
    badge: 'Selected Skill Category',
    icon: Database,
    description:
      'Working with structured data, database design, queries, and data storage.',
    skills: ['MongoDB', 'SQL'],
    color: '#FF6A00'
  },
  {
    id: 'aiml',
    title: 'AI & Machine Learning',
    folderTitle: 'AI / ML Skills',
    badge: 'Selected Skill Category',
    icon: BrainCircuit,
    description:
      'Exploring artificial intelligence, machine learning concepts, and intelligent applications.',
    skills: ['Artificial Intelligence', 'Machine Learning', 'Generative AI'],
    color: '#FF6A00'
  },
  {
    id: 'tools',
    title: 'Tools & Technologies',
    folderTitle: 'Developer Tools',
    badge: 'Selected Skill Category',
    icon: Wrench,
    description:
      'Using development tools, version control, and modern workflows to build and maintain projects.',
    skills: ['Git', 'GitHub', 'VS Code', 'npm'],
    color: '#FF6A00'
  },
  {
    id: 'design',
    title: 'UI/UX Design',
    folderTitle: 'Design Skills',
    badge: 'Selected Skill Category',
    icon: Palette,
    description:
      'Designing intuitive digital experiences with attention to usability, layout, interaction, and visual consistency.',
    skills: ['Figma', 'Wireframing', 'Responsive Design', 'Prototyping'],
    color: '#FF6A00'
  }
];

export const getSkillIcon = (skillName: string): LucideIcon => {
  const map: Record<string, LucideIcon> = {
    HTML5: Globe,
    CSS3: Layers,
    JavaScript: FileCode2,
    React: Sparkles,
    'Node.js': Server,
    'Express.js': Server,
    'REST APIs': Globe,
    Python: Terminal,
    Java: Code2,
    MongoDB: Database,
    SQL: Database,
    'Artificial Intelligence': BrainCircuit,
    'Machine Learning': Cpu,
    'Generative AI': Sparkles,
    Git: Wrench,
    GitHub: Globe,
    'VS Code': FileCode2,
    npm: Terminal,
    Figma: Palette,
    Wireframing: Layout,
    'Responsive Design': Layout,
    Prototyping: Sparkles
  };
  return map[skillName] || Code2;
};
