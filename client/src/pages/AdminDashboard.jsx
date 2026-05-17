// pages/AdminDashboard.jsx
// Only accessible to users with role = "admin"
// Shows stats + all users table

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// ── Stat Card ──
const StatCard = ({ label, value, icon, colorClass }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
    <div className="flex items-center justify-between mb-4">
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorClass}`}>
        {icon}
      </div>
    </div>
    <p className="text-4xl font-extrabold text-white">{value ?? '—'}</p>
  </div>
);

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [search,     setSearch]     = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  // Fetch dashboard data
  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get('/api/admin/dashboard');
      setData(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate('/login');
  };

  // Filter users by search
  const filteredUsers = data?.users?.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-mono text-sm">Loading dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={fetchData} className="text-amber-400 hover:underline text-sm font-mono">Retry</button>
      </div>
    </div>
  );

  const { stats, users } = data;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      {/* Subtle grid bg */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(251,191,36,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.02) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative max-w-7xl mx-auto">

        {/* ── Top Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">Admin Dashboard</span>
            </div>
            <p className="text-slate-500 text-sm font-mono">
              Welcome, <span className="text-amber-400">{user?.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-xl border border-slate-700 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Refresh
            </button>
            <button onClick={handleLogout} disabled={loggingOut} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm rounded-xl border border-red-500/20 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              {loggingOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Users"   value={stats.totalUsers}    colorClass="bg-blue-500/10 text-blue-400"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>}
          />
          <StatCard label="Logged In"     value={stats.loggedInUsers}  colorClass="bg-emerald-500/10 text-emerald-400"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
          />
          <StatCard label="Logged Out"    value={stats.loggedOutUsers} colorClass="bg-slate-500/10 text-slate-400"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>}
          />
          <StatCard label="Active (24h)"  value={stats.activeUsers}    colorClass="bg-amber-500/10 text-amber-400"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
          />
        </div>

        {/* ── Users Table ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">All Users</h2>
              <p className="text-slate-500 text-sm">{users.length} registered accounts</p>
            </div>
            <input
              type="text"
              placeholder="Search name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field sm:w-72"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-mono text-sm">
                      No users found {search && `matching "${search}"`}
                    </td>
                  </tr>
                ) : filteredUsers.map(u => (
                  <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Name + Avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">{u.name}</p>
                          <p className="text-slate-500 text-xs font-mono md:hidden">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Email */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-slate-300 text-sm font-mono">{u.email}</span>
                    </td>
                    {/* Role badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold font-mono ${
                        u.role === 'admin'
                          ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    {/* Login status */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${u.isLoggedIn ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                        <span className={`text-xs font-semibold ${u.isLoggedIn ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {u.isLoggedIn ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </td>
                    {/* Last login */}
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-slate-500 text-xs font-mono">
                        {u.lastLogin
                          ? new Date(u.lastLogin).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-800 flex justify-between">
            <p className="text-slate-600 text-xs font-mono">Showing {filteredUsers.length} of {users.length}</p>
            <p className="text-slate-600 text-xs font-mono">Auto-refreshes every 30s</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
