import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  FileCheck2,
  Clock,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Building2,
  ArrowRight,
} from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await api.get('/volunteer/my-applications');
        if (res.data.success) {
          setApplications(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 block mb-1">
          Status Tracker
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          My Volunteer Applications
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Track the live acceptance status of the NGO opportunities you applied to.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500">Loading your applications...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
          {error}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            You haven't applied to any drives yet
          </h3>
          <p className="text-xs text-slate-500">
            Browse verified opportunities that match your free hours and apply with 1 click.
          </p>
          <Link
            to="/volunteer/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all"
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
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {opp.category}
                      </span>
                      {app.availabilityMatch && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          100% Time Match Verified
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{opp.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">
                        {opp.ngoProfile?.organizationName || opp.ngo?.name}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {app.status === 'accepted' ? (
                      <div className="px-4 py-2 rounded-2xl bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs font-extrabold flex items-center gap-2 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <div>
                          <div>ACCEPTED (CONFIRMED)</div>
                          <div className="text-[10px] font-semibold text-emerald-700">
                            See you at the venue!
                          </div>
                        </div>
                      </div>
                    ) : app.status === 'rejected' ? (
                      <div className="px-4 py-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <div>
                          <div>DECLINED</div>
                          <div className="text-[10px] text-rose-600">
                            {app.ngoRemarks || 'Slots filled or criteria not met'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <div>
                          <div>UNDER REVIEW</div>
                          <div className="text-[10px] text-amber-700">
                            NGO reviewing candidate availability
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Schedule Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="font-semibold text-slate-800">
                        {opp.dayOfWeek},{' '}
                        {new Date(opp.eventDate).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-slate-400">Event Date</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="font-semibold text-slate-800">
                        {opp.startTime} - {opp.endTime}
                      </div>
                      <div className="text-[10px] text-slate-400">Time Window</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="font-semibold text-slate-800">{opp.location}</div>
                      <div className="text-[10px] text-slate-400">Venue</div>
                    </div>
                  </div>
                </div>

                {/* Volunteer's submitted message & response */}
                {app.volunteerMessage && (
                  <div className="mt-3 text-xs text-slate-600">
                    <span className="font-bold text-slate-700">Your Note: </span>
                    <span className="italic">"{app.volunteerMessage}"</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
