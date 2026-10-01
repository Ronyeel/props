// src/context/AppContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, Toast, Permission } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  permissionsFixed: boolean;
  filmMode: boolean;
  toasts: Toast[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  fixPermissions: () => void;
  setFilmMode: (v: boolean) => void;
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  hasPermission: (perm: Permission) => boolean;
  users: User[];
  updateUserPermissions: (userId: string, permissions: Permission[]) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const CREDENTIALS: Record<string, { password: string; userId: string }> = {
  employee: { password: 'password', userId: 'u1' },
  manager01: { password: 'manager123', userId: 'u2' },
  admin: { password: 'admin123', userId: 'u3' },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [permissionsFixed, setPermissionsFixed] = useState(false);
  const [filmMode, setFilmModeState] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    const cred = CREDENTIALS[username];
    if (!cred || cred.password !== password) return false;
    const user = users.find(u => u.id === cred.userId);
    if (!user) return false;
    setCurrentUser(user);
    setIsAuthenticated(true);
    return true;
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setPermissionsFixed(false);
  }, []);

  const fixPermissions = useCallback(() => {
    setUsers(prev => prev.map(u => {
      if (u.id === 'u1') {
        const newPerms: Permission[] = u.permissions.filter(
          p => p !== 'users' && p !== 'settings'
        );
        return { ...u, permissions: newPerms };
      }
      return u;
    }));
    setCurrentUser(prev => {
      if (!prev || prev.id !== 'u1') return prev;
      const newPerms: Permission[] = prev.permissions.filter(
        p => p !== 'users' && p !== 'settings'
      );
      return { ...prev, permissions: newPerms };
    });
    setPermissionsFixed(true);
  }, []);

  const setFilmMode = useCallback((v: boolean) => {
    setFilmModeState(v);
  }, []);

  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const hasPermission = useCallback((perm: Permission): boolean => {
    if (!currentUser) return false;
    return currentUser.permissions.includes(perm);
  }, [currentUser]);

  const updateUserPermissions = useCallback((userId: string, permissions: Permission[]) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, permissions } : u));
    setCurrentUser(prev => {
      if (!prev || prev.id !== userId) return prev;
      return { ...prev, permissions };
    });
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser,
      isAuthenticated,
      permissionsFixed,
      filmMode,
      toasts,
      login,
      logout,
      fixPermissions,
      setFilmMode,
      addToast,
      removeToast,
      hasPermission,
      users,
      updateUserPermissions,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
