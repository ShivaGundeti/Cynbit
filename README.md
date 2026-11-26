# Cynbit Careers & Talent Platform - Technical Assessment

Hi! This project is my technical assessment submission for the Full Stack Developer Intern role at Cynbit.

I spent time exploring the official [cynbit.in](https://cynbit.in) website as both a user and a developer, looking for areas where we could make a practical and meaningful improvement. Here is what I observed, what I decided to build, and how it works.

---

## 1. What I Found (The Problems)

While going through the website and inspecting the network calls, I noticed three main things:

1. **Static Job & Internship Openings:**
   - When checking the Network tab on `/careers`, I noticed that job listings aren't coming from an API or database. They are hardcoded directly into the frontend.
   - If HR wants to post a new opening, close a role, or update requirements, a developer has to manually edit the code and redeploy the site every single time.
   - There is no dynamic filtering or search.

2. **The Resume & Application Experience:**
   - Right now, Cynbit asks candidates to paste a Google Drive link for their resume.
   - I realized why: storing thousands of PDF files on servers costs money, and links are free.
   - But as a candidate, this causes friction. Candidates have to remember to set Google Drive permissions to "Public / Anyone with link". If they forget, recruiters get "Access Denied" and cannot view the resume.
   - Candidates also have to fill out long forms with duplicate information that is already present inside their resume.

3. **Page-reload Glitches:**
   - In sections like blogs and insights, clicking pagination triggers a full page reload, losing scroll position.

---

## 2. My Proposed Solution

Instead of just fixing small CSS styling issues, I wanted to build a complete, production-ready **Careers & Smart Application System** that solves real problems for both candidates and recruiters:

### A. Candidate Side:
- **Dynamic Job Board:** Search and filter jobs by department (Engineering, Growth, AI) and type (Full Time, Internship) with instant results and no full page reloads.
- **Smart Resume Auto-Fill:** Candidates upload their resume (PDF). Our backend extracts their key details (Name, Email, Phone, Skills, GitHub/LinkedIn) and auto-fills the form fields for them.
- **Direct Resume Upload with Smart Cost Management:**
  - Instead of forcing Google Drive links, candidates can upload their PDF directly.
  - To solve the storage cost problem, we implement a **Retention & Cleanup Strategy**:
    - If a recruiter reviews an applicant and clicks **Reject**, the resume file is immediately deleted from storage to free up space.
    - If an application stays inactive for over 30 days without review, an automated cleanup task purges the file.
    - This keeps storage usage low and eliminates cloud cost worries while giving candidates a 10x better experience.

### B. Recruiter Side:
- **Job Management:** Recruiters can add new job openings, edit descriptions/experience, close roles, or delete them through a clean dashboard. Changes appear on the public career board immediately.
- **Application Viewer:** Recruiters can view all submitted candidate profiles, their extracted skills, and preview their resume.

---

## 3. How It Is Built (Tech Stack & Architecture)

- **Frontend & Backend:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Database & Storage:** Supabase (PostgreSQL for structured data + Supabase Storage for resume files with Row Level Security)
- **Deployment:** Vercel

---

## 4. API Endpoints Built

### Jobs
- `GET /api/job` — Fetch active openings (supports `?department=...` and `?type=...`)
- `POST /api/job` — Create a new opening
- `PUT /api/job/[id]` — Update job details or change status (Active/Closed)
- `DELETE /api/job/[id]` — Remove an opening

### Applications
- `POST /api/applications` — Submit candidate application with attached resume
- `GET /api/applications` — Fetch applications for recruiter review
- `DELETE /api/applications/[id]` — Delete application and clean up attached resume file

---

## 5. How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/ShivaGundeti/Cynbit.git
   cd Cynbit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.
