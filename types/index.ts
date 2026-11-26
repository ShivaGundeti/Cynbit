
export interface Job {
  id: string;
  title: string;
  department: "Engineering" | "Marketing" | "HR" | "Operations";
  type: 'Full Time' | 'Internship';
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  location: string;
  experience: string;
  description: string;
  responsibilities: string[];
  skillsRequired: string[];
  status: 'Active' | 'Closed';
  createdAt: string;
}


export interface ParsedProfile {
  fullName?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  skills: string[];
  summary?: string;
  rawTextPreview?: string;
}


export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  skills: string[];
  resumeFileName?: string;
  coverNote?: string;
  status: 'Submitted' | 'In Review' | 'Shortlisted' | 'Rejected';
  submittedAt: string;
}