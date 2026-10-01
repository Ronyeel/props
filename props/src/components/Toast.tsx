// src/components/Toast.tsx
import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  const icons = {
    success: <CheckCircle size={18} className="text-green-500" />,
    error: <XCircle size={18} className="text-red-500" />,
    warning: <AlertCircle size={18} className="text-amber-500" />,
    info: <Info size={18} className="text-blue-500" />,
  };

  const borders = {
    success: 'border-l-4 border-green-500',
    error: 'border-l-4 border-red-500',
    warning: 'border-l-4 border-amber-500',
    info: 'border-l-4 border-blue-500',
  };

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3" style={{ pointerEvents: 'none' }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast-enter flex items-center gap-3 bg-white rounded-xl shadow-xl px-4 py-3.5 min-w-72 max-w-sm ${borders[toast.type]}`}
          style={{ pointerEvents: 'auto' }}
        >
          {icons[toast.type]}
          <span className="flex-1 text-sm font-medium text-gray-800">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600 ml-2">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
