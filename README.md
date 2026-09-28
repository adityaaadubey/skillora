# 🎓 Skillora — Student Opportunity Intelligence Platform

Skillora is an enterprise-grade, high-trust opportunity discovery platform specifically engineered for university students and emerging developers. It audits thousands of collegiate internships, hackathons, scholarships, and fellowships, delivering deterministic relevance matching, transparent scoring factors, and automated provenance auditing.

---

## 🌟 Key Highlights

- **🔒 Passwordless Email OTP Authentication:** Powered by Supabase Auth with zero password vulnerability, session auto-refresh via proxy, and immediate profile provisioning.
- **🎯 100% Deterministic & Explainable Scoring:** 5-factor relevance formula with zero black-box obscurity. Every score breakdown displays matched skills, category alignment, and deadline decay.
- **⚡ Canonical Ingestion & Deduplication Engine:** Ingestion pipeline tracking source feeds (RSS, JSON, APIs), SHA-256 payload hashing, URL normalization (stripping tracking fragments), and Levenshtein fuzzy duplicate prevention.
- **🛡️ Multi-Role RBAC & Row Level Security (RLS):** Strict PostgreSQL RLS policies isolating student bookmarks, reminders, and private profiles while granting verified moderation to authorized administrators.
- **📊 Application Pipeline Kanban:** Track opportunities from Saved to Applied, Interviewing, and Offers with custom notes.
- **🔔 Deadline Reminders:** Configurable deadline alerts before application cutoffs.
- **⚖️ GDPR & DPDP Compliance:** Comprehensive data portability export (JSON archive of all user activity) and explicit consent management.
- **🎨 Rich Design System:** Bespoke dark theme aesthetics with luminous accents, glassmorphic panels, and full keyboard/screen-reader accessibility (WCAG compliant).

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack, Server Actions & Route Handlers) |
| **Language** | TypeScript (Strict mode enabled, zero `any` leaks in core modules) |
| **Database & Auth** | Supabase PostgreSQL 17 + Supabase Auth + pgvector |
| **Styling** | Vanilla CSS Design System with CSS Tokens & Micro-interactions |
| **Validation** | Zod Schemas for all client and server endpoints |
| **Testing** | Node.js native test runner (`node:test`, `node:assert`) |
| **CI/CD** | GitHub Actions (`.github/workflows/ci.yml`) |
| **Deployment Target** | Vercel Serverless Edge |

---

## 📐 Deterministic Relevance Formula

Skillora calculates a score from 0 to 100 with transparent explanations:

$$\text{Relevance Score} = \text{SkillMatch} (35\%) + \text{CategoryFit} (20\%) + \text{LocationMode} (15\%) + \text{UrgencyRecency} (15\%) + \text{TrustBonus} (15\%)$$

- **Skill Match (35%):** Exact intersection of student's verified taxonomy with opportunity requirements.
- **Category Alignment (20%):** Matches student's preferred tracks (e.g. Internships, Hackathons).
- **Location & Mode (15%):** Remote-friendly boost or university geographic radius match.
- **Urgency & Recency (15%):** Higher priority for deadlines in 1–7 days so students never miss cutoffs.
- **Trust & Verification (15%):** Source reliability index and verified badge status.

---

## ⚙️ Environment Variables

Create `.env.local` in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xrxrxgygnuqkbexzvxas.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Skillora

# Ingestion Pipeline Secret
CRON_SECRET=skillora_dev_cron_secret_secure_token_2026
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to view Skillora.

### 3. Run Automated Tests
```bash
npm test
```

### 4. Run TypeScript Check & Linter
```bash
npm run type-check
npm run lint
```

### 5. Production Build
```bash
npm run build
```

---

## 📂 Key Directory Layout

```
├── app/
│   ├── (admin)/
│   │   ├── admin/page.tsx               # Admin metrics & audit logs
│   │   ├── admin/moderation/page.tsx    # One-click approve/reject & reports
│   │   └── admin/sources/page.tsx       # Ingestion sources & manual sync runner
│   ├── (auth)/
│   │   ├── login/page.tsx               # Passwordless email OTP form
│   │   └── verify-otp/page.tsx          # 6-digit token verification
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx           # Match feed & skill gap analysis
│   │   ├── profile/page.tsx             # Student taxonomy & academic profile
│   │   ├── saved/page.tsx               # Application pipeline status tracker
│   │   ├── reminders/page.tsx           # Deadline alert center
│   │   └── settings/page.tsx            # GDPR data export & consents
│   ├── (discovery)/
│   │   ├── opportunities/page.tsx       # Search, filter, and track explorer
│   │   └── opportunities/[id]/page.tsx  # Opportunity intelligence breakdown
│   ├── api/                             # Route handlers for all resources
│   ├── globals.css                      # Custom Design System tokens & classes
│   └── layout.tsx                       # Root layout with responsive navigation
├── components/                          # Navbar, Footer, MobileNav, OpportunityCard
├── lib/
│   ├── database.types.ts                # Auto-generated Supabase database definitions
│   ├── ingestion.ts                     # URL normalization, SHA-256 & fuzzy dedup
│   ├── relevance.ts                     # Deterministic scoring engine
│   ├── supabase/                        # SSR & client Supabase factories
│   └── validations/                     # Zod input schemas
├── tests/                               # Automated unit & RLS integration tests
├── .github/workflows/ci.yml             # GitHub Actions CI workflow
├── vercel.json                          # Production deployment & security headers
└── proxy.ts                             # Next.js 16 session refresh proxy
```

---

## 📜 License & Compliance

Skillora is built in accordance with GDPR and DPDP data sovereignty principles. User audit trails and consent logs are cryptographically verifiable.
