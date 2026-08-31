import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Shield,
  FileCheck,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  Landmark,
  UserCheck,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';

export const ApprovalsView: React.FC = () => {
  const {
    payrollRuns,
    currentUser,
    hrApprovePayroll,
    financeApprovePayroll,
    markPayrollPaid,
    reopenPayroll,
    setCurrentView,
    setSelectedPayrollRunId,
  } = useApp();

  const [reopenTargetId, setReopenTargetId] = useState<string | null>(null);
  const [reopenReason, setReopenReason] = useState('');

  const handleReopen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenReason.trim() || !reopenTargetId) return;
    reopenPayroll(reopenTargetId, reopenReason);
    setReopenTargetId(null);
    setReopenReason('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Two-Step Payroll Authorization & Disbursement
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 rounded-full">
              Current Role: {currentUser.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Strict Philippine Barangay Audit Workflow: Step 1 (HR Verification) → Step 2 (Finance/Treasurer Approval) → Payout Disbursement
          </p>
        </div>
      </div>

      {/* Workflow Diagram Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Government Multi-Tier Sign-off Hierarchy
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h4 className="font-bold text-blue-900 dark:text-blue-200 text-xs">
                Step 1: HR Timekeeping & Calculation Verification
              </h4>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              HR verifies biometrics, tardiness penalties, and employee eligibility.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="font-bold text-indigo-900 dark:text-indigo-200 text-xs">
                Step 2: Barangay Treasurer & Finance Sign-off
              </h4>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Finance approves fund allocations and statutory budget checks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-xs">
                Step 3: Direct Bank / Voucher Disbursement
              </h4>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Export bank direct-credit file and release official worker payslips.
            </p>
          </div>
        </div>
      </div>

      {/* Payroll Approval Queue Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Authorization Queue ({payrollRuns.length} Runs)
        </h3>

        {payrollRuns.map((r) => (
          <div
            key={r.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {r.payroll_month} {r.cutoff_number === 1 ? '1st Cut-off (1–15)' : '2nd Cut-off (16–30)'}, {r.payroll_year}
                  </h3>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  ID: {r.payroll_run_id} • Period: {r.period_start} to {r.period_end}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedPayrollRunId(r.id);
                    setCurrentView('payroll');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1"
                >
                  <span>Inspect Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Financials in this run */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Gross Pay</span>
                <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  ₱{r.total_gross.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-rose-500 text-[10px] uppercase font-bold">Total Deductions</span>
                <p className="text-base font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">
                  ₱{r.total_deductions.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30">
                <span className="text-emerald-700 dark:text-emerald-300 text-[10px] uppercase font-bold">
                  Net Disbursement
                </span>
                <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  ₱{r.total_net.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30">
                <span className="text-blue-700 dark:text-blue-300 text-[10px] uppercase font-bold">
                  Barangay Cost (ER Shares)
                </span>
                <p className="text-base font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
                  ₱{r.total_employer_cost.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Approval Stepper Status */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Approval Audit Trail:</span>
                  {r.hr_approved_at ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> HR Approved ({r.hr_approved_by} on {r.hr_approved_at.slice(0, 10)})
                    </span>
                  ) : (
                    <span className="text-slate-400">Pending HR Approval</span>
                  )}
                </div>
                {r.finance_approved_at && (
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Finance Approved ({r.finance_approved_by} on {r.finance_approved_at.slice(0, 10)})
                  </div>
                )}
              </div>

              {/* Action Buttons based on status & role */}
              <div className="flex items-center gap-2">
                {r.status === 'Draft' && (
                  <button
                    onClick={() => hrApprovePayroll(r.id)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                  >
                    Authorize as HR
                  </button>
                )}

                {r.status === 'HR Approved' && (
                  <button
                    onClick={() => financeApprovePayroll(r.id)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm"
                  >
                    Authorize as Finance
                  </button>
                )}

                {r.status === 'Finance Approved' && (
                  <button
                    onClick={() => markPayrollPaid(r.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                  >
                    Mark as Paid / Disbursed
                  </button>
                )}

                {(r.status === 'Finance Approved' || r.status === 'Paid') && currentUser.role === 'ADMIN' && (
                  <button
                    onClick={() => setReopenTargetId(r.id)}
                    className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reopen</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reopen Modal */}
      {reopenTargetId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-3 animate-in zoom-in-95 duration-200 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-500" />
              Reopen Payroll for Corrections
            </h3>
            <p className="text-slate-500">
              Reopening will reset the approval signatures back to Draft mode so attendance or salary adjustments can be made.
            </p>

            <form onSubmit={handleReopen} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Reopening *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Tanod overtime log correction requested by Barangay Captain."
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReopenTargetId(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                >
                  Confirm Reopen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
