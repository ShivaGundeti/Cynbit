'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase, Users, Plus, CheckCircle, XCircle, Clock,
  Trash2, ExternalLink, Loader2, RefreshCw, Lock, KeyRound,
  Sparkles, LogOut, ShieldCheck, Edit3, X, Eye, FileText, CheckCircle2, ChevronRight, ArrowLeft,
  Mail, Phone, MapPin, Globe, GraduationCap
} from 'lucide-react';
import { Job, Application } from '@/types';

export default function RecruiterDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'openings' | 'applications'>('openings');
  const [openingsFilter, setOpeningsFilter] = useState<'All' | 'Internship' | 'Full Time'>('All');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Recruiter Viewing/Editing a Specific Job
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [editJobData, setEditJobData] = useState({
    title: '',
    department: '',
    type: '',
    location: '',
    experience: '',
    description: '',
    skills_required: '',
  });
  const [updatingJob, setUpdatingJob] = useState(false);

  // Recruiter Viewing a Specific Candidate Application Drawer
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);

  // Post New Job Modal
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [creatingJob, setCreatingJob] = useState(false);
  const [newJobData, setNewJobData] = useState({
    title: '',
    department: 'Core Engineering',
    type: 'Full Time',
    work_mode: 'Remote',
    location: 'Remote / Jaipur',
    experience: '0-1 Years',
    description: '',
    responsibilities: '',
    skills_required: '',
  });

  const DEMO_PASSCODE = 'cynbit2026';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === DEMO_PASSCODE || passcode.trim().toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid passkey. Use cynbit2026 or click 1-Click Demo Login.');
    }
  };

  const handleQuickDemoLogin = () => {
    setPasscode(DEMO_PASSCODE);
    setIsAuthenticated(true);
    setLoginError('');
  };

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/job');
      const data = await res.json();
      if (data.jobs) setJobs(data.jobs);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch applications
  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/application');
      const data = await res.json();
      if (data.applications) setApplications(data.applications);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([fetchJobs(), fetchApplications()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Open Job Detail View in Recruiter Mode
  const handleOpenJobDetails = (job: Job) => {
    setSelectedJob(job);
    setIsEditingJob(false);
    setEditJobData({
      title: job.title,
      department: job.department,
      type: job.type,
      location: job.location,
      experience: job.experience,
      description: job.description,
      skills_required: (job.skills_required || []).join(', '),
    });
  };

  // Save Job Updates via PUT
  const handleSaveJobUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    try {
      setUpdatingJob(true);
      const res = await fetch(`/api/job/${selectedJob.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editJobData.title,
          department: editJobData.department,
          type: editJobData.type,
          location: editJobData.location,
          experience: editJobData.experience,
          description: editJobData.description,
          skills_required: editJobData.skills_required.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        setIsEditingJob(false);
        await fetchJobs();
        // Update local selected job
        setSelectedJob(prev => prev ? {
          ...prev,
          title: editJobData.title,
          department: editJobData.department,
          type: editJobData.type,
          location: editJobData.location,
          experience: editJobData.experience,
          description: editJobData.description,
          skills_required: editJobData.skills_required.split(',').map(s => s.trim()).filter(Boolean),
        } : null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingJob(false);
    }
  };

  // Create Job
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreatingJob(true);
      const res = await fetch('/api/job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newJobData.title,
          department: newJobData.department,
          type: newJobData.type,
          work_mode: newJobData.work_mode,
          location: newJobData.location,
          experience: newJobData.experience,
          description: newJobData.description,
          responsibilities: newJobData.responsibilities
            ? newJobData.responsibilities.split('\n').map((r) => r.trim()).filter(Boolean)
            : [],
          skills_required: newJobData.skills_required
            ? newJobData.skills_required.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
        }),
      });

      if (res.ok) {
        setShowAddJobModal(false);
        setNewJobData({
          title: '',
          department: 'Core Engineering',
          type: 'Full Time',
          work_mode: 'Remote',
          location: 'Remote / Jaipur',
          experience: '0-1 Years',
          description: '',
          responsibilities: '',
          skills_required: '',
        });
        await fetchJobs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingJob(false);
    }
  };

  // Delete Job
  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this opening?')) return;
    try {
      await fetch(`/api/job/${id}`, { method: 'DELETE' });
      if (selectedJob?.id === id) {
        setSelectedJob(null);
      }
      await fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  // Update Application Status
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/application/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchApplications();
      if (selectedApplication?.id === id) {
        setSelectedApplication((prev: any) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper: Generate styled resume document HTML for preview & print
  const generateResumeHtml = (app: any) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>${app.full_name || 'Candidate'} - Resume</title>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Manrope', -apple-system, sans-serif;
          background: #f8fafc;
          padding: 24px 16px;
          display: flex;
          justify-content: center;
          color: #1e293b;
        }
        .page {
          background: #ffffff;
          width: 100%;
          max-width: 650px;
          min-height: 850px;
          padding: 40px 36px;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          border: 1px solid #e2e8f0;
        }
        .header h1 { font-size: 26px; font-weight: 800; color: #0f172a; margin-bottom: 4px; letter-spacing: -0.02em; }
        .header .contact { font-size: 11.5px; font-weight: 600; color: #475569; margin-bottom: 18px; display: flex; flex-wrap: wrap; gap: 8px; }
        .section-heading {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #006067;
          border-bottom: 2px solid #e6f3f4;
          padding-bottom: 4px;
          margin-top: 20px;
          margin-bottom: 10px;
        }
        .edu-title { font-size: 13.5px; font-weight: 800; color: #0f172a; }
        .edu-sub { font-size: 12px; font-weight: 600; color: #64748b; margin-top: 2px; }
        .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
        .skill-pill {
          background: #f0fdfa;
          color: #006067;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 9px;
          border-radius: 6px;
          border: 1px solid #ccfbf1;
        }
        .statement { font-size: 12px; line-height: 1.6; color: #334155; font-style: italic; background: #fafafa; padding: 12px 14px; border-radius: 8px; border-left: 3px solid #006067; margin-top: 6px; }
        .links { font-size: 11.5px; font-weight: 600; margin-top: 6px; }
        .links a { color: #006067; text-decoration: none; margin-right: 14px; }
        @media print {
          body { background: #fff; padding: 0; }
          .page { border: none; box-shadow: none; padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="header">
          <h1>${app.full_name || 'Candidate'}</h1>
          <div class="contact">
            <span>📧 ${app.email || ''}</span>
            <span>•</span>
            <span>📞 ${app.phone || ''}</span>
            ${app.current_city ? `<span>•</span><span>📍 ${app.current_city}</span>` : ''}
          </div>
        </div>

        <div class="section-heading">Education & Qualifications</div>
        <div class="edu-title">${app.degree || 'Degree'} in ${app.specialization || 'Engineering'}</div>
        <div class="edu-sub">${app.college || 'University'} • Class of ${app.graduation_year || '2027'}${app.score_value ? ` • CGPA: ${app.score_value}` : ''}</div>

        <div class="section-heading">Technical Competencies</div>
        <div class="skills-grid">
          ${(app.skills || []).map((s: string) => `<span class="skill-pill">${s}</span>`).join('')}
        </div>

        ${app.why_cynbit ? `
          <div class="section-heading">Candidate Statement</div>
          <div class="statement">"${app.why_cynbit}"</div>
        ` : ''}

        ${(app.linkedin_url || app.github_url || app.portfolio_url) ? `
          <div class="section-heading">Online Profiles & Repositories</div>
          <div class="links">
            ${app.linkedin_url ? `<a href="${app.linkedin_url}" target="_blank">LinkedIn</a>` : ''}
            ${app.github_url ? `<a href="${app.github_url}" target="_blank">GitHub</a>` : ''}
            ${app.portfolio_url ? `<a href="${app.portfolio_url}" target="_blank">Portfolio</a>` : ''}
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;

  // View Resume in Chrome Tab (Opens real PDF or formatted document)
  const handleViewResume = (app: any) => {
    // 1. If real PDF base64 is present, decode to Blob and open directly in Chrome
    if (app.resume_url && app.resume_url.startsWith('data:application/pdf')) {
      try {
        const base64Data = app.resume_url.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
        return;
      } catch (err) {
        console.error('Error decoding base64 PDF:', err);
      }
    }

    // 2. If it is an external URL
    if (app.resume_url && (app.resume_url.startsWith('http') || app.resume_url.startsWith('/'))) {
      window.open(app.resume_url, '_blank');
      return;
    }

    // 3. Formatted document view in new tab
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generateResumeHtml(app));
      printWindow.document.close();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="py-24 mb-16 flex items-center justify-center px-4 bg-[#f8fafc] min-h-[75vh]">
        <div className="w-full max-w-md bg-white rounded-[32px] p-8 sm:p-10 border border-gray-150 shadow-[0_12px_40px_rgba(0,0,0,0.06)] text-center animate-in zoom-in-95 duration-200">

          <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#006067] mx-auto mb-5 shadow-xs">
            <Lock className="w-6 h-6 stroke-[2.5]" />
          </div>

          <span className="text-[10px] font-black tracking-widest text-[#006067] uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            INTERNAL RECRUITER GATE
          </span>

          <h2 className="text-2xl font-black text-gray-900 mt-3 mb-1">
            Recruiter Portal Access
          </h2>

          <p className="text-xs text-gray-500 font-medium mb-6">
            Enter the prototype recruiter passkey or use one-click demo login to review candidate applications.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                <span>Passkey</span>
                <span className="text-[10px] text-gray-400 font-medium">Default: cynbit2026</span>
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passkey..."
                  className="w-full pl-10 pr-4 py-3 text-xs font-semibold bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                />
              </div>
            </div>

            {loginError && (
              <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#006067] hover:bg-[#004f55] text-white text-xs font-black tracking-widest uppercase py-3.5 rounded-full transition-all shadow-md"
            >
              Enter Recruiter Dashboard
            </button>

            <div className="relative py-2 flex items-center justify-center">
              <span className="absolute inset-x-0 h-px bg-gray-200" />
              <span className="relative bg-white px-3 text-[10px] font-black uppercase text-gray-400">
                Or
              </span>
            </div>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full bg-teal-50 hover:bg-teal-100/70 text-[#006067] border border-teal-200 text-xs font-black tracking-widest uppercase py-3 rounded-full transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Quick Demo Login</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-[10px] text-gray-400 font-medium flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Production protected by Cynbit SSO & Role-Based Access Control</span>
          </div>

        </div>
      </div>
    );
  }

  // 1. DETAIL / EDIT VIEW FOR SPECIFIC OPENING (When recruiter clicks "View Details")
  if (selectedJob) {
    return (
      <div className="py-12 pb-24 bg-[#fafafa] min-h-[85vh]">
        <div className="max-w-5xl mx-auto px-6 sm:px-10">

          {/* Back to Recruiter Dashboard */}
          <button
            onClick={() => setSelectedJob(null)}
            className="inline-flex items-center gap-2 text-xs font-black tracking-wider uppercase text-gray-500 hover:text-[#006067] mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO OPENINGS LIST</span>
          </button>

          {/* Job Overview Card */}
          <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-gray-150 shadow-sm space-y-8">

            {/* Header with Edit & Delete Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black tracking-widest text-[#006067] uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                    {selectedJob.department}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    {selectedJob.type} • {selectedJob.location}
                  </span>
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  {selectedJob.title}
                </h1>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditingJob(!isEditingJob)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${isEditingJob
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-[#006067] text-white shadow-sm hover:bg-[#004f55]'
                    }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingJob ? 'Cancel Edit' : 'Edit Role'}</span>
                </button>

                <button
                  onClick={() => handleDeleteJob(selectedJob.id)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Role</span>
                </button>
              </div>
            </div>

            {/* If in Edit Mode: Show Live Editor Form */}
            {isEditingJob ? (
              <form onSubmit={handleSaveJobUpdate} className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Role Title</label>
                    <input
                      type="text"
                      required
                      value={editJobData.title}
                      onChange={(e) => setEditJobData({ ...editJobData, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#006067]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Department</label>
                    <select
                      value={editJobData.department}
                      onChange={(e) => setEditJobData({ ...editJobData, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl"
                    >
                      <option value="Core Engineering">Core Engineering</option>
                      <option value="AI & Data">AI & Data</option>
                      <option value="Growth">Growth</option>
                      <option value="Product & Design">Product & Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Type</label>
                    <select
                      value={editJobData.type}
                      onChange={(e) => setEditJobData({ ...editJobData, type: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl"
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Experience</label>
                    <input
                      type="text"
                      value={editJobData.experience}
                      onChange={(e) => setEditJobData({ ...editJobData, experience: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Required Skills (comma separated)</label>
                    <input
                      type="text"
                      value={editJobData.skills_required}
                      onChange={(e) => setEditJobData({ ...editJobData, skills_required: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editJobData.description}
                      onChange={(e) => setEditJobData({ ...editJobData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingJob(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-gray-500 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingJob}
                    className="bg-[#006067] hover:bg-[#004f55] text-white text-xs font-black uppercase px-7 py-3 rounded-full shadow-sm flex items-center gap-2"
                  >
                    {updatingJob ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Update Role</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Static View (Read-Only Specs) */
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-black tracking-widest uppercase text-gray-400 mb-2">
                    About The Role
                  </h4>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">
                    {selectedJob.description || 'Architect high-performance scalable systems.'}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-black tracking-widest uppercase text-gray-400 mb-2">
                    Experience Level
                  </h4>
                  <span className="text-xs font-bold text-[#006067] bg-teal-50 px-3 py-1 rounded-md border border-teal-100">
                    {selectedJob.experience || '0-1 Years'}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-black tracking-widest uppercase text-gray-400 mb-2">
                    Required Tech Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedJob.skills_required || ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL']).map((s, i) => (
                      <span key={i} className="text-xs font-semibold bg-gray-100 text-gray-800 px-3 py-1 rounded-lg">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    );
  }

  // 2. CANDIDATE APPLICATION DETAILS FULL-PAGE VIEW
  if (selectedApplication) {
    return (
      <div className="py-12 pb-24 bg-[#fafafa] min-h-[85vh]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">

          {/* Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <button
              onClick={() => setSelectedApplication(null)}
              className="inline-flex items-center gap-2 text-xs font-black tracking-wider uppercase text-gray-500 hover:text-[#006067] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>BACK TO CANDIDATE INBOX</span>
            </button>

            {/* Quick Status Pill */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-2xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Current Status:</span>
              <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                selectedApplication.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                selectedApplication.status === 'Rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                selectedApplication.status === 'In Review' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {selectedApplication.status}
              </span>
            </div>
          </div>

          {/* 2-Column Split: Left = Resume Preview, Right = Applicant Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LEFT SIDE: Resume Document Preview Card (col-span-5) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-[28px] border border-gray-200 shadow-sm p-6 sm:p-7 space-y-5">
                
                {/* Resume Header Bar */}
                <div className="flex items-center justify-between border-b border-gray-150 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#006067]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">Resume Preview</h3>
                      <p className="text-[10px] text-gray-400 font-medium truncate max-w-[220px] sm:max-w-[280px]">
                        {selectedApplication.resume_url?.startsWith('data:')
                          ? `${(selectedApplication.full_name || 'Candidate').replace(/\s+/g, '_')}_Resume.pdf`
                          : (selectedApplication.resume_url || `${(selectedApplication.full_name || 'Candidate').replace(/\s+/g, '_')}_Resume.pdf`)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PDF Document Viewer Container - Fitted Height */}
                {selectedApplication.resume_url && selectedApplication.resume_url.startsWith('data:application/pdf') ? (
                  <div className="w-full h-[365px] rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-inner">
                    <iframe
                      src={`${selectedApplication.resume_url}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                      className="w-full h-full border-0 bg-white"
                      title="Candidate PDF Resume"
                    />
                  </div>
                ) : (
                  <div className="w-full h-[365px] rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-inner">
                    <iframe
                      srcDoc={generateResumeHtml(selectedApplication)}
                      className="w-full h-full border-0 bg-white"
                      title="Candidate Document View"
                    />
                  </div>
                )}

                {/* See PDF Action Button Under the PDF */}
                <button
                  onClick={() => handleViewResume(selectedApplication)}
                  className="w-full py-2.5 rounded-full bg-[#006067] hover:bg-[#004f55] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <span>See PDF</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>

            {/* RIGHT SIDE: Applicant Details with Clear Teal Headings & Font Weights (col-span-7) */}
            <div className="lg:col-span-7 space-y-6">

              {/* Applicant Header & Decision Pipeline */}
              <div className="bg-white rounded-[28px] border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-[#006067] uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-100 inline-block mb-3">
                    CANDIDATE DOSSIER
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    {selectedApplication.full_name}
                  </h1>
                  <p className="text-xs text-gray-500 font-semibold mt-1">
                    Applied for: <span className="text-gray-900 font-black">{selectedApplication.job_title}</span>
                  </p>
                </div>

                {/* Recruiter Decision Actions */}
                <div className="pt-5 border-t border-gray-100">
                  <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase block mb-3">
                    RECRUITER DECISION PIPELINE
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleUpdateStatus(selectedApplication.id, 'In Review')}
                      className={`px-4 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl border transition-all ${
                        selectedApplication.status === 'In Review'
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      Under Review
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedApplication.id, 'Shortlisted')}
                      className={`px-4 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl transition-all shadow-xs ${
                        selectedApplication.status === 'Shortlisted'
                          ? 'bg-emerald-700 text-white ring-2 ring-emerald-400'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      Shortlist Candidate
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedApplication.id, 'Rejected')}
                      className={`px-4 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl transition-all shadow-xs ${
                        selectedApplication.status === 'Rejected'
                          ? 'bg-red-700 text-white ring-2 ring-red-400'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      Reject Application
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 1: PERSONAL INFORMATION */}
              <div className="bg-white rounded-[28px] border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
                <h3 className="text-xs font-black tracking-widest uppercase text-[#006067] border-b border-teal-100 pb-2">
                  1. Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-150">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Full Legal Name</span>
                    <span className="font-extrabold text-gray-900 text-sm">{selectedApplication.full_name}</span>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-150">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Email Address</span>
                    <span className="font-bold text-gray-800 break-all">{selectedApplication.email}</span>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-150">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Phone Number</span>
                    <span className="font-bold text-gray-800">{selectedApplication.phone}</span>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-150">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">WhatsApp Number</span>
                    <span className="font-bold text-gray-800">{selectedApplication.whatsapp || selectedApplication.phone}</span>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-150">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Current City</span>
                    <span className="font-bold text-gray-800">{selectedApplication.current_city || 'India'}</span>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-150">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Permanent Address</span>
                    <span className="font-semibold text-gray-700">{selectedApplication.permanent_address || 'Same as current city'}</span>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-150">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Date of Birth</span>
                    <span className="font-semibold text-gray-700">{selectedApplication.dob || 'Not Provided'}</span>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-150">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Gender</span>
                    <span className="font-semibold text-gray-700">{selectedApplication.gender || 'Not Specified'}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: ACADEMICS & QUALIFICATIONS */}
              <div className="bg-white rounded-[28px] border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
                <h3 className="text-xs font-black tracking-widest uppercase text-[#006067] border-b border-teal-100 pb-2">
                  2. Academic Performance & Qualifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-150">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Degree</span>
                    <span className="font-extrabold text-gray-900">{selectedApplication.degree}</span>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-150">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Specialization</span>
                    <span className="font-bold text-gray-800">{selectedApplication.specialization || 'N/A'}</span>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-150 sm:col-span-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">College / University</span>
                    <span className="font-bold text-gray-900">{selectedApplication.college || 'N/A'}</span>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-150">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Graduation Year</span>
                    <span className="font-extrabold text-gray-900">{selectedApplication.graduation_year || 'N/A'}</span>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-150">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">CGPA / Percentage</span>
                    <span className="font-extrabold text-[#006067]">{selectedApplication.score_value || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: TECHNICAL SKILLS */}
              <div className="bg-white rounded-[28px] border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
                <h3 className="text-xs font-black tracking-widest uppercase text-[#006067] border-b border-teal-100 pb-2">
                  3. Verified Technical Competencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(selectedApplication.skills || []).map((skill: string, i: number) => (
                    <span key={i} className="bg-teal-50 text-[#006067] text-xs font-black px-3.5 py-1.5 rounded-xl border border-teal-150 shadow-2xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* SECTION 4: ONLINE PROFILES */}
              <div className="bg-white rounded-[28px] border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
                <h3 className="text-xs font-black tracking-widest uppercase text-[#006067] border-b border-teal-100 pb-2">
                  4. Professional Profiles & Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-150">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">LinkedIn</span>
                    {selectedApplication.linkedin_url ? (
                      <a href={selectedApplication.linkedin_url} target="_blank" rel="noopener noreferrer" className="font-bold text-[#006067] hover:underline flex items-center gap-1">
                        <span>Profile Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-gray-400 font-medium">Not provided</span>
                    )}
                  </div>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-150">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">GitHub</span>
                    {selectedApplication.github_url ? (
                      <a href={selectedApplication.github_url} target="_blank" rel="noopener noreferrer" className="font-bold text-[#006067] hover:underline flex items-center gap-1">
                        <span>Repositories</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-gray-400 font-medium">Not provided</span>
                    )}
                  </div>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-150">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Portfolio</span>
                    {selectedApplication.portfolio_url ? (
                      <a href={selectedApplication.portfolio_url} target="_blank" rel="noopener noreferrer" className="font-bold text-[#006067] hover:underline flex items-center gap-1">
                        <span>Live Site</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-gray-400 font-medium">Not provided</span>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 5: MOTIVATION STATEMENT */}
              {selectedApplication.why_cynbit && (
                <div className="bg-white rounded-[28px] border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
                  <h3 className="text-xs font-black tracking-widest uppercase text-[#006067] border-b border-teal-100 pb-2">
                    5. Candidate Statement / Why Cynbit
                  </h3>
                  <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100 text-xs font-semibold text-gray-800 leading-relaxed italic">
                    "{selectedApplication.why_cynbit}"
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    );
  }

  // 3. MAIN RECRUITER DASHBOARD TABS
  return (
    <div className="py-12 pb-24 bg-[#f8fafc] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">

        {/* Recruiter Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 text-[#006067] text-[10px] font-black tracking-widest uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              AUTHENTICATED TALENT LEAD
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Recruiter Operations Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAll}
              className="p-2.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 transition-colors shadow-sm"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowAddJobModal(true)}
              className="bg-[#006067] hover:bg-[#004f55] text-white text-xs font-bold tracking-wider uppercase px-6 py-3 rounded-full transition-all shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Role</span>
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2.5 bg-white border border-gray-200 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors shadow-sm"
              title="Lock Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('openings')}
            className={`pb-4 text-xs font-black tracking-wider uppercase transition-colors relative flex items-center gap-2 ${activeTab === 'openings' ? 'text-[#006067]' : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Manage Openings ({jobs.length})</span>
            {activeTab === 'openings' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006067]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-4 text-xs font-black tracking-wider uppercase transition-colors relative flex items-center gap-2 ${activeTab === 'applications' ? 'text-[#006067]' : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            <Users className="w-4 h-4" />
            <span>Candidate Inbox ({applications.length})</span>
            {activeTab === 'applications' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006067]" />
            )}
          </button>
        </div>

        {/* Content Tabs */}
        {loading ? (
          <div className="py-20 flex justify-center text-[#006067]">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : activeTab === 'openings' ? (

          /* Cards Grid: Openings */
          <div className="space-y-6">

            {/* Filter Pills */}
            <div className="flex items-center gap-2">
              {(['All', 'Internship', 'Full Time'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setOpeningsFilter(filter)}
                  className={`px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase transition-all ${openingsFilter === filter
                    ? 'bg-[#006067] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  {filter === 'All' ? 'All Roles' : filter === 'Internship' ? 'Internships' : 'Full Time'}
                </button>
              ))}
            </div>

            {/* Grid of Cards */}
            {jobs.filter(j => openingsFilter === 'All' || j.type === openingsFilter).length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 text-gray-400">
                <Briefcase className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-xs font-bold">No {openingsFilter} roles found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs
                  .filter(j => openingsFilter === 'All' || j.type === openingsFilter)
                  .map((job) => (
                    <div
                      key={job.id}
                      className="group bg-white rounded-[28px] p-6 border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#006067]/40 hover:shadow-[0_12px_28px_rgba(0,96,103,0.1)] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-black tracking-widest text-[#006067] uppercase">
                            {job.department}
                          </span>
                          <span className="text-[10px] font-extrabold tracking-wider bg-gray-100 text-gray-600 px-3 py-1 rounded-full uppercase">
                            {job.type}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-1.5">
                          {job.title}
                        </h3>

                        <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 font-medium">
                          <span>{job.location || 'Remote / Jaipur'}</span>
                          <span>•</span>
                          <span className="text-[#006067] font-bold">{job.experience || '0-1 Years'}</span>
                        </div>

                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                          {job.description || 'Architect high-performance digital platforms.'}
                        </p>

                        {job.skills_required && job.skills_required.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {job.skills_required.slice(0, 3).map((s, i) => (
                              <span key={i} className="text-[10px] font-semibold bg-gray-50 text-gray-700 px-2 py-0.5 rounded border border-gray-150">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Recruiter Card Actions: View Details (opens role specs/editor) & Delete */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenJobDetails(job)}
                          className="inline-flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-[#006067] hover:underline"
                        >
                          <span>View Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-500 hover:text-white hover:bg-red-500 border border-red-200 p-2 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold"
                          title="Delete Opening"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

        ) : (

          /* Candidate Inbox with Hover Focus & Click-to-Inspect Drawer */
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            {applications.length === 0 ? (
              <div className="p-16 text-center text-gray-400">
                <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="font-semibold text-xs">No candidate applications submitted yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto p-3">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-400 font-black tracking-widest uppercase text-[10px]">
                      <th className="py-4 px-6">Candidate</th>
                      <th className="py-4 px-6">Applied Role</th>
                      <th className="py-4 px-6">Academics / City</th>
                      <th className="py-4 px-6">Extracted Skills</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Quick Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {applications.map((app) => (
                      <tr
                        key={app.id}
                        onClick={() => setSelectedApplication(app)}
                        className="group hover:bg-teal-50/40 hover:scale-[1.006] hover:shadow-md cursor-pointer transition-all duration-200"
                      >
                        <td className="py-4 px-6">
                          <div className="font-black text-gray-900 group-hover:text-[#006067] transition-colors">{app.full_name}</div>
                          <div className="text-[11px] text-gray-400 font-medium">{app.email}</div>
                        </td>
                        <td className="py-4 px-6 font-bold text-gray-800">{app.job_title}</td>
                        <td className="py-4 px-6 text-gray-500 font-medium">
                          <div>{app.degree} ({app.specialization || 'IT'})</div>
                          <div className="text-[10px] text-gray-400">{app.current_city || 'India'}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {(app.skills || []).slice(0, 3).map((s: string, i: number) => (
                              <span key={i} className="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded font-semibold">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${app.status === 'Shortlisted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'Rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                              }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'Shortlisted')}
                            className="bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 p-2 rounded-xl transition-all"
                            title="Shortlist Candidate"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                            className="bg-red-50 hover:bg-red-600 hover:text-white text-red-700 p-2 rounded-xl transition-all"
                            title="Reject Candidate"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        )}



        {/* Modal: Post New Job */}
        {showAddJobModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[28px] max-w-2xl w-full p-8 border border-gray-100 shadow-2xl animate-in fade-in max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Post New Job Opening</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Configure role specifications to publish directly to the live Cynbit Career platform.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateJob} className="space-y-4">
                
                {/* 1. Role Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={newJobData.title}
                    onChange={(e) => setNewJobData({ ...newJobData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                    placeholder="e.g. AI / ML Engineer or Full Stack Developer Intern"
                  />
                </div>

                {/* 2. Department & Employment Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Department *</label>
                    <select
                      value={newJobData.department}
                      onChange={(e) => setNewJobData({ ...newJobData, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] cursor-pointer"
                    >
                      <option value="Core Engineering">Core Engineering</option>
                      <option value="AI & Data">AI & Data</option>
                      <option value="Growth">Growth</option>
                      <option value="Product & Design">Product & Design</option>
                      <option value="Marketing & Growth Internships">Marketing & Growth Internships</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Employment Type *</label>
                    <select
                      value={newJobData.type}
                      onChange={(e) => setNewJobData({ ...newJobData, type: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] cursor-pointer"
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>

                {/* 3. Work Mode & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Work Mode *</label>
                    <select
                      value={newJobData.work_mode}
                      onChange={(e) => setNewJobData({ ...newJobData, work_mode: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] cursor-pointer"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Location *</label>
                    <select
                      value={newJobData.location}
                      onChange={(e) => setNewJobData({ ...newJobData, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] cursor-pointer"
                    >
                      <option value="Remote / Jaipur">Remote / Jaipur</option>
                      <option value="Remote">Remote (Global / India)</option>
                      <option value="Jaipur (On-site)">Jaipur (On-site Headquarters)</option>
                      <option value="Bangalore">Bangalore (Hybrid)</option>
                      <option value="Hyderabad">Hyderabad (Hybrid)</option>
                    </select>
                  </div>
                </div>

                {/* 4. Experience Required */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Experience Level *</label>
                  <select
                    value={newJobData.experience}
                    onChange={(e) => setNewJobData({ ...newJobData, experience: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] cursor-pointer"
                  >
                    <option value="0-1 Years">0-1 Years (Entry Level / Freshers)</option>
                    <option value="1-3 Years">1-3 Years (Mid-level Developer)</option>
                    <option value="3-5 Years">3-5 Years (Senior Engineer)</option>
                    <option value="5+ Years">5+ Years (Staff / Architect)</option>
                  </select>
                </div>

                {/* 5. Required Technical Skills */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Required Skills (comma separated) *</label>
                  <input
                    type="text"
                    required
                    value={newJobData.skills_required}
                    onChange={(e) => setNewJobData({ ...newJobData, skills_required: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                    placeholder="e.g. React, Next.js, TypeScript, Node.js, PostgreSQL"
                  />
                </div>

                {/* 6. Description / About the Role */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">About the Role / Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={newJobData.description}
                    onChange={(e) => setNewJobData({ ...newJobData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all leading-relaxed"
                    placeholder="Describe the mission of this role and the core business impact at Cynbit..."
                  />
                </div>

                {/* 7. Key Responsibilities */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                    <span>Key Responsibilities (1 per line)</span>
                    <span className="text-[10px] text-gray-400 font-normal">Optional</span>
                  </label>
                  <textarea
                    rows={3}
                    value={newJobData.responsibilities}
                    onChange={(e) => setNewJobData({ ...newJobData, responsibilities: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all leading-relaxed"
                    placeholder="Enter responsibilities (1 per line):&#10;• Architect scalable digital platforms and high-speed APIs&#10;• Collaborate with lead engineers on system architecture&#10;• Write clean, production-grade TypeScript and automated tests"
                  />
                </div>

                {/* Modal Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowAddJobModal(false)}
                    className="px-5 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingJob}
                    className="bg-[#006067] hover:bg-[#004f55] text-white text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-full shadow-sm transition-all disabled:opacity-50"
                  >
                    {creatingJob ? 'Publishing...' : 'Publish Opening'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
