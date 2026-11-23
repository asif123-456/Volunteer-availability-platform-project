'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  PlusCircle,
  Users,
  Calendar,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default function NgoDashboardPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNgoData = async () => {
    try {
      setLoading(true);
      const [oppRes, appRes] = await Promise.all([
        fetch('/api/opportunities?mine=true'),
        fetch('/api/applications'),
      ]);
      const oppData = await oppRes.json();
      const appData = await appRes.json();

      if (oppData.success) setOpportunities(oppData.data);
      if (appData.success) setApplicants(appData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNgoData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* NGO Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-teal-900/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-teal-300" />
            <span className="text-teal-200 text-xs font-bold uppercase tracking-wider">
              NGO Management Dashboard
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/40">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Verified NGO
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            NGO Opportunities Hub
          </h1>
          <p className="mt-1 text-teal-100 text-xs max-w-xl">
            Create time-slotted volunteer requirements, review candidate availability schedules, and confirm
            attendance for short-term drives.
          </p>
        </div>

        <Link
          href="/ngo/create-opportunity"
          className="px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Post New Drive
        </Link>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Total Drives
          </span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {opportunities.length}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Active Open Drives
          </span>
          <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
            {opportunities.filter((o) => o.status === 'open').length}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Total Applicants
          </span>
          <div className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 mt-1">
            {applicants.length}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
            Confirmed Volunteers
          </span>
          <div className="text-3xl font-extrabold text-teal-700 dark:text-teal-400 mt-1">
            {applicants.filter((a) => a.status === 'accepted').length}
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Your Posted Volunteer Opportunities
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {opportunities.length} drives created
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Loading drives...</p>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center max-w-md mx-auto space-y-3 transition-colors">
            <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No opportunities posted yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Post your first drive requirement to start receiving availability-matched applicants!
            </p>
            <Link
              href="/ngo/create-opportunity"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20"
            >
              <PlusCircle className="w-4 h-4" /> Create Drive
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {opportunities.map((opp) => {
              const oppApps = applicants.filter(
                (a) => a.opportunity?._id === opp._id
              );
              return (
                <div
                  key={opp._id}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {opp.category}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        {opp.status.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{opp.title}</h3>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 mb-4 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span>{opp.dayOfWeek}, {new Date(opp.eventDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span>{opp.startTime} - {opp.endTime}</span>
                      </div>
                    </div>

                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-600 dark:text-slate-400">Volunteers Filled:</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                          {opp.filledVolunteers || 0} / {opp.requiredVolunteers}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
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

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                      {oppApps.length} applicants
                    </span>

                    <Link
                      href={`/ngo/opportunities/${opp._id}/applicants`}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 flex items-center gap-1.5 transition-colors"
                    >
                      <Users className="w-3.5 h-3.5" />
                      Review Applicants
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
}
