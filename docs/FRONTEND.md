# Skillora Frontend Architecture

The frontend is built using **Next.js 16 (App Router)**, **React 19**, and **Vanilla CSS Design Tokens**, adhering to clean code standards and high visual polish.

---

## Folder Layout

```
skillora/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Direct Email + Password Sign In
│   │   └── register/page.tsx       # Student & Organizer Registration (Immediate session)
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx      # Student Intelligence Workspace & Match Hub
│   │   ├── profile/page.tsx        # Academic Profile & Skill Management
│   │   ├── reminders/page.tsx      # Deadline Tracker & Alert Scheduler
│   │   ├── saved/page.tsx          # Application Kanban (Saved, Applied, Interviewing)
│   │   └── settings/page.tsx       # GDPR / DPDP Consent, Data Export & Account Deletion
│   ├── admin/
│   │   ├── moderation/page.tsx     # Opportunity Approval / Rejection Console
│   │   └── sources/page.tsx        # Crawler Feeds & Ingestion Source Management
│   ├── opportunities/
│   │   ├── page.tsx                # Catalog with Multi-Filter, Search, & Dynamic Badges
│   │   └── [id]/page.tsx           # Detail View with Match Score & Direct Apply Link
│   ├── layout.tsx                  # Root Shell with Glassmorphism Navbar & Mobile Navigation
│   ├── page.tsx                    # Premium Landing Page with Dynamic Live Stats
│   └── globals.css                 # Curated HSL Theme System & Micro-animations
├── components/
│   ├── Navbar.tsx                  # Responsive Sticky Navbar with Theme Switcher & Logout
│   ├── OpportunityCard.tsx         # Opportunity Card Component with Provenance & Badges
│   ├── SaveButton.tsx              # Quick Bookmark / Status Toggle Button
│   ├── SearchFilterBar.tsx         # Unified Filter & Search Bar with Debouncing
│   ├── DeadlineBadge.tsx           # Dynamic Deadline Urgency Indicator (Expired, Soon, Normal)
│   └── ConfirmModal.tsx            # Accessible Glassmorphic Confirmation Modal
```

---

## Design System & Theme Engine

Skillora uses a curated token system in `globals.css` supporting both **Dark Mode (Default)** and **Light Mode**:

- **Glassmorphism**: `backdrop-filter: blur(16px)` on headers, panels, and modal cards.
- **Accents**:
  - Primary Indigo: `#6366f1`
  - Secondary Cyan: `#06b6d4`
  - Emerald Verified: `#10b981`
  - Amber Deadline: `#f59e0b`
  - Rose Danger: `#f43f5e`
- **Responsive Layout**: Fluid typography with `clamp()`, flexible grids (`repeat(auto-fill, minmax(320px, 1fr))`), and bottom mobile nav bar for screens under 768px.
