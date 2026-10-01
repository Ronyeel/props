// src/pages/Evaluation.tsx
import React, { useState } from 'react';
import { Star, TrendingUp, ArrowRight, CheckCircle2, X, MessageSquare } from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid
} from 'recharts';

const METRICS = [
  { label: 'System Quality', value: 92, color: '#3b82f6', desc: 'Reliability, performance, and ease of use' },
  { label: 'Information Quality', value: 89, color: '#8b5cf6', desc: 'Accuracy, timeliness, and relevance of data' },
  { label: 'Service Quality', value: 86, color: '#10b981', desc: 'Support responsiveness and training effectiveness' },
  { label: 'System Use', value: 94, color: '#f59e0b', desc: 'Frequency and breadth of system adoption' },
  { label: 'User Satisfaction', value: 88, color: '#ec4899', desc: 'Overall staff satisfaction with the system' },
  { label: 'Net Benefits', value: 91, color: '#06b6d4', desc: 'Operational improvements and efficiency gains' },
];

const FEEDBACK = [
  { author: 'JP Yaba', role: 'Store Employee', quote: 'Transactions are faster. I no longer have to look for receipts in different notebooks.' },
  { author: 'Jose Fernandez', role: 'Store Employee', quote: 'Inventory information is easier to find. I can check stock levels anytime without asking the manager.' },
  { author: 'Ana Bautista', role: 'Store Employee', quote: 'The workflow is clearer. I know exactly what steps to follow for each task.' },
  { author: 'Ma. Teresa Soriano', role: 'Operations Manager', quote: 'Users now understand their responsibilities better. There\'s less confusion about who does what.' },
  { author: 'Ricardo Palma', role: 'IT Administrator', quote: 'Access control is properly enforced. We can track who accessed what and when.' },
];

const BEFORE_AFTER = {
  before: [
    'Scattered information across notebooks and Excel files',
    'Multiple group chats with no official channel',
    'Manual, paper-based processes',
    'Unclear access — no role boundaries',
    'Limited reporting capability',
    'Training done verbally with no documentation',
  ],
  after: [
    'Centralized information accessible from any workstation',
    'Official Operations Channel in LSOIS Groupware',
    'Standardized digital workflow',
    'Role-based access control with Least Privilege',
    'Data-driven evaluation and real-time reports',
    'Structured training modules with completion tracking',
  ],
};

const RADAR_DATA = METRICS.map(m => ({ subject: m.label.split(' ')[0], value: m.value }));

const BAR_DATA = [
  { label: 'Before', value: 58 },
  { label: 'After', value: 90 },
];

export default function Evaluation() {
  const [selectedFeedback, setSelectedFeedback] = useState<number | null>(null);

  const avg = Math.round(METRICS.reduce((s, m) => s + m.value, 0) / METRICS.length);

  return (
    <div className="p-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Evaluation</h1>
          <div className="text-sm text-gray-500 mt-1">
            Post-implementation assessment — LSOIS v1.0 · October 2026
          </div>
        </div>
        <div
          className="flex items-center gap-3 rounded-2xl px-6 py-3"
          style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
        >
          <Star size={20} className="text-blue-600" />
          <div>
            <div className="text-2xl font-bold text-blue-700">{avg}%</div>
            <div className="text-xs text-blue-500 font-medium">Overall Score</div>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {METRICS.map(m => (
          <div key={m.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-600">{m.label}</div>
              <span className="text-xl font-bold" style={{ color: m.color }}>{m.value}%</span>
            </div>
            <div style={{ height: 6, background: '#e2e8f0', borderRadius: 99 }}>
              <div
                style={{
                  height: '100%',
                  width: `${m.value}%`,
                  background: m.color,
                  borderRadius: 99,
                  transition: 'width 800ms ease',
                }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-2">{m.desc}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        {/* Radar */}
        <div className="card p-6">
          <div className="font-bold text-gray-900 mb-1">Evaluation Radar</div>
          <div className="text-sm text-gray-400 mb-4">DeLone & McLean IS Success Model</div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748b' }} />
              <Radar
                name="Score"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Before/After bar */}
        <div className="card p-6">
          <div className="font-bold text-gray-900 mb-1">Overall Performance</div>
          <div className="text-sm text-gray-400 mb-4">Before vs. after implementation</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={BAR_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 13, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={v => [`${v}%`, 'Score']} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {BAR_DATA.map((d, i) => (
                  <Cell key={i} fill={i === 0 ? '#94a3b8' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <div style={{ width: 12, height: 12, borderRadius: 3, background: '#94a3b8' }} />
              <span className="text-gray-500">Before: 58%</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div style={{ width: 12, height: 12, borderRadius: 3, background: '#3b82f6' }} />
              <span className="text-gray-600 font-semibold">After: 90%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Before/After comparison */}
      <div className="card overflow-hidden mb-8">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <div className="font-bold text-gray-900">Implementation Impact</div>
          <div className="text-sm text-gray-400 mt-0.5">Before and after LSOIS adoption</div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-gray-100">
          <div className="p-6">
            <div
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold mb-5"
              style={{ background: '#fee2e2', color: '#dc2626' }}
            >
              <X size={14} />
              Before Implementation
            </div>
            <div className="flex flex-col gap-3">
              {BEFORE_AFTER.before.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', flexShrink: 0, marginTop: 7 }} />
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6">
            <div
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold mb-5"
              style={{ background: '#dcfce7', color: '#16a34a' }}
            >
              <CheckCircle2 size={14} />
              After Implementation
            </div>
            <div className="flex flex-col gap-3">
              {BEFORE_AFTER.after.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0, marginTop: 7 }} />
                  <span className="text-sm text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User feedback */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={18} className="text-gray-400" />
          <div className="font-bold text-gray-900">User Feedback</div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {FEEDBACK.map((f, i) => (
            <div key={i} className="card p-5">
              <div className="text-sm text-gray-700 leading-relaxed mb-4 italic">"{f.quote}"</div>
              <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
                <div
                  className="flex items-center justify-center rounded-full text-white text-sm font-bold flex-shrink-0"
                  style={{ width: 32, height: 32, background: '#3b82f6' }}
                >
                  {f.author.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{f.author}</div>
                  <div className="text-xs text-gray-400">{f.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
