'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Briefcase, UserCheck, ChevronDown } from 'lucide-react';

interface NavbarProps {
  currentView?: 'candidate' | 'recruiter';
  onViewChange?: (view: 'candidate' | 'recruiter') => void;
}

export default function Navbar({ currentView = 'candidate', onViewChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      {/* w-full with generous horizontal padding pushes logo to far-left & actions to far-right */}
      <div className="w-full px-6 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between h-20">
          
          {/* 1. Far Left: Cynbit Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img
                src="https://www.cynbit.in/logo.svg"
                alt="Cynbit Technologies"
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* 2. Dead Center: Desktop Navigation Links (Light weight font-semibold, tracking-wider, perfectly centered) */}
          <nav className="hidden lg:flex items-center space-x-9 text-[12px] font-semibold tracking-wider text-[#4a5568] uppercase">
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#006067] transition-colors">
              <span>COMPANY</span>
              <ChevronDown className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#006067] transition-colors">
              <span>EXPERTISE</span>
              <ChevronDown className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#006067] transition-colors">
              <span>BITELEVATE</span>
              <ChevronDown className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <Link href="/" className="hover:text-[#006067] transition-colors">
              BLOG
            </Link>
            <Link href="/" className="hover:text-[#006067] transition-colors">
              CONTACT
            </Link>
          </nav>

          {/* 3. Far Right: Prototype Role Switcher & JOIN US Button */}
          <div className="hidden sm:flex items-center space-x-4 flex-shrink-0">
            
            {/* Reviewer Role Switcher Pill */}
            <div className="flex items-center bg-gray-100 p-1 rounded-full text-xs font-medium border border-gray-200">
              <button
                type="button"
                onClick={() => onViewChange && onViewChange('candidate')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-[11px] ${
                  currentView === 'candidate'
                    ? 'bg-[#006067] text-white shadow-sm font-semibold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Candidate
              </button>
              <button
                type="button"
                onClick={() => onViewChange && onViewChange('recruiter')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-[11px] ${
                  currentView === 'recruiter'
                    ? 'bg-[#006067] text-white shadow-sm font-semibold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Recruiter
              </button>
            </div>

            {/* Cynbit JOIN US Pill */}
            <button className="bg-[#006067] hover:bg-[#004f55] text-white text-[11px] font-bold tracking-widest uppercase px-7 py-2.5 rounded-full transition-all shadow-sm">
              JOIN US
            </button>
          </div>

          {/* 4. Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-[#006067] rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#006067]" />
              ) : (
                <Menu className="w-6 h-6 text-gray-800" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-6 pt-4 pb-6 space-y-3 uppercase font-semibold text-[11px] tracking-wider text-[#4a5568]">
          <div className="py-2.5 hover:text-[#006067] flex justify-between items-center cursor-pointer">
            <span>Company</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="py-2.5 hover:text-[#006067] flex justify-between items-center cursor-pointer">
            <span>Expertise</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="py-2.5 hover:text-[#006067] flex justify-between items-center cursor-pointer">
            <span>BitElevate</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <Link href="/" className="block py-2.5 hover:text-[#006067]">
            Blog
          </Link>
          <Link href="/" className="block py-2.5 hover:text-[#006067]">
            Contact
          </Link>
          
          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400">DEMO VIEW</span>
            <div className="flex bg-gray-100 p-1 rounded-full text-xs">
              <button
                onClick={() => {
                  onViewChange && onViewChange('candidate');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 rounded-full text-[11px] ${
                  currentView === 'candidate' ? 'bg-[#006067] text-white' : 'text-gray-600'
                }`}
              >
                Candidate
              </button>
              <button
                onClick={() => {
                  onViewChange && onViewChange('recruiter');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 rounded-full text-[11px] ${
                  currentView === 'recruiter' ? 'bg-[#006067] text-white' : 'text-gray-600'
                }`}
              >
                Recruiter
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
