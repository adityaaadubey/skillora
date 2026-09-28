# Skillora Database Architecture

Skillora utilizes **PostgreSQL** provisioned via **Supabase** with Row Level Security (RLS), custom triggers, and cryptographic stored procedures.

---

## Directory Structure

```
database/
├── schema.sql              # Complete PostgreSQL DDL (Tables, Indexes, Constraints)
├── rls_policies.sql        # Row Level Security policies (Zero-Trust Security Model)
├── functions_triggers.sql  # Automated user triggers, timestamp updates & account deletion
├── seeds.sql               # Canonical verified opportunity sources and default seeds
└── README.md               # This architectural reference guide
```

---

## Entity Relationship Overview

```
                      +-------------------+
                      |    auth.users     | (Supabase Auth)
                      +---------+---------+
                                |
             +------------------+------------------+
             |                                     |
             v 1:1                                 v 1:1
     +---------------+                     +--------------------+
     |   profiles    |                     | organizer_profiles |
     +-------+-------+                     +--------------------+
             |
             +-----------------+-----------------+
             | 1:N             | 1:N             | 1:N
             v                 v                 v
   +-------------------+ +-------------+ +---------------+
   |saved_opportunities| |  reminders  | | user_consents |
   +---------+---------+ +------+------+ +---------------+
             |                  |
             +--------+---------+
                      | N:1
                      v
             +-----------------+
             |  opportunities  |
             +--------+--------+
                      | N:1
                      v
             +--------------------+
             |opportunity_sources |
             +--------------------+
```

---

## Core Tables

| Table | Description | Access Model |
| :--- | :--- | :--- |
| `public.opportunities` | Verified opportunities (internships, hackathons, scholarships, etc.) | Public read for approved items; Admin write; User submit |
| `public.profiles` | Student & user attributes (college, degree, branch, skills) | User own read/write; Admin read |
| `public.organizer_profiles` | Company/organization verified details | Organizer own read/write; Admin read |
| `public.user_roles` | Role-based authorization mapping (`student`, `organizer`, `admin`) | User read own; Admin full |
| `public.saved_opportunities` | Bookmarked opportunities and application progress states | User read/write own |
| `public.opportunity_reminders` | Scheduled notifications for deadlines | User read/write own |
| `public.user_consents` | Privacy and telemetry consents (GDPR / DPDP compliance) | User read/write own |
| `public.audit_logs` | Security and authentication event audit trail | Admin read only |

---

## Applying Migrations

You can apply the SQL scripts via the Supabase Dashboard SQL Editor or via the Supabase CLI:

```bash
supabase db push
# Or run individual SQL files
psql $DATABASE_URL -f database/schema.sql
psql $DATABASE_URL -f database/rls_policies.sql
psql $DATABASE_URL -f database/functions_triggers.sql
```
