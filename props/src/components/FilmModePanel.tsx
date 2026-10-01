// src/components/FilmModePanel.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Film, X, LayoutDashboard, MessageSquare, BookOpen,
  Users, Star, Clock, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function FilmModePanel() {
  const { filmMode, setFilmMode } = useApp();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!filmMode) {
    return (
      <button
        onClick={() => setFilmMode(true)}
        className="fixed bottom-6 right-6 z-50 opacity-20 hover:opacity-80 transition-opacity"
        title="Enable Film Mode"
        style={{
          background: '#1e293b',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          padding: '6px 12px',
          fontSize: 11,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Film size={12} />
        Film Mode
      </button>
    );
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(p => !p)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl shadow-xl text-white text-sm font-semibold px-4 py-3"
        style={{ background: '#1e40af', border: '2px solid #3b82f6' }}
      >
        <Film size={16} />
        {open ? 'Close' : 'Film Mode'}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-20 right-6 z-50 rounded-2xl shadow-2xl overflow-hidden"
          style={{ background: '#0f172a', border: '1px solid #1e40af', width: 240 }}
        >
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-2">
              <Film size={14} color="#60a5fa" />
              <span className="text-sm font-bold text-white">Film Controls</span>
            </div>
            <button onClick={() => { setFilmMode(false); setOpen(false); }}>
              <X size={14} color="#64748b" />
            </button>
          </div>
          <div className="p-3 flex flex-col gap-1">
            {[
              { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={14} /> },
              { label: 'Groupware', path: '/groupware', icon: <MessageSquare size={14} /> },
              { label: 'Training', path: '/training', icon: <BookOpen size={14} /> },
              { label: 'Security Demo', path: '/users', icon: <Users size={14} /> },
              { label: 'Evaluation', path: '/evaluation', icon: <Star size={14} /> },
              { label: 'Session Expired', path: '/session-expired', icon: <Clock size={14} /> },
            ].map(item => (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setOpen(false); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left w-full text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <span style={{ color: '#60a5fa' }}>{item.icon}</span>
                {item.label}
                <ChevronRight size={12} className="ml-auto opacity-40" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
