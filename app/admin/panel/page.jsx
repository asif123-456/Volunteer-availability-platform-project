'use client';

import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  Trash2,
  Sparkles,
  Users,
  Clock,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';

export default function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState('applications'); // Default to Applications so user sees it right away!
  const [ngos, setNgos] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [ngosRes, oppsRes, appsRes, reportsRes] = await Promise.all([
        fetch('/api/admin/ngos'),
        fetch('/api/opportunities'),
        fetch('/api/applications'),
        fetch('/api/admin/reports'),
      ]);

      const ngosData = await ngosRes.json();
      const oppsData = await oppsRes.json();
      const appsData = await appsRes.json();
      const reportsData = await reportsRes.json();

      if (ngosData.success) setNgos(ngosData.data);
      if (oppsData.success) setOpportunities(oppsData.data);
      if (appsData.success) setApplications(appsData.data || []);
      if (reportsData.success) setReports(reportsData.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyNgo = async (ngoId, status) => {
    setActionLoading(ngoId);
    try {
      const res = await fetch(`/api/admin/ngos/${ngoId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          note: status === 'verified' ? 'Approved by Super Admin' : 'Details incomplete',
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      } else {
        alert(data.message || 'Error updating NGO');
      }
    } catch (err) {
      alert('Error updating NGO verification');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateApplicationStatus = async (appId, newStatus) => {
    setActionLoading(appId);
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          remarks:
            newStatus === 'accepted'
              ? 'Confirmed for the drive by organizer!'
              : 'Declined.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      } else {
        alert(data.message || 'Error updating application status');
      }
    } catch (err) {
      alert('Error updating application status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteOpportunity = async (oppId) => {
    if (!window.confirm('Delete this opportunity?')) return;
    try {
      const res = await fetch(`/api/opportunities/${oppId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to remove opportunity');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Super Admin Verification Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Platform Administration Console
          </h1>
          <p className="mt-1 text-slate-400 text-xs max-w-xl">
            Verify NGO legal credentials, review volunteer applicants, and moderate community drives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-300 text-xs font-bold border border-purple-800">
            {applications.filter((a) => a.status === 'pending').length} Applications Pending
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'applications'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Volunteer Applications ({applications.length})
        </button>

        <button
          onClick={() => setActiveTab('ngos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'ngos'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          NGO Verification Queue ({ngos.filter((n) => n.verificationStatus === 'pending').length})
        </button>

        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'opportunities'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Opportunity Moderation ({opportunities.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Analytics & Impact
        </button>
      </div>

      {/* TAB 1: Volunteer Applications */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              All Volunteer Applications ({applications.length})
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Choose to Accept or Decline candidates for community drives
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-2 transition-colors">
              <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No applications found</h3>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {app.volunteer?.name || 'Volunteer'}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400">applied to</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        "{app.opportunity?.title}"
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          app.status === 'accepted'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : app.status === 'rejected'
                            ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                            : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse'
                        }`}
                      >
                        {app.status === 'pending'
                          ? '⏳ PENDING REVIEW'
                          : app.status === 'accepted'
                          ? '✓ ACCEPTED'
                          : '✕ DECLINED'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        Host NGO: {app.opportunity?.ngoProfile?.organizationName || app.opportunity?.ngo?.name || 'NGO'}
                      </span>
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
                        <span className="font-semibold text-slate-700 dark:text-slate-200">Note: </span>
                        "{app.volunteerMessage}"
                      </div>
                    )}
                  </div>

                  {/* Accept / Decline Action Controls */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => handleUpdateApplicationStatus(app._id, 'accepted')}
                      disabled={actionLoading === app._id}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                        app.status === 'accepted'
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-500'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white border border-emerald-300 dark:border-emerald-800'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {app.status === 'accepted' ? 'Accepted ✓' : 'Accept'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateApplicationStatus(app._id, 'rejected')}
                      disabled={actionLoading === app._id}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                        app.status === 'rejected'
                          ? 'bg-rose-600 text-white ring-2 ring-rose-500'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-600 dark:hover:bg-rose-600 hover:text-white border border-rose-300 dark:border-rose-800'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      {app.status === 'rejected' ? 'Declined ✕' : 'Decline'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: NGO Queue */}
      {activeTab === 'ngos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ngos.map((ngo) => (
              <div
                key={ngo._id}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase">
                      {ngo.cause}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        ngo.verificationStatus === 'verified'
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : ngo.verificationStatus === 'rejected'
                          ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                          : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      }`}
                    >
                      {ngo.verificationStatus.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{ngo.organizationName}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {ngo.description || 'No description provided.'}
                  </p>

                  <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 space-y-1 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400 dark:text-slate-500">Reg / 12A / 80G No:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {ngo.registrationNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 dark:text-slate-500">Contact:</span>
                      <span>{ngo.user?.email}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  {ngo.verificationStatus !== 'verified' && (
                    <button
                      onClick={() => handleVerifyNgo(ngo._id, 'verified')}
                      disabled={actionLoading === ngo._id}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Verify NGO
                    </button>
                  )}

                  {ngo.verificationStatus !== 'rejected' && (
                    <button
                      onClick={() => handleVerifyNgo(ngo._id, 'rejected')}
                      disabled={actionLoading === ngo._id}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 flex items-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Opportunities */}
      {activeTab === 'opportunities' && (
        <div className="space-y-3">
          {opportunities.map((opp) => (
            <div
              key={opp._id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {opp.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">{opp.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>{opp.dayOfWeek}, {new Date(opp.eventDate).toLocaleDateString()}</span>
                  <span>{opp.startTime} - {opp.endTime}</span>
                  <span>{opp.location}</span>
                </div>
              </div>

              <button
                onClick={() => handleDeleteOpportunity(opp._id)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove Drive
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: Reports */}
      {activeTab === 'reports' && reports && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center transition-colors">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Volunteers</span>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{reports.totalVolunteers}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center transition-colors">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Verified NGOs</span>
            <div className="text-3xl font-extrabold text-purple-700 dark:text-purple-400 mt-1">{reports.verifiedNgos}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center transition-colors">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Opportunities</span>
            <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">{reports.totalOpportunities}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center transition-colors">
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase">Accepted Volunteers</span>
            <div className="text-3xl font-extrabold text-teal-700 dark:text-teal-400 mt-1">{reports.acceptedApplications}</div>
          </div>
        </div>
      )}
    </div>
  );
}
