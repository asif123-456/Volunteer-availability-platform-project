import React from 'react';
import { HeartHandshake, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Volunteer<span className="text-emerald-400">Connect</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Bridging the gap between verified NGO drives and volunteer availability.
              Empowering community service through intelligent time-slot matchmaking.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              For Volunteers
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/volunteer/dashboard" className="hover:text-emerald-400 transition-colors">
                  Find Opportunities
                </Link>
              </li>
              <li>
                <Link to="/volunteer/availability" className="hover:text-emerald-400 transition-colors">
                  Manage Schedule
                </Link>
              </li>
              <li>
                <Link to="/volunteer/applications" className="hover:text-emerald-400 transition-colors">
                  Application Status
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition-colors">
                  Join as Volunteer
                </Link>
              </li>
            </ul>
          </div>

          {/* For NGOs */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              For NGOs
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/ngo/dashboard" className="hover:text-emerald-400 transition-colors">
                  NGO Dashboard
                </Link>
              </li>
              <li>
                <Link to="/ngo/create-opportunity" className="hover:text-emerald-400 transition-colors">
                  Post Requirement
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition-colors">
                  Register Your NGO
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/60 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Super Admin Verified
                </span>
              </li>
            </ul>
          </div>

          {/* Contact / Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Platform Support
            </h4>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>support@volunteerconnect.org</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>New Delhi / Mumbai / Bangalore</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2026 The Volunteer Availability Problem Project. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Built with Node.js, Express, MongoDB, JWT & React.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
