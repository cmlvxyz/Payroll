import React from 'react';

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let style = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  if (
    [
      'Active',
      'Present',
      'Approved',
      'HR Approved',
      'Finance Approved',
      'Paid',
      'Fully Paid',
    ].includes(status)
  ) {
    style =
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40';
  } else if (
    [
      'Draft',
      'Pending',
      'Pending HR Approval',
      'Pending Finance Approval',
      'Late',
      'Adjusted',
      'Suspended',
    ].includes(status)
  ) {
    style =
      'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40';
  } else if (
    ['Resigned', 'Absent', 'Rejected', 'Cancelled'].includes(status)
  ) {
    style =
      'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40';
  } else if (
    ['On Leave', 'Rest Day', 'Holiday', 'For Payout'].includes(status)
  ) {
    style =
      'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${style}`}
    >
      {status}
    </span>
  );
};
