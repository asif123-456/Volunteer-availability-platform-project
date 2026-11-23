import React from 'react';
import Link from 'next/link';
import { HeartHandshake, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400 border-t border-slate-800 dark:border-slate-800/80 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Volunteer<span className="text-emerald-400">Connect</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bridging the gap between verified NGO drives and volunteer availability.
              Engineered with Next.js App Router, Route Handlers & Server Actions.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              For Volunteers
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/volunteer/dashboard" className="hover:text-emerald-400">
                  Find Opportunities
                </Link>
              </li>
              <li>
                <Link href="/volunteer/availability" className="hover:text-emerald-400">
                  Manage Availability
                </Link>
              </li>
              <li>
                <Link href="/volunteer/applications" className="hover:text-emerald-400">
                  Application Tracker
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              For NGOs
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/ngo/dashboard" className="hover:text-emerald-400">
                  NGO Dashboard
                </Link>
              </li>
              <li>
                <Link href="/ngo/create-opportunity" className="hover:text-emerald-400">
                  Post Opportunity
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950 px-2 py-1 rounded-full border border-emerald-800 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Super Admin Verified
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Syllabus Implementation
            </h4>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• App Router (`app/`)</li>
              <li>• Route Handlers (`app/api/`)</li>
              <li>• Server-Side Rendering (SSR)</li>
              <li>• Client Components (`'use client'`)</li>
              <li>• Server Actions (`'use server'`)</li>
              <li>• MongoDB & Mongoose Integration</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © 2026 The Volunteer Availability Problem (NGO) Platform. Built with Next.js & MongoDB.
        </div>
      </div>
    </footer>
  );
}
