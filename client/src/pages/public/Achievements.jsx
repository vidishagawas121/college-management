import React, { useState, useEffect } from 'react';
import { achievementService } from '../../services/achievementService';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import { Trophy, Award, Calendar, Users, ExternalLink, ShieldCheck } from 'lucide-react';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory !== 'ALL') params.category = selectedCategory;
        if (selectedLevel !== 'ALL') params.level = selectedLevel;

        const res = await achievementService.getPublicAchievements(params);
        if (res.success && res.data) {
          setAchievements(res.data);
        }
      } catch (err) {
        console.error('Failed to load achievements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, [selectedCategory, selectedLevel]);

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title="Student & Faculty Achievements | Hall of Fame"
        description="Explore national and international laurels, hackathon triumphs, sports trophies, and research awards won by Apex Institute scholars."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
            Hall of Fame
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-academic-navy font-heading mt-3">
            Honors & Achievements
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl">
            Celebrating the extraordinary milestones, innovation cups, sports victories, and prestigious grants secured by our students and faculty.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filters */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {['ALL', 'Academic', 'Sports', 'Innovation & Hackathon', 'Faculty Recognition'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-academic-navy text-amber-400 shadow-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Domains' : cat}
              </button>
            ))}
          </div>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary-700/20 w-full sm:w-auto"
          >
            <option value="ALL">All Levels</option>
            <option value="International">International</option>
            <option value="National">National</option>
            <option value="State">State</option>
            <option value="University">University</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <LoadingSpinner message="Loading hall of achievements..." />
        ) : achievements.length === 0 ? (
          <EmptyState
            title="No achievements found"
            description="No published awards matching your selected criteria."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((ach) => (
              <div
                key={ach._id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {ach.photo ? (
                    <div className="h-52 bg-slate-100 overflow-hidden relative">
                      <ImageWithFallback
                        src={ach.photo}
                        alt={ach.title}
                        type="article"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-academic-navy text-amber-400 text-xs font-bold px-3 py-1 rounded-xl shadow">
                        {ach.level} Level
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 pb-0 flex items-center justify-between">
                      <span className="bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-lg border border-amber-200">
                        {ach.category}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{ach.level}</span>
                    </div>
                  )}

                  <div className="p-6 sm:p-8 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-amber-700 font-bold">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>{ach.category}</span>
                    </div>

                    <h3 className="text-lg font-bold text-academic-navy font-heading leading-snug">
                      {ach.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-4">
                  <div>
                    <span className="font-bold text-academic-navy block truncate max-w-[180px]">
                      {ach.recipient}
                    </span>
                    {ach.department && (
                      <span className="text-[11px] text-slate-400 block">{ach.department.name}</span>
                    )}
                  </div>
                  <span className="font-semibold text-slate-400">{ach.academicYear}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
