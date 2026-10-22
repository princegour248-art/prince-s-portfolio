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
  id?: string;
  title: string;
  issuer: string;
  type: 'Course' | 'Certification' | 'Specialization' | 'Internship Certificate';
  status: 'Completed' | 'In Progress' | 'Verified';
  date?: string;
  credentialUrl?: string;
  credentialId?: string;
  image?: string;
  topics: string[];
}

export interface ExperienceItem {
  id?: string;
  role: string;
  company: string;
  tagline?: string;
  type: string;
  period: string;
  duration?: string;
  date?: string;
  refId?: string;
  location?: string;
  documentType?: string;
  documentStatus?: string;
  offerLetterImage?: string;
  offerLetterPdf?: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  contact?: string;
  website?: string;
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
      linkedin: "https://www.linkedin.com/in/prince-gour-468b17315",
      location: "India",
      availability: "Open to Internships & Collaborative Projects"
    },
    meta: {
      canonicalUrl: "https://princegour248-art.github.io/prince-gour-portfolio/",
      title: "Prince Gour | AI Enthusiast & Software Developer Portfolio",
      description: "Official portfolio of Prince Gour: BCA student, software developer, and AI enthusiast showcasing real projects, technical skills, certifications, and resume."
    }
  },

  skills: [
    {
      title: "Frontend Development",
      description: "Creating responsive, accessible, and visually engaging user interfaces using modern web technologies.",
      skills: ["HTML5", "CSS3", "JavaScript", "React"]
    },
    {
      title: "Backend Development",
      description: "Building application logic, APIs, and server-side functionality that power reliable web applications.",
      skills: ["Node.js", "Express.js", "REST APIs"]
    },
    {
      title: "Programming Languages",
      description: "Learning and applying programming fundamentals to solve problems and develop software.",
      skills: ["Python", "Java", "JavaScript"]
    },
    {
      title: "Database Management",
      description: "Working with structured data, database design, queries, and data storage.",
      skills: ["MongoDB", "SQL"]
    },
    {
      title: "AI & Machine Learning",
      description: "Exploring artificial intelligence, machine learning concepts, and intelligent applications.",
      skills: ["Artificial Intelligence", "Machine Learning", "Generative AI"]
    },
    {
      title: "Tools & Technologies",
      description: "Using development tools, version control, and modern workflows to build and maintain projects.",
      skills: ["Git", "GitHub", "VS Code", "npm"]
    },
    {
      title: "UI/UX Design",
      description: "Designing intuitive digital experiences with attention to usability, layout, interaction, and visual consistency.",
      skills: ["Figma", "Wireframing", "Responsive Design", "Prototyping"]
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
      institution: "ITM, GIDA, Gorakhpur",
      period: "Current Student (In Progress)",
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
    },
    {
      degree: "Intermediate (12th)",
      field: "Senior Secondary",
      institution: "Raghuraj Singh Kisan Inter College",
      period: "Completed",
      status: "Completed",
      coursework: [],
      highlights: []
    },
    {
      degree: "High School (10th)",
      field: "Secondary Education",
      institution: "Raghuraj Singh Kisan Inter College",
      period: "Completed",
      status: "Completed",
      coursework: [],
      highlights: []
    }
  ] as EducationItem[],

  certifications: [
    {
      id: "gen-ai-studio",
      title: "Introduction to Generative AI Studio",
      issuer: "Simplilearn",
      type: "Course",
      status: "Completed",
      date: "1st September 2026",
      credentialId: "10679653",
      image: "/certificates/cert-generative-ai-studio.png",
      topics: ["Generative AI", "AI Studio", "Prompt Engineering", "Large Language Models"]
    },
    {
      id: "ml-python",
      title: "Machine Learning Using Python",
      issuer: "Simplilearn",
      type: "Course",
      status: "Completed",
      date: "23rd August 2026",
      credentialId: "10636941",
      image: "/certificates/cert-machine-learning-python.png",
      topics: ["Machine Learning", "Python", "Predictive Modeling", "Algorithm Training"]
    },
    {
      id: "codealpha-uiux",
      title: "UI/UX Design Virtual Internship",
      issuer: "CodeAlpha",
      type: "Internship Certificate",
      status: "Verified",
      date: "10th October 2026",
      credentialId: "CA/DF1/320277",
      image: "/certificates/cert-codealpha-internship.png",
      topics: ["UI/UX Design", "Wireframing", "Figma", "Digital Experiences", "Design Systems"]
    },
    {
      id: "samsung-bigdata",
      title: "Big Data Professional Course",
      issuer: "Samsung",
      type: "Course",
      status: "Completed",
      topics: ["Big Data Analytics", "Data Processing", "Distributed Concepts"]
    },
    {
      id: "mastercard-cybersec",
      title: "Cybersecurity Job Simulation",
      issuer: "Mastercard",
      type: "Course",
      status: "Completed",
      date: "August 21st, 2026",
      credentialId: "6a87de09841fdedde79827db",
      image: "/certificates/cert-mastercard-cybersecurity.png",
      topics: ["Phishing Simulation", "Threat Modeling", "Defensive Practices", "Security Analysis"]
    },
    {
      id: "tata-genai",
      title: "GenAI-Powered Data Analytics",
      issuer: "Tata",
      type: "Specialization",
      status: "Completed",
      date: "October 10th, 2026",
      image: "/certificates/cert-tata-genai-analytics.png",
      topics: ["AI Data Synthesis", "Analytics Pipelines", "Exploratory Data Analysis"]
    },
    {
      id: "google-genai",
      title: "Generative AI Fundamentals",
      issuer: "Google Cloud",
      type: "Certification",
      status: "Completed",
      topics: ["Large Language Models", "Prompt Engineering", "Responsible AI Principles"]
    }
  ] as CertificationItem[],

  experience: [
    {
      id: "cognifyz-webdev",
      role: "Web Development Intern",
      company: "Cognifyz IT Solutions Pvt. Ltd.",
      tagline: "Where Data Meets Intelligence",
      type: "Official Offer Letter",
      documentType: "Internship Offer Letter",
      documentStatus: "Offer Letter (Verified)",
      period: "Offer Date: 04/10/2026",
      date: "04/10/2026",
      duration: "1 Month (Self-Paced Industry Tasks)",
      refId: "Ref. : CTI/A1/C426682",
      location: "Warora, Chandrapur, Maharashtra",
      contact: "support@cognifyz.com",
      website: "www.cognifyz.com",
      offerLetterImage: "/internships/offer-cognifyz-webdev.png",
      offerLetterPdf: "/internships/offer-cognifyz-webdev.pdf",
      description: "Selected as Web Development Intern at Cognifyz IT Solutions Pvt. Ltd. based on verified qualifications, skills, and enthusiasm for web technologies. Focused on developing and integrating technologies to build scalable solutions that meet customer needs, ensuring application stability, and creating seamless front-end and back-end user experiences.",
      responsibilities: [
        "Developing and integrating modern technologies to engineer scalable web solutions",
        "Front-end and back-end development ensuring system stability and high performance",
        "Crafting seamless, accessible, and responsive digital user experiences",
        "Collaborating on diverse real-world projects and tasks aligned with customer needs"
      ],
      technologies: ["Full-Stack Development", "Front-End", "Back-End Integration", "JavaScript", "HTML5", "CSS3", "System Architecture"]
    },
    {
      id: "codealpha-uiux",
      role: "UI/UX Design Intern",
      company: "CodeAlpha",
      tagline: "Virtual UI/UX Design Internship",
      type: "Virtual Internship Offer",
      documentType: "Virtual Internship Offer Letter",
      documentStatus: "Offer Letter (Verified)",
      period: "20 Oct 2026 – 20 Nov 2026 (1 Month)",
      date: "10th October 2026",
      duration: "1 Month (20 Oct 2026 – 20 Nov 2026)",
      refId: "Student ID: CA/DF1/320277",
      location: "Virtual / Remote (Online)",
      offerLetterImage: "/internships/offer-codealpha-uiux.png",
      offerLetterPdf: "/internships/offer-codealpha-uiux.pdf",
      description: "Confirmed selection for CodeAlpha's 1-month Virtual UI/UX Design Internship. Focused on practical assignments and projects related to UI/UX design, wireframing, improving technical design skills, and gaining hands-on digital product design experience with performance-based stipend eligibility.",
      responsibilities: [
        "Participated actively in practical assignments and real-world UI/UX design projects",
        "Architected wireframes, user journeys, and interactive high-fidelity prototypes",
        "Applied usability guidelines, accessibility standards, and design system tokens",
        "Delivered assigned milestones on time with responsible, professional communication"
      ],
      technologies: ["UI/UX Design", "Wireframing", "Figma", "User Research", "Prototyping", "Design Systems", "Usability Testing"]
    }
  ] as ExperienceItem[]
};
