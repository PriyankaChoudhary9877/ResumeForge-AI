<div align="center">

<br />

<img src="public/landing-page.png" alt="ResumeForge AI" width="100%" />

<br />
<br />

# ResumeForge

**Build ATS-ready resumes in minutes — powered by Google Gemini AI**

<p>
  <a href="https://resumeforge-ai-rho.vercel.app">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Now-9C6B45?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  &nbsp;
  <a href="https://github.com/PriyankaChoudhary9877/ResumeForge-AI">
    <img src="https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
</p>

<p>
  <img src="https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite_5-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Firestore-FFA000?style=flat-square&logo=firebase&logoColor=white" />
  <img src="https://img.shields.io/badge/Google%20Gemini-4285F4?style=flat-square&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
</p>

</div>

---

## Overview

ResumeForge is a modern resume builder that helps students and professionals create ATS-friendly resumes with AI-powered writing assistance. It combines resume editing, ATS analysis, cloud storage, and PDF export into one simple application.

---

## Screenshots

<table>
  <tr>
    <td align="center" width="50%">
      <b>Resume Builder</b><br /><br />
      <img src="public/resume-builder.png" width="100%" alt="Resume Builder" />
    </td>
    <td align="center" width="50%">
      <b>Resume Dashboard</b><br /><br />
      <img src="public/dashboard.png" width="100%" alt="Dashboard" />
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <b>AI Resume Improvement</b><br /><br />
      <img src="public/ai-improve.png" width="100%" alt="AI Improve" />
    </td>
    <td align="center" width="50%">
      <b>ATS Analysis Result</b><br /><br />
      <img src="public/ats-result.png" width="100%" alt="ATS Analysis" />
    </td>
  </tr>
</table>

<details>
<summary><b>More Screenshots</b></summary>

<br />

**ATS Analysis — Target Role Selection**

<p align="center">
  <img src="public/ats-role.png" width="70%" alt="ATS Role Selection" />
</p>

**ATS Analysis — Processing**

<p align="center">
  <img src="public/ats-loading.png" width="70%" alt="ATS Loading" />
</p>

**Authentication**

<table align="center">
  <tr>
    <td align="center"><b>Login</b><br /><br /><img src="public/login.png" width="340" alt="Login" /></td>
    <td align="center"><b>Register</b><br /><br /><img src="public/register.png" width="340" alt="Register" /></td>
  </tr>
</table>

</details>

---

## Features

| Feature | Description |
|---|---|
| AI ATS Analysis | Score your resume for ATS compatibility with per-section feedback |
| AI Summary Generator | Generate a professional summary based on your resume content |
| AI Resume Improvement | Improve bullet points in your experience and project sections |
| Missing Keyword Detection | Identify keywords missing for a specific target role |
| Live Resume Preview | See changes reflected in real time as you edit |
| Multiple Templates | Choose from several resume layout options |
| Theme Customization | Adjust colors and styling to match your preference |
| Resume Dashboard | View, rename, duplicate, and delete saved resumes |
| Resume Completion Score | Track how complete your resume is |
| Firebase Authentication | Secure login, registration, and password reset |
| Cloud Sync | Save and access your resumes securely using Firestore. |
| PDF Export | Download an ATS-friendly PDF version of your resume |
| Responsive Design | Works on desktop and mobile |

---

## Tech Stack

<table>
  <tr>
    <td valign="top" width="25%">
      <b>Frontend</b><br /><br />
      <img src="https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black" /><br />
      <img src="https://img.shields.io/badge/Vite_5-646CFF?style=flat-square&logo=vite&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" /><br />
      <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" />
    </td>
    <td valign="top" width="25%">
      <b>Backend & Auth</b><br /><br />
      <img src="https://img.shields.io/badge/Firebase_Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black" /><br />
      <img src="https://img.shields.io/badge/Firestore-FFA000?style=flat-square&logo=firebase&logoColor=white" />
    </td>
    <td valign="top" width="25%">
      <b>AI</b><br /><br />
      <img src="https://img.shields.io/badge/Google%20Gemini-4285F4?style=flat-square&logo=google&logoColor=white" />
    </td>
    <td valign="top" width="25%">
      <b>Deployment</b><br /><br />
      <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
    </td>
  </tr>
</table>

---

## Getting Started

<details>
<summary><b>Prerequisites</b></summary>

<br />

- Node.js `v18+`
- A Firebase project with Authentication and Firestore enabled
- A Google Gemini API key

</details>

<details open>
<summary><b>Installation</b></summary>

<br />

**1. Clone the repository**

```bash
git clone https://github.com/PriyankaChoudhary9877/ResumeForge-AI.git
cd ResumeForge-AI
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

**4. Start the development server**

```bash
npm run dev
```

</details>

<details>
<summary><b>Build for Production</b></summary>

<br />

```bash
npm run build
npm run preview
```

</details>

---

## Project Structure

```
ResumeForge-AI/
│
├── public/                    # Static assets & screenshots
│
├── src/
│   ├── components/            # UI components
│   ├── context/               # React context providers
│   ├── lib/                   # Firebase and API setup
│   ├── utils/                 # Helper functions
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

---

## Future Improvements

Features I plan to add:

- Cover Letter Generator
- Resume Import
- More Resume Templates
- Dark Mode

---

## Author

<table>
  <tr>
    <td align="center">
      <b>Priyanka Choudhary</b><br />
      Computer Science Engineering Student<br /><br />
      <a href="https://github.com/PriyankaChoudhary9877">
        <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" />
      </a>
      &nbsp;
      <a href="https://www.linkedin.com/in/priyanka-choudhary-58b048312/">
        <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white" />
      </a>
      &nbsp;
      <a href="https://resumeforge-ai-rho.vercel.app">
        <img src="https://img.shields.io/badge/Live%20Demo-9C6B45?style=flat-square&logo=vercel&logoColor=white" />
      </a>
      &nbsp;
      <a href="mailto:priyankachoudhary9877@gmail.com">
        <img src="https://img.shields.io/badge/Email-EA4335?style=flat-square&logo=gmail&logoColor=white" />
      </a>
    </td>
  </tr>
</table>

---

<div align="center">

If you found this project helpful, consider giving it a ⭐ on GitHub.

<br />

Designed and developed by Priyanka Choudhary.

</div>
