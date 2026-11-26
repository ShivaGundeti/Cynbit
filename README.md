# Cynbit Next-Gen Career & Recruitment Automation Platform

> **Candidate:** Shiva Kumar Gundeti  
> **Role Applied:** Full Stack Developer Intern  
> **Company:** Cynbit Technologies (`https://cynbit.in`)  
> **Live Production URL:** [https://cynbit-drab.vercel.app/](https://cynbit-drab.vercel.app/)  
> **Project Repository:** [https://github.com/ShivaGundeti/Cynbit.git](https://github.com/ShivaGundeti/Cynbit.git)  

---

## 1. Executive Summary & Problem Audit

During an audit of Cynbit's production platform ([cynbit.in](https://cynbit.in)), I analyzed the architecture, network payloads, user experience, and recruitment workflows from both candidate and technical perspectives. This uncovered four critical operational bottlenecks:

### Problem 1: Hardcoded, Static Job Listings
- **The Issue:** Job and internship openings on `/careers` are hardcoded directly into Next.js React Server Component chunks (`_rsc`).
- **The Bottleneck:** Whenever HR opens a new position, modifies requirements, or closes a filled role, a developer must manually edit frontend source code, commit, and trigger a complete production redeployment.
- **Candidate Impact:** Candidates cannot search by keyword or filter by department, work mode, or location.

### Problem 2: Application Friction & The "Google Drive" Dilemma
- **The Issue:** The existing career forms require candidates to paste a Google Drive share link rather than uploading a file.
- **The Trade-Off:** File storage on cloud providers incurs ongoing costs, so free external links were chosen as a workaround.
- **The Real-World Friction:** Candidates frequently forget to set Google Drive link permissions to *"Anyone with the link can view"*, resulting in recruiters encountering `403 Access Denied` screens.
- **Candidate Fatigue:** Applicants are required to manually fill out 20+ repetitive form fields (Name, Phone, College, Degree, Graduation Year, Skills, Links) that already exist within their resume.

### Problem 3: Zero Internal Recruitment Management
- **The Issue:** There was no authenticated recruiter dashboard.
- **The Bottleneck:** HR talent leads lacked an internal interface to review incoming candidate dossiers, update application statuses (`Under Review`, `Shortlisted`, `Rejected`), inspect resumes, or publish new openings without engineering support.

### Problem 4: Footer & Visual Hierarchy Gaps
- **The Issue:** The production footer had unaligned contact information, hidden headquarters location text, small social links, and broken floating animation physics.

---

## 2. The Solution: Architecture & Key Features

To solve these systemic problems, I engineered the **Cynbit Next-Gen Career & Recruitment Automation Platform** — an end-to-end, full-stack recruitment operating system built on Next.js 16, TypeScript, Tailwind CSS, and Supabase PostgreSQL.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CYNBIT CAREER ECOSYSTEM                         │
└────────────────────────────────────────────────────────────────────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
┌────────────────────────────────┐     ┌────────────────────────────────┐
│      CANDIDATE EXPERIENCE      │     │      RECRUITER OPERATIONS      │
├────────────────────────────────┤     ├────────────────────────────────┤
│ • Dynamic Filterable Board     │     │ • Centered Passkey Gate        │
│ • Dedicated Role View          │     │ • Live Job Management (CRUD)   │
│ • Smart Resume Auto-Fill Engine│     │ • Full-Page Candidate Dossier  │
│ • Embedded PDF Preview         │     │ • Embedded Chrome PDF Viewer   │
│ • Dual Confetti Celebrations   │     │ • One-Click Decision Pipeline  │
└────────────────────────────────┘     └────────────────────────────────┘
                 │                                     │
                 └──────────────────┬──────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             DATA LIFECYCLE & STORAGE GOVERNANCE LAYER                  │
├────────────────────────────────────────────────────────────────────────┤
│ • Immediate PDF Purge upon Rejection (Zero Storage Bloat)              │
│ • Automated 30-Day Inactivity Cron Task (/api/cron/cleanup)            │
│ • In-Memory Parsing & Base64 Binary Synchronization                    │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Technical Capabilities:

1. **Dynamic Job Board with Client-Side Instant Filtering:**
   - Real-time search across role titles, departments, work modes, and locations.
   - Dual-tab view: **Internships** vs **Full Time** with animated sliding underline.
   - 2-Column wide job cards with highlighted experience badges (`Experience: 0-1 Years`) and teal hover effects.

2. **Dedicated Role Specifications Page (`/careers/[id]`):**
   - Full role breakdown: About the Role, Key Responsibilities checklist, Professional Requirements, and Core Benefits card.
   - No modal clutter — opens as a clean dedicated page.

3. **Smart Resume Auto-Fill Engine (`/api/resume/parse`):**
   - Candidates drag-and-drop their PDF resume into a clean dropzone.
   - Server-side in-memory text extraction parses the PDF and auto-populates 15+ application fields (Full Name, Email, Phone, College, Degree, Specialization, Graduation Year, Technical Skills, City, GitHub/LinkedIn).
   - Empty defaults: No hardcoded sample values forcing users to backspace.

4. **Zero-Cost Data Retention & Lifecycle Purge (`/api/cron/cleanup`):**
   - **Immediate Purge on Rejection:** When HR marks an applicant as `Rejected`, the binary PDF payload is automatically purged from the database (`resume_url: null`), maintaining candidate audit history while eliminating storage costs.
   - **Automated 30-Day Inactivity Cron:** A scheduled serverless cron job (`schedule: "0 2 * * *"` in `vercel.json`) scans for applications unreviewed for over 30 days and scrubs inactive files.
   - **Manual Trigger in UI:** A 1-click `"Auto-Purge Inactive"` button in the recruiter dashboard allows HR leads to trigger retention cleanup on demand.

5. **Authenticated Recruiter Operations Dashboard:**
   - **Passkey Protection:** Prototype login gate (`cynbit2026`) with 1-click Quick Demo Login.
   - **Live Job Management:** Create new openings with full specifications (Title, Dept, Type, Mode, Location, Experience, Skills, Responsibilities), edit existing openings via `PUT /api/job/[id]`, or delete roles.
   - **Candidate Dossier Page (2-Column Split):**
     - **Left Side:** Embedded PDF preview container fitted tightly to the document with a full-width `"See PDF"` button that opens the actual PDF file in a new Chrome tab.
     - **Right Side:** High-contrast applicant profile with teal headings (`#006067`), verified skill badges, contact details, academic qualifications, and real-time decision buttons (**Under Review**, **Shortlist**, **Reject**).

6. **Production-Grade Footer:**
   - Redesigned with a prominent Headquarters card (Jaipur, Rajasthan), grouped contact info, enlarged social icons (LinkedIn, Instagram, Facebook, X), and clear legal links.

---

## 3. End-to-End Walkthrough & How to Use

### A. Candidate Journey (Browse, Auto-Fill & Apply)

1. **Explore Positions:**
   - Navigate to the homepage at `http://localhost:3000` and scroll to the **Current Opportunities** section (or click *Explore Careers →* in the Hero).
   - Use the sticky sidebar to filter by **Department** (*Core Engineering*, *AI & Data*, *Growth*), **Work Mode** (*Remote*, *Hybrid*, *On-site*), **Location**, or **Stipend**.
   - Switch between **Internships** and **Full Time** using the tab buttons.

2. **Inspect Role Details:**
   - Click the teal **`VIEW DETAILS`** button on any role card (e.g., *Full Stack Developer Intern*).
   - You are routed to `/careers/[id]`, showing the role specifications, responsibilities checklist, and qualifications.

3. **Smart Resume Drop & Auto-Fill:**
   - Scroll to the **"SUBMIT YOUR BLUEPRINT"** form.
   - Drag and drop your PDF resume into the **`Drop your resume here`** box (or click to upload).
   - Watch the form fields automatically populate with your extracted name, email, phone, college, degree, graduation year, technical skills, and city.
   - Fill in your why-cynbit statement and click **`SUBMIT APPLICATION`**.
   - A dual-corner celebratory confetti cannon explodes across the screen to confirm submission.

---

### B. Recruiter Journey (Manage Roles, Inspect Candidates & Retention)

1. **Access Recruiter Mode:**
   - In the top Navbar, toggle the switcher from **`Candidate`** to **`Recruiter`**.
   - You will see the centered **Internal Recruiter Gate**.
   - Enter passkey `cynbit2026` or click **`Quick 1-Click Demo Login`**.

2. **Manage Openings Tab:**
   - View all live job openings in clean cards.
   - Filter openings by **All**, **Internship**, or **Full Time**.
   - Click **`View Details`** on any opening to inspect its specifications.
   - Click **`Edit Role`** to modify the title, department, location, experience, or skills and click **`Save Changes`** (persisted via `PUT /api/job/[id]`).
   - Click **`Delete Role`** to remove a role from the platform.
   - Click **`+ POST NEW ROLE`** to launch the comprehensive modal with all fields (Title, Dept, Type, Mode, Location, Experience, Skills, Responsibilities).

3. **Candidate Inbox Tab & Dossier Review:**
   - Switch to the **`Candidate Inbox`** tab.
   - Hover over applicant rows to see the focused teal border and subtle scaling animation.
   - Click on any candidate row (e.g., *Shiva Kumar Gundeti*).
   - You are transitioned to the dedicated **2-Column Candidate Dossier**:
     - **Left Side:** Real embedded PDF viewer displaying the uploaded resume, with a full-width **`See PDF`** button below to open the PDF in a dedicated Chrome tab.
     - **Right Side:** Candidate personal details, academics, extracted skills badges, and application statement.

4. **Decision Pipeline & Automated Retention:**
   - Click **`Under Review`** or **`Shortlist Candidate`** to update the applicant's status in Supabase.
   - Click **`Reject Application`**: The API immediately purges the resume file from storage (`resume_url: null`) while retaining audit data, and displays the *Automated Data Hygiene Active* banner.
   - Click **`Auto-Purge Inactive`** in the top bar to run the background lifecycle routine and view the real-time cleanup metrics.

---

## 4. API Architecture

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/job` | Fetch active openings with `?department=` and `?type=` query filters |
| `POST` | `/api/job` | Create a new role with title, department, work mode, location, experience, and skills |
| `GET` | `/api/job/[id]` | Fetch single role specification by UUID |
| `PUT` | `/api/job/[id]` | Update role attributes or toggle active/closed status |
| `DELETE` | `/api/job/[id]` | Permanently remove a role opening |
| `POST` | `/api/resume/parse` | In-memory PDF text extraction and entity heuristic parsing |
| `POST` | `/api/application` | Submit full candidate application with base64 PDF payload |
| `GET` | `/api/application` | Fetch all applications for recruiter review with status filtering |
| `GET` | `/api/application/[id]` | Fetch single candidate application record |
| `PUT` | `/api/application/[id]` | Update candidate status (`In Review`, `Shortlisted`, `Rejected` + immediate file purge) |
| `DELETE` | `/api/application/[id]` | Delete application and clean up attached records |
| `GET/POST`| `/api/cron/cleanup` | Serverless lifecycle cron routine for 30-day inactivity & rejected file purge |

---

## 5. Tech Stack & Design Tokens

- **Framework:** Next.js 16 (App Router with Turbopack)
- **Language:** TypeScript 5 (Strict Mode, 0 errors)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL with Row Level Security)
- **Icons:** Lucide React (Clean inline SVGs for brand logos)
- **Primary Brand Color:** `#006067` (Deep Teal / `rgb(0, 96, 103)`)
- **Typography:** Google Font `Manrope` (Weights: 400, 500, 600, 700, 800)
- **Automated Scheduling:** Vercel Cron (`vercel.json`)

---

## 6. How to Run Locally

### Prerequisites:
- Node.js 18+ installed
- Git

### Steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ShivaGundeti/Cynbit.git
   cd Cynbit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Visit [http://localhost:3000](http://localhost:3000)

6. **Verify production build:**
   ```bash
   npm run build
   ```

---

## 7. Submission Checklist

- [x] Production website audit completed and documented
- [x] Next-Gen Career & Recruitment Automation Platform built
- [x] Dynamic PostgreSQL-backed job board with real-time filters
- [x] Smart resume auto-fill engine with in-memory parsing
- [x] Authenticated Recruiter Operations Dashboard (`cynbit2026`)
- [x] 2-Column candidate dossier with embedded PDF viewer & decision pipeline
- [x] Data lifecycle management (immediate rejection purge + 30-day cron cleaner)
- [x] Redesigned production-grade Cynbit footer
- [x] TypeScript verified (`npx tsc --noEmit` exited with code 0)
- [x] Turbopack production build verified (`npm run build` exited with code 0)
