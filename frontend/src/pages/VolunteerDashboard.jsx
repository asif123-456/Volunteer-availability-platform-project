import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Filter,
  Send,
  X,
  Search,
  Building2,
  CalendarCheck,
} from 'lucide-react';

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyMatching, setOnlyMatching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Apply Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [volunteerMsg, setVolunteerMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const res = await api.get('/volunteer/opportunities');
      if (res.data.success) {
        setOpportunities(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleOpenApply = (opp) => {
    setSelectedOpp(opp);
    setVolunteerMsg(
      opp.isMatched
        ? `Hi! My schedule is free on ${opp.dayOfWeek}s and I would love to contribute to this drive.`
        : 'Hi! I would like to volunteer for this opportunity.'
    );
    setApplyModalOpen(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedOpp) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await api.post(`/volunteer/apply/${selectedOpp._id}`, {
        message: volunteerMsg,
      });
      if (res.data.success) {
        setSuccessMsg('Application submitted successfully to the NGO!');
        setTimeout(() => {
          setApplyModalOpen(false);
          setSuccessMsg('');
          fetchOpportunities();
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter opportunities
  const filtered = opportunities.filter((opp) => {
    const matchCat =
      selectedCategory === 'All' || opp.category === selectedCategory;
    const matchSchedule = !onlyMatching || opp.isMatched;
    const matchSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opp.city && opp.city.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCat && matchSchedule && matchSearch;
  });

  const categories = [
    'All',
    'Cleanliness Drive',
    'Education & Teaching',
    'Health & Medical',
    'Food Distribution',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-700/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-emerald-200 text-xs font-bold uppercase tracking-wider">
            <CalendarCheck className="w-4 h-4" /> Volunteer Availability Board
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.name}! 👋
          </h1>
          <p className="mt-1 text-emerald-100 text-sm max-w-xl">
            Here are verified NGO drives matched directly against your declared availability.
            Opportunities that fit your free hours appear with a green match badge.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/volunteer/availability"
            className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white text-emerald-800 hover:bg-emerald-50 shadow-md transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            Update My Free Schedule
          </Link>
          <Link
            to="/volunteer/applications"
            className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-800/80 hover:bg-emerald-800 text-white border border-emerald-500/50 transition-all"
          >
            My Applied Drives
          </Link>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search drives by title, venue or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Toggle "Only Matching My Schedule" */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors w-full sm:w-auto justify-center">
            <input
              type="checkbox"
              checked={onlyMatching}
              onChange={(e) => setOnlyMatching(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Only Show Free On My Schedule
            </span>
          </label>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-500">Checking opportunities against your schedule...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No matching drives found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {onlyMatching
              ? 'No open drives match your declared free hours. Try unchecking the schedule filter or add more days in your Availability manager!'
              : 'Try searching with a different keyword or category.'}
          </p>
          {onlyMatching && (
            <button
              onClick={() => setOnlyMatching(false)}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Show all open drives
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((opp) => (
            <div
              key={opp._id}
              className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                opp.isMatched
                  ? 'border-emerald-400/90 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-400/50'
                  : 'border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Card Header & Schedule Match Badge */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                    {opp.category}
                  </span>

                  {opp.isMatched ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm animate-pulse">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      {opp.matchScore}% Time Match
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-400">
                      Off-schedule
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                  {opp.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                  {opp.description}
                </p>

                {/* Match Reason Alert Banner if matched */}
                {opp.isMatched && (
                  <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 font-medium flex items-start gap-1.5 mb-4">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{opp.matchReason}</span>
                  </div>
                )}

                {/* Details List */}
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800">
                      {opp.ngoProfile?.organizationName || opp.ngo?.name || 'NGO Partner'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {opp.dayOfWeek},{' '}
                      {new Date(opp.eventDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-800">
                      {opp.startTime} – {opp.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{opp.location}</span>
                  </div>
                </div>

                {/* Skills Tags */}
                {opp.skillsRequired && opp.skillsRequired.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {opp.skillsRequired.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="text-xs">
                  <span className="font-extrabold text-slate-900">
                    {Math.max(0, opp.requiredVolunteers - (opp.filledVolunteers || 0))}
                  </span>{' '}
                  <span className="text-slate-500">spots open</span>
                </div>

                {opp.hasApplied ? (
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                      opp.applicationStatus === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : opp.applicationStatus === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Applied ({opp.applicationStatus})
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenApply(opp)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      opp.isMatched
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                        : 'bg-slate-800 hover:bg-slate-900 text-white'
                    }`}
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Submission Modal */}
      {applyModalOpen && selectedOpp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                Volunteer Opportunity Application
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                {selectedOpp.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Hosted by {selectedOpp.ngoProfile?.organizationName || selectedOpp.ngo?.name}
              </p>
            </div>

            {/* Timing confirmation card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Event Date:</span>
                <span className="font-bold text-slate-800">
                  {selectedOpp.dayOfWeek},{' '}
                  {new Date(selectedOpp.eventDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Event Time Slot:</span>
                <span className="font-bold text-slate-800">
                  {selectedOpp.startTime} - {selectedOpp.endTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Schedule Compatibility:</span>
                <span className="font-bold text-emerald-700">
                  {selectedOpp.isMatched ? '✓ Confirmed Available' : 'Custom Schedule'}
                </span>
              </div>
            </div>

            {successMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center font-bold text-sm">
                🎉 {successMsg}
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Personal Message to Organizer (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={volunteerMsg}
                    onChange={(e) => setVolunteerMsg(e.target.value)}
                    placeholder="Tell the NGO why you want to join and any relevant background..."
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? 'Submitting...' : 'Confirm Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;
