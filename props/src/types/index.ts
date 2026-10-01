// src/types/index.ts
export type UserRole = 'employee' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  email: string;
  department: string;
  lastLogin: string;
  permissions: Permission[];
}

export type Permission =
  | 'dashboard'
  | 'transactions'
  | 'inventory'
  | 'groupware'
  | 'training'
  | 'reports'
  | 'evaluation'
  | 'users'
  | 'settings';

export interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  permissionsFixed: boolean;
  filmMode: boolean;
  toasts: Toast[];
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface Transaction {
  id: string;
  date: string;
  customer: string;
  items: TransactionItem[];
  total: number;
  payment: 'Cash' | 'GCash' | 'Card';
  status: 'Completed' | 'Pending' | 'Voided';
  cashier: string;
}

export interface TransactionItem {
  name: string;
  qty: number;
  price: number;
}

export interface Product {
  sku: string;
  name: string;
  category: string;
  stock: number;
  reorderLevel: number;
  unit: string;
  price: number;
  lastUpdated: string;
  supplier: string;
}

export interface StockMovement {
  id: string;
  product: string;
  type: 'In' | 'Out' | 'Adjustment';
  quantity: number;
  date: string;
  notes: string;
  by: string;
}

export interface Message {
  id: string;
  channel: string;
  sender: string;
  senderRole: string;
  content: string;
  timestamp: string;
  isOwn?: boolean;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'locked';
  content: string[];
}
