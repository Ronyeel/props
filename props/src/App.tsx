// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import ToastContainer from './components/Toast';
import Login from './pages/Login';
import SessionExpired from './pages/SessionExpired';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Inventory from './pages/Inventory';
import Groupware from './pages/Groupware';
import Training from './pages/Training';
import Reports from './pages/Reports';
import Evaluation from './pages/Evaluation';
import UsersPage from './pages/Users';
import SettingsPage from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/session-expired" element={<SessionExpired />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="groupware" element={<Groupware />} />
            <Route path="training" element={<Training />} />
            <Route path="reports" element={<Reports />} />
            <Route path="evaluation" element={<Evaluation />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}
