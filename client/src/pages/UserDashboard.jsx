// pages/UserDashboard.jsx
// Only accessible to users with role = "user"

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate('/login');
  };

  // User initials for avatar
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-8 fade-in-up">
          <div className="inline-flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/30">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white">AuthSphere</span>
          </div>
        </div>

        {/* Welcome card */}
        <div className="card mb-6 fade-in-up">
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar */}
            <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20 flex-shrink-0">
              <span className="text-white font-bold text-xl">{initials}</span>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-mono mb-0.5">User Dashboard</p>
              <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
            </div>
          </div>

          {/* Online status */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-sm font-mono">Session active</span>
          </div>

          {/* Info fields */}
          <div className="space-y-4">
            <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
              <p className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-1">Name</p>
              <p className="text-white font-semibold text-lg">{user?.name}</p>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
              <p className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-1">Email</p>
              <p className="text-white font-mono text-sm">{user?.email}</p>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
              <p className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-1">Role</p>
              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-mono">
                User
              </span>
            </div>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full bg-slate-800 hover:bg-red-500/10 hover:border-red-500/30 text-slate-300 hover:text-red-400 font-semibold py-3 px-6 rounded-xl border border-slate-700 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 fade-in-up"
        >
          {loggingOut ? (
            <>
              <span className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
              Signing out...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              Sign Out
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
