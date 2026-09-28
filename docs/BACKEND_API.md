# Skillora Backend & REST API Reference

The backend operates via Next.js Route Handlers with Supabase PostgreSQL and server-side session management.

---

## Authentication APIs

### 1. `POST /api/auth/signup`
Creates a student or organizer account and establishes an authenticated session immediately without OTP friction.
- **Request Body:**
  ```json
  {
    "email": "student@university.edu",
    "password": "Password123!",
    "fullName": "Alex Morgan",
    "role": "student",
    "college": "MIT",
    "degree": "B.Tech Computer Science",
    "graduationYear": 2026
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "session": true,
    "user": {
      "id": "uuid",
      "email": "student@university.edu",
      "role": "student",
      "fullName": "Alex Morgan"
    }
  }
  ```

### 2. `POST /api/auth/login`
Authenticates a user via email and password, establishing HTTP-only session cookies.
- **Request Body:**
  ```json
  {
    "email": "student@university.edu",
    "password": "Password123!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "user": {
      "id": "uuid",
      "email": "student@university.edu",
      "role": "student",
      "fullName": "Alex Morgan"
    }
  }
  ```

### 3. `POST /api/auth/logout`
Terminates the active session and clears authentication cookies.
- **Response (200 OK):**
  ```json
  { "success": true, "message": "Logged out successfully" }
  ```

---

## Opportunities APIs

### 1. `GET /api/opportunities`
Fetches verified opportunities with multi-faceted filtering, searching, and pagination.
- **Query Parameters:**
  - `q` (string): Search query for title, company, or skills.
  - `category` (`internship` | `hackathon` | `scholarship` | `fellowship` | `competition` | `course`)
  - `mode` (`remote` | `hybrid` | `on-site`)
  - `pricing_type` (`free` | `paid`)
  - `platform` (e.g. `Google Careers`, `Unstop`, `Devpost`, etc.)
  - `sort` (`match` | `deadline` | `newest`)
  - `page` (integer, default `1`)
  - `limit` (integer, default `12`)
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "title": "OpenAI Autonomous Agents Global Hackathon",
        "organization": "OpenAI Ecosystem",
        "category": "hackathon",
        "mode": "remote",
        "is_verified": true,
        "is_featured": true,
        "deadline": "2026-10-06T00:00:00Z",
        "skills": ["Python", "OpenAI API", "LangChain"],
        "match_score": 75
      }
    ],
    "pagination": {
      "total": 33,
      "page": 1,
      "limit": 12,
      "totalPages": 3
    }
  }
  ```

### 2. `GET /api/opportunities/:id`
Retrieves full details for an opportunity, including eligibility, compensation, and application link.

### 3. `POST /api/opportunities/:id/save`
Bookmarks an opportunity or updates application stage (`saved`, `applying`, `applied`, `interviewing`, `offered`, `rejected`).

### 4. `DELETE /api/opportunities/:id/save`
Removes an opportunity from saved bookmarks.

---

## User & Account Management APIs

### 1. `GET /api/user/profile`
Fetches authenticated user profile, academic history, and configured preferences.

### 2. `DELETE /api/user/delete`
Permanently deletes user account, bookmarks, and personal data from `auth.users` with cascading cleanup.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Your Skillora account and all personal data have been permanently deleted."
  }
  ```

### 3. `GET /api/user/export`
Exports all user data (profile, bookmarks, click history, consents) in machine-readable JSON format for GDPR/DPDP data portability.
