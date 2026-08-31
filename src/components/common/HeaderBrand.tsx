import React from 'react';
import { Shield, Building2 } from 'lucide-react';

export const HeaderBrand: React.FC<{ subtitle?: boolean; compact?: boolean }> = ({ subtitle = true, compact = false }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-700 text-white shadow-md shadow-blue-700/20 shrink-0">
        <Shield className="w-6 h-6 text-amber-300" />
        <span className="absolute text-[9px] font-black tracking-tighter text-white font-mono top-3">SF II</span>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base sm:text-lg leading-tight">
            SF II Barangay Payroll
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
            Gov
          </span>
        </div>
        {subtitle && !compact && (
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[240px]">
            Barangay San Felipe II – Cavite City
          </p>
        )}
      </div>
    </div>
  );
};
