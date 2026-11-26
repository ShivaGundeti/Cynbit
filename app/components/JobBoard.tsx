'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Search, MapPin, Briefcase, Zap, ChevronDown, 
  RotateCcw, Sparkles, Loader2, DollarSign, Building2, Globe
} from 'lucide-react';
import { Job } from '@/types';

interface JobBoardProps {
  onApplyJob: (job: Job) => void;
}

const DEPARTMENTS = ['All', 'Core Engineering', 'AI & Data', 'Growth', 'Product & Design'];
const WORK_MODES = ['All', 'Remote', 'Hybrid', 'On-site'];
const LOCATIONS = ['All', 'Jaipur', 'Remote', 'Bengaluru', 'Hyderabad'];
const STIPENDS = ['All', '₹15,000 - ₹25,000', '₹25,000 - ₹40,000', 'Competitive'];

export default function JobBoard({ onApplyJob }: JobBoardProps) {
  const [activeTab, setActiveTab] = useState<'Internship' | 'Full Time'>('Internship');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedStipend, setSelectedStipend] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs dynamically from backend API
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('type', activeTab);
      if (selectedDept !== 'All') params.append('department', selectedDept);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/job?${params.toString()}`);
      const json = await res.json();
      if (json.jobs) {
        let filtered = json.jobs as Job[];
        
        // Client-side sub-filtering for work mode & location
        if (selectedWorkMode !== 'All') {
          filtered = filtered.filter(j => 
            (j.work_mode || j.workMode || 'Remote').toLowerCase() === selectedWorkMode.toLowerCase()
          );
        }
        if (selectedLocation !== 'All') {
          filtered = filtered.filter(j => 
            (j.location || '').toLowerCase().includes(selectedLocation.toLowerCase())
          );
        }
        setJobs(filtered);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedDept, selectedWorkMode, selectedLocation, searchQuery]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const resetFilters = () => {
    setSelectedDept('All');
    setSelectedWorkMode('All');
    setSelectedLocation('All');
    setSelectedStipend('All');
    setSearchQuery('');
  };

  return (
    <section id="openings" className="py-16 lg:py-24 bg-[#fafafa] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* 1. Section Header & Large Tab Switcher */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-[#006067] text-[11px] font-black tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 fill-[#006067]" />
            CURRENT OPPORTUNITIES
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-8">
            Explore Open Positions
          </h2>

          {/* Large Tab Switcher with Sliding Underline */}
          <div className="relative inline-flex items-center justify-center p-1.5 border-b border-gray-200 gap-10 sm:gap-16">
            <button
              type="button"
              onClick={() => {
                setActiveTab('Internship');
                resetFilters();
              }}
              className={`relative pb-3 text-xl sm:text-2xl font-black tracking-tight transition-all duration-300 ${
                activeTab === 'Internship'
                  ? 'text-[#006067]'
                  : 'text-gray-300 hover:text-gray-500'
              }`}
            >
              Internships
              {activeTab === 'Internship' && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#006067] rounded-full shadow-[0_2px_8px_rgba(0,96,103,0.4)] animate-in fade-in" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('Full Time');
                resetFilters();
              }}
              className={`relative pb-3 text-xl sm:text-2xl font-black tracking-tight transition-all duration-300 ${
                activeTab === 'Full Time'
                  ? 'text-[#006067]'
                  : 'text-gray-300 hover:text-gray-500'
              }`}
            >
              Full Time
              {activeTab === 'Full Time' && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#006067] rounded-full shadow-[0_2px_8px_rgba(0,96,103,0.4)] animate-in fade-in" />
              )}
            </button>
          </div>
        </div>

        {/* 2. Main Two-Column Layout: Filter Sidebar (Left) + 2-Column Cards (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Aesthetic Filter Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-[26px] p-6 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] sticky top-28 space-y-6">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#006067]" />
                <h3 className="text-sm font-black text-gray-900 tracking-wider uppercase">Filter Roles</h3>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] font-bold text-gray-400 hover:text-[#006067] flex items-center gap-1 transition-colors"
                title="Reset all"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* 1. Search Bar inside Sidebar */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 tracking-wider uppercase mb-1.5">
                Keyword Search
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. Full Stack, AI, Marketing..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs font-semibold bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] transition-all"
                />
              </div>
            </div>

            {/* 2. Department Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-gray-400" />
                <span>Department</span>
              </label>
              <div className="relative">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 text-xs font-semibold bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] cursor-pointer"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* 3. Work Mode Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-gray-400" />
                <span>Work Mode</span>
              </label>
              <div className="relative">
                <select
                  value={selectedWorkMode}
                  onChange={(e) => setSelectedWorkMode(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 text-xs font-semibold bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] cursor-pointer"
                >
                  {WORK_MODES.map((mode) => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* 4. Location Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>Location</span>
              </label>
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 text-xs font-semibold bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] cursor-pointer"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* 5. Stipend / Compensation */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                <span>{activeTab === 'Internship' ? 'Stipend Range' : 'Compensation'}</span>
              </label>
              <div className="relative">
                <select
                  value={selectedStipend}
                  onChange={(e) => setSelectedStipend(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 text-xs font-semibold bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006067]/20 focus:border-[#006067] cursor-pointer"
                >
                  {STIPENDS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Matching roles count badge */}
            <div className="pt-2 text-center">
              <span className="text-[11px] font-bold text-gray-400">
                Showing <span className="text-[#006067] font-black">{jobs.length}</span> positions
              </span>
            </div>

          </div>

          {/* Right Column: 2-Column Wide Job Cards */}
          <div className="lg:col-span-8">
            
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center text-gray-400 bg-white rounded-[28px] border border-gray-100">
                <Loader2 className="w-8 h-8 animate-spin text-[#006067] mb-3" />
                <span className="text-xs font-bold tracking-wider uppercase">Loading matching positions...</span>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-[28px] border border-dashed border-gray-300 p-12 text-center">
                <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-800 mb-1">No roles matching your criteria</h3>
                <p className="text-xs text-gray-500 mb-4">Try clearing one or more filters from the sidebar.</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-bold text-[#006067] underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              /* Exactly 2 cards per row on desktop with extra width & spacing */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="group relative bg-white rounded-[28px] p-7 border border-gray-150 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:border-[#006067] hover:shadow-[0_16px_36px_rgba(0,96,103,0.14)] hover:-translate-y-1 hover:scale-[1.015] transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black tracking-widest text-[#006067] uppercase">
                          {job.department}
                        </span>
                        <span className="text-[10px] font-extrabold tracking-wider bg-gray-100/80 text-gray-600 px-3 py-1 rounded-full uppercase">
                          {job.location || 'REMOTE / JAIPUR'}
                        </span>
                      </div>

                      {/* Semi-bold Title */}
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#006067] transition-colors mb-2 line-clamp-1">
                        {job.title}
                      </h3>

                      {/* Highlighted Experience in Teal */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold text-[#006067] bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100/60">
                          Experience: {job.experience || '0-1 Years'}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">•</span>
                        <span className="text-xs text-gray-500 font-medium">
                          {job.work_mode || job.workMode || 'Remote'}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed mb-4">
                        {job.description || 'Architect high-performance systems and collaborate directly with our engineering team.'}
                      </p>

                      {/* Curated Skills: 3 to 4 Skills Only */}
                      {job.skills_required && job.skills_required.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {job.skills_required.slice(0, 4).map((skill, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-bold bg-gray-50 text-gray-700 px-2.5 py-1 rounded-md border border-gray-150"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills_required.length > 4 && (
                            <span className="text-[10px] font-bold text-gray-400 self-center">
                              +{job.skills_required.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* View Details Link navigating to fresh dedicated role page */}
                    <Link
                      href={`/careers/${job.id}`}
                      className="w-full mt-2 bg-gray-50 hover:bg-[#006067] text-gray-700 hover:text-white border border-gray-200/80 hover:border-[#006067] text-xs font-semibold tracking-wider uppercase py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-sm group/btn"
                    >
                      <span>View Details</span>
                      <Zap className="w-3.5 h-3.5 fill-current opacity-70 group-hover/btn:opacity-100" />
                    </Link>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
