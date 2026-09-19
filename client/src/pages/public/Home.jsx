import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Award,
  Users,
  Building,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  BarChart3,
  ChevronRight,
  ShieldCheck,
  Globe2,
  CheckCircle2,
  Trophy,
  Newspaper,
  Image as ImageIcon,
  Megaphone
} from 'lucide-react';
import { useCollege } from '../../context/CollegeContext';
import { departmentService } from '../../services/departmentService';
import { eventService } from '../../services/eventService';
import { articleService } from '../../services/articleService';
import { achievementService } from '../../services/achievementService';
import { galleryService } from '../../services/galleryService';
import SEO from '../../components/common/SEO';
import RichTextRenderer from '../../components/common/RichTextRenderer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ImageWithFallback from '../../components/common/ImageWithFallback';

const Home = () => {
  const { collegeInfo, settings } = useCollege();

  const [featuredDepartments, setFeaturedDepartments] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [featuredAchievements, setFeaturedAchievements] = useState([]);
  const [featuredGalleries, setFeaturedGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const [deptRes, eventRes, articleRes, achRes, galleryRes] = await Promise.all([
          departmentService.getPublicDepartments({ featured: 'true' }).catch(() => ({ data: [] })),
          eventService.getPublicEvents({ type: 'upcoming', limit: 3 }).catch(() => ({ data: [] })),
          articleService.getPublicArticles({ limit: 3 }).catch(() => ({ data: [] })),
          achievementService.getPublicAchievements({ featured: 'true' }).catch(() => ({ data: [] })),
          galleryService.getPublicGalleries({ featured: 'true' }).catch(() => ({ data: [] })),
        ]);

        if (deptRes.data) setFeaturedDepartments(deptRes.data.slice(0, 4));
        if (eventRes.data) setUpcomingEvents(eventRes.data);
        if (articleRes.data) setLatestArticles(articleRes.data);
        if (achRes.data) setFeaturedAchievements(achRes.data.slice(0, 3));
        if (galleryRes.data) setFeaturedGalleries(galleryRes.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomepageData();
  }, []);

  const heroPrimaryCtaText = collegeInfo?.heroPrimaryCtaText || 'Explore Programs';
  const heroPrimaryCtaLink = collegeInfo?.heroPrimaryCtaLink || '/courses';

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      <SEO />

      {/* 1. UNIFIED HERO SECTION WITH STATS & SUB-BAR */}
      <section className="hero-unified relative isolate overflow-hidden pt-4 pb-3 sm:pt-6 sm:pb-4 lg:pt-8 lg:pb-4">
        {/* Subtle dot background */}
        <div className="hero-dots absolute inset-0 pointer-events-none opacity-20" />
        {/* Ambient warm glow */}
        <div className="absolute right-0 top-1/3 h-[32rem] w-[32rem] -translate-y-1/2 rounded-full bg-gradient-to-br from-[#ffd56b]/15 to-[#f87171]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
          
          {/* Main Hero Row: Text Content & Fluid Arched Graphic */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left Column: Heading, Actions & Features */}
            <div className="hero-rise lg:col-span-5 xl:col-span-5 space-y-4 sm:space-y-4 lg:pr-2">
              {/* Admissions Open Label */}
              <div className="inline-flex items-center gap-2.5 text-[#551524]">
                <div className="w-8 h-8 rounded-full bg-[#fde9e7] flex items-center justify-center text-[#741c32] shadow-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm sm:text-base tracking-tight text-[#450c1c]">
                  Admissions Open 2026–27
                </span>
                <span className="w-12 h-[1.5px] bg-[#741c32]/30" />
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] xl:text-[4rem] leading-[1.02] tracking-tight font-serif">
                <span className="block font-bold text-[#450c1c]">Shape Ideas.</span>
                <span className="block italic font-bold text-[#ea584f]">Build Futures.</span>
              </h1>

              {/* Description */}
              <p className="text-slate-600 text-sm sm:text-base max-w-lg leading-relaxed">
                Experience industry-focused education, innovative research and a campus where ambition becomes achievement.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  to={heroPrimaryCtaLink}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#f05d54] to-[#e44c46] text-white font-bold text-sm shadow-md shadow-red-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>{heroPrimaryCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border border-[#741c32] bg-white/80 backdrop-blur-xs text-[#741c32] font-bold text-sm hover:bg-amber-50/60 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="w-5 h-5 rounded-full bg-[#741c32] flex items-center justify-center text-white">
                    <span className="w-0 h-0 border-t-[3.5px] border-t-transparent border-b-[3.5px] border-b-transparent border-l-[5px] border-l-white ml-0.5" />
                  </span>
                  <span>Virtual Campus Tour</span>
                </button>
              </div>

              {/* 3 Feature Highlights */}
              <div className="flex items-center gap-3.5 sm:gap-5 pt-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#9e2a2b]/70 flex items-center justify-center text-[#9e2a2b] shrink-0 shadow-2xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[10px] sm:text-[11px] font-medium text-slate-500">Industry-Oriented</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800">Curriculum</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#d8a52a]/80 flex items-center justify-center text-[#2b1820] shrink-0 shadow-2xs">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[10px] sm:text-[11px] font-medium text-slate-500">Vibrant</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800">Campus Life</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#741c32]/70 flex items-center justify-center text-[#741c32] shrink-0 shadow-2xs">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[10px] sm:text-[11px] font-medium text-slate-500">Global</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800">Opportunities</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Arched Image with Sweeping 3D Ribbons & Exact Overlays */}
            <div className="hero-slide lg:col-span-7 xl:col-span-7 relative flex justify-center items-center py-2 lg:py-0">
              <div className="relative w-full h-[430px] sm:h-[480px] lg:h-[510px] flex items-center justify-end">
                
                {/* 1. Golden Background Contour Arcs (Top-Left Background) */}
                <svg
                  className="absolute -top-10 -left-16 sm:-left-20 w-72 sm:w-88 h-72 sm:h-88 pointer-events-none z-0 opacity-40"
                  viewBox="0 0 260 260"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M 10 35 C 60 35, 120 80, 165 160" stroke="#d49e28" strokeWidth="1.2" />
                  <path d="M 10 75 C 75 75, 140 130, 200 220" stroke="#d49e28" strokeWidth="1.2" />
                  <path d="M 10 115 C 90 115, 165 175, 225 270" stroke="#d49e28" strokeWidth="1.2" />
                  <path d="M 45 10 C 45 80, 110 160, 190 230" stroke="#d49e28" strokeWidth="1.2" />
                  <path d="M 95 10 C 95 75, 160 150, 235 210" stroke="#d49e28" strokeWidth="1.2" />
                </svg>

                {/* 2. Photo Container with Students and College Building */}
                <div className="relative z-10 w-full h-full overflow-hidden rounded-3xl shadow-2xl bg-[#fdeee0]">
                  <ImageWithFallback
                    src="/assets/herobgimg.png"
                    type="article"
                    alt="Apex Institute of Technology and Sciences Campus Students"
                    className="w-full h-full object-cover object-[15%_center] scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#551524]/10 via-transparent to-[#551524]/5 pointer-events-none" />

                  {/* Bottom-Right Maroon Wedge with Script Overlay */}
                  <div className="absolute bottom-0 right-0 w-64 sm:w-84 md:w-96 h-40 sm:h-52 md:h-60 pointer-events-none z-20 overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 380 240" preserveAspectRatio="none">
                      <polygon points="110,240 380,70 380,240" fill="#551524" />
                      <line x1="110" y1="240" x2="380" y2="70" stroke="#d8a52a" strokeWidth="2.5" opacity="0.85" />
                    </svg>
                    
                    <div className="absolute bottom-3 right-4 sm:bottom-6 sm:right-7 z-30 text-right select-none pointer-events-none transform -rotate-[13deg] origin-bottom-right">
                      <div className="font-caveat text-2xl sm:text-3xl text-white font-medium drop-shadow-sm leading-tight">
                        More
                      </div>
                      <div className="font-caveat text-xl sm:text-2xl text-white font-medium drop-shadow-sm leading-tight my-0.5">
                        Than a Degree
                      </div>
                      <div className="font-caveat text-3xl sm:text-[38px] text-white font-bold drop-shadow-sm leading-none relative inline-block">
                        A Brighter Tomorrow
                        <svg className="absolute -bottom-2.5 left-0 w-full h-3 text-[#f5a000]" viewBox="0 0 200 14" fill="none" preserveAspectRatio="none">
                          <path d="M 0,8 Q 60,-2 130,5 Q 180,10 200,3 Q 160,14 100,10 Q 40,12 0,8 Z" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Sweeping 3D Maroon Wave & Metallic Gold Crest Ribbons */}
                <svg
                  className="absolute inset-y-0 left-0 w-full h-full pointer-events-none overflow-visible z-20"
                  viewBox="0 0 600 500"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="maroonWave3D" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#801c34" />
                      <stop offset="45%" stopColor="#551524" />
                      <stop offset="100%" stopColor="#380914" />
                    </linearGradient>
                    <linearGradient id="goldCrest3D" x1="10%" y1="0%" x2="90%" y2="100%">
                      <stop offset="0%" stopColor="#fff2a8" />
                      <stop offset="25%" stopColor="#f5cb58" />
                      <stop offset="65%" stopColor="#c89124" />
                      <stop offset="100%" stopColor="#8c5c0c" />
                    </linearGradient>
                    <filter id="goldDropShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="-6" dy="10" stdDeviation="12" floodColor="#000000" floodOpacity="0.25" />
                    </filter>
                  </defs>

                  {/* Upper Gold Wave across top-left corner */}
                  <path
                    d="M -30,60 C 50,60 140,25 220,0"
                    stroke="url(#goldCrest3D)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    filter="url(#goldDropShadow)"
                  />

                  {/* Deep Maroon Flowing 3D Wave Body */}
                  <path
                    d="M -50,0 L 210,0 C 130,70 65,160 55,250 C 45,340 70,420 145,500 L -50,500 Z"
                    fill="url(#maroonWave3D)"
                    filter="url(#goldDropShadow)"
                  />

                  {/* Outer Crest Metallic Gold Ribbon */}
                  <path
                    d="M 210,0 C 130,70 65,160 55,250 C 45,340 70,420 145,500"
                    stroke="url(#goldCrest3D)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    filter="url(#goldDropShadow)"
                  />

                  {/* Specular Highlight Line along Gold Crest */}
                  <path
                    d="M 208,2 C 128,71 63,160 53,250 C 43,339 68,419 143,498"
                    stroke="#fff8d1"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.85"
                  />

                  {/* Inner Gold Contour Ribbon along Photo Edge */}
                  <path
                    d="M 222,0 C 142,72 77,162 67,250 C 57,338 82,418 157,500"
                    stroke="url(#goldCrest3D)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                </svg>

                {/* 4. Top Badge: NAAC A+ Accredited */}
                <div className="hero-float absolute top-5 left-2 sm:top-7 sm:left-4 lg:-left-2 z-30 flex items-center gap-3.5 rounded-2xl bg-white/95 backdrop-blur-md px-4 py-3 sm:px-5 sm:py-3.5 text-[#551524] shadow-xl border border-white/60">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#c89326] via-[#d49e28] to-[#9c6f14] flex items-center justify-center text-white shrink-0 shadow-md">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.3" />
                      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" />
                    </svg>
                  </div>
                  <div>
                    <strong className="block text-sm sm:text-base font-extrabold text-[#2a0812] leading-tight font-sans">
                      NAAC A+
                      <br />
                      Accredited
                    </strong>
                    <span className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5 block font-sans">
                      Excellence in Education
                    </span>
                  </div>
                </div>

                {/* 5. Bottom Badge: Admissions Open */}
                <div className="hero-float absolute bottom-5 left-2 sm:bottom-7 sm:left-4 lg:-left-2 z-30 flex items-center gap-3 sm:gap-4 rounded-2xl bg-white/95 backdrop-blur-md px-4 py-3 sm:px-5 sm:py-3.5 text-[#551524] shadow-xl border border-white/60">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#feeae6] flex items-center justify-center text-[#f15b55] shrink-0">
                    <Megaphone className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <strong className="block text-sm sm:text-base font-extrabold text-[#2a0812] leading-tight font-sans">
                      Admissions Open
                    </strong>
                    <span className="text-[10px] sm:text-xs text-slate-500 font-medium font-sans block mt-0.5">
                      for Academic Session 2026–27
                    </span>
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#feeae6] flex items-center justify-center text-[#741c32] shrink-0 ml-1">
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Institutional Stat Cards Row */}
          <div className="relative z-20 mt-8 lg:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Background elements behind cards */}

            {/* Background Contour Lines on Left */}
            <svg className="hidden lg:block absolute -left-16 -top-12 w-96 h-48 pointer-events-none z-0 opacity-30" viewBox="0 0 380 180" fill="none">
              <path d="M 0,25 C 90,35 180,80 290,160" stroke="#d49e28" strokeWidth="1.2" />
              <path d="M 0,60 C 105,70 210,115 325,165" stroke="#d49e28" strokeWidth="1.2" />
              <path d="M 0,95 C 120,105 240,140 360,170" stroke="#d49e28" strokeWidth="1.2" />
            </svg>

            {/* Background Golden Ribbon Crest & Maroon Swoosh in Center */}
            <div className="hidden lg:block absolute -top-10 left-1/4 right-0 h-28 pointer-events-none z-0 overflow-visible">
              <svg className="w-full h-full" viewBox="0 0 700 100" fill="none">
                <path d="M 50,0 C 180,70 380,85 650,20" stroke="#d8a52a" strokeWidth="10" strokeLinecap="round" opacity="0.35" />
                <path d="M 120,10 C 240,75 390,85 580,25" stroke="#741c32" strokeWidth="16" opacity="0.15" />
              </svg>
            </div>

            {/* Card 1: 25+ Programs */}
            <div className="bg-white rounded-2xl sm:rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:shadow-xl flex items-center justify-between p-4 sm:p-5 border border-amber-50/80 transition-all duration-200 hover:-translate-y-0.5 relative z-10">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shrink-0 bg-[#fdebe9] text-[#551524] shadow-2xs">
                  <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <div className="text-2xl sm:text-[32px] font-black text-[#111827] font-sans leading-none tracking-tight">
                    25+
                  </div>
                  <div className="text-xs sm:text-sm text-slate-800 font-semibold leading-tight mt-1.5 font-sans">
                    Programs
                  </div>
                </div>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 bg-[#fdebe9] text-[#551524] shadow-2xs">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
            </div>

            {/* Card 2: 100+ Faculty */}
            <div className="bg-white rounded-2xl sm:rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:shadow-xl flex items-center justify-between p-4 sm:p-5 border border-amber-50/80 transition-all duration-200 hover:-translate-y-0.5 relative z-10">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shrink-0 bg-[#fef3db] text-[#a6741a] shadow-2xs">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    <path d="M19.5 12c1.38 0 2.5-1.12 2.5-2.5S20.88 7 19.5 7s-2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5zm0 1.5c-1.32 0-2.55.4-3.57 1.07.7 1.15 1.07 2.47 1.07 3.93V20h5v-1.5c0-2.12-3.38-3.5-2.5-3.5z" />
                    <path d="M4.5 12c1.38 0 2.5-1.12 2.5-2.5S5.88 7 4.5 7 2 8.12 2 9.5 3.12 12 4.5 12zm0 1.5C3.18 13.5 1.95 13.9.93 14.57c.7 1.15 1.07 2.47 1.07 3.93V20h5v-1.5c0-2.12-3.38-3.5-2.5-3.5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl sm:text-[32px] font-black text-[#111827] font-sans leading-none tracking-tight">
                    100+
                  </div>
                  <div className="text-xs sm:text-sm text-slate-800 font-semibold leading-tight mt-1.5 font-sans">
                    Faculty
                  </div>
                </div>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 bg-[#fdebe9] text-[#551524] shadow-2xs">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
            </div>

            {/* Card 3: 5,000+ Students */}
            <div className="bg-white rounded-2xl sm:rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:shadow-xl flex items-center justify-between p-4 sm:p-5 border border-amber-50/80 transition-all duration-200 hover:-translate-y-0.5 relative z-10">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shrink-0 bg-[#fdebe9] text-[#551524] shadow-2xs">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl sm:text-[32px] font-black text-[#111827] font-sans leading-none tracking-tight">
                    5,000+
                  </div>
                  <div className="text-xs sm:text-sm text-slate-800 font-semibold leading-tight mt-1.5 font-sans">
                    Students
                  </div>
                </div>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 bg-[#fdebe9] text-[#551524] shadow-2xs">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
            </div>

            {/* Card 4: 95% Placements */}
            <div className="bg-white rounded-2xl sm:rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:shadow-xl flex items-center justify-between p-4 sm:p-5 border border-amber-50/80 transition-all duration-200 hover:-translate-y-0.5 relative z-10">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shrink-0 bg-[#fef3db] text-[#a6741a] shadow-2xs">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="13" width="3.2" height="8" rx="1.6" />
                    <rect x="8.5" y="9" width="3.2" height="12" rx="1.6" />
                    <rect x="14" y="5" width="3.2" height="16" rx="1.6" />
                    <rect x="19.5" y="2" width="3.2" height="19" rx="1.6" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl sm:text-[32px] font-black text-[#111827] font-sans leading-none tracking-tight">
                    95%
                  </div>
                  <div className="text-xs sm:text-sm text-slate-800 font-semibold leading-tight mt-1.5 font-sans">
                    Placements
                  </div>
                </div>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 bg-[#fdebe9] text-[#551524] shadow-2xs">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Bottom Sub-Bar / Micro-Footer */}
          <div className="relative z-10 mt-6 pt-3 pb-1 border-t border-amber-200/50 flex flex-wrap items-center justify-between gap-4 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-slate-400 font-semibold select-none">
            <div className="tracking-[0.25em] text-slate-400">
              KNOWLEDGE CREATES A BRIGHTER TOMORROW
            </div>

            <div className="flex items-center gap-3 text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#d8a52a]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#d1d5db]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#d1d5db]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#d1d5db]" />
              </div>
              <span className="tracking-[0.22em]">PEOPLE &nbsp;|&nbsp; IDEAS &nbsp;|&nbsp; IMPACT</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. ABOUT COLLEGE & PRINCIPAL'S MESSAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* About College Overview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
              <span>About Our Institution</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-academic-navy font-heading tracking-tight">
              A Legacy of Technical Mastery & Visionary Research
            </h2>
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
              {collegeInfo?.aboutCollege ? (
                <RichTextRenderer content={collegeInfo.aboutCollege} />
              ) : (
                <p>
                  Established in 1998, Apex Institute of Technology & Sciences (AITS) has evolved into a nationally acclaimed powerhouse for engineering and applied sciences education.
                </p>
              )}
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-primary-900 hover:bg-primary-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                <span>Read Full Institute Profile</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/vision-mission"
                className="inline-flex items-center gap-2 text-primary-900 hover:bg-primary-50 border border-primary-200 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                <span>Vision & Mission</span>
              </Link>
            </div>
          </div>

          {/* Principal's Desk Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-academic-navy text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 flex-shrink-0 bg-slate-800">
                <ImageWithFallback
                  src={collegeInfo?.principalPhoto}
                  alt="Principal"
                  type="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-heading">
                  {collegeInfo?.principalName || 'Dr. Arthur Pendelton, Ph.D.'}
                </h4>
                <p className="text-xs text-amber-400 font-medium">
                  {collegeInfo?.principalDesignation || 'Principal & Senior Professor'}
                </p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed italic border-l-2 border-amber-500 pl-4 py-1 mb-6">
              "Education at AITS is an empowering journey where curiosity meets purpose. We nurture engineers, innovators, and leaders equipped to shape the future."
            </div>

            <Link
              to="/principal-message"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold tracking-wide"
            >
              <span>Read Principal's Complete Message</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. QUICK PORTAL NAVIGATION */}
      <section className="bg-slate-100/70 py-12 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {[
              { title: 'Admissions 2026', link: '/admissions', icon: GraduationCap, color: 'text-amber-600 bg-amber-50' },
              { title: 'Academic Programs', link: '/courses', icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
              { title: 'Departments', link: '/departments', icon: Building, color: 'text-indigo-600 bg-indigo-50' },
              { title: 'Faculty Directory', link: '/staff', icon: Users, color: 'text-emerald-600 bg-emerald-50' },
              { title: 'Notices & Circulars', link: '/notices', icon: Calendar, color: 'text-rose-600 bg-rose-50' },
              { title: 'Campus Facilities', link: '/facilities', icon: ShieldCheck, color: 'text-purple-600 bg-purple-50' },
            ].map((portal, idx) => {
              const Icon = portal.icon;
              return (
                <Link
                  key={idx}
                  to={portal.link}
                  className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-400 hover:-translate-y-1 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-3 ${portal.color} transition-transform group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 font-heading leading-tight">
                    {portal.title}
                  </h4>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. FEATURED DEPARTMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
              Centers of Excellence
            </span>
            <h2 className="text-3xl font-extrabold text-academic-navy font-heading tracking-tight mt-2">
              Featured Academic Departments
            </h2>
          </div>
          <Link
            to="/departments"
            className="text-xs font-bold text-primary-900 hover:text-primary-700 flex items-center gap-1 group"
          >
            <span>Explore All Departments</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDepartments.map((dept) => (
            <div
              key={dept._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div className="h-44 bg-slate-100 overflow-hidden relative">
                <ImageWithFallback
                  src={dept.image}
                  alt={dept.name}
                  type="department"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-academic-navy/90 backdrop-blur-xs text-amber-400 text-xs font-bold px-2.5 py-1 rounded-lg">
                  {dept.shortName}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading group-hover:text-primary-900 transition-colors leading-snug mb-2">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                    {dept.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">
                    {dept.courses?.length || 0} Programs Offered
                  </span>
                  <Link
                    to={`/departments/${dept.slug}`}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. UPCOMING EVENTS & RECENT NEWS */}
      <section className="bg-slate-100/50 py-16 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Events Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded">
                    Campus Schedule
                  </span>
                  <h2 className="text-2xl font-extrabold text-academic-navy font-heading mt-1">
                    Upcoming Events
                  </h2>
                </div>
                <Link to="/events" className="text-xs font-bold text-primary-900 hover:text-primary-700">
                  View All &rarr;
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingEvents.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No upcoming events scheduled at this moment.</p>
                ) : (
                  upcomingEvents.map((evt) => {
                    const evtDate = new Date(evt.date);
                    return (
                      <Link
                        key={evt._id}
                        to={`/events/${evt.slug}`}
                        className="bg-white rounded-xl p-4 border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex gap-4 items-center group"
                      >
                        <div className="w-14 h-14 rounded-xl bg-academic-navy text-amber-400 flex flex-col items-center justify-center flex-shrink-0 font-heading">
                          <span className="text-xs uppercase font-bold tracking-wider">
                            {evtDate.toLocaleString('default', { month: 'short' })}
                          </span>
                          <span className="text-lg font-black leading-none text-white">
                            {evtDate.getDate()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded mb-1">
                            {evt.category}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary-900 transition-colors truncate">
                            {evt.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" /> {evt.startTime}
                            </span>
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 text-slate-400" /> {evt.venue}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>

            {/* Articles Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded">
                    Media & Press
                  </span>
                  <h2 className="text-2xl font-extrabold text-academic-navy font-heading mt-1">
                    Latest Articles & News
                  </h2>
                </div>
                <Link to="/articles" className="text-xs font-bold text-primary-900 hover:text-primary-700">
                  View All &rarr;
                </Link>
              </div>

              <div className="space-y-4">
                {latestArticles.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No published news items at this time.</p>
                ) : (
                  latestArticles.map((art) => (
                    <Link
                      key={art._id}
                      to={`/articles/${art.slug}`}
                      className="bg-white rounded-xl p-4 border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex gap-4 items-center group"
                    >
                      <div className="w-20 h-20 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={art.featuredImage}
                          alt={art.title}
                          type="article"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-1">
                          <span className="font-semibold text-amber-700">{art.category}</span>
                          <span>•</span>
                          <span>{new Date(art.publicationDate).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary-900 transition-colors line-clamp-1">
                          {art.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {art.shortDescription}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. STUDENT ACHIEVEMENTS & LAURELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
              Hall of Fame
            </span>
            <h2 className="text-3xl font-extrabold text-academic-navy font-heading tracking-tight mt-2">
              Recent Institutional Honors
            </h2>
          </div>
          <Link
            to="/achievements"
            className="text-xs font-bold text-primary-900 hover:text-primary-700 flex items-center gap-1 group"
          >
            <span>View All Achievements</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredAchievements.map((ach) => (
            <div
              key={ach._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    {ach.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {ach.level} Level
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 font-heading mb-2 leading-snug">
                  {ach.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {ach.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-academic-navy">{ach.recipient}</span>
                <span>{ach.academicYear}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. GALLERY HIGHLIGHTS */}
      <section className="bg-academic-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-white/10 px-3 py-1 rounded-md">
                Campus Life
              </span>
              <h2 className="text-3xl font-extrabold text-white font-heading tracking-tight mt-2">
                Gallery Highlights
              </h2>
            </div>
            <Link
              to="/gallery"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
            >
              <span>Explore All Albums</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredGalleries.map((gal) => (
              <Link
                key={gal._id}
                to={`/gallery/${gal.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-800 shadow-lg block"
              >
                <ImageWithFallback
                  src={gal.coverImage}
                  alt={gal.title}
                  type="gallery"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-5">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                    {gal.category} • {gal.images?.length || 0} Photos
                  </span>
                  <h4 className="text-base font-bold text-white font-heading group-hover:text-amber-300 transition-colors leading-tight">
                    {gal.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9. ADMISSION CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-900 to-primary-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-bold">
              Enrollment 2026-27
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
              Ready to Shape Your Future at Apex Institute?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore eligibility, scholarship programs, and direct entrance criteria. Our admissions team is ready to guide you through every step.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 flex-shrink-0">
            <Link
              to="/admissions"
              className="w-full sm:w-auto text-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-4 rounded-xl text-sm shadow-md transition-all"
            >
              Start Admission Process
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto text-center bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold px-8 py-4 rounded-xl text-sm transition-all"
            >
              Request Campus Tour
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
