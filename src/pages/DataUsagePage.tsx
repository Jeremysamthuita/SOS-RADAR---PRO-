import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPinned, Database, LockKeyhole, PhoneCall } from 'lucide-react';

export const DataUsagePage: React.FC = () => (
  <div className="w-full max-w-3xl mx-auto px-4 py-10">
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Privacy</p>
          <h1 className="text-2xl font-black text-slate-900">How we use your data</h1>
        </div>
      </div>

      <div className="space-y-4 text-sm text-slate-600">
        <p>
          We use your location, phone number, and emergency profile only to connect you with the nearest verified rescue service,
          notify trusted contacts, and keep your dispatch record safe and accessible.
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <MapPinned className="mb-2 h-5 w-5 text-amber-600" />
            <h2 className="font-bold text-slate-900">Location</h2>
            <p className="mt-1 text-xs text-slate-500">GPS and road context help dispatchers reach you quickly.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <Database className="mb-2 h-5 w-5 text-amber-600" />
            <h2 className="font-bold text-slate-900">Emergency data</h2>
            <p className="mt-1 text-xs text-slate-500">We store your profile, vehicle, and service record to support dispatch.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <LockKeyhole className="mb-2 h-5 w-5 text-amber-600" />
            <h2 className="font-bold text-slate-900">Protection</h2>
            <p className="mt-1 text-xs text-slate-500">Your data stays protected, encrypted in transit, and only used for safety support.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-semibold text-slate-800">We do not sell your personal data.</p>
          <p className="mt-1 text-xs text-slate-600">We only use it for emergency coordination, safety alerts, and service delivery.</p>
        </div>

        <ul className="space-y-2 text-xs text-slate-600">
          <li>• Your location is used only when an SOS is triggered or during active rescue dispatch.</li>
          <li>• Emergency contacts are notified only with your consent and the rescue flow.</li>
          <li>• You can review or update your emergency profile in the settings section.</li>
        </ul>

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <PhoneCall className="h-4 w-4 text-amber-600" />
            24/7 support: 999 • 112 • 1199
          </div>
          <Link to="/login" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  </div>
);
