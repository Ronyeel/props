// src/components/Sidebar.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Package,
  MessageSquare,
  BookOpen,
  BarChart3,
  Star,
  Users,
  Settings,
  LogOut,
  Building2,
  Circle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Permission } from '../types';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  permission: Permission;
}

const mainNav: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} />, permission: 'dashboard' },
  { label: 'Transactions', path: '/transactions', icon: <Receipt size={18} />, permission: 'transactions' },
  { label: 'Inventory', path: '/inventory', icon: <Package size={18} />, permission: 'inventory' },
  { label: 'Groupware', path: '/groupware', icon: <MessageSquare size={18} />, permission: 'groupware' },
  { label: 'Training & Manual', path: '/training', icon: <BookOpen size={18} />, permission: 'training' },
  { label: 'Reports', path: '/reports', icon: <BarChart3 size={18} />, permission: 'reports' },
  { label: 'Evaluation', path: '/evaluation', icon: <Star size={18} />, permission: 'evaluation' },
];

const adminNav: NavItem[] = [
  { label: 'Users & Permissions', path: '/users', icon: <Users size={18} />, permission: 'users' },
  { label: 'Settings', path: '/settings', icon: <Settings size={18} />, permission: 'settings' },
];

export default function Sidebar() {
  const { currentUser, hasPermission, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel: Record<string, string> = {
    employee: 'Store Employee',
    manager: 'Operations Manager',
    admin: 'System Administrator',
  };

  const roleBadgeColor: Record<string, string> = {
    employee: '#22c55e',
    manager: '#3b82f6',
    admin: '#a855f7',
  };

  return (
    <aside
      className="flex flex-col h-screen"
      style={{
        width: 240,
        minWidth: 240,
        background: '#0f172a',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ width: 40, height: 40, background: '#3b82f6', boxShadow: '0 0 20px rgba(59,130,246,0.4)' }}
        >
          <Building2 size={22} color="white" />
        </div>
        <div>
          <div className="text-white font-bold text-base leading-tight tracking-wide">LSOIS</div>
          <div className="text-xs leading-tight" style={{ color: '#64748b' }}>Local Store Ops.</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" style={{ scrollbarWidth: 'none' }}>
        <div className="flex flex-col gap-1">
          {mainNav.map(item => {
            if (!hasPermission(item.permission)) return null;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Admin section */}
        {adminNav.some(item => hasPermission(item.permission)) && (
          <>
            <div
              className="mt-6 mb-3 px-2 text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#334155' }}
            >
              Administration
            </div>
            <div className="flex flex-col gap-1">
              {adminNav.map(item => {
                if (!hasPermission(item.permission)) return null;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `sidebar-nav-item ${isActive ? 'active' : ''}`
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </>
        )}
      </nav>

      {/* User info */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div
            className="flex items-center justify-center rounded-full font-bold text-sm text-white"
            style={{
              width: 36,
              height: 36,
              background: roleBadgeColor[currentUser?.role || 'employee'],
              flexShrink: 0,
            }}
          >
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{currentUser?.name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Circle size={6} fill="#22c55e" color="#22c55e" />
              <span className="text-xs" style={{ color: '#64748b' }}>Online</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Sign out"
          >
            <LogOut size={16} color="#64748b" />
          </button>
        </div>
        <div className="mt-1.5 px-2">
          <div className="text-xs" style={{ color: '#334155' }}>
            {roleLabel[currentUser?.role || 'employee']}
          </div>
        </div>
      </div>
    </aside>
  );
}
