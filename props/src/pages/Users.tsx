// src/pages/Users.tsx
import React, { useState } from 'react';
import {
  Users, Shield, ShieldAlert, ShieldCheck, ShieldOff,
  X, AlertTriangle, CheckCircle2, Lock, Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User, Permission } from '../types';

const ALL_PERMISSIONS: { key: Permission; label: string; desc: string }[] = [
  { key: 'dashboard', label: 'Dashboard', desc: 'View operational dashboard and KPIs' },
  { key: 'transactions', label: 'Transactions', desc: 'Process and view transactions' },
  { key: 'inventory', label: 'Inventory', desc: 'View and update product inventory' },
  { key: 'groupware', label: 'Groupware', desc: 'Access team communication channels' },
  { key: 'training', label: 'Training & Manual', desc: 'Access training modules and manual' },
  { key: 'reports', label: 'Reports', desc: 'Generate and view reports' },
  { key: 'evaluation', label: 'Evaluation', desc: 'View implementation evaluation data' },
  { key: 'users', label: 'User Management', desc: 'Manage users and permissions' },
  { key: 'settings', label: 'Settings', desc: 'Configure system preferences' },
];

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  employee: { bg: '#dcfce7', color: '#16a34a' },
  manager: { bg: '#dbeafe', color: '#1d4ed8' },
  admin: { bg: '#f3e8ff', color: '#7e22ce' },
};

const ROLE_LABELS: Record<string, string> = {
  employee: 'Employee',
  manager: 'Manager',
  admin: 'Administrator',
};

function PermissionsModal({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  const { updateUserPermissions, fixPermissions, permissionsFixed, addToast, currentUser } = useApp();
  const [perms, setPerms] = useState<Permission[]>(user.permissions);
  const [fixing, setFixing] = useState(false);
  const [fixed, setFixed] = useState(false);

  const toggle = (perm: Permission) => {
    setPerms(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const save = () => {
    updateUserPermissions(user.id, perms);
    addToast(`Permissions updated for ${user.name}.`, 'success');
    onClose();
  };

  const handleFixPermissions = () => {
    setFixing(true);
    setTimeout(() => {
      fixPermissions();
      setFixed(true);
      setPerms(['dashboard', 'transactions', 'inventory', 'groupware', 'training', 'reports', 'evaluation']);
      addToast('Permissions updated. Employee access has been corrected.', 'success');
      setFixing(false);
    }, 1200);
  };

  const isEmployee = user.role === 'employee';
  const hasExcessiveAccess = isEmployee && user.permissions.includes('users');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div
          className="flex items-center justify-between px-8 py-5"
          style={{ borderBottom: '1px solid #f1f5f9' }}
        >
          <div>
            <div className="text-xl font-bold text-gray-900">User Permissions</div>
            <div className="text-sm text-gray-500 mt-0.5">{user.name} — {ROLE_LABELS[user.role]}</div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="px-8 py-6">
          {/* Security concepts */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-xl p-4" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <div className="flex items-center gap-2 mb-2">
                <Eye size={16} className="text-blue-600" />
                <div className="font-semibold text-blue-900 text-sm">AUTHENTICATION</div>
              </div>
              <div className="text-xs text-blue-700">Who are you?</div>
              <div className="text-sm font-medium text-blue-800 mt-1">{user.username}</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: '#fdf4ff', border: '1px solid #e9d5ff' }}>
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-purple-600" />
                <div className="font-semibold text-purple-900 text-sm">AUTHORIZATION</div>
              </div>
              <div className="text-xs text-purple-700">What are you allowed to access?</div>
              <div className="text-sm font-medium text-purple-800 mt-1">{perms.length} permissions granted</div>
            </div>
          </div>

          {/* Least privilege note */}
          {isEmployee && (
            <div
              className="flex items-start gap-3 rounded-xl px-4 py-3 mb-5"
              style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
            >
              <ShieldCheck size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <strong>Least Privilege Principle:</strong> Grant only the minimum permissions needed for this employee's role.
              </div>
            </div>
          )}

          {/* Excessive access warning */}
          {hasExcessiveAccess && !fixed && (
            <div
              className="flex items-start gap-3 rounded-xl px-4 py-4 mb-5"
              style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}
            >
              <AlertTriangle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-orange-900 text-sm">Excessive Permissions Detected</div>
                <div className="text-sm text-orange-700 mt-1">
                  This employee has access to <strong>User Management</strong>, which exceeds their role requirements. This should be corrected immediately.
                </div>
              </div>
              <button
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: '#ea580c' }}
                onClick={handleFixPermissions}
                disabled={fixing}
              >
                {fixing ? (
                  <>
                    <div
                      className="spin"
                      style={{
                        width: 13,
                        height: 13,
                        border: '2px solid rgba(255,255,255,0.4)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                      }}
                    />
                    Fixing...
                  </>
                ) : (
                  <>
                    <ShieldOff size={14} />
                    Fix Permissions
                  </>
                )}
              </button>
            </div>
          )}

          {fixed && (
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5"
              style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
            >
              <CheckCircle2 size={16} className="text-green-600" />
              <div className="text-sm text-green-800 font-medium">
                Permissions updated successfully. Least privilege applied.
              </div>
            </div>
          )}

          {/* Permission toggles */}
          <div className="text-sm font-semibold text-gray-700 mb-3">Access Permissions</div>
          <div className="flex flex-col gap-2">
            {ALL_PERMISSIONS.map(p => {
              const granted = perms.includes(p.key);
              const isRestricted = isEmployee && (p.key === 'users' || p.key === 'settings') && fixed;
              return (
                <div
                  key={p.key}
                  className="flex items-center justify-between rounded-xl px-4 py-3"
                  style={{
                    background: granted && !isRestricted ? '#f0fdf4' : isRestricted ? '#fef2f2' : '#f8fafc',
                    border: `1px solid ${granted && !isRestricted ? '#bbf7d0' : isRestricted ? '#fecaca' : '#e2e8f0'}`,
                  }}
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{p.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{p.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={granted}
                      onChange={() => toggle(p.key)}
                      className="sr-only peer"
                    />
                    <div
                      onClick={() => toggle(p.key)}
                      className="w-11 h-6 rounded-full cursor-pointer transition-colors"
                      style={{
                        background: granted ? '#22c55e' : '#d1d5db',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 2,
                          left: granted ? 22 : 2,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: 'white',
                          transition: 'left 200ms ease',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        }}
                      />
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 px-8 py-5" style={{ borderTop: '1px solid #f1f5f9' }}>
          <button className="btn-secondary flex-1" onClick={onClose}>Cancel</button>
          <button className="btn-primary flex-1" onClick={save}>Save Permissions</button>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const { users, currentUser, hasPermission, permissionsFixed, addToast } = useApp();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Security scene: if permissions are fixed and we're the employee trying to access this page
  if (permissionsFixed && currentUser?.role === 'employee' && !hasPermission('users')) {
    return (
      <div className="p-8 fade-in flex flex-col items-center justify-center min-h-96">
        <div
          className="card p-10 flex flex-col items-center text-center"
          style={{ maxWidth: 480, border: '2px solid #fecaca' }}
        >
          <div
            className="flex items-center justify-center rounded-2xl mb-6"
            style={{ width: 64, height: 64, background: '#fee2e2' }}
          >
            <ShieldAlert size={32} color="#ef4444" />
          </div>
          <div className="text-2xl font-bold text-red-700 mb-2">ACCESS RESTRICTED</div>
          <div className="text-gray-600 mb-6">
            You do not have permission to access this resource.
          </div>
          <div className="rounded-xl px-5 py-4 mb-4 text-left w-full" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Access Log</div>
            <div className="text-xs text-gray-500">
              <div>User: <span className="font-mono">{currentUser?.username}</span></div>
              <div>Resource: User Management (users)</div>
              <div>Status: <span className="text-red-600 font-semibold">DENIED</span></div>
              <div>Time: {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Contact your system administrator if you believe this is an error.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users & Permissions</h1>
          <div className="text-sm text-gray-500 mt-1">Manage system access and role-based permissions</div>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => addToast('User invitation sent.', 'info')}
        >
          <Users size={16} />
          Invite User
        </button>
      </div>

      {/* Security concepts */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        <div className="card p-6 flex items-start gap-4" style={{ border: '1px solid #bfdbfe' }}>
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ width: 44, height: 44, background: '#dbeafe' }}
          >
            <Eye size={22} className="text-blue-600" />
          </div>
          <div>
            <div className="font-bold text-gray-900">Authentication</div>
            <div className="text-sm text-gray-500 mt-1">
              Verifies the identity of every user before granting access to the system.
              Uses unique credentials assigned by the administrator.
            </div>
          </div>
        </div>
        <div className="card p-6 flex items-start gap-4" style={{ border: '1px solid #e9d5ff' }}>
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ width: 44, height: 44, background: '#f3e8ff' }}
          >
            <Shield size={22} className="text-purple-600" />
          </div>
          <div>
            <div className="font-bold text-gray-900">Authorization</div>
            <div className="text-sm text-gray-500 mt-1">
              Controls what each user is allowed to access. Based on role and least-privilege principle:
              grant only the minimum access required.
            </div>
          </div>
        </div>
      </div>

      {/* User table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <div className="font-bold text-gray-900">System Users</div>
          <div className="text-sm text-gray-500">{users.length} users registered</div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Permissions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const rc = ROLE_COLORS[user.role];
              const hasExcessAccess = user.role === 'employee' && user.permissions.includes('users') && !permissionsFixed;
              return (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center rounded-full text-white text-sm font-bold flex-shrink-0"
                        style={{ width: 36, height: 36, background: rc.color }}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono text-sm text-gray-600">{user.username}</span>
                  </td>
                  <td>
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: rc.bg, color: rc.color }}
                    >
                      {ROLE_LABELS[user.role]}
                    </span>
                  </td>
                  <td className="text-sm text-gray-600">{user.department}</td>
                  <td>
                    <span className="badge-success">{user.status}</span>
                  </td>
                  <td className="text-xs text-gray-400">{user.lastLogin}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{user.permissions.length} granted</span>
                      {hasExcessAccess && (
                        <span title="Excessive permissions detected">
                          <AlertTriangle size={14} className="text-orange-500" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-800"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Shield size={14} />
                      Manage
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Role descriptions */}
      <div className="grid grid-cols-3 gap-5 mt-6">
        {[
          { role: 'Employee', color: '#16a34a', bg: '#dcfce7', icon: <Users size={18} />, desc: 'Basic operational access. Can process transactions and view inventory.' },
          { role: 'Manager', color: '#1d4ed8', bg: '#dbeafe', icon: <Shield size={18} />, desc: 'Standard management access. Can approve transactions, manage staff, and view reports.' },
          { role: 'Administrator', color: '#7e22ce', bg: '#f3e8ff', icon: <ShieldCheck size={18} />, desc: 'Full system access. Can manage users, permissions, and system configuration.' },
        ].map(r => (
          <div key={r.role} className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{ width: 36, height: 36, background: r.bg, color: r.color }}
              >
                {r.icon}
              </div>
              <div className="font-semibold text-gray-900">{r.role}</div>
            </div>
            <div className="text-sm text-gray-500 leading-relaxed">{r.desc}</div>
          </div>
        ))}
      </div>

      {selectedUser && (
        <PermissionsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
