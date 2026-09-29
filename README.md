<div align="center">

  <img src="public/logo-full.png" alt="Skillora Logo" width="360" />

  <p><strong>High-Trust Student Opportunity Intelligence & Deterministic Matching Platform</strong></p>

  <p>
    <a href="https://skillora-xi-beige.vercel.app"><img src="https://img.shields.io/badge/Live%20Platform-skillora--xi--beige.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" /></a>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" /></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
    <a href="https://threejs.org"><img src="https://img.shields.io/badge/Three.js-WebGL%203D-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" /></a>
    <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
    <a href="#test-suite"><img src="https://img.shields.io/badge/Tests-18%20Passing%20(100%25)-success?style=for-the-badge&logo=node.js&logoColor=white" alt="Tests" /></a>
    <a href="#license"><img src="https://img.shields.io/badge/License-MIT-purple?style=for-the-badge" alt="License" /></a>
  </p>

  <p>
    <a href="https://skillora-xi-beige.vercel.app"><strong>🌐 Visit Live App (skillora-xi-beige.vercel.app)</strong></a> •
    <a href="#-key-features">Key Features</a> •
    <a href="#-threejs-3d-interactive-experience">Three.js 3D</a> •
    <a href="#-1-click-direct-in-app-apply">Direct Apply</a> •
    <a href="#-founder--contact">Founder & Contact</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-test-suite">Tests</a>
  </p>

</div>

---

> 🌐 **Official Production Deployment**: [**https://skillora-xi-beige.vercel.app**](https://skillora-xi-beige.vercel.app)  
> 🚀 **All Changes Live**: Interactive 3D Three.js Hero, Founder Aditya Dubey Spotlight, 1-Click In-App Direct Apply, and 10+ Ingestion Pipes!


---

## 🌟 Overview

**Skillora** is an open-source, high-trust student opportunity intelligence platform. It eliminates spam, dark-pattern redirect loops, and fragmented browsing by aggregating, deduplicating, verifying, and deterministically ranking tech internships, hackathons, scholarships, fellowships, and developer grants across 10+ global pipes.

Built for all university students, emerging developers, and event organizers worldwide.

---

## 🎨 Three.js 3D Interactive Experience

Skillora features a custom WebGL 3D sculptural emblem built with Three.js:
- **Organic Parametric Geometry**: Smooth, fluid, breathing parametric form that ripples with dynamic vertex sine-wave displacement.
- **Dual-Theme Adaptive Shaders**:
  - *Dark Mode*: Deep obsidian void with luminescent indigo, radiant violet, and cyan stardust orbital rings.
  - *Light Mode*: Luminous rose quartz, opal glass reflections, and warm champagne ambient depth.
- **Mouse & Touch Interactive**: Follows cursor with silky lerping, with interactive click pulses.

---

## ⚡ 1-Click Direct In-App Apply (Zero Redirections)

Unlike typical aggregators that redirect students to external tracking forms, Skillora enables **direct in-app application and event registration**:
- Candidates apply or register in 1 click directly inside the platform.
- Generates a verified application reference code (e.g. `SKL-2026-APP-XXXX`).
- Automatically logs application status in the candidate's dashboard (`Submitted`, `Under Review`, `Shortlisted`, `Accepted`).
- Zero tracking cookies, encrypted applicant data.

---

## ➕ Host & Post Opportunity Suite

Any student club lead, startup founder, or hackathon organizer can publish opportunities directly:
- Structured schema: Title, Organization, Category, Work Mode, Compensation/Prize Pool, Deadlines, and Required Tech Stack.
- Enable direct in-app candidate registrations.
- Published instantly across the Skillora global directory with verified provenance.

---

## 👤 Founder & Leadership

Skillora was envisioned, designed, and architected by **Aditya Dubey**.

- **Founder & Chief Architect**: Aditya Dubey
- **Direct Email**: [adityaomprakashdubey@gmail.com](mailto:adityaomprakashdubey@gmail.com)
- **Phone / WhatsApp**: [+91 98818 67687](tel:+919881867687)
- **GitHub**: [github.com/adityaaadubey](https://github.com/adityaaadubey)

> *"Skillora is built to kill the broken, spam-infested campus placement cycle. We connect talent directly with real opportunities through open, deterministic, explainable matching."*

---

## 🚀 Key Features

1. **10+ Automated Ingestion Pipes**: Ingests verified opportunities from global tech ecosystems with SHA-256 deduplication and canonical URL sanitization.
2. **Deterministic Explainable Matching**:
   - `35%` Skill Intersection
   - `20%` Category & Track Alignment
   - `15%` Work Mode (Remote/Hybrid/On-site)
   - `30%` Deadline Urgency & Verified Trust Boost
3. **Collapsible Full-Featured Sidebar**: Navigation, Direct Apply Hub, Track Filters, Organizer Suite, and Telemetry.
4. **Guaranteed Working Links**: Runtime URL resolver that eliminates 404s and strips tracking parameters.
5. **Auto-Sync Engine**: Periodic live telemetry endpoint (`/api/sync`) keeping directory data fresh and synchronized.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **3D Graphics**: Three.js (WebGL)
- **Database**: Supabase (PostgreSQL + Row Level Security)
- **Styling**: Vanilla CSS Design System with Glassmorphism
- **Validation**: Zod schema validation
- **Icons**: Lucide React
- **Deployment**: Vercel

---

## 🏁 Getting Started

### 1. Prerequisites
- **Node.js** >= 18.x or 20.x
- **npm** or **pnpm**
- A **Supabase** account

### 2. Clone Repository
```bash
git clone https://github.com/adityaaadubey/skillora.git
cd skillora
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 4. Install & Run
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Test Suite

Run the full automated test suite:
```bash
npm test
```
All 18 unit, integration, and security tests pass with 100% pass rate.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
