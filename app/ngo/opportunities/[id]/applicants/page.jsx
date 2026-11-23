'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
} from 'lucide-react';

export default function OpportunityApplicantsPage() {
  const params = useParams();
  const id = params.id;

  const [opportunity, setOpportunity] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const [oppRes, appRes] = await Promise.all([
        fetch(`/api/opportunities/${id}`),
        fetch(`/api/applications?opportunityId=${id}`),
      ]);
      const oppData = await oppRes.json();
      const appData = await appRes.json();

      if (oppData.success) setOpportunity(oppData.data);
      if (appData.success) setApplicants(appData.data);
    } catch (err) {
      setError('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchApplicants();
  }, [id]);

  const handleUpdateStatus = async (appId, newStatus) => {
    setActionLoadingId(appId);
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          remarks:
            newStatus === 'accepted'
              ? 'Confirmed for the drive by organizer! Please report 15 mins early.'
              : 'Declined.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchApplicants();
      } else {
        alert(data.message || 'Error updating status');
      }
    } catch (err) {
      alert('Error updating application status');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link
        href="/ngo/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to NGO Dashboard
      </Link>

      {opportunity && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-1">
              Review Applicants for Drive
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{opportunity.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {opportunity.dayOfWeek}, {new Date(opportunity.eventDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {opportunity.startTime} - {opportunity.endTime}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {opportunity.location}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center min-w-[150px]">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">Slots Confirmed</span>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
              {opportunity.filledVolunteers} / {opportunity.requiredVolunteers}
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Registered Applicants ({applicants.length})
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Ranked by availability schedule match score
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Loading applicants...</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold">
            {error}
          </div>
        ) : applicants.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-2 transition-colors">
            <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No applicants yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Volunteers whose schedule matches this drive time will see it highlighted on their feed.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {applicants.map((app) => (
              <div
                key={app._id}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {app.volunteer?.name}
                    </h3>
                    {app.availabilityMatch ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        100% Time Slot Available
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        Standard Applicant
                      </span>
                    )}

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        app.status === 'accepted'
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : app.status === 'rejected'
                          ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                          : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      }`}
                    >
                      {app.status === 'pending'
                        ? '⏳ PENDING'
                        : app.status === 'accepted'
                        ? '✓ ACCEPTED'
                        : '✕ DECLINED'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {app.volunteer?.email}
                    </span>
                    {app.volunteer?.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {app.volunteer?.phone}
                      </span>
                    )}
                  </div>

                  {app.volunteerMessage && (
                    <div className="text-xs bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Message: </span>
                      "{app.volunteerMessage}"
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(app._id, 'accepted')}
                    disabled={actionLoadingId === app._id}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                      app.status === 'accepted'
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-500'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white border border-emerald-300 dark:border-emerald-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {app.status === 'accepted' ? 'Accepted ✓' : 'Accept'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(app._id, 'rejected')}
                    disabled={actionLoadingId === app._id}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                      app.status === 'rejected'
                        ? 'bg-rose-600 text-white ring-2 ring-rose-500'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-600 dark:hover:bg-rose-600 hover:text-white border border-rose-300 dark:border-rose-800'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    {app.status === 'rejected' ? 'Declined ✕' : 'Decline'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
