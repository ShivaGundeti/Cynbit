'use client';

import React, { useState } from 'react';
import { X, Upload, CheckCircle2, Sparkles, Loader2, AlertCircle, FileText } from 'lucide-react';
import { Job } from '@/types';

interface ApplyModalProps {
  job: Job | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApplyModal({ job, onClose, onSuccess }: ApplyModalProps) {
  const [parsing, setParsing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');

  // Form State matching all Cynbit fields
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    whatsapp_number: '',
    highest_qualification: 'Graduation',
    degree: 'B.Tech / B.E.',
    specialization: 'Information Technology',
    college: '',
    graduation_year: '2026',
    current_city: '',
    skills: [] as string[],
    skillsInput: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    why_cynbit: '',
  });

  if (!job) return null;

  // Handle PDF Resume Upload & Parsing
  const handleFileUpload = async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      setErrorMessage('Please upload a valid PDF document.');
      return;
    }

    try {
      setParsing(true);
      setErrorMessage('');
      setResumeFileName(file.name);

      const data = new FormData();
      data.append('resume', file);

      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to extract resume details');
      }

      if (json.data) {
        const extracted = json.data;
        setFormData((prev) => ({
          ...prev,
          full_name: extracted.full_name || prev.full_name,
          email: extracted.email || prev.email,
          phone: extracted.phone || prev.phone,
          whatsapp_number: extracted.whatsapp_number || prev.whatsapp_number,
          highest_qualification: extracted.highest_qualification || prev.highest_qualification,
          degree: extracted.degree || prev.degree,
          specialization: extracted.specialization || prev.specialization,
          college: extracted.college || prev.college,
          graduation_year: extracted.graduation_year || prev.graduation_year,
          current_city: extracted.current_city || prev.current_city,
          linkedin_url: extracted.linkedin_url || prev.linkedin_url,
          github_url: extracted.github_url || prev.github_url,
          portfolio_url: extracted.portfolio_url || prev.portfolio_url,
          skills: extracted.skills || prev.skills,
          skillsInput: (extracted.skills || []).join(', '),
        }));
        setAutoFilled(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error parsing resume');
    } finally {
      setParsing(false);
    }
  };

  // One-click demo test resume loader for reviewers
  const handleLoadSampleResume = () => {
    setFormData({
      full_name: 'Shiva Kumar Gundeti',
      email: 'shivagundeti1403@gmail.com',
      phone: '+91 9392240740',
      whatsapp_number: '+91 9392240740',
      highest_qualification: 'Graduation',
      degree: 'B.Tech / B.E.',
      specialization: 'Information Technology',
      college: "Nalla Narasimha Reddy Education Society's Group of Institutions (NNRG)",
      graduation_year: '2027',
      current_city: 'Hyderabad',
      skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
      skillsInput: 'React, Next.js, TypeScript, Node.js, PostgreSQL, Tailwind CSS, Docker',
      linkedin_url: 'https://linkedin.com/in/shiva-kumar',
      github_url: 'https://github.com/ShivaGundeti',
      portfolio_url: 'https://shiva-portfolio.vercel.app',
      why_cynbit: 'Excited about architecting high-performance digital platforms and AI automation systems at Cynbit.',
    });
    setResumeFileName('Shiva_Kumar_Resume.pdf');
    setAutoFilled(true);
  };

  // Submit Final Application
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setErrorMessage('');

      const payload = {
        job_id: job.id,
        job_title: job.title,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        whatsapp_number: formData.whatsapp_number,
        highest_qualification: formData.highest_qualification,
        degree: formData.degree,
        specialization: formData.specialization,
        college: formData.college,
        graduation_year: formData.graduation_year,
        current_city: formData.current_city,
        skills: formData.skillsInput
          ? formData.skillsInput.split(',').map((s) => s.trim()).filter(Boolean)
          : formData.skills,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url,
        portfolio_url: formData.portfolio_url,
        why_cynbit: formData.why_cynbit,
        resume_url: resumeFileName || 'Direct Upload',
      };

      const res = await fetch('/api/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to submit application');
      }

      onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 pt-7 pb-5 border-b border-gray-100 flex items-start justify-between bg-[#fafafa]">
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#006067] uppercase">
              APPLYING FOR
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">
              {job.title}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-semibold">
              <span>{job.department}</span>
              <span>•</span>
              <span>{job.location}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200/70 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Smart Auto-Fill Resume Dropzone */}
          <div className="bg-teal-50/50 rounded-2xl p-5 border border-dashed border-[#006067]/30 text-center relative">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#006067]/10 flex items-center justify-center text-[#006067]">
                {parsing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              </div>
              
              <div>
                <p className="text-xs font-bold text-gray-800">
                  {resumeFileName ? (
                    <span className="text-[#006067] flex items-center justify-center gap-1.5">
                      <FileText className="w-4 h-4" /> {resumeFileName}
                    </span>
                  ) : (
                    'Upload your Resume (PDF) to Auto-Fill this form'
                  )}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Our parser extracts name, contact, academics, and tech skills instantly.
                </p>
              </div>

              {/* Upload Input & Demo Button */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <label className="cursor-pointer bg-[#006067] hover:bg-[#004f55] text-white text-[11px] font-bold tracking-wider uppercase px-4 py-2 rounded-full transition-all shadow-sm">
                  <span>Browse PDF</span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={handleLoadSampleResume}
                  className="bg-white hover:bg-gray-50 text-[#006067] border border-[#006067]/30 text-[11px] font-bold tracking-wider uppercase px-4 py-2 rounded-full transition-all flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Load Sample Profile
                </button>
              </div>
            </div>

            {/* Auto-fill notification badge */}
            {autoFilled && (
              <div className="mt-3 py-1.5 px-3 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Fields populated successfully! Review and edit if needed.
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Fields: Personal Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-black tracking-widest uppercase text-gray-400">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067]"
                  placeholder="e.g. Shiva Kumar"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067]"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067]"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Current City</label>
                <input
                  type="text"
                  value={formData.current_city}
                  onChange={(e) => setFormData({ ...formData, current_city: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067]"
                  placeholder="e.g. Jaipur / Hyderabad"
                />
              </div>
            </div>
          </div>

          {/* Form Fields: Academics */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-black tracking-widest uppercase text-gray-400">
              Academics & College
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Degree</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                  placeholder="B.Tech / B.E."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                  placeholder="Information Technology"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Graduation Year</label>
                <input
                  type="text"
                  value={formData.graduation_year}
                  onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                  placeholder="2026 / 2027"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">College / University</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                placeholder="College name"
              />
            </div>
          </div>

          {/* Form Fields: Skills & Profiles */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-black tracking-widest uppercase text-gray-400">
              Technical Skills & Links
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Technical Skills (comma-separated)
              </label>
              <input
                type="text"
                value={formData.skillsInput}
                onChange={(e) => setFormData({ ...formData, skillsInput: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                placeholder="React, Next.js, TypeScript, PostgreSQL"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">GitHub / Portfolio</label>
                <input
                  type="url"
                  value={formData.github_url || formData.portfolio_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Why Cynbit? (Brief Statement)
              </label>
              <textarea
                rows={2}
                value={formData.why_cynbit}
                onChange={(e) => setFormData({ ...formData, why_cynbit: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                placeholder="What excites you about building high-performance systems with Cynbit?"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#006067] hover:bg-[#004f55] disabled:opacity-50 text-white text-xs font-black tracking-widest uppercase px-8 py-3 rounded-full transition-all shadow-md flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Application</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
