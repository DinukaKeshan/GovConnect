import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Submit Complaints",
    description: "Report issues directly to the relevant government department from anywhere.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Track Progress",
    description: "Monitor the status of your complaints in real time through your dashboard.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Connect with Departments",
    description: "Browse government departments and understand which handles your concern.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Hero */}
      <div className="bg-[#1a3a6b] text-white flex-1 flex flex-col">
        <div className="max-w-screen-xl mx-auto px-6 py-20 flex flex-col items-center text-center flex-1 justify-center">

          {/* Emblem */}
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>

          <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-3">
            Government of Sri Lanka
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4 max-w-2xl leading-tight">
            GovConnect
          </h1>
          <p className="text-blue-200 text-base sm:text-lg max-w-xl leading-relaxed mb-10">
            An integrated platform connecting citizens with government departments.
            Report issues, track resolutions, and help improve public services in your community.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/citizen/login"
              className="bg-white text-[#1a3a6b] text-sm font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/citizen/register"
              className="bg-white/10 border border-white/30 text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Create Account
            </Link>
          </div>

          <p className="mt-5 text-xs text-blue-300">
            Staff member?{" "}
            <Link to="/" className="underline hover:text-white transition-colors">
              Access the staff portal
            </Link>
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6 py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 text-center mb-8">
            How it works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex flex-col items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1a3a6b]/10 flex items-center justify-center text-[#1a3a6b]">
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{f.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-white">
        <p className="text-center text-xs text-gray-400 py-4">
          Government of Sri Lanka &mdash; GovConnect Platform
        </p>
      </div>

    </div>
  );
}