'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, Check, Sparkles, Upload, Loader2, 
  FileText, CheckCircle2, AlertCircle, Zap, HeartHandshake, Rocket, Laptop, Eye
} from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { Job } from '@/types';

function JobDetailContent() {
  const params = useParams();
  const id = params?.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [parsing, setParsing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeFileSize, setResumeFileSize] = useState('');
  const [resumeBase64, setResumeBase64] = useState('');

  const formSectionRef = useRef<HTMLDivElement>(null);
  const successSectionRef = useRef<HTMLDivElement>(null);

  // Form Data - ALL EMPTY DEFAULTS (No pre-filled values)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    whatsapp_number: '',
    dob: '',
    gender: '',
    highest_qualification: '',
    degree: '',
    specialization: '',
    college: '',
    graduation_year: '',
    education_status: '',
    score_value: '',
    notice_period: '',
    current_city: '',
    permanent_address: '',
    skillsInput: '',
    skills: [] as string[],
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    why_cynbit: '',
  });

  // Fetch Job details
  useEffect(() => {
    async function fetchJob() {
      try {
        setLoading(true);
        const res = await fetch(`/api/job`);
        const json = await res.json();
        if (json.jobs) {
          const found = (json.jobs as Job[]).find(j => j.id === id);
          if (found) {
            setJob(found);
          } else {
            setJob(json.jobs[0] || null);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchJob();
  }, [id]);

  const scrollToApply = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // PDF Resume Parsing
  const handleFileUpload = async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      setErrorMessage('Please upload a valid PDF file.');
      return;
    }

    try {
      setParsing(true);
      setErrorMessage('');
      setResumeFileName(file.name);
      setResumeFileSize((file.size / 1024).toFixed(1) + ' KB');

      // Convert uploaded PDF to base64 Data URL for embedded preview & Chrome viewing
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setResumeBase64(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      const data = new FormData();
      data.append('resume', file);

      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to parse resume');

      if (json.data) {
        const ext = json.data;
        setFormData({
          full_name: ext.full_name || '',
          email: ext.email || '',
          phone: ext.phone || '',
          whatsapp_number: ext.whatsapp_number || ext.phone || '',
          dob: '',
          gender: 'Prefer not to say',
          highest_qualification: ext.highest_qualification || 'Graduation',
          degree: ext.degree || 'B.Tech',
          specialization: ext.specialization || 'Computer Science',
          college: ext.college || '',
          graduation_year: ext.graduation_year || '',
          education_status: 'Pursuing',
          score_value: '',
          notice_period: 'Immediate',
          current_city: ext.current_city || '',
          permanent_address: ext.current_city ? `${ext.current_city}, India` : '',
          linkedin_url: ext.linkedin_url || '',
          github_url: ext.github_url || '',
          portfolio_url: ext.portfolio_url || '',
          skills: ext.skills || [],
          skillsInput: (ext.skills || []).join(', '),
          why_cynbit: '',
        });
        setAutoFilled(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error parsing resume');
    } finally {
      setParsing(false);
    }
  };

  // Sample Profile Loader
  const handleLoadSample = () => {
    setFormData({
      full_name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      phone: '+91 9876543210',
      whatsapp_number: '+91 9876543210',
      dob: '2003-05-20',
      gender: 'Male',
      highest_qualification: 'Graduation',
      degree: 'B.Tech / B.E.',
      specialization: 'Information Technology',
      college: 'Institute of Engineering & Technology',
      graduation_year: '2026',
      education_status: 'Pursuing',
      score_value: '8.6 CGPA',
      notice_period: 'Immediate',
      current_city: 'Jaipur',
      permanent_address: 'Jaipur, Rajasthan',
      skillsInput: 'React, Next.js, TypeScript, Node.js, PostgreSQL, Tailwind CSS, Docker',
      skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
      linkedin_url: 'https://linkedin.com/in/alex-johnson',
      github_url: 'https://github.com/alex-johnson',
      portfolio_url: 'https://alex-dev.vercel.app',
      why_cynbit: 'Excited about architecting scalable digital platforms and AI automation systems.',
    });
    setResumeFileName('Alex_Johnson_Resume.pdf');
    setResumeFileSize('182 KB');
    setAutoFilled(true);
  };

  // Trigger dual corner confetti cannon blast
  const triggerConfetti = () => {
    const container = document.createElement('div');
    container.className = 'fixed inset-0 pointer-events-none z-[100] overflow-hidden';
    document.body.appendChild(container);

    const colors = ['#006067', '#00a896', '#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'];
    
    // Left Cannon (blasts from bottom-left corner diagonally upwards towards center)
    for (let i = 0; i < 75; i++) {
      const piece = document.createElement('div');
      piece.className = 'absolute rounded-sm animate-confetti';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.left = '4%';
      piece.style.bottom = '8%';
      piece.style.width = `${Math.random() * 10 + 6}px`;
      piece.style.height = `${Math.random() * 12 + 6}px`;
      
      const tx = `${Math.random() * 550 + 200}px`;
      const ty = `-${Math.random() * 650 + 350}px`;
      piece.style.setProperty('--tx', tx);
      piece.style.setProperty('--ty', ty);
      piece.style.animation = `confetti-blast-left ${Math.random() * 1.5 + 2}s cubic-bezier(0.25, 1, 0.5, 1) forwards`;
      container.appendChild(piece);
    }

    // Right Cannon (blasts from bottom-right corner diagonally upwards towards center)
    for (let i = 0; i < 75; i++) {
      const piece = document.createElement('div');
      piece.className = 'absolute rounded-sm animate-confetti';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.right = '4%';
      piece.style.bottom = '8%';
      piece.style.width = `${Math.random() * 10 + 6}px`;
      piece.style.height = `${Math.random() * 12 + 6}px`;
      
      const tx = `-${Math.random() * 550 + 200}px`;
      const ty = `-${Math.random() * 650 + 350}px`;
      piece.style.setProperty('--tx', tx);
      piece.style.setProperty('--ty', ty);
      piece.style.animation = `confetti-blast-right ${Math.random() * 1.5 + 2}s cubic-bezier(0.25, 1, 0.5, 1) forwards`;
      container.appendChild(piece);
    }

    setTimeout(() => {
      container.remove();
    }, 4500);
  };

  // Submit Application
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

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
        dob: formData.dob || null,
        gender: formData.gender,
        highest_qualification: formData.highest_qualification,
        degree: formData.degree,
        specialization: formData.specialization,
        college: formData.college,
        graduation_year: formData.graduation_year,
        education_status: formData.education_status,
        score_value: formData.score_value,
        notice_period: formData.notice_period,
        current_city: formData.current_city,
        permanent_address: formData.permanent_address,
        skills: formData.skillsInput
          ? formData.skillsInput.split(',').map(s => s.trim()).filter(Boolean)
          : formData.skills,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url,
        portfolio_url: formData.portfolio_url,
        why_cynbit: formData.why_cynbit,
        resume_url: resumeBase64 || resumeFileName || 'Direct Upload',
      };

      const res = await fetch('/api/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Submission failed');

      setSubmitted(true);
      triggerConfetti();

      setTimeout(() => {
        successSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 200);

    } catch (err: any) {
      setErrorMessage(err.message || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-[#006067]">
          <Loader2 className="w-8 h-8 animate-spin mb-3" />
          <span className="text-xs font-bold uppercase tracking-wider">Loading role details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Top Header Section */}
      <header className="bg-white border-b border-gray-100 pt-10 pb-16">
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          
          <Link
            href="/#openings"
            className="inline-flex items-center gap-2 text-[11px] font-black tracking-widest uppercase text-gray-500 hover:text-[#006067] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO CAREERS</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-[11px] font-black tracking-widest text-[#006067] bg-teal-50 px-3.5 py-1.5 rounded-full uppercase border border-teal-100">
              {job?.department || 'CORE ENGINEERING'}
            </span>
            <span className="text-[11px] font-extrabold tracking-wider bg-gray-100 text-gray-600 px-3.5 py-1.5 rounded-full uppercase">
              {job?.location || 'REMOTE / JAIPUR'} • {job?.type || 'INTERNSHIP'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight max-w-3xl leading-[1.15]">
              {job?.title || 'Engineering Role'}
            </h1>

            <button
              type="button"
              onClick={scrollToApply}
              className="bg-[#006067] hover:bg-[#004f55] text-white text-xs font-bold tracking-widest uppercase px-9 py-4 rounded-full shadow-lg hover:shadow-xl transition-all self-start md:self-auto flex-shrink-0"
            >
              Apply for this role
            </button>
          </div>

        </div>
      </header>

      {/* 3. Role Overview & Core Benefits */}
      <section className="py-16 bg-[#fafafa] border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-8 space-y-10">
              <div>
                <h3 className="text-xs font-black tracking-widest uppercase text-gray-400 mb-3">
                  ABOUT THE ROLE
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                  {job?.description || 'Bridge the gap between Cynbit and high-performance digital platforms.'}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-black tracking-widest uppercase text-gray-400 mb-4">
                  KEY RESPONSIBILITIES
                </h3>
                <ul className="space-y-3">
                  {(job?.responsibilities && job.responsibilities.length > 0 ? job.responsibilities : [
                    'Architect robust digital platforms and automated engineering loops.',
                    'Collaborate directly with AI architects and core product engineering teams.',
                    'Participate in sprint design reviews, code deployments, and system benchmarks.',
                    'Deliver scalable features with measurable reliability and high Core Web Vitals.'
                  ]).map((resp, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                      <div className="w-5 h-5 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-[#006067] flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-black tracking-widest uppercase text-gray-400 mb-4">
                  PROFESSIONAL REQUIREMENTS
                </h3>
                <ul className="space-y-3">
                  {[
                    `Demonstrated skills in: ${(job?.skills_required || ['Modern Web Frameworks', 'REST APIs', 'Cloud']).slice(0, 4).join(', ')}.`,
                    `Experience level: ${job?.experience || '0-1 Years'} in scalable software.`,
                    'Strong problem-solving, clean code design, and collaborative engineering habits.',
                    'Self-motivated, proactive communicator suited for high-autonomy teams.'
                  ].map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                      <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white rounded-[28px] p-7 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-6">
              <h4 className="text-[11px] font-black tracking-widest text-[#006067] uppercase">
                CORE BENEFITS
              </h4>

              <div className="space-y-4 text-xs font-bold text-gray-800 uppercase tracking-wider">
                <div className="flex items-center gap-3">
                  <Rocket className="w-4 h-4 text-[#006067]" />
                  <span>STARTUP AGILITY</span>
                </div>
                <div className="flex items-center gap-3">
                  <Laptop className="w-4 h-4 text-[#006067]" />
                  <span>REMOTE-FIRST MODEL</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-[#006067]" />
                  <span>UNLIMITED LEARNING</span>
                </div>
                <div className="flex items-center gap-3">
                  <HeartHandshake className="w-4 h-4 text-[#006067]" />
                  <span>SOCIAL IMPACT HOURS</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400 font-medium">
                Applications are reviewed within 48 hours by our lead technical architects.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. The Application Form Section: "SUBMIT YOUR BLUEPRINT" */}
      <section ref={formSectionRef} className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-10">
          
          {submitted ? (
            <div 
              ref={successSectionRef}
              className="bg-teal-50/70 border border-[#006067]/30 rounded-[32px] p-10 sm:p-14 text-center space-y-4 animate-in zoom-in-95 duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-[#006067] text-white flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                Thanks for applying!
              </h2>
              <p className="text-sm text-gray-600 font-medium max-w-lg mx-auto leading-relaxed">
                Your application for <span className="font-bold text-[#006067]">{job?.title}</span> has been received and stored in our database. Our engineering team reviews all blueprints carefully and will reach out to you directly.
              </p>
              <div className="pt-4 flex justify-center gap-4">
                <Link
                  href="/#openings"
                  className="bg-[#006067] hover:bg-[#004f55] text-white text-xs font-bold tracking-widest uppercase px-7 py-3 rounded-full transition-all"
                >
                  Explore More Roles
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              
              <div className="text-center space-y-2">
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                  SUBMIT YOUR BLUEPRINT
                </h2>
              </div>

              {/* Minimal Clean Resume Upload Box */}
              <div className="relative bg-teal-50/40 rounded-3xl p-8 border-2 border-dashed border-[#006067]/30 hover:border-[#006067] transition-all text-center">
                
                {/* Native hidden file input covering the area */}
                <input
                  type="file"
                  accept=".pdf"
                  id="resume-file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />

                <div className="flex flex-col items-center justify-center gap-3 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-teal-100/70 text-[#006067] flex items-center justify-center">
                    {parsing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6 stroke-[2.5]" />}
                  </div>

                  <div>
                    <p className="text-base font-extrabold text-gray-800">
                      Drop your resume here
                    </p>
                  </div>
                </div>

                {/* Uploaded File Preview Badge */}
                {resumeFileName && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-teal-200 shadow-sm text-xs font-bold text-[#006067] animate-in fade-in">
                    <FileText className="w-4 h-4 text-[#006067]" />
                    <span>{resumeFileName}</span>
                    <span className="text-[10px] text-gray-400">({resumeFileSize})</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-extrabold">
                      ✓ Uploaded successfully
                    </span>
                  </div>
                )}

                {/* Compact Sample Profile Pill (pointer-events-auto so it can be clicked) */}
                <div className="mt-4 relative z-20 flex justify-center">
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="bg-white hover:bg-gray-50 text-[#006067] border border-[#006067]/30 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-sm"
                  >
                    <Sparkles className="w-3 h-3" />
                    Load Sample Profile
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3.5 bg-red-50 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Comprehensive Application Form: Exactly 2 Columns and 1 Row per pair */}
              <form onSubmit={handleSubmit} className="space-y-10">
                
                {/* 1. PERSONAL INFORMATION */}
                <div className="space-y-5">
                  <h3 className="text-base sm:text-lg font-black tracking-wider uppercase text-[#006067] border-b border-gray-100 pb-2">
                    1. PERSONAL INFORMATION
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                        placeholder="john.doe@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        value={formData.whatsapp_number}
                        onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Gender
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Current City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.current_city}
                        onChange={(e) => setFormData({ ...formData, current_city: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                        placeholder="e.g. Bangalore / Jaipur"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Permanent Address
                      </label>
                      <input
                        type="text"
                        value={formData.permanent_address}
                        onChange={(e) => setFormData({ ...formData, permanent_address: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                        placeholder="Street, City, State"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. ACADEMICS & QUALIFICATIONS */}
                <div className="space-y-5">
                  <h3 className="text-base sm:text-lg font-black tracking-wider uppercase text-[#006067] border-b border-gray-100 pb-2">
                    2. ACADEMICS & QUALIFICATIONS
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Highest Qualification
                      </label>
                      <select
                        value={formData.highest_qualification}
                        onChange={(e) => setFormData({ ...formData, highest_qualification: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                      >
                        <option value="">Select Qualification</option>
                        <option value="Graduation">Graduation</option>
                        <option value="Post Graduation">Post Graduation</option>
                        <option value="Diploma">Diploma</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Degree / Qualification <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.degree}
                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                        placeholder="e.g. B.Tech / B.E."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Specialization / Major <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                        placeholder="e.g. Computer Science / IT"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        College / University <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                        placeholder="University Name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Graduation Year <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.graduation_year}
                        onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                        placeholder="e.g. 2026"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Education Status
                      </label>
                      <select
                        value={formData.education_status}
                        onChange={(e) => setFormData({ ...formData, education_status: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                      >
                        <option value="">Select Status</option>
                        <option value="Pursuing">Pursuing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Score Value (CGPA / %)
                      </label>
                      <input
                        type="text"
                        value={formData.score_value}
                        onChange={(e) => setFormData({ ...formData, score_value: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                        placeholder="e.g. 8.5 CGPA"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Notice Period
                      </label>
                      <select
                        value={formData.notice_period}
                        onChange={(e) => setFormData({ ...formData, notice_period: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                      >
                        <option value="">Select Notice Period</option>
                        <option value="Immediate">Immediate</option>
                        <option value="15 Days">15 Days</option>
                        <option value="30 Days">30 Days</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. TECHNICAL SKILLS & LINKS */}
                <div className="space-y-5">
                  <h3 className="text-base sm:text-lg font-black tracking-wider uppercase text-[#006067] border-b border-gray-100 pb-2">
                    3. TECHNICAL SKILLS & WEB PROFILES
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Key Technical Skills <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.skillsInput}
                        onChange={(e) => setFormData({ ...formData, skillsInput: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                        placeholder="e.g. React, Next.js, Node.js, Python, SQL"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="url"
                        value={formData.linkedin_url}
                        onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        GitHub Profile URL
                      </label>
                      <input
                        type="url"
                        value={formData.github_url}
                        onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                        placeholder="https://github.com/username"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Portfolio / Website URL
                      </label>
                      <input
                        type="url"
                        value={formData.portfolio_url}
                        onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                        placeholder="https://portfolio-website.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">
                        Why Cynbit? (Motivation Statement)
                      </label>
                      <input
                        type="text"
                        value={formData.why_cynbit}
                        onChange={(e) => setFormData({ ...formData, why_cynbit: e.target.value })}
                        className="w-full px-4 py-3.5 text-sm font-semibold bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                        placeholder="What excites you about Cynbit?"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="pt-2 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    defaultChecked
                    className="mt-1 w-4 h-4 text-[#006067] rounded border-gray-300 focus:ring-[#006067]"
                  />
                  <label htmlFor="terms" className="text-xs text-gray-500 font-medium">
                    I confirm that the information provided is accurate and agree to Cynbit's recruitment process policies.
                  </label>
                </div>

                {/* Full-Width Teal Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#006067] hover:bg-[#004f55] disabled:opacity-50 text-white text-xs font-black tracking-widest uppercase py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Blueprint...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <Zap className="w-4 h-4 fill-white" />
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          )}

        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default function JobDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col items-center justify-center text-[#006067]">
          <Loader2 className="w-8 h-8 animate-spin mb-3" />
          <span className="text-xs font-bold uppercase tracking-wider">Loading role...</span>
        </div>
      }
    >
      <JobDetailContent />
    </Suspense>
  );
}
