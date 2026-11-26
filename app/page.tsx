'use client';

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JobBoard from './components/JobBoard';
import ApplyModal from './components/ApplyModal';
import RecruiterDashboard from './components/RecruiterDashboard';
import { Job } from '@/types';
import { CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [currentView, setCurrentView] = useState<'candidate' | 'recruiter'>('candidate');
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleApplicationSuccess = () => {
    setSelectedJobForApply(null);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
      
      {/* 1. Navbar with Role Switcher */}
      <Navbar currentView={currentView} onViewChange={setCurrentView} />

      {/* 2. Success Banner Toast */}
      {showSuccessToast && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <div>
            <div className="text-xs font-black uppercase tracking-wider">Application Received!</div>
            <div className="text-[11px] opacity-90">Your profile and resume details were saved to Supabase.</div>
          </div>
        </div>
      )}

      {/* 3. Main Views */}
      <main className="flex-1">
        {currentView === 'candidate' ? (
          <>
            <Hero />
            <JobBoard onApplyJob={(job) => setSelectedJobForApply(job)} />
          </>
        ) : (
          <RecruiterDashboard />
        )}
      </main>

      {/* 4. Smart Auto-fill Apply Drawer / Modal */}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          onSuccess={handleApplicationSuccess}
        />
      )}

      {/* 5. Minimal Clean Cynbit Footer */}
      <footer className="bg-white border-t border-gray-100 py-10 text-center text-xs text-gray-400 font-semibold">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="https://www.cynbit.in/logo.svg" alt="Cynbit" className="h-6 w-auto grayscale opacity-70" />
            <span>© 2026 Cynbit Technologies. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-teal-700 font-bold">Candidate & Talent Automation Prototype</span>
            <span>Jaipur, Rajasthan</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
