// src/components/Layout.tsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useApp } from '../context/AppContext';
import FilmModePanel from './FilmModePanel';

export default function Layout() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f1f5f9' }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <FilmModePanel />
    </div>
  );
}
