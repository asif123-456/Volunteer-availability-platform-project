'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Filter,
  Send,
  X,
  Search,
  Building2,
  CalendarCheck,
} from 'lucide-react';

export default function VolunteerDashboard() {
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
      const res = await fetch('/api/volunteer/opportunities');
      const data = await res.json();
      if (data.success) {
        setOpportunities(data.data);
      }
    } catch (err) {
      setError('Failed to load availability-matched opportunities');
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
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId: selectedOpp._id,
          message: volunteerMsg,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Application submitted to the NGO!');
        setTimeout(() => {
          setApplyModalOpen(false);
          setSuccessMsg('');
          fetchOpportunities();
        }, 1200);
      } else {
        setError(data.message || 'Failed to submit application');
      }
    } catch (err) {
      setError(err.message || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = opportunities.filter((opp) => {
    const matchCat =
      selectedCategory === 'All' || opp.category === selectedCategory;
    const matchSchedule = !onlyMatching || opp.isMatched;
    const matchSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchQuery.toLowerCase());

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
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-700/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-emerald-200 text-xs font-bold uppercase tracking-wider">
            <CalendarCheck className="w-4 h-4" /> Smart Availability Matching Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Volunteer Opportunity Feed
          </h1>
          <p className="mt-1 text-emerald-100 text-xs max-w-xl">
            Verified NGO drives automatically compared with your declared free schedule.
            Drives matching your available hours appear with a green match badge.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/volunteer/availability"
            className="px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider bg-white text-emerald-800 hover:bg-emerald-50 shadow-md transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            Set Free Hours
          </Link>
          <Link
            href="/volunteer/applications"
            className="px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-800/80 hover:bg-emerald-800 text-white border border-emerald-500/50 transition-all"
          >
            My Applications
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search drives by title or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors">
            <input
              type="checkbox"
              checked={onlyMatching}
              onChange={(e) => setOnlyMatching(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600"
            />
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Only Show Free on My Schedule
            </span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Drives Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Matching drives against your schedule...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center max-w-lg mx-auto space-y-3 transition-colors">
          <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No matching drives found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {onlyMatching
              ? 'None of the current drives overlap with your declared free schedule. Update your availability to see more!'
              : 'Try another category or search term.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((opp) => (
            <div
              key={opp._id}
              className={`bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                opp.isMatched
                  ? 'border-emerald-400 dark:border-emerald-500/70 shadow-md ring-1 ring-emerald-400/50'
                  : 'border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {opp.category}
                  </span>

                  {opp.isMatched ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 animate-pulse">
                      <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      {opp.matchScore}% Time Match
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      Off-schedule
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {opp.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  {opp.description}
                </p>

                {opp.isMatched && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium flex items-start gap-1.5 mb-4">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{opp.matchReason}</span>
                  </div>
                )}

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {opp.ngoProfile?.organizationName || opp.ngo?.name || 'NGO Partner'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>
                      {opp.dayOfWeek},{' '}
                      {new Date(opp.eventDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {opp.startTime} – {opp.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{opp.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                <div className="text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {Math.max(0, opp.requiredVolunteers - (opp.filledVolunteers || 0))}
                  </span>{' '}
                  <span className="text-slate-500 dark:text-slate-400">spots open</span>
                </div>

                {opp.hasApplied ? (
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                      opp.applicationStatus === 'accepted'
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : opp.applicationStatus === 'rejected'
                        ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                        : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
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
                        : 'bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white'
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

      {/* Apply Modal */}
      {applyModalOpen && selectedOpp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 relative transition-colors">
            <button
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                Volunteer Drive Application
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {selectedOpp.title}
              </h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Timing:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedOpp.dayOfWeek}, {selectedOpp.startTime} - {selectedOpp.endTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Compatibility:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {selectedOpp.isMatched ? '✓ Free on your schedule' : 'Custom application'}
                </span>
              </div>
            </div>

            {successMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-center font-bold text-sm">
                🎉 {successMsg}
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Message to Organizer (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={volunteerMsg}
                    onChange={(e) => setVolunteerMsg(e.target.value)}
                    placeholder="Tell the NGO why you want to participate..."
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 disabled:opacity-50"
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
}
