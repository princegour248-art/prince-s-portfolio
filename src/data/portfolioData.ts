/**
 * Prince Gour — Developer Portfolio Central Configuration
 * All personal details, projects, skills, education, certifications, and links
 * are centrally managed and easily editable here.
 */

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'Full-Stack' | 'AI & Web' | 'System';
  tags: string[];
  features: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  isPlaceholder?: boolean;
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: string[];
}

export interface EducationItem {
  degree: string;
  field: string;
  institution: string;
  period: string;
  status: string;
  coursework: string[];
  highlights?: string[];
}

export interface CertificationItem {
  title: string;
  issuer: string;
  type: 'Course' | 'Certification' | 'Specialization';
  status: 'Completed' | 'In Progress';
  date?: string;
  credentialUrl?: string;
  topics: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  type: 'Internship' | 'Offer Documentation';
  period: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
}

export const PORTFOLIO_CONFIG = {
  personal: {
    name: "Prince Gour",
    headline: "AI Enthusiast | Aspiring Software Developer | Web Developer",
    tagline: "Building purposeful web applications, AI-integrated software, and intuitive interfaces with clean architectural discipline.",
    about: {
      paragraphs: [
        "I am an enthusiastic Bachelor of Computer Applications (BCA) student with a passion for software engineering, artificial intelligence, and modern web technologies. My technical curiosity revolves around bridging theoretical computer science principles with practical, user-centric software.",
        "From engineering local-first academic assistance systems like Master Sahab to designing transparent grievance portals for campus workflows, I approach every project with an architectural mindset: clean separation of concerns, fast feedback loops, and zero unnecessary visual bloat.",
        "I enjoy diving deep into full-stack development with Python and JavaScript, integrating generative AI endpoints, designing accessible UI/UX systems, and analyzing data patterns to derive actionable real-world insights."
      ],
      highlights: [
        { label: "Focus Areas", value: "AI Integration, Full-Stack Web, UI/UX" },
        { label: "Degree Path", value: "BCA (Bachelor of Computer Applications)" },
        { label: "Core Mindset", value: "Clean Architecture & Pragmatic Problem Solving" },
        { label: "Location", value: "India" }
      ]
    },
    contact: {
      email: "princegour248@gmail.com",
      github: "https://github.com/princegour248-art",
      githubUsername: "princegour248-art",
      linkedin: "https://www.linkedin.com/in/princegour",
      location: "India",
      availability: "Open to Internships & Collaborative Projects"
    },
    meta: {
      canonicalUrl: "https://princegour248-art.github.io/portfolio",
      title: "Prince Gour | AI Enthusiast & Software Developer Portfolio",
      description: "Official portfolio of Prince Gour: BCA student, software developer, and AI enthusiast showcasing real projects, technical skills, certifications, and resume."
    }
  },

  skills: [
    {
      title: "Programming Languages",
      description: "Core languages used for problem solving, backend services, and application logic",
      skills: ["Python", "Java", "JavaScript (ES6+)"]
    },
    {
      title: "Frontend Engineering",
      description: "Building responsive, semantic, and accessible user interfaces",
      skills: ["HTML5", "CSS3 / Modern CSS", "React", "TypeScript", "Responsive Web Design", "DOM Manipulation"]
    },
    {
      title: "Backend & APIs",
      description: "Designing structured RESTful endpoints and server-side logic",
      skills: ["Python", "FastAPI", "REST APIs", "Node.js Basics", "JSON Architecture"]
    },
    {
      title: "AI & Machine Learning",
      description: "Hands-on integration with state-of-the-art models and pipelines",
      skills: ["Generative AI", "AI API Integration", "Ollama Local LLMs", "Prompt Engineering", "ML Fundamentals"]
    },
    {
      title: "Databases & Cloud",
      description: "Persistent storage, relational schemas, and cloud platforms",
      skills: ["SQL", "Relational Database Design", "Supabase", "LocalStorage Architecture"]
    },
    {
      title: "Tools & Workflow",
      description: "Modern developer tooling for version control and productivity",
      skills: ["Git", "GitHub", "VS Code", "Vite", "Command Line (PowerShell/Bash)"]
    },
    {
      title: "Design & Prototyping",
      description: "Creating accessible, human-friendly visual hierarchies",
      skills: ["UI/UX Principles", "Wireframing", "Layout Design", "Design Systems", "Accessibility (WCAG)"]
    }
  ] as SkillCategory[],

  projects: [
    {
      id: "master-sahab",
      title: "Master Sahab — AI Student Assistant",
      tagline: "Production-grade AI study companion engineered for conceptual clarity, exam preparation, and study management.",
      description: "A complete full-stack academic assistant that synthesizes complex textbook topics into step-by-step analogies, active recall flashcards, study schedules, and instant practice quizzes. Architected with a local-first resilience model and resilient fallback pipelines.",
      category: "AI & Web",
      tags: ["Python", "FastAPI", "JavaScript", "Generative AI", "CSS Modules", "LocalStorage"],
      features: [
        "AI Chat Interface with streaming typewriter responses and multi-turn context retention",
        "Adaptive Daily Study Timetable Creator with customized slot generation",
        "Active Recall Flashcard Studio featuring 3D card-flip physics and spaced mastery tracking",
        "Instant Exam Quiz engine with multi-option evaluation and detailed rationales",
        "STEM Formula & Cheatsheet Vault with mnemonic anchors",
        "Local-first client storage for zero latency and guaranteed offline functionality"
      ],
      githubUrl: "https://github.com/princegour248-art/master-sahab-ai-student-assistant",
      demoUrl: "https://github.com/princegour248-art/master-sahab-ai-student-assistant",
      featured: true
    },
    {
      id: "college-complaint-portal",
      title: "College Complaint Management Portal",
      tagline: "Transparent grievance redressal platform engineered for academic campus environments.",
      description: "A secure, privacy-conscious workflow application that enables students to register, categorize, and track academic, infrastructural, and administrative complaints with optional anonymity and administrative role-based auditing.",
      category: "Full-Stack",
      tags: ["Python", "FastAPI", "SQL", "JavaScript", "RBAC", "Responsive UI"],
      features: [
        "Dual complaint submission channels (Registered & Anonymous)",
        "Role-Based Access Control (Student, Department Coordinator, Administrator)",
        "Lifecycle ticket state tracking (Submitted, In-Review, In-Progress, Resolved)",
        "Department-level categorization and priority assignment",
        "Privacy-first audit logging to safeguard student identities"
      ],
      githubUrl: "https://github.com/princegour248-art/college-complaint-portal",
      demoUrl: undefined,
      featured: true
    },
    {
      id: "future-projects",
      title: "Distributed Autonomous Agent Framework",
      tagline: "Upcoming modular architecture for task orchestration and multi-agent workflows.",
      description: "An exploratory engineering initiative investigating lightweight multi-agent coordination, deterministic memory persistence, and tool invocation pipelines for developer automation.",
      category: "System",
      tags: ["Python", "TypeScript", "AI Agents", "System Design"],
      features: [
        "Modular plug-and-play tool integration",
        "External state persistence across execution turns",
        "Declarative subagent delegation schema"
      ],
      githubUrl: undefined,
      demoUrl: undefined,
      featured: false,
      isPlaceholder: true
    }
  ] as Project[],

  education: [
    {
      degree: "Bachelor of Computer Applications (BCA)",
      field: "Computer Science & Application Development",
      institution: "Affiliated University / College (Editable in settings)",
      period: "Current Student (Expected Graduation: 2026/2027)",
      status: "In Progress",
      coursework: [
        "Data Structures & Algorithms",
        "Object-Oriented Programming (Java & Python)",
        "Database Management Systems (SQL / Relational)",
        "Web Technologies (HTML, CSS, JavaScript)",
        "Software Engineering Principles",
        "Computer Networks & Operating Systems",
        "Artificial Intelligence & Machine Learning Fundamentals"
      ],
      highlights: [
        "Maintained strong focus on practical software construction and real-world project development",
        "Active self-directed research in modern full-stack frameworks and generative AI tooling"
      ]
    }
  ] as EducationItem[],

  certifications: [
    {
      title: "Big Data Professional Course",
      issuer: "Samsung",
      type: "Course",
      status: "Completed",
      topics: ["Big Data Analytics", "Data Processing", "Distributed Concepts"]
    },
    {
      title: "Cybersecurity Fundamentals",
      issuer: "Mastercard",
      type: "Course",
      status: "Completed",
      topics: ["Network Security", "Threat Modeling", "Defensive Practices"]
    },
    {
      title: "Generative AI Fundamentals",
      issuer: "Google Cloud",
      type: "Certification",
      status: "Completed",
      topics: ["Large Language Models", "Prompt Engineering", "Responsible AI Principles"]
    },
    {
      title: "Machine Learning Foundations",
      issuer: "Simplilearn",
      type: "Course",
      status: "Completed",
      topics: ["Supervised Learning", "Model Evaluation", "Statistical Foundations"]
    },
    {
      title: "GenAI-Powered Data Analytics",
      issuer: "Tata",
      type: "Specialization",
      status: "Completed",
      topics: ["AI Data Synthesis", "Analytics Pipelines", "Business Intelligence"]
    },
    {
      title: "Web Development Certification",
      issuer: "Professional Learning Provider",
      type: "Certification",
      status: "Completed",
      topics: ["Responsive Web Design", "Modern JavaScript", "Frontend Standards"]
    }
  ] as CertificationItem[],

  experience: [
    {
      role: "Web Development Intern",
      company: "Cognifyz Technologies",
      type: "Internship",
      period: "Internship / Offer Documentation",
      description: "Focused on frontend engineering, responsive web interface design, and client-side optimization across diverse viewport dimensions.",
      responsibilities: [
        "Developed interactive, semantic web interfaces following modern CSS and HTML standards",
        "Ensured cross-browser compatibility and accessible component design",
        "Collaborated on feature specifications and git-based version control workflows"
      ],
      technologies: ["HTML5", "CSS3", "JavaScript", "Git", "Responsive Design"]
    },
    {
      role: "UI/UX Design Intern",
      company: "CodeAlpha",
      type: "Internship",
      period: "Internship / Offer Documentation",
      description: "Concentrated on user experience architecture, wireframing user journeys, and creating cohesive design system tokens.",
      responsibilities: [
        "Designed high-contrast, distraction-free interface layouts with clear typographical scales",
        "Conducted usability reviews and accessibility assessments across user navigation flows",
        "Translated functional product requirements into structured design prototypes"
      ],
      technologies: ["UI/UX Design", "Wireframing", "Prototyping", "Design Systems", "Usability"]
    }
  ] as ExperienceItem[]
};
