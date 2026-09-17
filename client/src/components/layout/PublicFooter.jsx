import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Youtube, Instagram, ShieldCheck, ChevronRight } from 'lucide-react';
import { useCollege } from '../../context/CollegeContext';

const PublicFooter = () => {
  const { collegeInfo, settings } = useCollege();

  const collegeName = collegeInfo?.collegeName || settings?.collegeName || 'Apex Institute of Technology & Sciences';
  const shortName = collegeInfo?.shortName || settings?.shortName || 'AITS';
  const address = settings?.address || 'Knowledge Park IV, Educational Expressway, Metropolis Campus - 400012';
  const phone = settings?.phone || '+91 (0) 1234 567890';
  const email = settings?.email || 'info@college.edu';
  const admissionsEmail = settings?.admissionsEmail || 'admissions@college.edu';
  const copyright = settings?.copyrightText || `© ${new Date().getFullYear()} ${collegeName}. All rights reserved.`;
  const footerAbout = settings?.footerAbout || 'A premier center of higher education and innovative scientific research, recognized for academic excellence, state-of-the-art laboratories, and top-tier career placements.';

  const social = settings?.socialLinks || {};

  return (
    <footer className="bg-[var(--color-primary)] text-white/75 border-t-4 border-[var(--color-accent)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: College Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] flex items-center justify-center font-bold shadow">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-lg font-bold text-white font-heading">
                {shortName}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-white/70">
              {footerAbout}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-accent-light)] bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-[var(--color-accent-light)]" />
                NAAC A++ & NBA Accredited
              </span>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[var(--color-accent)] hover:text-[var(--color-primary)] flex items-center justify-center text-white transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[var(--color-accent)] hover:text-[var(--color-primary)] flex items-center justify-center text-white transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[var(--color-accent)] hover:text-[var(--color-primary)] flex items-center justify-center text-white transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[var(--color-accent)] hover:text-[var(--color-primary)] flex items-center justify-center text-white transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[var(--color-accent)] hover:text-[var(--color-primary)] flex items-center justify-center text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-heading border-l-2 border-amber-500 pl-2.5">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> About Institute
                </Link>
              </li>
              <li>
                <Link to="/vision-mission" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Vision & Mission
                </Link>
              </li>
              <li>
                <Link to="/principal-message" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Principal's Desk
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Academic Departments
                </Link>
              </li>
              <li>
                <Link to="/staff" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Faculty Directory
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Programs & Degrees
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Campus Facilities
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Admissions & Portals */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-heading border-l-2 border-amber-500 pl-2.5">
              Admissions & Media
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/admissions" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Admissions 2026-27
                </Link>
              </li>
              <li>
                <Link to="/admissions/notices" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Admission Notices & Forms
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Events & Seminars
                </Link>
              </li>
              <li>
                <Link to="/articles" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> News & Articles
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Honors & Achievements
                </Link>
              </li>
              <li>
                <Link to="/notices" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Official Circulars
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" /> Photo & Video Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Address */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-heading border-l-2 border-amber-500 pl-2.5">
              Campus Contact
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <a href={`mailto:${admissionsEmail}`} className="hover:text-white transition-colors">{admissionsEmail}</a>
              </div>
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-block bg-primary-800 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors border border-primary-700"
                >
                  Send Public Enquiry &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{copyright}</p>
          <div className="flex items-center space-x-6">
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link to="/admin/login" className="hover:text-amber-400 font-semibold transition-colors">Admin CMS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
