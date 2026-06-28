// utils/sampleData.js

let idCounter = 0
export function makeId() {
  idCounter += 1
  return `id_${Date.now()}_${idCounter}`
}

export const THEME_COLORS = [
  { id: 'teal', label: 'Teal', hex: '#0f8b7f' },
  { id: 'navy', label: 'Midnight Navy', hex: '#1e3a8a' },
  { id: 'emerald', label: 'Forest Emerald', hex: '#065f46' },
  { id: 'slate', label: 'Slate Steel', hex: '#475569' },
  { id: 'burgundy', label: 'Warm Burgundy', hex: '#7f1d1d' },
]

export const TEMPLATES = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'compact', label: 'Compact' },
]

export function emptyResume() {
  return {
    theme: 'teal',
    template: 'classic',
    personal: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      github: '',
      portfolio: '',
      summary: '',
      photo: '', // base64 string, optional
    },
    education: [],
    skillCategories: [
      // standard categories, kept even if empty until user fills them
      { id: makeId(), name: 'Technical Skills', items: [], standard: true },
      { id: makeId(), name: 'Programming Languages', items: [], standard: true },
      { id: makeId(), name: 'Frameworks & Libraries', items: [], standard: true },
      { id: makeId(), name: 'Tools & Technologies', items: [], standard: true },
      { id: makeId(), name: 'Soft Skills', items: [], standard: true },
    ],
    experience: [],
    projects: [],
    certifications: [],
    achievements: [],
    customSections: [],
  }
}

export function sampleResume() {
  return {
    theme: 'teal',
    template: 'classic',
    personal: {
      fullName: 'Priyanka Choudhary',
      email: 'priyanka.choudhary@example.com',
      phone: '+91 98765 43210',
      address: 'Ludhiana, Punjab, India',
      linkedin: 'linkedin.com/in/priyankachoudhary',
      github: 'github.com/priyankachoudhary',
      portfolio: 'priyankachoudhary.dev',
      summary:
        'Motivated Computer Science undergraduate with hands-on experience building full-stack web applications using React and Node.js. Passionate about clean code, ATS-friendly design systems, and solving real-world problems through technology.',
      photo: '',
    },
    education: [
      {
        id: makeId(),
        level: 'College / Degree',
        institution: 'Guru Nanak Dev Engineering College',
        course: 'B.Tech in Computer Science',
        board: 'Punjab Technical University',
        year: '2022 - 2026',
        score: '8.4 CGPA',
      },
      {
        id: makeId(),
        level: 'Higher Secondary / 12th',
        institution: 'Delhi Public School',
        course: 'Non-Medical (PCM)',
        board: 'CBSE',
        year: '2022',
        score: '92%',
      },
    ],
    skillCategories: [
      { id: makeId(), name: 'Technical Skills', items: ['Data Structures', 'REST APIs', 'Git & GitHub'], standard: true },
      { id: makeId(), name: 'Programming Languages', items: ['JavaScript', 'Python', 'Java'], standard: true },
      { id: makeId(), name: 'Frameworks & Libraries', items: ['React', 'Node.js', 'Express'], standard: true },
      { id: makeId(), name: 'Tools & Technologies', items: ['VS Code', 'Vite', 'Postman'], standard: true },
      { id: makeId(), name: 'Soft Skills', items: ['Communication', 'Teamwork', 'Time Management'], standard: true },
      { id: makeId(), name: 'Cloud Technologies', items: ['Vercel', 'Netlify'], standard: false },
    ],
    experience: [
      {
        id: makeId(),
        title: 'Web Development Intern',
        company: 'Digital Heroes',
        duration: 'Jun 2026 - Present',
        description:
          'Built reusable React components for client dashboards.\nCollaborated with a 4-person team using Git for version control.\nImproved page load time by 30% through code splitting.',
      },
    ],
    projects: [
      {
        id: makeId(),
        name: 'ATS Resume Builder',
        tech: 'React, Vite, CSS, localStorage',
        description:
          'Built a fully client-side resume builder with live preview and PDF export.\nImplemented dynamic conditional rendering to hide empty sections.',
        github: 'github.com/priyankachoudhary/resume-builder',
        live: 'resume-builder.vercel.app',
      },
      {
        id: makeId(),
        name: 'Campus Event Tracker',
        tech: 'React, Express, MongoDB',
        description:
          'Developed a full-stack event management platform for college societies.\nIntegrated role-based access for admins and students.',
        github: 'github.com/priyankachoudhary/event-tracker',
        live: '',
      },
    ],
    certifications: [
      { id: makeId(), name: 'React - The Complete Guide', org: 'Udemy', year: '2025' },
      { id: makeId(), name: 'Data Structures & Algorithms', org: 'Coursera', year: '2024' },
    ],
    achievements: [
      { id: makeId(), text: 'Winner, Smart India Hackathon (College Round) — 2025' },
      { id: makeId(), text: 'Top 10 finalist, Digital Heroes Trial Challenge — 2026' },
    ],
    customSections: [
      {
        id: makeId(),
        heading: 'Positions of Responsibility',
        description: 'Technical Lead, College Coding Club (2024 - 2025)\nOrganized 3 workshops on web development for 100+ students.',
      },
      {
        id: makeId(),
        heading: 'Languages',
        description: 'English (Fluent)\nHindi (Native)\nPunjabi (Native)',
      },
    ],
  }
}
