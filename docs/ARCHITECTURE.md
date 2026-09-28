# Skillora System Architecture

Skillora is an intelligence platform for students and organizers that crawls, deduplicates, verifies, and scores tech opportunities deterministically.

---

## High-Level Architecture Diagram

```
[ Opportunity Crawlers / Feeds ]
           │
           ▼
[ Ingestion & Deduplication Pipeline (lib/ingestion.ts) ]
  - Canonical URL Normalization
  - Levenshtein Title Fuzzy Matching
  - Exact Payload SHA-256 Hash
           │
           ▼
[ Supabase PostgreSQL ] ◄───► [ Row Level Security (RLS) ]
  - opportunities               - Public read on approved
  - profiles                    - Own profile write
  - saved_opportunities         - Cascading account delete
           │
           ▲
[ Deterministic Relevance Engine (lib/relevance.ts) ]
  - Direct Skill Overlap (+40%)
  - Work Mode Alignment (+20%)
  - Location Match (+15%)
  - Deadline Decay Penalty (-30%)
           │
           ▼
[ Next.js 16 Fullstack App Router ]
  ├── Client UI (React 19, Components, MobileNav, Glassmorphism)
  └── REST Server Handlers (/api/auth, /api/opportunities, /api/user)
```

---

## Key Subsystems

1. **Ingestion & Deduplication Engine (`lib/ingestion.ts`)**:
   - Strips UTM tags, trailing slashes, and protocol variances to compute a `canonical_url`.
   - Generates deterministic slugs from organization and title.
   - Computes SHA-256 payload hashes to prevent duplicate crawler entries.
   - Applies Levenshtein distance calculations to detect near-duplicate opportunity titles.

2. **Deterministic Relevance Engine (`lib/relevance.ts`)**:
   - Produces a transparent `0 - 100%` match score without black-box hallucinations.
   - Weights: Skill overlap (40 pts), Mode preference (20 pts), Education level (15 pts), Category match (15 pts), Recency (10 pts).
   - Automatically penalizes expired opportunities.

3. **Zero-Trust Security & Privacy Model**:
   - Zero OTP friction: Streamlined email + password authentication.
   - Direct account deletion via PostgreSQL `delete_my_account(p_user_id)` procedure.
   - Strict RLS ensuring users can only read and mutate their own bookmarks and settings.
