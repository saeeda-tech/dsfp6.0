# VerdantJobs 🌿 - Job Posting & Application Portal

A modern, full-stack application for managing job postings, reviewing candidates, and submitting job applications. Built with a bespoke **Dark Green** primary design system (`#0F3D2E` / `#0A2F1D` / `#166534`) and zero external npm dependencies using Node.js's built-in SQLite engine (`node:sqlite`).

---

## 🌟 Key Features

### 🛡️ Admin Capabilities
- **Post Jobs**: Publish new openings with detailed fields (Title, Company, Location, Employment Type, Category, Experience Level, Salary Range, Role Description, Requirements, and Perks).
- **Update Jobs**: Edit any existing job post in real-time (update responsibilities, adjust salary ranges, change status to Active/Closed/Draft).
- **1-Click Status Toggling**: Pause or resume applications with an instant toggle between Active and Closed.
- **Delete Jobs**: Remove outdated listings with safety confirmation.
- **Applicant Pipeline Management**:
  - Filter candidates by position or application status (`Pending`, `Reviewed`, `Shortlisted`, `Rejected`, `Hired`).
  - View full applicant profiles including cover letters and portfolio links.
  - **Download Candidate Resumes** with one click.
  - Change recruitment status with instant database persistence.
- **Analytics Dashboard**: Live metrics tracking Active Openings, Total Listings, Total Applicants, and Shortlisted Candidates.

### 👤 Candidate / User Capabilities
- **Job Discovery & Search**:
  - Real-time keyword search (title, company, skills, location).
  - Category filters (Engineering, Design, Marketing, Product, Sales, Support).
  - Employment type checkboxes (Full-time, Part-time, Remote, Hybrid).
  - Experience level filters (Entry, Mid, Senior, Lead).
  - Sorting by newest, highest salary, or company name.
- **Detailed Job View**: Comprehensive modal breakdown of role responsibilities, skill requirements, compensation, and benefits.
- **Direct Application Submission**:
  - Intuitive application modal with validation.
  - Drag-and-drop **Resume Upload** (PDF, DOCX, TXT support).
  - Note to hiring manager / Cover letter input.
- **"My Applications" Tracker**: Candidates can monitor the live review status of every role they've applied for from their browser.

### 🎨 Design & Aesthetic
- Primary color: **Dark Green** (`#0F3D2E`), forest pine accents (`#0A2F1D`), vibrant emerald badges (`#10B981` / `#34D399`), and clean high-contrast slate surfaces.
- Fully responsive across desktop, tablet, and mobile.
- Instant role switcher pill in the top navigation bar to seamlessly toggle between **Candidate View** and **Admin Workspace**.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v22 or higher (tested on Node v24). Zero external npm package installations required!

### Running the App
1. Open your terminal in this project directory:
   ```bash
   npm start
   ```
   *or*
   ```bash
   node server.js
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🗄️ Database Architecture (`node:sqlite`)

The database (`jobs.db`) is automatically initialized and pre-seeded with realistic sample jobs and applicant data:

### `jobs` Table
- `id` (TEXT PRIMARY KEY)
- `title`, `company`, `location`, `job_type`, `category`, `experience`
- `salary_min`, `salary_max`, `salary_currency`
- `description`, `requirements`, `benefits`
- `status` (`'active'`, `'closed'`, `'draft'`)
- `created_at`, `updated_at`

### `applications` Table
- `id` (TEXT PRIMARY KEY)
- `job_id` (FOREIGN KEY REFERENCES `jobs(id)`)
- `applicant_name`, `applicant_email`, `applicant_phone`
- `portfolio_url`, `experience_years`, `cover_letter`
- `resume_name`, `resume_data` (Base64 data URL)
- `status` (`'pending'`, `'reviewed'`, `'shortlisted'`, `'rejected'`, `'hired'`)
- `notes`, `created_at`

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/jobs` | Retrieve all jobs (supports `?search=`, `?category=`, `?status=`) |
| `GET` | `/api/jobs/:id` | Get details and applicant count for a single job |
| `POST` | `/api/jobs` | Admin create new job listing |
| `PUT` | `/api/jobs/:id` | Admin update existing job listing |
| `DELETE` | `/api/jobs/:id` | Admin delete job listing |
| `POST` | `/api/jobs/:id/apply` | Candidate apply for a position (with resume payload) |
| `GET` | `/api/applications` | Admin list all candidate applications |
| `GET` | `/api/applications/:id` | View single application details |
| `PATCH` | `/api/applications/:id` | Admin update application recruitment status |
| `GET` | `/api/applications/:id/resume`| Download candidate's uploaded resume |
| `GET` | `/api/stats` | Real-time portal stats (counts & statuses) |
| `POST` | `/api/reset` | Reset database to sample seed state |

