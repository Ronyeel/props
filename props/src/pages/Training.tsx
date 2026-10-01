// src/pages/Training.tsx
import React, { useState } from 'react';
import {
  BookOpen, CheckCircle2, Circle, ChevronRight, Clock,
  Lock, Play, Download, X, ChevronLeft
} from 'lucide-react';
import { MOCK_TRAINING_MODULES } from '../data/mockData';
import { TrainingModule } from '../types';
import { useApp } from '../context/AppContext';

const MANUAL_SECTIONS = [
  {
    title: '1. System Overview',
    content: [
      'LSOIS (Local Store Operations Information System) is the centralized platform for all store operations.',
      'The system covers: Transactions, Inventory, Groupware, Reports, and Administration.',
      'All employees are required to use LSOIS for their assigned functions.',
    ],
  },
  {
    title: '2. Access and Authentication',
    content: [
      'Each user is assigned a unique username and password. Credentials must not be shared.',
      'Passwords must be changed every 90 days.',
      'Three consecutive failed login attempts will lock the account.',
    ],
  },
  {
    title: '3. Transaction Processing',
    content: [
      'All sales must be recorded in LSOIS Transactions. Paper-based logs are no longer accepted.',
      'Payment methods: Cash, GCash, or Credit/Debit Card.',
      'Voids require a reason code and supervisor acknowledgment.',
    ],
  },
  {
    title: '4. Inventory Procedures',
    content: [
      'Receive deliveries using the Stock In function. Always verify against the delivery receipt.',
      'Report discrepancies immediately using the Adjustment function.',
      'Weekly physical count must be submitted every Friday at end of shift.',
    ],
  },
  {
    title: '5. Reporting',
    content: [
      'Reports are generated from the Reports module and reflect real-time data.',
      'Only managers and above may export full reports.',
      'Exported data must be handled in accordance with the company data policy.',
    ],
  },
  {
    title: '6. Security and Access Control',
    content: [
      'Your account is assigned a role that determines what you can access.',
      'Report any access that seems incorrect to your supervisor immediately.',
      'Never attempt to access functions outside your assigned role.',
      'The Least Privilege principle is applied: you receive only the access needed for your job.',
    ],
  },
];

export default function Training() {
  const { addToast } = useApp();
  const [modules, setModules] = useState(MOCK_TRAINING_MODULES);
  const [activeModule, setActiveModule] = useState<TrainingModule | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  const completed = modules.filter(m => m.status === 'completed').length;
  const total = modules.length;
  const pct = Math.round((completed / total) * 100);

  const handleStartModule = (mod: TrainingModule) => {
    if (mod.status === 'locked') {
      addToast('Complete previous modules first.', 'warning');
      return;
    }
    setActiveModule(mod);
  };

  const handleMarkComplete = (modId: string) => {
    setModules(prev => prev.map((m, i, arr) => {
      if (m.id === modId && m.status !== 'completed') {
        // unlock next module
        const next = arr[arr.indexOf(m) + 1];
        const updated = { ...m, status: 'completed' as const };
        if (next && next.status === 'locked') {
          arr[arr.indexOf(m) + 1] = { ...next, status: 'in-progress' as const };
        }
        return updated;
      }
      return m;
    }));
    setActiveModule(null);
    addToast('Module completed! Keep up the great work.', 'success');
  };

  const statusIcon = (status: TrainingModule['status']) => {
    if (status === 'completed') return <CheckCircle2 size={20} className="text-green-500" />;
    if (status === 'in-progress') return <ChevronRight size={20} className="text-blue-500" />;
    return <Lock size={20} className="text-gray-300" />;
  };

  const statusLabel = (status: TrainingModule['status']) => {
    if (status === 'completed') return <span className="badge-success">Completed</span>;
    if (status === 'in-progress') return <span className="badge-info">In Progress</span>;
    return <span className="badge-gray">Locked</span>;
  };

  return (
    <div className="p-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training & User Manual</h1>
          <div className="text-sm text-gray-500 mt-1">
            Complete all modules to become a certified LSOIS user.
          </div>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => setShowManual(true)}
        >
          <BookOpen size={16} />
          View User Manual
        </button>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left — Module list */}
        <div className="col-span-2">
          {/* Progress */}
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-bold text-gray-900">Training Completion</div>
                <div className="text-sm text-gray-500 mt-0.5">{completed} of {total} modules completed</div>
              </div>
              <div className="text-3xl font-bold text-blue-600">{pct}%</div>
            </div>
            <div style={{ height: 10, background: '#e2e8f0', borderRadius: 99 }}>
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: '#3b82f6',
                  borderRadius: 99,
                  transition: 'width 600ms ease',
                }}
              />
            </div>
          </div>

          {/* Modules */}
          <div className="flex flex-col gap-3">
            {modules.map(mod => (
              <div
                key={mod.id}
                className={`card p-5 flex items-center gap-4 ${mod.status !== 'locked' ? 'cursor-pointer hover:shadow-md' : 'opacity-60'}`}
                style={{ transition: 'box-shadow 200ms ease' }}
                onClick={() => handleStartModule(mod)}
              >
                <div className="flex-shrink-0">
                  {statusIcon(mod.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">{mod.title}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{mod.description}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock size={12} />
                    {mod.duration}
                  </div>
                  {statusLabel(mod.status)}
                  {mod.status !== 'locked' && (
                    <button
                      className="flex items-center justify-center rounded-xl p-2"
                      style={{ background: mod.status === 'completed' ? '#dcfce7' : '#dbeafe' }}
                    >
                      {mod.status === 'completed' ? (
                        <CheckCircle2 size={16} className="text-green-600" />
                      ) : (
                        <Play size={16} className="text-blue-600" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Info panel */}
        <div className="flex flex-col gap-5">
          <div className="card p-6">
            <div className="font-bold text-gray-900 mb-1">User Manual</div>
            <div className="text-sm text-gray-500 mb-4">
              The official LSOIS Operations Manual for all store personnel.
            </div>
            <div className="flex flex-col gap-2">
              <button
                className="btn-primary w-full flex items-center justify-center gap-2"
                onClick={() => setShowManual(true)}
              >
                <BookOpen size={16} />
                View Manual
              </button>
              <button
                className="btn-secondary w-full flex items-center justify-center gap-2"
                onClick={() => addToast('User Manual downloaded successfully.', 'success')}
              >
                <Download size={16} />
                Download Guide
              </button>
            </div>
          </div>

          <div className="card p-6">
            <div className="font-bold text-gray-900 mb-4">Training Progress</div>
            <div className="flex flex-col gap-3">
              {modules.map(mod => (
                <div key={mod.id} className="flex items-center gap-2.5">
                  {mod.status === 'completed' ? (
                    <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />
                  ) : mod.status === 'in-progress' ? (
                    <ChevronRight size={15} className="text-blue-500 flex-shrink-0" />
                  ) : (
                    <Circle size={15} className="text-gray-300 flex-shrink-0" />
                  )}
                  <span
                    className="text-sm"
                    style={{
                      color: mod.status === 'completed' ? '#374151' :
                        mod.status === 'in-progress' ? '#2563eb' : '#9ca3af',
                      fontWeight: mod.status === 'in-progress' ? 600 : 400,
                    }}
                  >
                    {mod.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <div className="font-bold text-blue-900 mb-2">Need Help?</div>
            <div className="text-sm text-blue-700 mb-3">
              Contact your supervisor or the system administrator for training support.
            </div>
            <div className="text-sm text-blue-800 font-medium">IT Support</div>
            <div className="text-sm text-blue-600">r.palma@lsois.local · Ext. 204</div>
          </div>
        </div>
      </div>

      {/* Module detail modal */}
      {activeModule && (
        <div className="modal-overlay" onClick={() => setActiveModule(null)}>
          <div className="modal-panel" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div
              className="flex items-center justify-between px-8 py-5"
              style={{ borderBottom: '1px solid #f1f5f9' }}
            >
              <div>
                <div className="text-xl font-bold text-gray-900">{activeModule.title}</div>
                <div className="text-sm text-gray-500 mt-0.5">{activeModule.description}</div>
              </div>
              <button onClick={() => setActiveModule(null)} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <div className="px-8 py-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Clock size={14} />
                  {activeModule.duration}
                </div>
                {statusLabel(activeModule.status)}
              </div>
              <div className="flex flex-col gap-4">
                {activeModule.content.map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="flex items-center justify-center rounded-full text-white text-xs font-bold flex-shrink-0"
                      style={{ width: 24, height: 24, background: '#3b82f6', marginTop: 1 }}
                    >
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 px-8 py-5" style={{ borderTop: '1px solid #f1f5f9' }}>
              <button className="btn-secondary flex-1" onClick={() => setActiveModule(null)}>
                Close
              </button>
              {activeModule.status !== 'completed' && (
                <button
                  className="btn-primary flex-1"
                  onClick={() => handleMarkComplete(activeModule.id)}
                >
                  Mark as Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manual viewer */}
      {showManual && (
        <div className="modal-overlay" onClick={() => setShowManual(false)}>
          <div
            className="modal-panel flex"
            style={{ maxWidth: 900, height: '85vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Section list */}
            <div
              className="flex-shrink-0 py-6 overflow-y-auto"
              style={{
                width: 240,
                background: '#f8fafc',
                borderRight: '1px solid #e2e8f0',
                borderRadius: '16px 0 0 16px',
              }}
            >
              <div className="px-5 mb-4">
                <div className="font-bold text-gray-900 text-sm">User Manual</div>
                <div className="text-xs text-gray-400 mt-0.5">LSOIS v1.0.0 · Oct 2026</div>
              </div>
              {MANUAL_SECTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSection(i)}
                  className="w-full text-left px-5 py-3 text-sm"
                  style={{
                    background: activeSection === i ? '#dbeafe' : 'transparent',
                    color: activeSection === i ? '#1d4ed8' : '#374151',
                    fontWeight: activeSection === i ? 600 : 400,
                    borderLeft: activeSection === i ? '3px solid #3b82f6' : '3px solid transparent',
                  }}
                >
                  {s.title}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div
                className="flex items-center justify-between px-8 py-5"
                style={{ borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}
              >
                <div className="font-bold text-gray-900">{MANUAL_SECTIONS[activeSection].title}</div>
                <button onClick={() => setShowManual(false)} className="p-2 rounded-lg hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-8 py-6">
                <div className="flex flex-col gap-5">
                  {MANUAL_SECTIONS[activeSection].content.map((line, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="flex items-center justify-center rounded-full text-white text-xs font-bold flex-shrink-0"
                        style={{ width: 26, height: 26, background: '#3b82f6', marginTop: 1 }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{line}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid #f1f5f9' }}>
                  <button
                    onClick={() => setActiveSection(p => Math.max(0, p - 1))}
                    disabled={activeSection === 0}
                    className="btn-secondary flex items-center gap-2 disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <span className="text-sm text-gray-400">
                    {activeSection + 1} / {MANUAL_SECTIONS.length}
                  </span>
                  <button
                    onClick={() => setActiveSection(p => Math.min(MANUAL_SECTIONS.length - 1, p + 1))}
                    disabled={activeSection === MANUAL_SECTIONS.length - 1}
                    className="btn-primary flex items-center gap-2 disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
