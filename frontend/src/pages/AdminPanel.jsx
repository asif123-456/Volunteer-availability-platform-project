import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  ShieldCheck,
  Building2,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Trash2,
  AlertTriangle,
  Globe,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('ngos'); // 'ngos' | 'opportunities' | 'users' | 'reports'

  const [ngos, setNgos] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [ngosRes, oppsRes, usersRes, reportsRes] = await Promise.all([
        api.get('/admin/ngos'),
        api.get('/admin/opportunities'),
        api.get('/admin/users'),
        api.get('/admin/reports'),
      ]);

      if (ngosRes.data.success) setNgos(ngosRes.data.data);
      if (oppsRes.data.success) setOpportunities(oppsRes.data.data);
      if (usersRes.data.success) setUsers(usersRes.data.data);
      if (reportsRes.data.success) setReports(reportsRes.data.data);
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
      const res = await api.put(`/admin/ngos/${ngoId}/verify`, {
        status,
        note: status === 'verified' ? 'Approved by Super Admin' : 'Documentation incomplete',
      });
      if (res.data.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating NGO verification');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteOpportunity = async (oppId) => {
    if (!window.confirm('Are you sure you want to remove this opportunity?')) return;
    try {
      const res = await api.delete(`/admin/opportunities/${oppId}`);
      if (res.data.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove opportunity');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> System Super Admin Governance
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Platform Administration Console
          </h1>
          <p className="mt-1 text-slate-400 text-sm max-w-xl">
            Verify NGO legal credentials, remove counterfeit or fake opportunities, and monitor platform metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-300 text-xs font-bold border border-purple-800">
            {reports?.pendingNgos || 0} NGOs Awaiting Verification
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('ngos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'ngos'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
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
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Opportunity Moderation ({opportunities.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          User Management ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Analytics & Impact
        </button>
      </div>

      {/* TAB 1: NGO Verification */}
      {activeTab === 'ngos' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Registered NGOs Directory</h2>
            <span className="text-xs text-slate-500">
              Review organization registration numbers & grant verified status
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ngos.map((ngo) => (
              <div
                key={ngo._id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-700 uppercase">
                      {ngo.cause}
                    </span>
                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        ngo.verificationStatus === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ngo.verificationStatus === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ngo.verificationStatus.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{ngo.organizationName}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {ngo.description || 'No description provided.'}
                  </p>

                  <div className="mt-4 p-3 rounded-2xl bg-slate-50 text-xs text-slate-700 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Reg / 12A / 80G No:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {ngo.registrationNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Contact Email:</span>
                      <span className="font-medium">{ngo.user?.email}</span>
                    </div>
                    {ngo.website && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Website:</span>
                        <a
                          href={ngo.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-600 hover:underline"
                        >
                          {ngo.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  {ngo.verificationStatus !== 'verified' && (
                    <button
                      onClick={() => handleVerifyNgo(ngo._id, 'verified')}
                      disabled={actionLoading === ngo._id}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve & Verify NGO
                    </button>
                  )}

                  {ngo.verificationStatus !== 'rejected' && (
                    <button
                      onClick={() => handleVerifyNgo(ngo._id, 'rejected')}
                      disabled={actionLoading === ngo._id}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-all flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Credentials
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Opportunities Moderation */}
      {activeTab === 'opportunities' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Moderation Queue</h2>
            <span className="text-xs text-slate-500">
              Audit posted drives and remove suspicious listings
            </span>
          </div>

          <div className="space-y-3">
            {opportunities.map((opp) => (
              <div
                key={opp._id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {opp.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      by {opp.ngoProfile?.organizationName || opp.ngo?.name}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{opp.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                    <span>
                      {opp.dayOfWeek},{' '}
                      {new Date(opp.eventDate).toLocaleDateString()}
                    </span>
                    <span>
                      {opp.startTime} - {opp.endTime}
                    </span>
                    <span>{opp.location}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteOpportunity(opp._id)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove Drive
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Users Directory */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">All Registered Accounts</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3 px-4">{u.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          u.role === 'superadmin'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'ngo'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">{u.city || '—'}</td>
                    <td className="py-3 px-4">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Reports & Analytics */}
      {activeTab === 'reports' && reports && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Total Volunteers
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">
                {reports.totalVolunteers}
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
              <span className="text-xs font-bold text-purple-600 uppercase">
                Verified NGOs
              </span>
              <div className="text-3xl font-extrabold text-purple-700 mt-1">
                {reports.verifiedNgos}
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
              <span className="text-xs font-bold text-emerald-600 uppercase">
                Total Opportunities
              </span>
              <div className="text-3xl font-extrabold text-emerald-700 mt-1">
                {reports.totalOpportunities}
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
              <span className="text-xs font-bold text-teal-600 uppercase">
                Confirmed Matches
              </span>
              <div className="text-3xl font-extrabold text-teal-700 mt-1">
                {reports.acceptedApplications}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
