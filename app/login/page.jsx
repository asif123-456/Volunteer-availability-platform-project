'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  AlertCircle,
} from 'lucide-react';

export default function LoginPage() {
  const { login, quickLogin } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleRedirect = (role) => {
    if (role === 'ngo') {
      router.push('/ngo/dashboard');
    } else if (role === 'superadmin') {
      router.push('/admin/panel');
    } else {
      router.push('/volunteer/dashboard');
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
      setError(err.message || 'Login failed. Please check credentials.');
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
      setError(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100 dark:shadow-none transition-colors">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign In
          </h2>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Sign in to manage your availability schedule or NGO volunteer drives
          </p>
        </div>

        {/* 1-Click Demo Login Shortcuts */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-2">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block text-center">
            ⚡ 1-Click Quick Demo Login:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('volunteer')}
              disabled={loading}
              className="px-2 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 hover:bg-emerald-200/80 dark:hover:bg-emerald-900/60 rounded-xl flex flex-col items-center gap-1 transition-all"
            >
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Volunteer</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('ngo')}
              disabled={loading}
              className="px-2 py-2 text-xs font-bold text-teal-800 dark:text-teal-300 bg-teal-100/70 dark:bg-teal-950/60 hover:bg-teal-200/80 dark:hover:bg-teal-900/60 rounded-xl flex flex-col items-center gap-1 transition-all"
            >
              <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>NGO</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('superadmin')}
              disabled={loading}
              className="px-2 py-2 text-xs font-bold text-purple-800 dark:text-purple-300 bg-purple-100/70 dark:bg-purple-950/60 hover:bg-purple-200/80 dark:hover:bg-purple-900/60 rounded-xl flex flex-col items-center gap-1 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="volunteer@gmail.com"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In with JWT'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Need a new account?{' '}
          <Link
            href="/register"
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
          >
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
