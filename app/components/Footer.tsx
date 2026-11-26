'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Top / Main Grid: 4 Balanced Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-gray-100">
          
          {/* Column 1: Brand, Mission & Social Links */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
              <img
                src="https://www.cynbit.in/logo.svg"
                alt="Cynbit Technologies"
                className="h-10 w-auto object-contain"
              />
            </Link>

            <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-sm">
              Architecting scalable digital platforms, AI automation systems, and high-performance engineering labs. Engineered for optimism.
            </p>

            {/* Social Icons (Prominently sized, clean circles) */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-50 hover:bg-[#006067] text-gray-600 hover:text-white border border-gray-200/80 flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.69 1.69 0 1 0 0-3.38 1.69 1.69 0 0 0 0 3.38m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                </svg>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-50 hover:bg-[#006067] text-gray-600 hover:text-white border border-gray-200/80 flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-50 hover:bg-[#006067] text-gray-600 hover:text-white border border-gray-200/80 flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-50 hover:bg-[#006067] text-gray-600 hover:text-white border border-gray-200/80 flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="Twitter / X"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            {/* Direct Contact & Email Section */}
            <div className="pt-2 space-y-3">
              <a
                href="mailto:opportunities@cynbit.in"
                className="flex items-center gap-3 text-xs font-bold text-gray-700 hover:text-[#006067] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-[#006067] border border-teal-100 flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span>opportunities@cynbit.in</span>
              </a>

              <div className="flex items-start gap-3 text-xs font-semibold text-gray-600">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-[#006067] border border-teal-100 flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div>+91 89479 62667</div>
                  <div>+91 78912 09777</div>
                </div>
              </div>
            </div>

          </div>

          {/* Column 2: EXPLORE Navigation Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[11px] font-black tracking-widest text-[#006067] uppercase">
              EXPLORE
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-gray-600">
              <li>
                <Link href="/" className="hover:text-[#006067] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#006067] transition-colors">
                  Core Team
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#006067] transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#006067] transition-colors">
                  Product Suite
                </Link>
              </li>
              <li>
                <Link href="/#openings" className="text-[#006067] font-bold hover:underline">
                  Student Internships
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: IMPACT & INITIATIVES */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[11px] font-black tracking-widest text-[#006067] uppercase">
              IMPACT
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-gray-600">
              <li>
                <Link href="/" className="hover:text-[#006067] transition-colors">
                  Social Initiatives
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#006067] transition-colors">
                  Expert Blog
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#006067] transition-colors">
                  Engineering Labs
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#006067] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#006067] transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: STAY CONNECTED & HEADQUARTERS */}
          <div className="lg:col-span-4 space-y-5">
            <h4 className="text-[11px] font-black tracking-widest text-[#006067] uppercase">
              STAY CONNECTED
            </h4>

            {/* Newsletter Subscription Card */}
            <div className="bg-[#fafafa] rounded-2xl p-5 border border-gray-150 space-y-3">
              <h5 className="text-xs font-black text-gray-900">
                Subscribe to our Briefing
              </h5>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                Join 25k+ architects receiving our weekly technical and strategic deep-dives.
              </p>
              
              <div className="pt-1">
                <button
                  type="button"
                  className="w-full bg-[#006067] hover:bg-[#004f55] text-white text-[11px] font-black tracking-wider uppercase py-3 rounded-full transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>JOIN THE NEWSLETTER</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Prominent Headquarters Box */}
            <div className="bg-teal-50/60 rounded-2xl p-4 border border-teal-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-teal-200 flex items-center justify-center text-[#006067] flex-shrink-0 mt-0.5 shadow-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-xs font-medium text-gray-700 leading-snug">
                <div className="text-[10px] font-black tracking-widest text-[#006067] uppercase mb-0.5">
                  HEADQUARTERS
                </div>
                <div>32/115 Pratap Nagar, Jaipur,</div>
                <div>Rajasthan, 302033, India</div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar: Copyright & Navigation */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-gray-400">
          <div className="tracking-wide">
            © 2026 CYNBIT TECHNOLOGIES. ENGINEERED FOR OPTIMISM.
          </div>

          <div className="flex items-center gap-6 text-[11px] tracking-wider uppercase">
            <Link href="/" className="hover:text-[#006067] transition-colors font-bold">
              TERMS
            </Link>
            <Link href="/" className="hover:text-[#006067] transition-colors font-bold">
              COOKIES
            </Link>
            <Link href="/#openings" className="hover:text-[#006067] transition-colors font-bold text-[#006067]">
              CAREERS NAVIGATION
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
