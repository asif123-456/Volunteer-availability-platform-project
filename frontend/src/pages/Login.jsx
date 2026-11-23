import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  AlertCircle,
} from 'lucide-react';

const Login = () => {
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleRedirect = (role) => {
    if (role === 'ngo') {
      navigate('/ngo/dashboard');
    } else if (role === 'superadmin') {
      navigate('/admin/panel');
    } else {
      navigate('/volunteer/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      handleRoleRedirect(loggedUser.role);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setError('');
    setLoading(true);
    try {
      const loggedUser = await quickLogin(role);
      handleRoleRedirect(loggedUser.role);
    } catch (err) {
      setError(err.response?.data?.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100">
        <div>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to manage your availability or NGO drives
            </p>
          </div>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
            ⚡ Quick Demo 1-Click Login:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('volunteer')}
              disabled={loading}
              className="px-2.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200/80 rounded-xl flex flex-col items-center gap-1 transition-all"
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Volunteer</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('ngo')}
              disabled={loading}
              className="px-2.5 py-2 text-xs font-bold text-teal-800 bg-teal-100/70 hover:bg-teal-200/80 rounded-xl flex flex-col items-center gap-1 transition-all"
            >
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>NGO</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('superadmin')}
              disabled={loading}
              className="px-2.5 py-2 text-xs font-bold text-purple-800 bg-purple-100/70 hover:bg-purple-200/80 rounded-xl flex flex-col items-center gap-1 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          Don't have an account yet?{' '}
          <Link
            to="/register"
            className="font-bold text-emerald-600 hover:text-emerald-700"
          >
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
