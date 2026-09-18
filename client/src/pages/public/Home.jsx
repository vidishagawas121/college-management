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
  Sparkles,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Globe2,
  CheckCircle2,
  Trophy,
  Newspaper,
  Image as ImageIcon
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

  const heroHeading = collegeInfo?.heroHeading || 'Empowering Minds, Pioneering The Future';
  const heroSubheading = collegeInfo?.heroSubheading || 'Discover world-class academic degrees, state-of-the-art computational labs, and vibrant campus life.';
  const heroPrimaryCtaText = collegeInfo?.heroPrimaryCtaText || 'Explore Programs';
  const heroPrimaryCtaLink = collegeInfo?.heroPrimaryCtaLink || '/courses';
  const heroSecondaryCtaText = collegeInfo?.heroSecondaryCtaText || 'Admissions 2026';
  const heroSecondaryCtaLink = collegeInfo?.heroSecondaryCtaLink || '/admissions';

  const stats = [
    { label: 'Undergraduate & PG Scholars', value: '4,500+', icon: Users },
    { label: 'Doctoral Faculty Members', value: '180+', icon: GraduationCap },
    { label: 'Campus Placement Rate', value: '96.4%', icon: Award },
    { label: 'Eco-Smart Wi-Fi Campus', value: '55 Acres', icon: Building },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      <SEO />

      {/* 1. UNIFIED HERO SECTION */}
      <section className="hero-unified relative isolate overflow-hidden bg-[#551524] text-white">
        <div className="hero-dots absolute inset-0 pointer-events-none" />
        <div className="hero-glow absolute -right-32 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-[#d8a52a]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto grid max-w-[1500px] items-center gap-8 px-5 py-14 sm:px-8 sm:py-20 lg:min-h-[calc(100vh-116px)] lg:grid-cols-[49%_51%] lg:gap-0 lg:px-12 lg:py-16">
          <div className="hero-rise relative z-20 max-w-2xl lg:pr-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d8a52a]/40 bg-white/10 px-3.5 py-2 text-xs font-semibold text-[#ffd36a] backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>Admissions Open for Academic Session 2026–2027</span>
            </div>

            <h1 className="max-w-3xl text-[clamp(3rem,5vw,5.5rem)] font-black leading-[.98] tracking-[-.035em] text-[#fff8ee]">
              Empowering Minds,<br />
              <span className="text-[#f5a000]">Transforming Futures</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-[#e8dde0] sm:text-lg">
              Discover world-class academic programs, cutting-edge research facilities, and vibrant campus life.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to={heroPrimaryCtaLink} className="hero-cta inline-flex items-center gap-3 rounded-xl bg-[#f5a000] px-6 py-3.5 text-sm font-bold text-[#35101b] shadow-lg shadow-black/20 focus:outline-none focus:ring-2 focus:ring-[#ffd36a] focus:ring-offset-2 focus:ring-offset-[#551524]">
                <span>Explore Programs</span><ArrowRight className="h-4 w-4" />
              </Link>
              <Link to={heroSecondaryCtaLink} className="hero-cta inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#ffd36a] focus:ring-offset-2 focus:ring-offset-[#551524]">
                <span>Admissions 2026</span>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-6 text-xs font-medium text-[#e8dde0]">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#f5a000]" /> NAAC A++ (CGPA 3.82)</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#f5a000]" /> NBA Tier-1 Accredited</span>
              <span className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-[#f5a000]" /> AICTE &amp; UGC Recognized</span>
            </div>
          </div>

          <div className="hero-image-wrap hero-slide relative mx-auto min-h-[390px] w-full max-w-2xl sm:min-h-[500px] lg:min-h-[590px] lg:max-w-none">
            <div className="hero-arc hero-arc-gold" />
            <div className="hero-arc hero-arc-maroon" />
            <div className="hero-image-shell absolute inset-5 overflow-hidden rounded-[42%_8%_8%_42%] border border-white/15 shadow-2xl shadow-black/30 sm:inset-7 lg:inset-y-5 lg:left-6 lg:right-0">
              <ImageWithFallback
                src="/assets/herobgimg.png"
                type="article"
                alt="Students walking together on a university campus"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#551524]/25 via-transparent to-[#551524]/10" />
            </div>

            <div className="hero-float absolute left-3 top-6 z-10 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 text-[#551524] shadow-xl sm:left-5 sm:top-10 sm:px-5 sm:py-4">
              <ShieldCheck className="h-11 w-11 rounded-full bg-[#fff3d5] p-2 text-[#c38c16]" />
              <div><strong className="block text-base leading-tight sm:text-lg">NAAC A+</strong><span className="text-[11px] text-[#4b3a40] sm:text-xs">Accredited<br />Excellence in Education</span></div>
            </div>

            <div className="hero-float absolute bottom-5 left-3 z-10 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 text-[#551524] shadow-xl sm:bottom-10 sm:left-10 sm:gap-4 sm:px-5 sm:py-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#741c32] text-xl text-white">↗</span>
              <div><strong className="block text-base leading-tight sm:text-lg">Admissions Open</strong><span className="text-[11px] text-[#4b3a40] sm:text-xs">for Academic Session 2026–27</span></div>
              <ArrowRight className="h-7 w-7 shrink-0 rounded-full bg-[#fbe5e1] p-2 text-[#741c32]" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. INSTITUTIONAL STATS COUNTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
          {stats.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div key={idx} className="flex items-center gap-4 p-2 sm:p-3 border-r last:border-r-0 border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-900 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-academic-navy font-heading">
                    {st.value}
                  </div>
                  <div className="text-xs text-slate-500 font-medium leading-tight mt-0.5">
                    {st.label}
                  </div>
                </div>
              </div>
            );
          })}
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
