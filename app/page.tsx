'use client';

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

export default function Home() {
  const [currentView, setCurrentView] = useState<'candidate' | 'recruiter'>('candidate');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. Header Navigation with Role Switcher */}
      <Navbar currentView={currentView} onViewChange={setCurrentView} />

      {/* 2. Hero Section */}
      <main className="flex-1">
        <Hero />
      </main>
    </div>
  );
}
