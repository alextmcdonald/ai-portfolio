export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  timeline: string;
  category: string;
  heroImage: string;
  videoUrl?: string;
  statsSummary?: string;
  summary: string;
  problem: string;
  solution: string;
  researchInsights: string[];
  designDecisions: {
    title: string;
    description: string;
  }[];
  metrics: {
    label: string;
    value: string;
    subtext: string;
  }[];
  systemSpecs: {
    key: string;
    value: string;
  }[];
  prototypeScreens: {
    name: string;
    caption: string;
    tag: string;
  }[];
  tags: string[];
}

export interface WorkExperience {
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
  skills: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  notes: string;
}

export interface PatentItem {
  id: string;
  title: string;
  filingBody: string;
  year: string;
  description: string;
}

export interface Recommendation {
  id: string;
  name: string;
  role: string;
  company: string;
  relationship: string;
  avatarUrl?: string;
  avatarInitials: string;
  quote: string;
  highlight: string;
  verifiedYear: string;
  linkedinUrl?: string;
}

export type ActiveSection = 'overview' | 'work' | 'interactive' | 'resume' | 'contact';
