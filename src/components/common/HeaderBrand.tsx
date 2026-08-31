import React from 'react';

export const HeaderBrand: React.FC<{ subtitle?: boolean; compact?: boolean }> = ({ subtitle = true, compact = false }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-11 h-11 shrink-0">
        <img
          src="/barangay-logo-circle.png"
          alt="Barangay SF II Logo"
          className="w-11 h-11 object-contain drop-shadow"
        />
      </div>
      <div className="min-w-0">
        {compact ? (
          <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base leading-tight">
            SF II Payroll
          </span>
        ) : (
          <>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight text-sm sm:text-[15px] leading-tight block">
              Barangay SF II
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-700 dark:text-blue-400 block">
              Payroll Management
            </span>
          </>
        )}
        {subtitle && !compact && (
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[220px] mt-0.5">
            Limay, Bataan
          </p>
        )}
      </div>
      {!compact && (
        <span className="hidden xl:inline-flex text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          GOV
        </span>
      )}
    </div>
  );
};
