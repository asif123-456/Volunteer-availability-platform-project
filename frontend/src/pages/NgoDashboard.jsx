import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Building2,
  PlusCircle,
  Users,
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Eye,
  CheckCircle2,
} from 'lucide-react';

const NgoDashboard = () => {
  const [stats, setStats] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNgoData = async () => {
    try {
      setLoading(true);
      const [statsRes, oppsRes] = await Promise.all([
        api.get('/ngo/dashboard-stats'),
        api.get('/ngo/my-opportunities'),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (oppsRes.data.success) {
        setOpportunities(oppsRes.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load NGO dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNgoData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top NGO Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-teal-900/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-teal-300" />
            <span className="text-teal-200 text-xs font-bold uppercase tracking-wider">
              NGO Partner Management Portal
            </span>
            {stats?.verificationStatus === 'verified' ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/40">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Verified NGO
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/40">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-300" /> Verification Pending
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {stats?.organizationName || 'NGO Dashboard'}
          </h1>
          <p className="mt-1 text-teal-100 text-sm max-w-xl">
            Create volunteer requirements, review candidate availability schedules, and confirm
            attendance for short-term drives.
          </p>
        </div>

        <Link
          to="/ngo/create-opportunity"
          className="px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Post New Opportunity
        </Link>
      </div>

      {/* Verification Warning Notice if pending */}
      {stats?.verificationStatus === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800">
            <span className="font-bold">Super Admin Verification Underway: </span>
            Your organization details and registration number are currently being verified by the
            platform Super Admin. You can still create and manage drives, which will be visible once
            verification completes.
          </div>
        </div>
      )}

      {/* Metric Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Drives Created
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">
            {stats?.totalDrives || 0}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Active Open Drives
          </span>
          <div className="text-3xl font-extrabold text-emerald-700 mt-1">
            {stats?.openDrives || 0}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Total Applicants
          </span>
          <div className="text-3xl font-extrabold text-indigo-700 mt-1">
            {stats?.totalApplicants || 0}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
            Accepted Helpers
          </span>
          <div className="text-3xl font-extrabold text-teal-700 mt-1">
            {stats?.acceptedVolunteers || 0}
          </div>
        </div>
      </div>

      {/* Opportunities Created by this NGO */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-slate-900">
            Your Posted Volunteer Opportunities
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {opportunities.length} drives created
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Loading your opportunities...</p>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-md mx-auto space-y-4">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No opportunities posted yet</h3>
            <p className="text-xs text-slate-500">
              Post your first drive requirement to start receiving availability-matched volunteer applicants!
            </p>
            <Link
              to="/ngo/create-opportunity"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700"
            >
              <PlusCircle className="w-4 h-4" /> Create Drive Requirement
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {opportunities.map((opp) => (
              <div
                key={opp._id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {opp.category}
                    </span>
                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                        opp.status === 'open'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {opp.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">{opp.title}</h3>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {opp.dayOfWeek},{' '}
                        {new Date(opp.eventDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {opp.startTime} - {opp.endTime}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600">Volunteers Filled:</span>
                      <span className="text-emerald-700 font-bold">
                        {opp.filledVolunteers || 0} / {opp.requiredVolunteers}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            ((opp.filledVolunteers || 0) / opp.requiredVolunteers) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-bold text-slate-900">{opp.totalApplicants}</span>{' '}
                    <span className="text-slate-500">applicants</span>
                    {opp.pendingApplicants > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px]">
                        {opp.pendingApplicants} new
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/ngo/opportunity/${opp._id}/applicants`}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 flex items-center gap-1.5 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Review Applicants
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NgoDashboard;
