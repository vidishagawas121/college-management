import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import SEO from '../../components/common/SEO';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import RichTextRenderer from '../../components/common/RichTextRenderer';
import { Calendar, Clock, MapPin, Users, ExternalLink, ChevronLeft, ArrowRight, Share2 } from 'lucide-react';

const EventDetail = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await eventService.getEventBySlug(slug);
        if (res.success && res.data) {
          setEvent(res.data);
          setRelatedEvents(res.relatedEvents || []);
        }
      } catch (err) {
        console.error('Failed to load event:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  if (loading) return <LoadingSpinner message="Loading event details..." fullPage />;
  if (!event) return <EmptyState title="Event not found" description="The requested event does not exist or has been removed." />;

  const evtDate = new Date(event.date);

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <SEO
        title={event.title}
        description={event.description}
        ogImage={event.coverImage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-900 hover:text-primary-700 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Events Calendar
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Event Article */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
              <div className="h-72 sm:h-96 bg-slate-100 overflow-hidden relative">
                <img
                  src={event.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-academic-navy text-amber-400 text-xs font-bold px-3 py-1.5 rounded-xl shadow">
                  {event.category}
                </div>
              </div>

              <div className="p-6 sm:p-10 space-y-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-academic-navy font-heading leading-tight">
                  {event.title}
                </h1>

                <div className="text-slate-700 leading-relaxed space-y-4 text-base">
                  <RichTextRenderer content={event.description} />
                </div>

                {event.registrationLink && (
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                        Registrations Open
                      </span>
                      <span className="text-xs text-slate-500">Seats available on first-come basis.</span>
                    </div>
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs shadow-sm transition-colors"
                    >
                      <span>Register for Event</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Event Sidebar Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-academic-navy font-heading border-b border-slate-100 pb-3">
                Event Schedule & Venue
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Date</span>
                    <span>{evtDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Timings</span>
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Venue</span>
                    <span>{event.venue}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Organizer</span>
                    <span>{event.organizer}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-academic-navy font-heading border-b border-slate-100 pb-2">
                  Related Events
                </h4>
                <div className="space-y-3">
                  {relatedEvents.map((r) => (
                    <Link
                      key={r._id}
                      to={`/events/${r.slug}`}
                      className="block p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors group"
                    >
                      <h5 className="text-xs font-bold text-slate-900 group-hover:text-primary-900 transition-colors line-clamp-1">
                        {r.title}
                      </h5>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">
                        {new Date(r.date).toLocaleDateString()}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
