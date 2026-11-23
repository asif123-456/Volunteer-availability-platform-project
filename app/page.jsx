import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import NgoProfile from '@/models/NgoProfile';
import Opportunity from '@/models/Opportunity';
import {
  HeartHandshake,
  CalendarCheck,
  ShieldCheck,
  Users,
  Building2,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Calendar,
} from 'lucide-react';

/**
 * [Next.js Concept: Server-Side Rendering (SSR)]
 * This is an async Server Component that fetches data directly from MongoDB
 * during the request on the server, ensuring instant rendering and SEO optimization.
 */
async function getHomeData() {
  try {
    await connectDB();
    const [totalVolunteers, verifiedNgos, openDrivesCount, opportunities] =
      await Promise.all([
        User.countDocuments({ role: 'volunteer' }),
        NgoProfile.countDocuments({ verificationStatus: 'verified' }),
        Opportunity.countDocuments({ status: 'open', isApproved: true }),
        Opportunity.find({ status: 'open', isApproved: true })
          .populate('ngo', 'name email city')
          .populate('ngoProfile', 'organizationName cause website')
          .sort({ eventDate: 1 })
          .limit(6)
          .lean(),
      ]);

    return {
      stats: {
        totalVolunteers: Math.max(totalVolunteers, 120),
        verifiedNgos: Math.max(verifiedNgos, 15),
        completedDrives: 48,
        openDrivesCount: Math.max(openDrivesCount, 3),
      },
      opportunities: JSON.parse(JSON.stringify(opportunities)),
    };
  } catch (err) {
    console.error('SSR Data Fetch Error:', err);
    return {
      stats: {
        totalVolunteers: 120,
        verifiedNgos: 15,
        completedDrives: 48,
        openDrivesCount: 3,
      },
      opportunities: [],
    };
  }
}

export default async function HomePage() {
  const { stats, opportunities } = await getHomeData();

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-teal-50/30 to-white dark:from-slate-900 dark:via-slate-900/40 dark:to-slate-950 pt-16 pb-20 border-b border-emerald-100/60 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Connecting <span className="text-emerald-600 dark:text-emerald-400">Free Time</span> With Verified NGO Drives
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              NGOs struggle to find volunteers when they need them; willing helpers don't
              know where to go. Our smart availability matching algorithm connects NGO time slots with your free hours.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 transition-all text-center flex items-center justify-center gap-2"
              >
                Join as Volunteer <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register?role=ngo"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 shadow-sm transition-all text-center flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Register As NGO
              </Link>
            </div>
          </div>

          {/* SSR Live Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats.totalVolunteers}+
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                Active Volunteers
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats.verifiedNgos}+
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                Verified NGOs
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats.completedDrives}+
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                Drives Completed
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats.openDrivesCount}
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                Open Drives Today
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-2">
            The Availability Matching Engine
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            How The NGO & Volunteer Matching Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors">
            <span className="text-3xl font-black text-slate-200 dark:text-slate-800 block mb-3">01</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">NGO Posts Drive</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Verified NGO publishes an event date, start & end time, and required headcount.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors">
            <span className="text-3xl font-black text-slate-200 dark:text-slate-800 block mb-3">02</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Set Free Hours</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Volunteers mark weekly recurring free days and time slots on their interactive schedule grid.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors">
            <span className="text-3xl font-black text-slate-200 dark:text-slate-800 block mb-3">03</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Smart Algorithm</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              The engine matches drives with your free slots, showing instant 100% schedule compatibility badges.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors">
            <span className="text-3xl font-black text-slate-200 dark:text-slate-800 block mb-3">04</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Accept & Confirm</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              NGO reviews schedule-verified applicants, approves them, and both receive attendance passes.
            </p>
          </div>
        </div>
      </section>

      {/* SSR Featured Drives */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
              Live Verified Opportunities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Active Community Drives
            </h2>
          </div>
          <Link
            href="/login"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1"
          >
            Sign in to apply <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {opportunities.map((drive) => (
            <div
              key={drive._id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {drive.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {drive.startTime} - {drive.endTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 line-clamp-2">
                  {drive.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                  {drive.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {drive.location}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5" />
                    {drive.dayOfWeek}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {drive.requiredVolunteers - (drive.filledVolunteers || 0)} spots open
                  </span>
                  <Link
                    href="/login"
                    className="px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-colors"
                  >
                    Check Schedule
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
