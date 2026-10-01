// src/pages/Settings.tsx
import React, { useState } from 'react';
import {
  User, Bell, Shield, Settings2, Save, Film,
  Mail, Phone, Globe, Moon, Sun, Monitor
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const TABS = [
  { id: 'profile', label: 'Profile', icon: <User size={16} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
  { id: 'security', label: 'Security', icon: <Shield size={16} /> },
  { id: 'preferences', label: 'System Preferences', icon: <Settings2 size={16} /> },
];

export default function SettingsPage() {
  const { currentUser, addToast, filmMode, setFilmMode } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    addToast('Settings saved successfully.', 'success');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <div className="text-sm text-gray-500 mt-1">Manage your account and system preferences</div>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={handleSave}>
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar tabs */}
        <div className="flex flex-col gap-1" style={{ width: 200, flexShrink: 0 }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left w-full transition-all"
              style={{
                background: activeTab === tab.id ? '#eff6ff' : 'transparent',
                color: activeTab === tab.id ? '#2563eb' : '#6b7280',
                borderLeft: activeTab === tab.id ? '3px solid #3b82f6' : '3px solid transparent',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}

          {/* Film Mode separator */}
          <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 16, paddingTop: 16 }}>
            <button
              onClick={() => {
                setFilmMode(!filmMode);
                addToast(filmMode ? 'Film Mode disabled.' : 'Film Mode enabled. Control panel active.', 'info');
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left w-full transition-all"
              style={{
                background: filmMode ? '#1e40af' : 'transparent',
                color: filmMode ? '#93c5fd' : '#9ca3af',
                border: filmMode ? '1px solid #3b82f6' : '1px solid transparent',
              }}
            >
              <Film size={16} />
              Film Mode
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h2>
              <div className="flex items-center gap-6 mb-8">
                <div
                  className="flex items-center justify-center rounded-2xl text-white text-2xl font-bold"
                  style={{ width: 72, height: 72, background: '#3b82f6' }}
                >
                  {currentUser?.name?.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">{currentUser?.name}</div>
                  <div className="text-gray-500 text-sm">{currentUser?.email}</div>
                  <div className="text-blue-600 text-sm font-medium mt-1 cursor-pointer hover:underline">
                    Change photo
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { label: 'Full Name', value: currentUser?.name || '', icon: <User size={14} /> },
                  { label: 'Username', value: currentUser?.username || '', icon: <User size={14} /> },
                  { label: 'Email Address', value: currentUser?.email || '', icon: <Mail size={14} /> },
                  { label: 'Department', value: currentUser?.department || '', icon: <Globe size={14} /> },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">{f.label}</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{f.icon}</div>
                      <input
                        type="text"
                        defaultValue={f.value}
                        className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-400"
                        style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h2>
              <div className="flex flex-col gap-5">
                {[
                  { label: 'Low Stock Alerts', desc: 'Notify when products fall below reorder level', on: true },
                  { label: 'Transaction Alerts', desc: 'Notify on pending or voided transactions', on: true },
                  { label: 'System Announcements', desc: 'Receive announcements from management', on: true },
                  { label: 'Training Reminders', desc: 'Remind about incomplete training modules', on: false },
                  { label: 'Security Events', desc: 'Alert on failed login attempts or access violations', on: true },
                ].map(n => (
                  <div key={n.label} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <div className="font-semibold text-gray-800">{n.label}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{n.desc}</div>
                    </div>
                    <ToggleSwitch defaultOn={n.on} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Security Settings</h2>
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-400"
                    style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-400"
                    style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-400"
                    style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}
                  />
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
                >
                  <div className="font-semibold text-green-800 text-sm mb-1">Password Requirements</div>
                  <div className="text-sm text-green-700 flex flex-col gap-1">
                    <div>• Minimum 8 characters</div>
                    <div>• At least one uppercase letter</div>
                    <div>• At least one number</div>
                    <div>• Must be changed every 90 days</div>
                  </div>
                </div>
                <button
                  className="btn-primary self-start px-8"
                  onClick={() => addToast('Password updated successfully.', 'success')}
                >
                  Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="card p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">System Preferences</h2>
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-3">Display Theme</label>
                  <div className="flex gap-3">
                    {[
                      { label: 'Light', icon: <Sun size={16} />, active: true },
                      { label: 'Dark', icon: <Moon size={16} />, active: false },
                      { label: 'System', icon: <Monitor size={16} />, active: false },
                    ].map(t => (
                      <button
                        key={t.label}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                        style={{
                          background: t.active ? '#eff6ff' : '#f8fafc',
                          border: `1px solid ${t.active ? '#bfdbfe' : '#e2e8f0'}`,
                          color: t.active ? '#2563eb' : '#6b7280',
                        }}
                      >
                        {t.icon}
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Currency Format</label>
                  <select
                    className="rounded-xl text-sm px-4 py-3 outline-none"
                    style={{ border: '1px solid #e2e8f0', background: '#f8fafc', color: '#374151', width: 240 }}
                    defaultValue="php"
                  >
                    <option value="php">Philippine Peso (₱)</option>
                    <option value="usd">US Dollar ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Date Format</label>
                  <select
                    className="rounded-xl text-sm px-4 py-3 outline-none"
                    style={{ border: '1px solid #e2e8f0', background: '#f8fafc', color: '#374151', width: 240 }}
                    defaultValue="mdy"
                  >
                    <option value="mdy">MMM D, YYYY</option>
                    <option value="dmy">D/M/YYYY</option>
                    <option value="ymd">YYYY-MM-DD</option>
                  </select>
                </div>
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 20 }}>
                  <div className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                    <Film size={16} className="text-gray-400" />
                    Film Mode
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    Enable a floating control panel for filming convenience.
                  </div>
                  <button
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: filmMode ? '#1e40af' : '#f8fafc',
                      color: filmMode ? 'white' : '#374151',
                      border: `1px solid ${filmMode ? '#3b82f6' : '#e2e8f0'}`,
                    }}
                    onClick={() => {
                      setFilmMode(!filmMode);
                      addToast(filmMode ? 'Film Mode disabled.' : 'Film Mode enabled.', 'info');
                    }}
                  >
                    <Film size={15} />
                    {filmMode ? 'Film Mode: ON' : 'Film Mode: OFF'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div
      onClick={() => setOn(p => !p)}
      className="cursor-pointer rounded-full transition-colors"
      style={{
        width: 44,
        height: 24,
        background: on ? '#22c55e' : '#d1d5db',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 2,
          left: on ? 22 : 2,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: 'white',
          transition: 'left 200ms ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );
}
