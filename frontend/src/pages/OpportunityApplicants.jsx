import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
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
  AlertCircle,
} from 'lucide-react';

const OpportunityApplicants = () => {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/ngo/opportunities/${id}/applicants`);
      if (res.data.success) {
        setOpportunity(res.data.opportunity);
        setApplicants(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const handleUpdateStatus = async (appId, newStatus) => {
    setActionLoadingId(appId);
    try {
      const res = await api.put(`/ngo/applications/${appId}/status`, {
        status: newStatus,
        remarks:
          newStatus === 'accepted'
            ? 'Confirmed for Sunday cleanliness drive! Please arrive 15 minutes before start time.'
            : 'Slots currently full.',
      });
      if (res.data.success) {
        fetchApplicants();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating application status');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link
        to="/ngo/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to NGO Dashboard
      </Link>

      {/* Opportunity Summary Card */}
      {opportunity && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-600 block mb-1">
              Reviewing Applicants for Drive
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">{opportunity.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {opportunity.dayOfWeek},{' '}
                {new Date(opportunity.eventDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {opportunity.startTime} - {opportunity.endTime}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5" />
                {opportunity.location}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center min-w-[160px]">
            <span className="text-xs text-slate-500 font-semibold block">Slots Confirmed</span>
            <div className="text-2xl font-black text-emerald-700">
              {opportunity.filledVolunteers} / {opportunity.requiredVolunteers}
            </div>
          </div>
        </div>
      )}

      {/* Applicants List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Registered Applicants ({applicants.length})
          </h2>
          <span className="text-xs text-slate-500">
            Candidates sorted by schedule compatibility
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Loading applicants...</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 text-xs font-bold">
            {error}
          </div>
        ) : applicants.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              No volunteers have applied yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Volunteers whose schedule matches this drive time will see it highlighted on their feed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applicants.map((app) => (
              <div
                key={app._id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-5 hover:border-slate-300 transition-all"
              >
                {/* Volunteer Information */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {app.volunteer?.name}
                    </h3>
                    {app.availabilityMatch ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        100% Time Slot Available
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Standard Applicant
                      </span>
                    )}

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        app.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {app.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Contact details */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
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
                    {app.volunteer?.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {app.volunteer?.city}
                      </span>
                    )}
                  </div>

                  {app.volunteerMessage && (
                    <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600">
                      <span className="font-semibold text-slate-700">Message: </span>
                      "{app.volunteerMessage}"
                    </div>
                  )}
                </div>

                {/* Accept / Reject Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleUpdateStatus(app._id, 'accepted')}
                    disabled={actionLoadingId === app._id || app.status === 'accepted'}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {app.status === 'accepted' ? 'Accepted' : 'Accept Volunteer'}
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(app._id, 'rejected')}
                    disabled={actionLoadingId === app._id || app.status === 'rejected'}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-all flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityApplicants;
