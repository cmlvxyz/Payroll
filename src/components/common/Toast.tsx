import React from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  const borders = {
    success:
      'border-emerald-500/30 bg-emerald-50/90 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800',
    error:
      'border-rose-500/30 bg-rose-50/90 text-rose-900 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800',
    info:
      'border-blue-500/30 bg-blue-50/90 text-blue-900 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-800',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md ${borders[toast.type]}`}
      >
        {icons[toast.type]}
        <p className="text-sm font-medium pr-2">{toast.message}</p>
      </div>
    </div>
  );
};

export const ToastContainer = Toast;
