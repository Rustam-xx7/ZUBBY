'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import LoadingScreen from '../components/LoadingScreen';
import Character1ScrollCanvas from '../components/Character1ScrollCanvas';
import BikeScrollCanvas from '../components/BikeScrollCanvas';
import SmoothScroll from '../components/SmoothScroll';

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [navMode, setNavMode] = useState('dark');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);

      if (scrollTop > 40) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }

      // Check current visible section mode
      const sections = document.querySelectorAll('section[data-nav-mode], footer[data-nav-mode]');
      const navOffset = 70;
      let currentMode = 'dark';
      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= navOffset && rect.bottom >= navOffset) {
          currentMode = sec.getAttribute('data-nav-mode') || 'dark';
        }
      });
      setNavMode(currentMode);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Intersection Observer for scroll animations
    const revealItems = document.querySelectorAll('.reveal-on-scroll, .reveal-from-left, .reveal-from-right');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealItems.forEach((el) => observer.observe(el));

    // Fallback trigger for elements already in viewport
    const timer = setTimeout(() => {
      revealItems.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add('active');
        }
      });
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F6F5F2] text-[#111111]">
      {/* 5-SECOND INTRO LOGO ANIMATION LOADING SCREEN */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <SmoothScroll isLoading={isLoading} />

      {/* TOP SCROLL PROGRESS BAR */}
      <div className="fixed top-0 left-0 w-full h-[3px] z-50 pointer-events-none" id="scroll-progress-container">
        <div
          className="h-full bg-jabee-orange transition-all duration-75 ease-out shadow-[0_0_8px_#FF6B1A]"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* FIXED FLOATING NAVBAR */}
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 py-3.5 px-4 md:px-12 flex items-center justify-between ${navScrolled
          ? navMode === 'light'
            ? 'bg-[#0B0D12]/90 backdrop-blur-md border-b border-white/10'
            : 'bg-white/90 backdrop-blur-md border-b border-neutral-200/70 shadow-sm'
          : 'bg-transparent'
          }`}
        id="main-nav"
      >
        <a className="flex items-center gap-2 group" href="#">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xl md:text-2xl font-black tracking-wider transition-colors duration-300 font-display ${navMode === 'light' ? 'text-white' : 'text-jabee-black'
                }`}
            >
              ZUBBY<span className="text-jabee-orange">.</span>
            </span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a
            className={`text-sm font-medium transition-colors hover:text-jabee-orange ${navMode === 'light' ? 'text-neutral-200' : 'text-[#333333]'
              }`}
            href="#story"
          >
            Story
          </a>
          <a
            className={`text-sm font-medium transition-colors hover:text-jabee-orange ${navMode === 'light' ? 'text-neutral-200' : 'text-[#333333]'
              }`}
            href="#bike-reveal"
          >
            The Revelation
          </a>
          <a
            className={`text-sm font-medium transition-colors hover:text-jabee-orange ${navMode === 'light' ? 'text-neutral-200' : 'text-[#333333]'
              }`}
            href="#features"
          >
            Features
          </a>
          <a
            className={`text-sm font-medium transition-colors hover:text-jabee-orange ${navMode === 'light' ? 'text-neutral-200' : 'text-[#333333]'
              }`}
            href="#team"
          >
            Team
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            className="bg-jabee-orange hover:bg-jabee-orangeDark text-white px-3.5 py-1.5 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-bold tracking-wide transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md shadow-jabee-orange/30 flex items-center gap-1.5"
            href="#download-section"
          >
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" viewBox="0 0 512 512">
              {/* Left Blue Spine */}
              <path fill="#4285F4" d="M47.7 26.6C44.4 30.1 42.5 35.7 42.5 43v426c0 7.3 1.9 12.9 5.2 16.4l1.6 1.4 238.4-238.4v-5.6L49.3 25.2l-1.6 1.4z" />
              {/* Right Yellow Arrow */}
              <path fill="#FBBC04" d="M371.7 319.4l-84-84v-5.6l84-84 1.9 1.1 99.4 56.5c28.3 16.1 28.3 42.5 0 58.6l-99.4 56.5-1.9 1.1z" />
              {/* Bottom Red Wedge */}
              <path fill="#EA4335" d="M287.7 235.4L47.7 475.4c9.3 9.9 24.8 11.1 42.1 1.4l241.9-137.4-44-44z" />
              {/* Top Green Wedge */}
              <path fill="#34A853" d="M287.7 235.4l44-44-241.9-137.4c-17.3-9.7-32.8-8.5-42.1 1.4l240 240z" />
            </svg>
            <span>Download App</span>
          </a>
        </div>
      </header>

      {/* ========================================== */}
      {/* STORY SCENE 1: Character 1 (Light Studio)  */}
      {/* ========================================== */}
      {/* DESKTOP VIEW */}
      <section
        className="hidden lg:flex relative min-h-screen w-full items-center justify-center pt-28 pb-20 px-16 lg:px-24 bg-[#F6F5F2] overflow-hidden"
        data-nav-mode="dark"
        id="story"
      >
        <div className="max-w-7xl w-full mx-auto grid grid-cols-12 gap-8 items-center relative z-20">
          <div className="col-span-6 flex flex-col justify-center relative z-30 reveal-from-left">
            <div className="bg-white/95 p-12 rounded-3xl border border-neutral-200/80 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-[3px] h-6 bg-jabee-orange rounded-full"></div>
                <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#666666]">
                  WEEKDAY MORNING
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-jabee-black tracking-tight leading-[1.12] mb-6 font-display">
                Every weekday, the same road to work.
              </h1>
              <p className="text-lg md:text-xl text-[#555555] font-normal leading-relaxed mb-8">
                Meet an everyday office professional. Bag on his shoulder, a long day ahead, and a ride to book.
              </p>
              <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-[#888888] pt-4 border-t border-[#EAE6DF]">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 08:30 AM Routine
                </span>
                <span>•</span>
                <span>Daily Office Rush</span>
              </div>
            </div>
          </div>
          <div className="col-span-6 flex justify-center items-center py-6 relative z-10">
            <Character1ScrollCanvas isLoading={isLoading} triggerId="story" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#CFCBC6] pointer-events-none z-10"></div>
      </section>

      {/* MOBILE VIEW */}
      <section className="block lg:hidden relative pt-20 pb-12 overflow-hidden bg-[#F6F5F2]" data-nav-mode="dark" id="story-mobile">
        <div className="max-w-[590px] mx-auto px-4">
          {/* Character 1 Animation Canvas ON TOP in Mobile View */}
          <div className="relative w-full flex flex-col items-center justify-center mb-4">
            <Character1ScrollCanvas isLoading={isLoading} triggerId="story-mobile" />
          </div>

          {/* Text Card BELOW Character 1 in Mobile View */}
          <div className="glass-card rounded-2xl p-5 border border-white/80 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-[3px] h-3.5 bg-jabee-orange rounded-full inline-block"></span>
              <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-500">WEEKDAY MORNING</span>
            </div>
            <h1 className="text-[28px] leading-[1.15] font-black tracking-tight text-neutral-900 mb-2.5 font-display">
              Every weekday, the same road to work.
            </h1>
            <p className="text-neutral-600 text-[13.5px] leading-relaxed mb-4">
              Meet an everyday office professional. Bag on his shoulder, a long day ahead, and a ride to book.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/80 border border-neutral-200/70 px-3 py-1.5 rounded-full shadow-2xs backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10.5px] font-semibold tracking-wide text-neutral-700 uppercase">08:30 AM ROUTINE • DAILY OFFICE RUSH</span>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* STORY SCENE 2: Character 2 (Warm Grey Wall, Sunlit Greenery)   */}
      {/* ============================================================== */}
      {/* DESKTOP VIEW */}
      <section
        className="hidden lg:flex relative min-h-screen w-full items-center justify-center pt-28 pb-24 px-16 lg:px-24 bg-[#CFCBC6] overflow-hidden"
        data-nav-mode="dark"
      >
        <div className="absolute inset-0 z-0">
          <img
            alt="Every morning commute waiting"
            className="w-full h-full object-cover object-[10%_left]"
            src="/character2bg.png"
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-[#CFCBC6] to-transparent pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-36 bg-gradient-to-b from-transparent to-[#0B0D12] pointer-events-none z-10"></div>

        <div className="max-w-7xl w-full mx-auto grid grid-cols-12 gap-8 items-center relative z-20">
          <div className="col-span-6 flex flex-col items-start justify-center">
            <div className="bg-white/90 px-5 py-3 rounded-2xl shadow-soft border border-white/80 inline-flex items-center gap-2 text-xs font-semibold text-[#333333] animate-float-2">
              <span>📍 Home → Tech Park (9.4 km)</span>
            </div>
          </div>

          <div className="col-span-6 flex flex-col justify-center reveal-from-right">
            <div className="bg-white/90 p-12 rounded-3xl border border-white/70 shadow-2xl">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-[3px] h-6 bg-jabee-orange rounded-full"></div>
                <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#55524C]">
                  SAME JOURNEY. EVERY DAY.
                </span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-extrabold text-jabee-black tracking-tight leading-[1.12] mb-6 font-display">
                Every morning, he books the same ride.
              </h2>
              <p className="text-lg md:text-xl text-[#3A3835] font-normal leading-relaxed mb-8">
                Same pickup. Same drop. Same time. Yet he opens the app and does it all over again, five days a week.
              </p>
              <div className="grid grid-cols-5 gap-2 max-w-xs pt-2">
                <div className="h-2 rounded-full bg-jabee-orange"></div>
                <div className="h-2 rounded-full bg-jabee-orange"></div>
                <div className="h-2 rounded-full bg-jabee-orange"></div>
                <div className="h-2 rounded-full bg-jabee-orange"></div>
                <div className="h-2 rounded-full bg-jabee-orange"></div>
              </div>
              <span className="text-[11px] uppercase tracking-wider text-[#66635D] font-bold mt-2.5 block">
                5 days every week • Zero consistency
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE VIEW */}
      <section className="block lg:hidden relative pt-10 pb-12 bg-[#CFCBC6]" data-nav-mode="dark">
        <div className="max-w-[390px] mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden shadow-md bg-neutral-200 mb-5">
            <img alt="Professional looking out from balcony" className="w-full h-[460px] object-cover object-top" src="/character2.jpg" />
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10.5px] font-medium px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Home → Tech Park (9.4 km)</span>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-5 border border-white/80 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-[3px] h-3.5 bg-jabee-orange rounded-full inline-block"></span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-600">SAME JOURNEY. EVERY DAY.</span>
            </div>
            <h2 className="text-2xl font-black text-neutral-900 leading-snug mb-2 font-display">
              Every morning, he books the same ride.
            </h2>
            <p className="text-neutral-600 text-[13px] leading-relaxed mb-4">
              Same pickup. Same drop. Same time. Yet he opens the app and does it all over again, five days a week.
            </p>
            <div className="pt-3 border-t border-neutral-200/80">
              <div className="flex items-center justify-between text-[10px] font-bold text-neutral-500 mb-1.5 uppercase tracking-wider">
                <span>5 Days Every Week</span>
                <span className="text-jabee-orange">Zero Consistency</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                <span className="h-1.5 rounded-full bg-jabee-orange"></span>
                <span className="h-1.5 rounded-full bg-jabee-orange"></span>
                <span className="h-1.5 rounded-full bg-jabee-orange"></span>
                <span className="h-1.5 rounded-full bg-jabee-orange"></span>
                <span className="h-1.5 rounded-full bg-jabee-orange"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* STORY SCENE 3: Character 3 (Dark, Stressed, Spotlight)         */}
      {/* ============================================================== */}
      {/* DESKTOP VIEW */}
      <section
        className="hidden lg:flex relative min-h-screen w-full items-center justify-center pt-28 pb-24 px-16 lg:px-24 bg-[#0B0D12] text-white overflow-hidden"
        data-nav-mode="light"
      >
        <div className="absolute inset-0 z-0">
          <img
            alt="Stressed commuter in spotlight"
            className="w-full h-full object-cover object-center"
            src="/character3bg.png"
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-[#0B0D12] to-transparent pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-36 bg-gradient-to-b from-transparent to-[#EAE6DF] pointer-events-none z-10"></div>

        <div className="max-w-7xl w-full mx-auto grid grid-cols-12 gap-8 items-center relative z-20">
          <div className="col-span-6 flex flex-col justify-center reveal-from-left">
            <div className="bg-[#0B0D12]/85 p-12 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-[3px] h-6 bg-jabee-orange rounded-full shadow-[0_0_12px_#FF6B1A]"></div>
                <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#FF9E54]">
                  THEN THE STRESS BEGINS
                </span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6 font-display">
                Prices jump.<br />
                Captains cancel.<br />
                <span className="text-neutral-400">Time runs out.</span>
              </h2>
              <p className="text-lg text-[#CCCCCC] font-normal leading-relaxed mb-8">
                Sometimes the fare changes. Sometimes no captain accepts. Rides get cancelled again and again, and
                every cancellation costs minutes he doesn't have. The day starts with stress and a bad mood.
              </p>
              <div className="bg-black/60 border border-white/15 rounded-2xl p-4 max-w-md">
                <div className="flex items-center justify-between text-xs text-red-400 font-semibold mb-2">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      ></path>
                    </svg>
                    High demand in your area
                  </span>
                  <span className="bg-red-500/25 text-red-300 px-2 py-0.5 rounded text-[10px] font-bold">
                    +68% Surge
                  </span>
                </div>
                <div className="text-xs font-medium text-neutral-300">Searching for nearby captains (3m 42s elapsed)...</div>
              </div>
            </div>
          </div>

          <div className="col-span-6 relative flex flex-col items-center justify-center gap-3 py-8 reveal-from-right">
            <div className="bg-[#181A20]/95 border border-amber-500/50 text-amber-300 px-5 py-3 rounded-2xl text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-float-1">
              <span className="text-amber-400 font-bold">↑</span>
              <span>Fare increased to $28.50</span>
            </div>
            <div className="bg-[#181A20]/95 border border-blue-500/40 text-blue-200 px-5 py-3 rounded-2xl text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-float-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              <span>Searching for captain...</span>
            </div>
            <div className="bg-[#241315]/95 border border-red-500/50 text-red-300 px-5 py-3 rounded-2xl text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-float-3">
              <span className="text-red-400 font-bold">✕</span>
              <span>Ride cancelled by captain</span>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE VIEW */}
      <section className="block lg:hidden relative pt-10 pb-12 bg-[#CFCBC6]" data-nav-mode="dark">
        <div className="max-w-[390px] mx-auto px-4 relative z-10">
          <div className="bg-[#12141A]/95 backdrop-blur-md rounded-2xl p-5 border border-black/15 shadow-xl mb-5 text-white">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-[3px] h-3.5 bg-jabee-orange rounded-full inline-block"></span>
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#FF8540]">THEN THE STRESS BEGINS</span>
            </div>
            <h2 className="text-[28px] font-black leading-[1.12] tracking-tight mb-2.5 text-white font-display">
              Prices jump.<br />Captains cancel.<br /><span className="text-jabee-orange">Time runs out.</span>
            </h2>
            <p className="text-neutral-300 text-[13px] leading-relaxed">
              Sometimes the fare changes. Sometimes no captain accepts. Rides get cancelled again and again, and every cancellation costs minutes he doesn't have. The day starts with stress and a bad mood.
            </p>
          </div>

          <div className="relative w-full rounded-2xl overflow-hidden border border-neutral-400/50 bg-[#14171E] shadow-xl">
            <img alt="Anxious professional waiting in the dark" className="w-full h-[420px] object-cover object-bottom" src="/character3.jpg" />
            <div className="absolute top-3.5 right-3 bg-[#181A20]/90 backdrop-blur-md border border-red-500/40 text-red-200 text-[10.5px] font-semibold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
              <span>Fare increased to $28.50</span>
            </div>
            <div className="absolute bottom-14 left-3 bg-[#181A20]/90 backdrop-blur-md border border-amber-500/30 text-amber-200 text-[10.5px] font-medium px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Searching for captain...</span>
            </div>
            <div className="absolute bottom-3.5 right-3 bg-[#181A20]/90 backdrop-blur-md border border-red-500/40 text-red-300 text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="text-red-400">✕</span>
              <span>Ride cancelled by captain</span>
            </div>
          </div>

          <div className="mt-4 bg-[#12141A]/95 backdrop-blur-md rounded-xl p-3 border border-black/15 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center gap-2 text-[11.5px] text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>High demand in your area</span>
            </div>
            <span className="text-[10.5px] font-bold text-red-400 bg-red-900/40 px-2 py-0.5 rounded border border-red-800/40">+45% Surge</span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* STORY SCENE 4: Character 4 (Bright Office & Modern Relief)    */}
      {/* ============================================================== */}
      {/* DESKTOP VIEW */}
      <section
        className="hidden lg:flex relative min-h-screen w-full items-center justify-center pt-28 pb-28 px-16 lg:px-24 bg-[#EAE6DF] overflow-hidden"
        data-nav-mode="dark"
      >
        <div className="absolute inset-0 z-0">
          <img
            alt="Calm commuter holding mug at office desk"
            className="w-full h-full object-cover object-center"
            src="/character4bg.png"
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-[#EAE6DF] to-transparent pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-36 bg-gradient-to-b from-transparent to-white pointer-events-none z-10"></div>

        <div className="max-w-7xl w-full mx-auto grid grid-cols-12 gap-8 items-center relative z-20">
          <div className="col-span-6 flex items-end justify-start">
            <div className="bg-white/95 px-5 py-3 rounded-2xl shadow-soft border border-emerald-500/20 flex items-center gap-3 animate-float-1">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <div>
                <div className="text-xs font-bold text-jabee-black">Captain Rajesh arrived</div>
                <div className="text-[10px] text-neutral-500">Same friendly smile • 8:28 AM</div>
              </div>
            </div>
          </div>

          <div className="col-span-6 flex flex-col justify-center reveal-from-right">
            <div className="bg-white/55 p-12 rounded-3xl border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-[3px] h-6 bg-jabee-orange rounded-full"></div>
                <span className="text-sm font-bold uppercase tracking-[0.25em] text-jabee-orange">
                  WHAT IF?
                </span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-extrabold text-jabee-black tracking-tight leading-[1.12] mb-6 font-display">
                What if he never had to book again?
              </h2>
              <p className="text-lg md:text-xl text-[#444444] font-normal leading-relaxed mb-8">
                A fixed captain. Ready at the same perfect time. The same fair price. Every single day. No headache.
                No stress. Just a good start to the day.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 bg-neutral-50/80 p-3 rounded-xl border border-neutral-200">
                  <span className="w-2 h-2 rounded-full bg-jabee-orange"></span>
                  <span className="text-xs font-bold text-jabee-black">Fixed Daily Captain</span>
                </div>
                <div className="flex items-center gap-2 bg-neutral-50/80 p-3 rounded-xl border border-neutral-200">
                  <span className="w-2 h-2 rounded-full bg-jabee-orange"></span>
                  <span className="text-xs font-bold text-jabee-black">Zero Morning Surge</span>
                </div>
                <div className="flex items-center gap-2 bg-neutral-50/80 p-3 rounded-xl border border-neutral-200">
                  <span className="w-2 h-2 rounded-full bg-jabee-orange"></span>
                  <span className="text-xs font-bold text-jabee-black">Automated Dispatch</span>
                </div>
                <div className="flex items-center gap-2 bg-neutral-50/80 p-3 rounded-xl border border-neutral-200">
                  <span className="w-2 h-2 rounded-full bg-jabee-orange"></span>
                  <span className="text-xs font-bold text-jabee-black">Punctual Peace of Mind</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE VIEW */}
      <section className="block lg:hidden relative pt-10 pb-12 bg-gradient-to-b from-[#CFCBC6] to-[#EAE6DF]" data-nav-mode="dark">
        <div className="max-w-[390px] mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden shadow-lg bg-white mb-5">
            <img alt="Professional relaxed in office holding coffee mug" className="w-full h-[420px] object-cover object-center" src="/character4.jpg" />
            <div className="absolute bottom-3 left-3 glass-card text-neutral-800 text-[10.5px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-emerald-500/40 shadow">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Captain Rajesh arrived • 08:28 AM</span>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-5 border border-white/80 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-[3px] h-3.5 bg-jabee-orange rounded-full inline-block"></span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-jabee-orange">WHAT IF?</span>
            </div>
            <h2 className="text-2xl font-black text-neutral-900 leading-tight mb-2 font-display">
              What if he never had to book again?
            </h2>
            <p className="text-neutral-600 text-[13px] leading-relaxed mb-4">
              A fixed captain. Ready at the same perfect time. The same fair price. Every single day. No headache. No stress. Just a good start to the day.
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-neutral-800">
              <div className="flex items-center gap-1.5 bg-white/80 border border-white/60 px-2.5 py-2 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-jabee-orange"></span>
                <span>Fixed Daily Captain</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 border border-white/60 px-2.5 py-2 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-jabee-orange"></span>
                <span>Zero Morning Surge</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 border border-white/60 px-2.5 py-2 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-jabee-orange"></span>
                <span>Automated Dispatch</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 border border-white/60 px-2.5 py-2 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-jabee-orange"></span>
                <span>Punctual Peace of Mind</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* BIKE REVEAL SECTION: Transformation with 200 Frame Animation  */}
      {/* ============================================================== */}
      {/* DESKTOP VIEW */}
      <section className="hidden lg:flex py-20 px-16 lg:px-24 bg-white text-jabee-black min-h-screen flex-col justify-center" data-nav-mode="dark" id="bike-reveal-container">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-10 reveal-on-scroll">
            <span className="text-xs font-extrabold uppercase tracking-[0.3em] text-jabee-orange block mb-3">
              THE TRANSFORMATION
            </span>
            <h2 className="text-5xl font-extrabold text-jabee-black tracking-tight font-display mb-4">
              Building effortless commutes brick by brick.
            </h2>
            <p className="text-lg text-neutral-500">
              The same daily struggle turned into an engineered, reliable rhythm for the modern professional.
            </p>
          </div>

          <div className="w-full max-w-5xl mx-auto mb-12">
            <div id="bike-canvas-pin" className="bg-white rounded-3xl p-4 border border-neutral-100 shadow-card">
              <BikeScrollCanvas isLoading={isLoading} triggerId="bike-canvas-pin" start="center center" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto mb-20 reveal-on-scroll">
            <div className="bg-[#FAFAFA] p-7 rounded-2xl border border-neutral-200/80 hover:border-jabee-orange transition-colors">
              <div className="flex items-start gap-3.5 mb-2">
                <div className="w-[3px] h-6 bg-jabee-orange rounded-full flex-shrink-0 mt-0.5"></div>
                <div>
                  <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-jabee-black block font-display">
                    SAME PIECES. DIFFERENT POSSIBILITIES.
                  </span>
                  <p className="text-sm text-neutral-500 mt-2 font-normal leading-relaxed">
                    Every commuter has the same hours, roads, and transit needs. We rethink how those pieces connect.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#FAFAFA] p-7 rounded-2xl border border-neutral-200/80 hover:border-jabee-orange transition-colors">
              <div className="flex items-start gap-3.5 mb-2">
                <div className="w-[3px] h-6 bg-jabee-orange rounded-full flex-shrink-0 mt-0.5"></div>
                <div>
                  <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-jabee-black block font-display">
                    A ROAD TAKES SHAPE.
                  </span>
                  <p className="text-sm text-neutral-500 mt-2 font-normal leading-relaxed">
                    Routes align. Predictable pickup corridors replace frantic app refreshes every single morning.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#FAFAFA] p-7 rounded-2xl border border-neutral-200/80 hover:border-jabee-orange transition-colors">
              <div className="flex items-start gap-3.5 mb-2">
                <div className="w-[3px] h-6 bg-jabee-orange rounded-full flex-shrink-0 mt-0.5"></div>
                <div>
                  <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-jabee-black block font-display">
                    MOVEMENT FINDS FORM.
                  </span>
                  <p className="text-sm text-neutral-500 mt-2 font-normal leading-relaxed">
                    The ZUBBY bike arrives at your doorstep on time. Sleek, dedicated, and ready when you are.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE VIEW */}
      <section className="block lg:hidden py-10 px-2 bg-white text-jabee-black border-t border-neutral-100" data-nav-mode="dark" id="bike-reveal-mobile">
        <div className="max-w-[420px] mx-auto px-1">
          <div className="text-center mb-5">
            <span className="text-[10px] font-black tracking-widest uppercase text-jabee-orange mb-1.5 inline-block">THE TRANSFORMATION</span>
            <h2 className="text-2xl font-black text-neutral-900 leading-snug tracking-tight mb-2 font-display">
              Building effortless commutes brick by brick.
            </h2>
            <p className="text-neutral-500 text-[13px] leading-relaxed max-w-[320px] mx-auto">
              The same daily struggle turned into an engineered, reliable rhythm for the modern professional.
            </p>
          </div>

          {/* Bike Frame Animation on Mobile - Expanded wide layout */}
          <div className="rounded-2xl border border-neutral-200/80 overflow-hidden bg-neutral-50/50 p-4 mb-6 shadow-sm">
            <BikeScrollCanvas isLoading={isLoading} triggerId="bike-reveal-mobile" />
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF9F6] border border-neutral-200/70">
              <div className="w-[3px] h-9 bg-jabee-orange rounded-full shrink-0 mt-0.5"></div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 font-display">SAME PIECES. DIFFERENT POSSIBILITIES.</h3>
                <p className="text-[12px] text-neutral-500 leading-snug mt-0.5">Every commuter has the same hours, roads, and transit needs. We rethink how those pieces connect.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF9F6] border border-neutral-200/70">
              <div className="w-[3px] h-9 bg-jabee-orange rounded-full shrink-0 mt-0.5"></div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 font-display">A ROAD TAKES SHAPE.</h3>
                <p className="text-[12px] text-neutral-500 leading-snug mt-0.5">Routes align. Predictable pickup corridors replace frantic app refreshes every single morning.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF9F6] border border-neutral-200/70">
              <div className="w-[3px] h-9 bg-jabee-orange rounded-full shrink-0 mt-0.5"></div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 font-display">MOVEMENT FINDS FORM.</h3>
                <p className="text-[12px] text-neutral-500 leading-snug mt-0.5">The ZUBBY bike arrives at your doorstep on time. Sleek, dedicated, and ready when you are.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* BRAND CTA & DOWNLOAD SECTION                                   */}
      {/* ============================================================== */}
      <section className="py-14 bg-gradient-to-b from-white to-[#F9F8F5] border-t border-neutral-100 text-center" data-purpose="brand-milestone-cta" id="download-section">
        <div className="max-w-[390px] lg:max-w-4xl mx-auto px-4 flex flex-col items-center">
          <div className="flex items-baseline justify-center mb-2">
            <span className="text-4xl lg:text-7xl font-black tracking-tight text-neutral-900 font-display">ZUBBY</span>
            <span className="w-3.5 h-3.5 lg:w-5 lg:h-5 rounded-full bg-jabee-orange ml-1"></span>
          </div>
          <p className="text-neutral-900 font-extrabold text-[17px] lg:text-2xl mb-2 leading-snug font-display">
            Office professionals' favourite ride booking app.
          </p>
          <p className="text-neutral-500 text-[13px] lg:text-base leading-relaxed max-w-[340px] lg:max-w-xl mb-6">
            Our founder lived this problem every morning. So he built ZUBBY for everyone who makes the same commute. The ZUBBY team makes it stress-free for you.
          </p>

          <a className="w-full max-w-[280px] lg:max-w-[320px] bg-jabee-orange hover:bg-jabee-orangeDark text-white py-3.5 px-6 rounded-full font-bold shadow-md shadow-jabee-orange/20 flex items-center justify-center gap-3 transition-transform active:scale-95" href="#playstore">
            <svg className="w-5 h-5 lg:w-6 lg:h-6 shrink-0" viewBox="0 0 512 512">
              {/* Left Blue Spine */}
              <path fill="#4285F4" d="M47.7 26.6C44.4 30.1 42.5 35.7 42.5 43v426c0 7.3 1.9 12.9 5.2 16.4l1.6 1.4 238.4-238.4v-5.6L49.3 25.2l-1.6 1.4z" />
              {/* Right Yellow Arrow */}
              <path fill="#FBBC04" d="M371.7 319.4l-84-84v-5.6l84-84 1.9 1.1 99.4 56.5c28.3 16.1 28.3 42.5 0 58.6l-99.4 56.5-1.9 1.1z" />
              {/* Bottom Red Wedge */}
              <path fill="#EA4335" d="M287.7 235.4L47.7 475.4c9.3 9.9 24.8 11.1 42.1 1.4l241.9-137.4-44-44z" />
              {/* Top Green Wedge */}
              <path fill="#34A853" d="M287.7 235.4l44-44-241.9-137.4c-17.3-9.7-32.8-8.5-42.1 1.4l240 240z" />
            </svg>
            <div className="text-left">
              <div className="text-[9px] uppercase tracking-wider leading-none text-white/80">AVAILABLE ON</div>
              <div className="text-sm font-extrabold leading-none mt-0.5">Get it on Google Play</div>
            </div>
          </a>
          <div className="mt-3 flex items-center gap-1.5 text-neutral-600 text-[11px] lg:text-xs font-semibold">
            <span className="text-amber-500">★</span>
            <span>4.9/5 from 12,000+ daily riders</span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* MEET THE ZUBBY TEAM: Desktop + Mobile Cards                    */}
      {/* ============================================================== */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-16 lg:px-24 bg-[#FAFAFA] border-t border-neutral-100" data-nav-mode="dark" id="team">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 reveal-on-scroll">
            <div className="flex items-center justify-center gap-2 mb-2 md:mb-3">
              <div className="w-[3px] h-4 md:h-5 bg-jabee-orange rounded-full"></div>
              <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-[0.25em] text-neutral-500">
                BEHIND THE HELMET
              </span>
            </div>
            <h2 className="text-2xl md:text-5xl font-extrabold text-jabee-black tracking-tight font-display mb-3 md:mb-4">
              The people behind ZUBBY
            </h2>
            <p className="text-neutral-500 text-xs md:text-lg max-w-[320px] md:max-w-xl mx-auto">
              A dedicated crew in Burdwan, West Bengal obsessed with bringing calm, joy, and punctuality to your everyday commute.
            </p>
          </div>

          {/* 4 Team Groups */}
          <div className="space-y-10 md:space-y-16">
            {/* Group 1: Founders */}
            <div>
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-jabee-orange"></span>
                <h3 className="text-xs md:text-base font-bold text-jabee-black tracking-wider uppercase font-display">
                  Founders
                </h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <div className="p-3.5 md:p-6 rounded-xl md:rounded-2xl border border-white/80 bg-white shadow-sm text-center flex flex-col items-center">
                  <div className="w-12 h-12 md:w-20 md:h-20 mx-auto mb-2 md:mb-4 rounded-full md:rounded-2xl bg-neutral-100 flex items-center justify-center text-xl md:text-3xl text-neutral-400 border border-white/60">
                    👤
                  </div>
                  <div className="text-[13px] md:text-base font-bold text-jabee-black leading-tight">[Founder Name]</div>
                  <div className="text-[10px] md:text-xs font-semibold text-jabee-orange uppercase mt-0.5">Founder &amp; CEO</div>
                  <p className="text-[10px] md:text-xs text-neutral-500 mt-1">Daily commuter turned mobility architect.</p>
                </div>
                <div className="p-3.5 md:p-6 rounded-xl md:rounded-2xl border border-white/80 bg-white shadow-sm text-center flex flex-col items-center">
                  <div className="w-12 h-12 md:w-20 md:h-20 mx-auto mb-2 md:mb-4 rounded-full md:rounded-2xl bg-neutral-100 flex items-center justify-center text-xl md:text-3xl text-neutral-400 border border-white/60">
                    👤
                  </div>
                  <div className="text-[13px] md:text-base font-bold text-jabee-black leading-tight">[Co-Founder Name]</div>
                  <div className="text-[10px] md:text-xs font-semibold text-jabee-orange uppercase mt-0.5">Co-Founder &amp; COO</div>
                  <p className="text-[10px] md:text-xs text-neutral-500 mt-1">Scaling captain network with empathy.</p>
                </div>
              </div>
            </div>

            {/* Group 2: Tech Team */}
            <div>
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-jabee-orange"></span>
                <h3 className="text-xs md:text-base font-bold text-jabee-black tracking-wider uppercase font-display">
                  Tech Team
                </h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-6">
                {[
                  { name: '[Tech Lead Name]', role: 'Head of Engineering', desc: 'Route optimization & dispatch.' },
                  { name: '[Mobile Architect]', role: 'Lead Android Dev', desc: 'Zero-lag rider tracking.' },
                  { name: '[Product Designer]', role: 'Lead Product Designer', desc: 'Crafting clutter-free ride journeys.' },
                  { name: '[Backend Specialist]', role: 'Infrastructure Lead', desc: '99.99% uptime for commutes.' },
                ].map((member, i) => (
                  <div key={i} className="p-3 md:p-6 rounded-xl md:rounded-2xl border border-neutral-200/80 bg-white shadow-2xs text-center">
                    <div className="w-9 h-9 md:w-16 md:h-16 mx-auto rounded-full md:rounded-2xl bg-neutral-100 flex items-center justify-center text-sm md:text-2xl mb-1.5 md:mb-3 text-neutral-400">⚙️</div>
                    <div className="text-[12px] md:text-base font-bold text-neutral-900 leading-tight">{member.name}</div>
                    <div className="text-[9.5px] md:text-xs font-semibold text-jabee-orange uppercase mt-0.5">{member.role}</div>
                    <p className="text-[9.5px] md:text-xs text-neutral-500 mt-1">{member.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Group 3: Marketing & Community */}
            <div>
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-jabee-orange"></span>
                <h3 className="text-xs md:text-base font-bold text-jabee-black tracking-wider uppercase font-display">
                  Marketing &amp; Community
                </h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-6">
                {[
                  { name: '[Growth Lead]', role: 'Head of Growth', desc: 'Connecting office parks with fleets.' },
                  { name: '[Brand Strategist]', role: 'Brand Communications', desc: 'Championing morning peace.' },
                  { name: '[B2B Lead]', role: 'Corporate Partner', desc: 'Direct office subscription perks.' },
                  { name: '[Community Head]', role: 'Community & Support', desc: 'Listening to commuter stories 24/7.' },
                ].map((member, i) => (
                  <div key={i} className="p-3 md:p-6 rounded-xl md:rounded-2xl border border-neutral-200/80 bg-white shadow-2xs text-center">
                    <div className="text-[12px] md:text-base font-bold text-neutral-900 leading-tight">{member.name}</div>
                    <div className="text-[9px] md:text-xs font-semibold text-jabee-orange uppercase mt-0.5">{member.role}</div>
                    <p className="text-[9.5px] md:text-xs text-neutral-500 mt-1">{member.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* APP FEATURES: 3x3 Card Grid                                    */}
      {/* ============================================================== */}
      <section className="py-14 md:py-28 px-4 sm:px-6 md:px-16 lg:px-24 bg-white" data-nav-mode="dark" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-20 reveal-on-scroll">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="w-[3px] h-4 md:h-5 bg-jabee-orange rounded-full"></div>
              <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-[0.25em] text-jabee-orange">
                CORE CAPABILITIES
              </span>
            </div>
            <h2 className="text-2xl md:text-5xl font-extrabold text-jabee-black tracking-tight font-display mb-2 md:mb-4">
              Engineered for the corporate commute.
            </h2>
            <p className="text-neutral-500 text-xs md:text-lg max-w-[310px] md:max-w-xl mx-auto">
              Nine key pillars that transform everyday office travel from an erratic gamble into a dependable luxury.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
            {[
              { title: 'Fixed daily ride', desc: 'Book once, ride every weekday without ever opening the app to hail again.', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
              { title: 'Same captain, same time', desc: 'Meet the same trusted professional rider outside your gate at your exact scheduled minute.', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              { title: 'Same fair price, no surge', desc: 'Rain, festival, or peak hour — your monthly commute fare remains locked and strictly fair.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              { title: 'Scheduled pickups & alerts', desc: 'Gentle automated alerts 10 minutes prior so you can finish your coffee without rushing.', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
              { title: 'Live ride tracking', desc: 'High precision real-time GPS telemetry showing your dedicated bike approaching.', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
              { title: 'Verified captains', desc: 'Every partner undergoes rigorous criminal background checks, defensive ride testing, and ratings review.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
              { title: 'In-app captain chat', desc: 'Instant one-tap direct messaging with masked phone numbers for absolute rider privacy.', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
              { title: 'UPI, Cash & Card payments', desc: 'Automate autopay via UPI or corporate cards, or opt for seamless cash reconciliation.', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
              { title: 'Ride history & trip sharing', desc: 'One-click monthly expense statements and shareable live links for family tracking.', icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' },
            ].map((feat, idx) => (
              <div key={idx} className="p-4 md:p-8 rounded-xl md:rounded-3xl bg-white border border-neutral-200/80 md:border-neutral-100 shadow-2xs md:shadow-card flex md:block items-start gap-3.5">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#FFF5EF] md:bg-orange-50 text-jabee-orange flex items-center justify-center shrink-0 mb-0 md:mb-6">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d={feat.icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-[14px] md:text-lg font-bold text-neutral-900 md:text-jabee-black leading-tight mb-1 md:mb-2 font-display">{feat.title}</h3>
                  <p className="text-[12px] md:text-sm text-neutral-500 md:text-neutral-600 leading-snug md:leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* FOOTER                                                         */}
      {/* ============================================================== */}
      <footer
        className="bg-jabee-black text-white pt-10 md:pt-20 pb-8 md:pb-12 px-5 md:px-16 lg:px-24 border-t border-neutral-800"
        data-nav-mode="light"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 pb-8 md:pb-16 border-b border-neutral-800">
            {/* Brand Info */}
            <div className="lg:col-span-5 space-y-2 md:space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-3xl font-black tracking-wider text-white font-display">
                  ZUBBY<span className="text-jabee-orange">.</span>
                </span>
              </div>
              <p className="text-xs md:text-base text-neutral-300 font-medium max-w-sm">
                Office professionals' favourite ride booking app.
              </p>
              <p className="text-[11px] md:text-xs text-neutral-400 max-w-sm leading-relaxed">
                Eliminating morning commute friction with predictable daily motorcycle captains for office goers.
              </p>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-3 space-y-2 md:space-y-3">
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-jabee-orange">Quick Links</div>
              <ul className="space-y-1.5 md:space-y-2.5 text-xs md:text-sm text-neutral-400">
                <li><a className="hover:text-white transition-colors" href="#story">Story</a></li>
                <li><a className="hover:text-white transition-colors" href="#bike-reveal">The Revelation</a></li>
                <li><a className="hover:text-white transition-colors" href="#features">Features</a></li>
                <li><a className="hover:text-white transition-colors" href="#team">Team</a></li>
              </ul>
            </div>

            {/* App Download & Contact */}
            <div className="lg:col-span-4 space-y-3 md:space-y-4">
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-jabee-orange">Get the App</div>
              <a
                className="inline-flex items-center gap-3 bg-neutral-900 border border-neutral-700 hover:border-jabee-orange px-4 py-2.5 rounded-xl text-white transition-all duration-200"
                href="#download-section"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 512 512">
                  {/* Left Blue Spine */}
                  <path fill="#4285F4" d="M47.7 26.6C44.4 30.1 42.5 35.7 42.5 43v426c0 7.3 1.9 12.9 5.2 16.4l1.6 1.4 238.4-238.4v-5.6L49.3 25.2l-1.6 1.4z" />
                  {/* Right Yellow Arrow */}
                  <path fill="#FBBC04" d="M371.7 319.4l-84-84v-5.6l84-84 1.9 1.1 99.4 56.5c28.3 16.1 28.3 42.5 0 58.6l-99.4 56.5-1.9 1.1z" />
                  {/* Bottom Red Wedge */}
                  <path fill="#EA4335" d="M287.7 235.4L47.7 475.4c9.3 9.9 24.8 11.1 42.1 1.4l241.9-137.4-44-44z" />
                  {/* Top Green Wedge */}
                  <path fill="#34A853" d="M287.7 235.4l44-44-241.9-137.4c-17.3-9.7-32.8-8.5-42.1 1.4l240 240z" />
                </svg>
                <div className="text-left">
                  <div className="text-[9px] uppercase font-semibold text-neutral-400">Download for Android</div>
                  <div className="text-xs md:text-sm font-bold tracking-tight">Google Play</div>
                </div>
              </a>

              <div className="text-xs text-neutral-400">
                <span className="text-[11px] text-neutral-500 block">Contact Us</span>
                <a className="hover:text-jabee-orange transition-colors font-medium" href="mailto:support@zubby.in">
                  support@zubby.in
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between text-[10.5px] md:text-xs text-neutral-500 gap-2 md:gap-4 text-center md:text-left">
            <div>© 2026 ZUBBY, Burdwan, West Bengal. All rights reserved.</div>
            <div className="flex items-center gap-4 text-neutral-400">
              <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
              <span>•</span>
              <a className="hover:text-white transition-colors" href="#">Terms of Service</a>
              <span>•</span>
              <a className="hover:text-white transition-colors" href="#">Captain Code of Conduct</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
