export const initialResumeData = {
  personal: {
    fullName: "Alexander Wright",
    headline: "Senior Full-Stack Engineer & Cloud Architect",
    email: "alexander.wright@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA (Open to Remote)",
    website: "https://alexwright.dev",
    linkedin: "https://linkedin.com/in/alexanderwright",
    github: "https://github.com/alexwright",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    showAvatar: true,
  },
  summary:
    "Dynamic Senior Full-Stack Engineer with 8+ years of expertise in architecting high-concurrency cloud distributed systems and responsive web applications. Proven track record leading cross-functional squads to reduce API latency by 45% and scaling platform infrastructure supporting 2M+ daily active users. Passionate about developer tooling, microservices, and AI-driven workflow optimization.",
  experience: [
    {
      id: "exp-1",
      company: "Vanguard Tech Systems",
      role: "Lead Systems Architect & Staff Engineer",
      location: "San Francisco, CA",
      startDate: "2022-03",
      endDate: "Present",
      current: true,
      highlights: [
        "Architected enterprise-grade event-driven microservices processing 15,000+ RPS utilizing Kafka, Go, and React.",
        "Spearheaded cloud migration from on-prem to AWS EKS, slashing operational infrastructure expenditure by $320k annually.",
        "Mentored a team of 14 front-end and back-end engineers, implementing CI/CD automated gates and trunk-based deployment."
      ]
    },
    {
      id: "exp-2",
      company: "NovaStream Media",
      role: "Senior Full-Stack Developer",
      location: "San Jose, CA",
      startDate: "2019-06",
      endDate: "2022-02",
      current: false,
      highlights: [
        "Engineered real-time collaboration canvas using React, WebSockets, and WebGL, boosting session duration by 38%.",
        "Redesigned core checkout funnel, integrating Stripe payment orchestration and reducing drop-off rates by 18%.",
        "Pioneered automated testing suite with Jest and Cypress, elevating test coverage from 42% to 91%."
      ]
    },
    {
      id: "exp-3",
      company: "Apex Digital Labs",
      role: "Software Engineer",
      location: "Austin, TX",
      startDate: "2017-08",
      endDate: "2019-05",
      current: false,
      highlights: [
        "Constructed client-facing analytics dashboards using React, Redux, and D3.js delivering sub-second query rendering.",
        "Designed and maintained RESTful APIs in Node.js/Express backed by PostgreSQL with Redis cache layers."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "B.S. in Computer Science",
      fieldOfStudy: "Software Engineering & Distributed Computing",
      startDate: "2013-09",
      endDate: "2017-05",
      score: "GPA: 3.88 / 4.0 (Dean's Honor List)",
      highlights: [
        "President of the Berkeley Open Source Club.",
        "Conducted undergraduate research in distributed consensus protocols under Prof. Stone."
      ]
    }
  ],
  skills: [
    {
      id: "sk-1",
      category: "Frontend & UI",
      items: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Redux Toolkit", "GraphQL", "WebSockets"]
    },
    {
      id: "sk-2",
      category: "Backend & Cloud",
      items: ["Node.js", "Go", "Python", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS (EKS, Lambda, S3)"]
    },
    {
      id: "sk-3",
      category: "Architecture & Practices",
      items: ["Microservices", "Event-Driven Design", "CI/CD Pipelines", "System Design", "Agile/Scrum Leadership"]
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "PulseQueue - Open Source Event Broker",
      technologies: "Go, Redis, gRPC, React",
      link: "https://pulsequeue.io",
      github: "https://github.com/alexwright/pulsequeue",
      description: "Lightweight, distributed message broker capable of handling 50k msgs/sec with persistent disk-backed logging."
    },
    {
      id: "proj-2",
      name: "CloudLens - Infrastructure Cost Visualizer",
      technologies: "Next.js, TypeScript, AWS SDK, TailwindCSS",
      link: "https://cloudlens-demo.app",
      github: "https://github.com/alexwright/cloudlens",
      description: "SaaS dashboard that analyzes AWS cost allocation tags and generates proactive resource downscaling alerts."
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Professional",
      issuer: "Amazon Web Services",
      date: "2023",
      credentialId: "AWS-PSA-994821",
      link: "https://aws.amazon.com/verification"
    },
    {
      id: "cert-2",
      name: "Certified Kubernetes Administrator (CKA)",
      issuer: "Cloud Native Computing Foundation (CNCF)",
      date: "2022",
      credentialId: "CKA-773019",
      link: "https://cncf.io/verify"
    }
  ],
  customSections: [
    {
      id: "cust-1",
      title: "Honors & Achievements",
      items: [
        {
          id: "ci-1",
          title: "1st Place Winner - Global FinTech Hackathon",
          subtitle: "Out of 400+ international development squads",
          date: "2021",
          description: "Engineered a biometric zero-knowledge authentication gateway in 48 hours."
        }
      ]
    }
  ]
};

export const presets = {
  softwareEngineer: initialResumeData,
  productManager: {
    personal: {
      fullName: "Elena Rostova",
      headline: "Principal Product Manager & Strategy Director",
      email: "elena.rostova@example.com",
      phone: "+1 (555) 890-1234",
      location: "New York, NY",
      website: "https://elenarostova.com",
      linkedin: "https://linkedin.com/in/elenarostova",
      github: "",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      showAvatar: true,
    },
    summary:
      "Results-oriented Principal Product Manager with 9+ years driving SaaS product strategy, growth funnels, and enterprise customer discovery. Proven track record launching 0-to-1 B2B platforms generating $18M ARR within 18 months. Specialized in PLG (Product-Led Growth), user retention telemetry, and cross-functional leadership.",
    experience: [
      {
        id: "pm-exp-1",
        company: "Apex Cloud Technologies",
        role: "Principal Product Manager - Core Platform",
        location: "New York, NY",
        startDate: "2021-01",
        endDate: "Present",
        current: true,
        highlights: [
          "Drove product roadmap for flagship enterprise collaboration suite, increasing quarterly active users by 62%.",
          "Instituted user telemetry dashboards and churn early-warning metrics, decreasing enterprise churn from 4.8% to 1.9%.",
          "Partnered closely with sales and engineering directors to scope and deliver SOC-2 and HIPAA compliance modules."
        ]
      },
      {
        id: "pm-exp-2",
        company: "Beacon Analytics",
        role: "Senior Product Manager",
        location: "Boston, MA",
        startDate: "2018-04",
        endDate: "2020-12",
        current: false,
        highlights: [
          "Led team of 12 engineers and 2 UX designers to build an AI automated reporting engine with 89% customer adoption.",
          "Conducted 120+ customer discovery interviews to define key personas, reducing onboarding time by 35%."
        ]
      }
    ],
    education: [
      {
        id: "pm-edu-1",
        institution: "Columbia Business School",
        degree: "MBA, Technology Management",
        fieldOfStudy: "Product Strategy & Operations",
        startDate: "2016",
        endDate: "2018",
        score: "Top 10% Honors",
        highlights: ["VP of Tech & Innovation Club", "Co-chaired Annual Product Leadership Summit"]
      },
      {
        id: "pm-edu-2",
        institution: "New York University",
        degree: "B.S. in Economics & Data Science",
        fieldOfStudy: "Applied Statistics",
        startDate: "2012",
        endDate: "2016",
        score: "Magna Cum Laude",
        highlights: []
      }
    ],
    skills: [
      {
        id: "pm-sk-1",
        category: "Product Management",
        items: ["Product Roadmap", "PLG (Product-Led Growth)", "Customer Discovery", "A/B Testing", "OKRs", "Agile/Scrum"]
      },
      {
        id: "pm-sk-2",
        category: "Analytics & Telemetry",
        items: ["Mixpanel", "Amplitude", "SQL", "Google Analytics 4", "Tableau", "Segment"]
      },
      {
        id: "pm-sk-3",
        category: "Leadership & Collaboration",
        items: ["Executive Presentation", "Cross-Functional Alignment", "P&L Management", "User Journey Mapping"]
      }
    ],
    projects: [
      {
        id: "pm-proj-1",
        name: "Enterprise Self-Serve Onboarding Flow",
        technologies: "Segment, Amplitude, Chameleon, Stripe",
        link: "https://example.com/case-study",
        github: "",
        description: "Re-engineered user onboarding flow, boosting trial-to-paid conversion by 28% and driving $3.2M incremental ARR."
      }
    ],
    certifications: [
      {
        id: "pm-cert-1",
        name: "Pragmatic Certified Product Master",
        issuer: "Pragmatic Institute",
        date: "2021",
        credentialId: "PRAG-8392",
        link: ""
      }
    ],
    customSections: []
  },
  blank: {
    personal: {
      fullName: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      avatarUrl: "",
      showAvatar: false,
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    customSections: []
  }
};

export const colorPalettes = [
  { id: "champagne", name: "Champagne Gold", primary: "#c59b27", secondary: "#e5c583", accent: "#fdf6e2", text: "#78590f" },
  { id: "amethyst", name: "Royal Amethyst", primary: "#7c3aed", secondary: "#a855f7", accent: "#f3e8ff", text: "#4c1d95" },
  { id: "rosegold", name: "Rose Gold", primary: "#b76e79", secondary: "#d49b9b", accent: "#fdf2f4", text: "#6e2d37" },
  { id: "copper", name: "Warm Copper", primary: "#b45309", secondary: "#d97706", accent: "#fef3c7", text: "#78350f" },
  { id: "obsidian", name: "Obsidian & Platinum", primary: "#18181b", secondary: "#52525b", accent: "#f4f4f5", text: "#09090b" },
  { id: "plum", name: "Velvet Plum", primary: "#831843", secondary: "#be185d", accent: "#fce7f3", text: "#500724" }
];

export const fontFamilies = [
  { id: "sans", name: "Modern Sans (Inter)", fontClass: "font-sans" },
  { id: "serif", name: "Classic Serif (Merriweather)", fontClass: "font-serif" },
  { id: "display", name: "Creative Display (Poppins)", fontClass: "font-display" }
];
