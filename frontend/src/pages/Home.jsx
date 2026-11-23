import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  HeartHandshake,
  CalendarCheck,
  ShieldCheck,
  Users,
  Building2,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Calendar,
} from 'lucide-react';

const Home = () => {
  const [stats, setStats] = useState({
    totalVolunteers: 120,
    verifiedNgos: 15,
    opportunitiesCompleted: 45,
    activeDrivesCount: 8,
  });
  const [recentDrives, setRecentDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await api.get('/public/home-data');
        if (res.data.success) {
          setStats(res.data.stats);
          setRecentDrives(res.data.recentOpportunities || []);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-teal-50/30 to-white pt-16 pb-20 border-b border-emerald-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Solving The Volunteer Availability Problem
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Connecting <span className="text-emerald-600">Free Time</span> With Meaningful NGO Drives
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              NGOs struggle to find volunteers when they need them; willing helpers don't
              know where to go. Our platform matches verified community drives with your
              exact free schedule.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 transition-all text-center flex items-center justify-center gap-2"
              >
                Start Volunteering <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register?role=ngo"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-all text-center flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4 text-emerald-600" />
                Register As NGO
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{stats.totalVolunteers}+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Active Volunteers
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{stats.verifiedNgos}+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Verified NGOs
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{stats.opportunitiesCompleted}+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Drives Completed
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{stats.activeDrivesCount}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Open Drives Today
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider block mb-2">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            How Volunteer Matching Works
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            No endless searching or scheduling conflicts. We do the math between NGO requirements and your free hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 relative group hover:border-emerald-500 transition-all">
            <span className="absolute top-4 right-4 text-3xl font-black text-slate-200 group-hover:text-emerald-200 transition-colors">
              01
            </span>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">NGO Posts Drive</h3>
            <p className="text-sm text-slate-600">
              Verified NGOs publish specific events (e.g. Sunday Cleanliness Drive, 10 volunteers needed from 09:30 AM).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 relative group hover:border-emerald-500 transition-all">
            <span className="absolute top-4 right-4 text-3xl font-black text-slate-200 group-hover:text-emerald-200 transition-colors">
              02
            </span>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Set Free Hours</h3>
            <p className="text-sm text-slate-600">
              Volunteers mark recurring free time slots (e.g. "Free every Sunday 9 AM - 2 PM") on their schedule grid.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 relative group hover:border-emerald-500 transition-all">
            <span className="absolute top-4 right-4 text-3xl font-black text-slate-200 group-hover:text-emerald-200 transition-colors">
              03
            </span>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Match & Apply</h3>
            <p className="text-sm text-slate-600">
              The engine matches drives with your free slots, showing instant 100% schedule compatibility badges.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 relative group hover:border-emerald-500 transition-all">
            <span className="absolute top-4 right-4 text-3xl font-black text-slate-200 group-hover:text-emerald-200 transition-colors">
              04
            </span>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Accept & Attend</h3>
            <p className="text-sm text-slate-600">
              NGO reviews schedule-verified applicants, approves them, and both parties receive direct event passes.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Drives */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-8">
          <div>
            <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider block mb-1">
              Active Verified Opportunities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Featured Community Drives
            </h2>
          </div>
          <Link
            to="/login"
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            Sign in to view schedule matches <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentDrives.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center">
            <p className="text-slate-500 text-sm">Loading active drives...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentDrives.map((drive) => (
              <div
                key={drive._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {drive.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {drive.startTime} - {drive.endTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                    {drive.title}
                  </h3>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                    {drive.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {drive.location}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {drive.dayOfWeek || 'Weekend'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs">
                      <span className="font-bold text-slate-800">
                        {drive.requiredVolunteers - (drive.filledVolunteers || 0)}
                      </span>{' '}
                      <span className="text-slate-500">slots open</span>
                    </div>

                    <Link
                      to="/login"
                      className="px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      Check Availability
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Role Breakdown Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Built For 3 Types Of Platform Users
            </h2>
            <p className="text-slate-300 text-sm">
              Role-specific workflows designed to foster high-trust collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1. Volunteers</h3>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• Declare weekly free days & hours</li>
                <li>• Discover 100% schedule-matching drives</li>
                <li>• 1-Click application submission</li>
                <li>• Real-time approval passes</li>
              </ul>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2. NGOs & Organizers</h3>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• Post time-slotted requirements</li>
                <li>• Review applicant schedule match score</li>
                <li>• Accept or reject with feedback</li>
                <li>• Verified organizer credibility</li>
              </ul>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">3. Super Admin</h3>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• Verify NGO official credentials & docs</li>
                <li>• Moderate & remove fake drives</li>
                <li>• User governance & audit logs</li>
                <li>• Community impact analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
