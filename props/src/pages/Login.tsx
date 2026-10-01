// src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';

const LOADING_STEPS = [
  'Authenticating...',
  'Loading workspace...',
  'Preparing your dashboard...',
];

export default function Login() {
  const { login, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [error, setError] = useState('');
  const [forgotShown, setForgotShown] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setLoadStep(0);

    // Animate through loading steps
    await new Promise(r => setTimeout(r, 800));
    setLoadStep(1);
    await new Promise(r => setTimeout(r, 800));
    setLoadStep(2);
    await new Promise(r => setTimeout(r, 700));

    const success = await login(username, password);
    if (success) {
      await new Promise(r => setTimeout(r, 300));
      navigate('/dashboard', { replace: true });
    } else {
      setLoading(false);
      setError('Invalid username or password. Please try again.');
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: '#0f172a' }}
      >
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{ width: 56, height: 56, background: '#3b82f6' }}
            >
              <Building2 size={32} color="white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white tracking-wide">LSOIS</div>
              <div className="text-sm" style={{ color: '#64748b' }}>Local Store Operations Information System</div>
            </div>
          </div>

          {/* Spinner */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="spin"
              style={{
                width: 44,
                height: 44,
                border: '3px solid rgba(59,130,246,0.2)',
                borderTop: '3px solid #3b82f6',
                borderRadius: '50%',
              }}
            />
            <div className="text-base font-medium" style={{ color: '#94a3b8' }}>
              {LOADING_STEPS[loadStep]}
            </div>
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: 280,
              height: 2,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: '#3b82f6',
                width: `${((loadStep + 1) / 3) * 100}%`,
                transition: 'width 600ms ease',
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: '#0f172a' }}
    >
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-12"
        style={{
          width: '45%',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 44, height: 44, background: '#3b82f6' }}
          >
            <Building2 size={26} color="white" />
          </div>
          <div>
            <div className="text-xl font-bold text-white tracking-wide">LSOIS</div>
            <div className="text-xs" style={{ color: '#64748b' }}>Local Store Operations Information System</div>
          </div>
        </div>

        <div>
          <blockquote className="text-2xl font-light text-white leading-relaxed mb-6">
            "One system.<br />One workflow.<br />Better operations."
          </blockquote>
          <div className="flex flex-col gap-4">
            {[
              { label: 'Centralized Transactions', desc: 'All sales in one place' },
              { label: 'Live Inventory Tracking', desc: 'Real-time stock visibility' },
              { label: 'Team Collaboration', desc: 'Official operations channel' },
              { label: 'Data-Driven Reports', desc: 'Insights for better decisions' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }} />
                <div>
                  <div className="text-sm font-semibold text-white">{item.label}</div>
                  <div className="text-xs" style={{ color: '#64748b' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs" style={{ color: '#334155' }}>
          © 2026 LSOIS — Local Store Operations Information System
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: 44, height: 44, background: '#3b82f6' }}
            >
              <Building2 size={26} color="white" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">LSOIS</div>
              <div className="text-xs" style={{ color: '#64748b' }}>Local Store Operations Information System</div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
          <p className="text-sm mb-8" style={{ color: '#64748b' }}>
            Enter your credentials to access your workspace.
          </p>

          {/* Error */}
          {error && (
            <div
              className="mb-6 rounded-xl px-4 py-3 text-sm font-medium"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8' }}>
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="Enter your username"
                className="w-full rounded-xl px-4 py-3.5 text-white text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'border-color 150ms ease',
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl px-4 py-3.5 text-white text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#64748b' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="rounded"
                  style={{ accentColor: '#3b82f6', width: 16, height: 16 }}
                />
                <span className="text-sm" style={{ color: '#94a3b8' }}>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setForgotShown(true)}
                className="text-sm font-medium"
                style={{ color: '#60a5fa' }}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="signin-btn"
              className="btn-primary w-full py-4 text-base rounded-xl font-semibold mt-2"
              style={{ background: '#3b82f6', fontSize: 16 }}
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs text-center" style={{ color: '#334155' }}>
              Unauthorized access to this system is strictly prohibited.<br />
              All activity is monitored and logged.
            </p>
          </div>
        </div>
      </div>

      {/* Forgot password modal */}
      {forgotShown && (
        <div className="modal-overlay" onClick={() => setForgotShown(false)}>
          <div
            className="modal-panel p-8"
            style={{ maxWidth: 400 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">Password Reset</h2>
            <p className="text-sm text-gray-500 mb-6">
              Password reset requests must be submitted to your system administrator. Contact your IT department or manager.
            </p>
            <div className="rounded-xl p-4 mb-6" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
              <p className="text-sm font-medium text-blue-800">System Admin Contact</p>
              <p className="text-sm text-blue-700 mt-1">Ricardo Palma — r.palma@lsois.local</p>
              <p className="text-sm text-blue-700">Internal Ext. 204</p>
            </div>
            <button className="btn-primary w-full" onClick={() => setForgotShown(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
