'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Users, Plus, CheckCircle, XCircle, Clock, Trash2, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { Job, Application } from '@/types';

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState<'openings' | 'applications'>('openings');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Job Modal state
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

  // Fetch candidate applications
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

  // Recruiter creates a new opening
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

  // Recruiter deletes an opening
  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job opening?')) return;
    try {
      await fetch(`/api/job/${id}`, { method: 'DELETE' });
      await fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  // Recruiter updates candidate application status
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/application/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="py-12 bg-[#f8fafc] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Recruiter Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-[10px] font-black tracking-widest uppercase mb-2">
              INTERNAL TALENT HUB
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
          
          /* Table: Job Openings */
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-extrabold tracking-wider uppercase">
                  <th className="py-4 px-6">Role Title</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900">{job.title}</td>
                    <td className="py-4 px-6 text-gray-600">{job.department}</td>
                    <td className="py-4 px-6">
                      <span className="bg-teal-50 text-[#006067] px-2.5 py-1 rounded-md font-bold">
                        {job.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500">{job.location}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete opening"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        ) : (

          /* Table: Candidate Inbox */
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            {applications.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold text-xs">No candidate applications submitted yet.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-extrabold tracking-wider uppercase">
                    <th className="py-4 px-6">Candidate</th>
                    <th className="py-4 px-6">Applied Role</th>
                    <th className="py-4 px-6">Academics / City</th>
                    <th className="py-4 px-6">Extracted Skills</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-900">{app.full_name}</div>
                        <div className="text-[11px] text-gray-400">{app.email} • {app.phone}</div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-800">{app.job_title}</td>
                      <td className="py-4 px-6 text-gray-500">
                        <div>{app.degree} ({app.specialization || 'IT'})</div>
                        <div className="text-[10px] text-gray-400">{app.college || app.current_city}</div>
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
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
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
                      <td className="py-4 px-6 text-right space-x-1.5">
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'Shortlisted')}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-1.5 rounded-lg transition-colors"
                          title="Shortlist Candidate"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                          className="bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded-lg transition-colors"
                          title="Reject Candidate"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        )}

        {/* Modal: Recruiter Adds New Job */}
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
