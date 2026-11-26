'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Bot, Cpu, Zap, Activity } from 'lucide-react';

const ROTATING_WORDS = [
  'SaaS platforms.',
  'cloud solutions.',
  'AI agents.',
  'dashboards.',
  'scalable platforms.'
];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'enter' | 'exit'>('enter');
  const [progress, setProgress] = useState(88);

  // Smooth upward fade rotation of words
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('exit');
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setFadeState('enter');
      }, 350);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Subtle pulsing progress bar animation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 98 ? 85 : prev + 1));
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#fafafa] py-16 lg:py-24 border-b border-gray-100">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-teal-50/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading, Animated Text & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tag pill matching Cynbit */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fcedd7] text-[#8c5717] text-[11px] font-black tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8c5717]" />
              THE OPTIMISTIC ARCHITECT
            </div>

            {/* Main Title with Upward Fading Rotating Text */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black tracking-tight text-[#111827] leading-[1.12]">
              Architecting <br />
              the future with <br />
              <span className="inline-block relative h-[1.25em] overflow-hidden align-bottom">
                <span
                  className={`inline-block font-extrabold italic text-[#006067] transition-all duration-300 transform ${
                    fadeState === 'enter'
                      ? 'translate-y-0 opacity-100'
                      : '-translate-y-6 opacity-0'
                  }`}
                >
                  {ROTATING_WORDS[wordIndex]}
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
              Cynbit Technologies architects the digital future with{' '}
              <span className="underline decoration-teal-600/40 font-semibold text-gray-800">autonomous AI agents</span>,{' '}
              custom software development, and scalable business platforms. Based in Jaipur, Rajasthan, we bridge the gap between technical precision and global business growth.
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <a
                href="#openings"
                className="inline-flex items-center gap-2.5 bg-[#006067] hover:bg-[#004f55] text-white text-xs font-bold tracking-wider uppercase px-8 py-3.5 rounded-full shadow-sm hover:shadow transition-all group"
              >
                <span>Explore Careers</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

          </div>

          {/* Right Column: Floating Interactive Engineering Hub Component */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            
            {/* The main floating container with smooth vertical float */}
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
              
              {/* Outer Dashed Concentric Orbit Rings */}
              <div className="absolute inset-0 rounded-full border border-gray-200/80" />
              <div className="absolute inset-8 rounded-full border border-dashed border-gray-300/70" />
              <div className="absolute inset-16 rounded-full border border-gray-200/60" />

              {/* Central White Glass Disc with Soft Shadow */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-white shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center justify-center">
                {/* Tech icon network in center */}
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#006067]">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mt-1">CORE LAB</span>
                </div>
              </div>

              {/* Top-Right Card: AUTOMATION & Animated Progress Bar */}
              <div className="absolute -top-2 right-0 sm:right-2 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-gray-100 w-48 animate-[float-subtle_4s_ease-in-out_infinite]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center text-[#006067]">
                    <Zap className="w-3.5 h-3.5 fill-[#006067]" />
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-[#006067] uppercase">AUTOMATION</span>
                </div>
                {/* Interactive Animated Progress Bar */}
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#006067] h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 mt-1.5">
                  <span>Efficiency</span>
                  <span className="text-[#006067] font-extrabold">{progress}%</span>
                </div>
              </div>

              {/* Left Orbit Node: AI Cognitive Agent Badge */}
              <div className="absolute top-1/4 -left-2 bg-blue-100/90 text-blue-700 w-11 h-11 rounded-2xl shadow-md border border-blue-200 flex items-center justify-center animate-[float-subtle_5s_ease-in-out_infinite_reverse]">
                <Bot className="w-5 h-5" />
              </div>

              {/* Bottom-Left Card: Runtime Active Now Status */}
              <div className="absolute -bottom-2 left-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3 animate-[float-subtle_4.5s_ease-in-out_infinite]">
                <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] font-black tracking-widest text-gray-400 uppercase">RUNTIME</div>
                  <div className="text-xs font-bold text-teal-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active now
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
