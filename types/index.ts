
export interface Job {
  id: string;
  title: string;
  department: string;
  type: string;
  work_mode?: string;
  workMode?: string;
  location: string;
  experience: string;
  description: string;
  responsibilities?: string[];
  skills_required?: string[];
  skillsRequired?: string[];
  status: string;
  created_at?: string;
  createdAt?: string;
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