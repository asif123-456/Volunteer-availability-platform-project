'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Clock,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Sparkles,
  Building2,
  ArrowRight,
} from 'lucide-react';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/applications');
        const data = await res.json();
        if (data.success) {
          setApplications(data.data);
        }
      } catch (err) {
        setError('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
          Application Status Tracker
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          My Volunteer Applications
        </h1>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Track the live acceptance status of community drives you applied for.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading your applications...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold">
          {error}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center max-w-md mx-auto space-y-3 transition-colors">
          <FileCheck2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No active applications yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Find drives matching your free hours and apply with 1 click.
          </p>
          <Link
            href="/volunteer/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20"
          >
            Find Matching Drives <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const opp = app.opportunity;
            if (!opp) return null;

            return (
              <div
                key={app._id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {opp.category}
                      </span>
                      {app.availabilityMatch && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                          <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          100% Schedule Match Verified
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{opp.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{opp.ngoProfile?.organizationName || opp.ngo?.name}</span>
                    </div>
                  </div>

                  <div>
                    {app.status === 'accepted' ? (
                      <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                        <div>
                          <div>CONFIRMED (ACCEPTED)</div>
                          <div className="text-[10px] font-normal text-emerald-700 dark:text-emerald-400">
                            See you at the drive!
                          </div>
                        </div>
                      </div>
                    ) : app.status === 'rejected' ? (
                      <div className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        <div>
                          <div>DECLINED</div>
                          <div className="text-[10px] font-normal text-rose-600 dark:text-rose-400">
                            {app.ngoRemarks || 'Slots full'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <div>
                          <div>UNDER REVIEW</div>
                          <div className="text-[10px] font-normal text-amber-700 dark:text-amber-400">
                            Awaiting NGO decision
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>
                      {opp.dayOfWeek},{' '}
                      {new Date(opp.eventDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{opp.startTime} - {opp.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{opp.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
