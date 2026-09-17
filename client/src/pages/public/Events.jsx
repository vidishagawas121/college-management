import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Calendar, Clock, MapPin, Tag, ArrowRight, ChevronRight } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past' | 'all'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeTab === 'upcoming') params.type = 'upcoming';
        else if (activeTab === 'past') params.type = 'past';
        if (selectedCategory !== 'ALL') params.category = selectedCategory;

        const res = await eventService.getPublicEvents(params);
        if (res.success && res.data) {
          setEvents(res.data);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [activeTab, selectedCategory]);

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title="College Events, Seminars & Workshops"
        description="Discover academic conferences, international tech fests, workshops, cultural shows, and sports events at Apex Institute."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
            Campus Happenings
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-academic-navy font-heading mt-3">
            Events & Seminars
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl">
            Explore national symposiums, hackathons, guest lectures, cultural gatherings, and technical championships.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Tabs & Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            {[
              { id: 'upcoming', label: 'Upcoming Events' },
              { id: 'past', label: 'Past Events' },
              { id: 'all', label: 'All Events' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-academic-navy text-amber-400 shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary-700/20"
            >
              <option value="ALL">All Categories</option>
              {['Academic', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Conference'].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <LoadingSpinner message="Loading events schedule..." />
        ) : events.length === 0 ? (
          <EmptyState
            title="No events found"
            description="There are currently no events matching your selected filter criteria."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((evt) => {
              const evtDate = new Date(evt.date);
              return (
                <div
                  key={evt._id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-52 bg-slate-100 overflow-hidden relative">
                      <img
                        src={evt.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-academic-navy/90 backdrop-blur-xs text-amber-400 text-xs font-bold px-3 py-1 rounded-xl shadow">
                        {evt.category}
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 space-y-4">
                      {/* Date Block */}
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        <span>{evtDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-heading group-hover:text-primary-900 transition-colors leading-snug">
                        {evt.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{evt.startTime} - {evt.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{evt.venue}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                    <span className="text-[11px] font-semibold text-slate-400">
                      Organized by: {evt.organizer || 'AITS'}
                    </span>
                    <Link
                      to={`/events/${evt.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-900 hover:text-primary-700"
                    >
                      <span>View Event</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
