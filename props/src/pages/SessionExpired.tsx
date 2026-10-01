// src/pages/SessionExpired.tsx
import React, { useState } from 'react';
import { Building2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SessionExpired() {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(true);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: '#0f172a' }}
    >
      {/* Frozen loading UI */}
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

        {/* Frozen spinner */}
        <div className="flex flex-col items-center gap-4">
          <div
            style={{
              width: 44,
              height: 44,
              border: '3px solid rgba(59,130,246,0.2)',
              borderTop: '3px solid rgba(59,130,246,0.4)',
              borderRadius: '50%',
            }}
          />
          <div className="text-base font-medium" style={{ color: '#475569' }}>
            Authenticating...
          </div>
        </div>

        {/* Frozen progress bar */}
        <div
          style={{
            width: 280,
            height: 2,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 2,
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'rgba(59,130,246,0.3)',
              width: '35%',
              borderRadius: 2,
            }}
          />
        </div>

        {/* SESSION EXPIRED alert */}
        {showAlert && (
          <div
            className="fade-in flex flex-col items-center gap-4 rounded-2xl px-10 py-8"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.3)',
              marginTop: 16,
              maxWidth: 360,
              textAlign: 'center',
            }}
          >
            <AlertCircle size={36} color="#f87171" />
            <div>
              <div className="text-xl font-bold text-white mb-1">SESSION EXPIRED</div>
              <div className="text-sm" style={{ color: '#94a3b8' }}>
                Your session has ended due to inactivity. Please sign in again to continue.
              </div>
            </div>
            <button
              className="btn-primary px-8 py-3 rounded-xl text-sm font-semibold"
              style={{ background: '#3b82f6', marginTop: 8 }}
              onClick={() => navigate('/login')}
            >
              Return to Login
            </button>
          </div>
        )}
      </div>

      {/* Timestamp */}
      <div className="absolute bottom-8 text-xs" style={{ color: '#334155' }}>
        Session terminated — Oct 1, 2026 · 08:12:34 AM
      </div>
    </div>
  );
}
