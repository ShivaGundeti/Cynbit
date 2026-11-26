'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, Users, Plus, CheckCircle, XCircle, Clock, 
  Trash2, ExternalLink, Loader2, RefreshCw, Lock, KeyRound, 
  Sparkles, LogOut, ShieldCheck, Edit3, X, Eye, FileText, CheckCircle2, ChevronRight, ArrowLeft
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
    location: 'Remote / Jaipur',
    experience: '1-3 Years',
    description: '',
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
          ...newJobData,
          skills_required: newJobData.skills_required.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        setShowAddJobModal(false);
        setNewJobData({
          title: '',
          department: 'Core Engineering',
          type: 'Full Time',
          location: 'Remote / Jaipur',
          experience: '1-3 Years',
          description: '',
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

  // View Resume in Chrome Tab
  const handleViewResume = (app: any) => {
    const resumeText = `CYNBIT CANDIDATE RESUME SUMMARY\n=================================\n\nCandidate: ${app.full_name}\nEmail: ${app.email}\nPhone: ${app.phone}\nLocation: ${app.current_city || 'India'}\n\nDegree: ${app.degree} in ${app.specialization || 'Engineering'}\nCollege: ${app.college || 'N/A'}\nGraduation Year: ${app.graduation_year || 'N/A'}\n\nTechnical Skills: ${(app.skills || []).join(', ')}\n\nLinkedIn: ${app.linkedin_url || 'N/A'}\nGitHub: ${app.github_url || 'N/A'}\nPortfolio: ${app.portfolio_url || 'N/A'}\n\nApplication Statement:\n"${app.why_cynbit || 'N/A'}"\n\n[Status: ${app.status} | Submitted: ${new Date(app.submitted_at).toLocaleString()}]`;

    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
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
                  className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
                    isEditingJob 
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

  // 2. MAIN RECRUITER DASHBOARD TABS
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
            className={`pb-4 text-xs font-black tracking-wider uppercase transition-colors relative flex items-center gap-2 ${
              activeTab === 'openings' ? 'text-[#006067]' : 'text-gray-400 hover:text-gray-600'
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
            className={`pb-4 text-xs font-black tracking-wider uppercase transition-colors relative flex items-center gap-2 ${
              activeTab === 'applications' ? 'text-[#006067]' : 'text-gray-400 hover:text-gray-600'
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
                  className={`px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase transition-all ${
                    openingsFilter === filter
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
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              app.status === 'Shortlisted'
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

        {/* 3. CANDIDATE APPLICATION INSPECTION DRAWER */}
        {selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-xl h-full bg-white shadow-2xl p-8 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-300">
              
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-gray-100 pb-5">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-[#006067] uppercase bg-teal-50 px-2.5 py-0.5 rounded">
                    CANDIDATE DOSSIER
                  </span>
                  <h2 className="text-2xl font-black text-gray-900 mt-1">
                    {selectedApplication.full_name}
                  </h2>
                  <p className="text-xs text-gray-500 font-semibold">
                    Applied for: <span className="text-gray-900">{selectedApplication.job_title}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Decision Actions */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-150 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">CURRENT STATUS</span>
                  <div className="text-sm font-black text-[#006067]">{selectedApplication.status}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedApplication.id, 'In Review')}
                    className="px-3 py-1.5 text-xs font-bold bg-amber-50 text-amber-800 rounded-lg border border-amber-200"
                  >
                    Under Review
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApplication.id, 'Shortlisted')}
                    className="px-3 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-lg shadow-sm"
                  >
                    Shortlist
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApplication.id, 'Rejected')}
                    className="px-3 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg shadow-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* View Full Resume in Chrome */}
              <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs font-bold text-[#006067]">
                  <FileText className="w-4 h-4" />
                  <span>Attached Resume: {selectedApplication.resume_url || 'Resume.pdf'}</span>
                </div>
                <button
                  onClick={() => handleViewResume(selectedApplication)}
                  className="bg-[#006067] hover:bg-[#004f55] text-white text-[11px] font-black uppercase px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm"
                >
                  <span>See Resume</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Candidate Info Grid */}
              <div className="space-y-4 text-xs font-medium">
                <div>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-1">Contact</h4>
                  <div className="text-gray-800 font-semibold">{selectedApplication.email} • {selectedApplication.phone}</div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-1">Academics</h4>
                  <div className="text-gray-800">{selectedApplication.degree} in {selectedApplication.specialization}</div>
                  <div className="text-gray-500">{selectedApplication.college} (Graduation: {selectedApplication.graduation_year})</div>
                  {selectedApplication.score_value && <div className="text-gray-500">Score: {selectedApplication.score_value}</div>}
                </div>

                <div>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-1.5">Extracted Technical Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedApplication.skills || []).map((s: string, i: number) => (
                      <span key={i} className="bg-teal-50 text-[#006067] font-bold px-2.5 py-1 rounded-md border border-teal-100">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedApplication.why_cynbit && (
                  <div>
                    <h4 className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-1">Application Statement</h4>
                    <p className="p-3 bg-gray-50 rounded-xl text-gray-700 italic border border-gray-100">
                      "{selectedApplication.why_cynbit}"
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Modal: Post New Job */}
        {showAddJobModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[28px] max-w-lg w-full p-7 border border-gray-100 shadow-2xl animate-in fade-in">
              <h3 className="text-xl font-black text-gray-900 mb-4">Post New Job Opening</h3>
              
              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={newJobData.title}
                    onChange={(e) => setNewJobData({ ...newJobData, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl"
                    placeholder="e.g. AI / ML Engineer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Department</label>
                    <select
                      value={newJobData.department}
                      onChange={(e) => setNewJobData({ ...newJobData, department: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl"
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
                      value={newJobData.type}
                      onChange={(e) => setNewJobData({ ...newJobData, type: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl"
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Required Skills (comma separated)</label>
                  <input
                    type="text"
                    value={newJobData.skills_required}
                    onChange={(e) => setNewJobData({ ...newJobData, skills_required: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl"
                    placeholder="Python, LangChain, FastAPI, Docker"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newJobData.description}
                    onChange={(e) => setNewJobData({ ...newJobData, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl"
                    placeholder="Brief description of responsibilities..."
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowAddJobModal(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingJob}
                    className="bg-[#006067] hover:bg-[#004f55] text-white text-xs font-black uppercase px-6 py-2.5 rounded-full"
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
