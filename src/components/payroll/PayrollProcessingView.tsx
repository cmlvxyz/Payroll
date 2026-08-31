import React, { useState } from 'react';
import {
  Calculator,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Printer,
  FileText,
  Lock,
  RotateCcw,
  Eye,
  ArrowRight,
  Info,
  DollarSign,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PayrollRun, PayrollDetail, Employee } from '../../types';
import { StatusBadge } from '../common/Badge';
import { ExportService } from '../../services/exportService';

export const PayrollProcessingView: React.FC = () => {
  const {
    payrollRuns,
    payrollDetails,
    employees,
    processPayrollRun,
    hrApprovePayroll,
    financeApprovePayroll,
    reopenPayroll,
    currentUser,
    setCurrentView,
    setSelectedPayrollRunId,
    selectedPayrollRunId,
    settings,
  } = useApp();

  const [selectedMonth, setSelectedMonth] = useState('September');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedCutoff, setSelectedCutoff] = useState<1 | 2>(1);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [drilldownDetail, setDrilldownDetail] = useState<PayrollDetail | null>(null);
  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Active or selected run
  const activeRun = payrollRuns.find((r) => r.id === selectedPayrollRunId) || payrollRuns[0];
  const activeDetails = activeRun
    ? payrollDetails.filter((d) => d.payroll_run_id === activeRun.id)
    : [];

  const activeEmployees = employees.filter((e) => e.status === 'Active');
  const missingSssCount = activeEmployees.filter((e) => !e.sss_no || e.sss_no.includes('0000000')).length;
  const missingBankCount = activeEmployees.filter((e) => !e.bank_account).length;

  const handleStartProcess = () => {
    setIsConfirmModalOpen(true);
  };

  const handleExecuteProcess = () => {
    processPayrollRun(selectedMonth, selectedYear, selectedCutoff);
    setIsConfirmModalOpen(false);
  };

  const handleReopenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenReason.trim()) {
      alert('A reason is required to reopen an approved payroll for government audit logs.');
      return;
    }
    if (activeRun) {
      reopenPayroll(activeRun.id, reopenReason);
      setReopenModalOpen(false);
      setReopenReason('');
    }
  };

  const empMap = new Map<string, Employee>(employees.map((e) => [e.employee_id, e]));

  return (
    <div className="relative -left-4 -top-5 space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Payroll Processing Engine
            </h1>
            {activeRun && <StatusBadge status={activeRun.status} />}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated statutory calculations: SSS 2026, PhilHealth 5% split, Pag-IBIG cap, & TRAIN Law BIR withholding tax.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeRun && (
            <>
              <button
                onClick={() => ExportService.exportPayrollRegisterExcel(activeRun, activeDetails, employees, settings)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export Excel</span>
              </button>
              <button
                onClick={() => setCurrentView('payslips')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>View Payslips</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Period Selection & Run Picker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Cutoff Setup */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            Select Payroll Period
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Payroll Month & Year
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value) || 2026)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Semi-Monthly Cut-off Period
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCutoff(1)}
                  className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                    selectedCutoff === 1
                      ? 'bg-blue-50 border-blue-600 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                  }`}
                >
                  1st Cut-off (1–15)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCutoff(2)}
                  className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                    selectedCutoff === 2
                      ? 'bg-blue-50 border-blue-600 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                  }`}
                >
                  2nd Cut-off (16–30)
                </button>
              </div>
            </div>

            {/* Validation Checklist Box */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{activeEmployees.length} Active Employees in Masterlist</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Attendance records consolidated</span>
              </div>
              {missingSssCount > 0 && (
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{missingSssCount} employee(s) have missing statutory SSS numbers</span>
                </div>
              )}
            </div>

            <button
              onClick={handleStartProcess}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>PROCESS PAYROLL ({selectedMonth} {selectedCutoff === 1 ? '1–15' : '16–30'})</span>
            </button>
          </div>
        </div>

        {/* Right 2 Cols: Active Run Financial Summary */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Disbursement Summary: {activeRun?.payroll_run_id || 'No Run Selected'}
              </h2>
              <p className="text-xs text-slate-400">
                {activeRun?.period_start} to {activeRun?.period_end} • {activeDetails.length} Barangay Workers
              </p>
            </div>

            {/* Approval / Reopen Controls */}
            <div className="flex items-center gap-2">
              {activeRun && activeRun.status === 'Draft' && currentUser.role !== 'EMPLOYEE' && (
                <button
                  onClick={() => hrApprovePayroll(activeRun.id)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                >
                  HR Approve
                </button>
              )}
              {activeRun && activeRun.status === 'HR Approved' && (currentUser.role === 'FINANCE' || currentUser.role === 'ADMIN') && (
                <button
                  onClick={() => financeApprovePayroll(activeRun.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  Finance Approve
                </button>
              )}
              {activeRun && (activeRun.status === 'Finance Approved' || activeRun.status === 'Paid') && currentUser.role === 'ADMIN' && (
                <button
                  onClick={() => setReopenModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Request Reopen</span>
                </button>
              )}
            </div>
          </div>

          {activeRun ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400">Gross Payroll</span>
                <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                  ₱{activeRun.total_gross.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40">
                <span className="text-[10px] font-bold uppercase text-rose-700 dark:text-rose-300">
                  Total Deductions
                </span>
                <p className="text-lg font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">
                  ₱{activeRun.total_deductions.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
                <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300">
                  Total Net Pay
                </span>
                <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  ₱{activeRun.total_net.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40">
                <span className="text-[10px] font-bold uppercase text-blue-700 dark:text-blue-300">
                  Employer Shares
                </span>
                <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
                  ₱{activeRun.total_employer_cost.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-xs py-6 text-center">No active payroll selected.</p>
          )}

          {/* Previous Payroll Runs selector tabs */}
          <div className="pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Available Payroll Runs
            </span>
            <div className="flex flex-wrap gap-2">
              {payrollRuns.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedPayrollRunId(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    activeRun?.id === r.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {r.payroll_month} Cut-off {r.cutoff_number} ({r.payroll_year})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Calculated Payroll Details Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-3 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            Payroll Register & Breakdown ({activeDetails.length} Workers)
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Click any row to view full statutory calculation formula
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Worker Name</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Basic</th>
                <th className="p-3 text-right">OT Pay</th>
                <th className="p-3 text-right">Allowance</th>
                <th className="p-3 text-right font-bold text-slate-900 dark:text-white">Gross</th>
                <th className="p-3 text-right">SSS (EE)</th>
                <th className="p-3 text-right">PhilHealth</th>
                <th className="p-3 text-right">Pag-IBIG</th>
                <th className="p-3 text-right">Tax (TRAIN)</th>
                <th className="p-3 text-right">Loans/Ded</th>
                <th className="p-3 text-right text-rose-600 font-bold">Total Ded.</th>
                <th className="p-3 text-right text-emerald-600 font-extrabold text-sm">Net Pay</th>
                <th className="p-3 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {activeDetails.map((d) => {
                const emp = empMap.get(d.employee_id);
                return (
                  <tr
                    key={d.id}
                    onClick={() => setDrilldownDetail(d)}
                    className="hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
                  >
                    <td className="p-3 font-mono font-bold text-blue-700 dark:text-blue-400">
                      {d.employee_id}
                    </td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {emp ? `${emp.last_name}, ${emp.first_name}` : d.employee_id}
                    </td>
                    <td className="p-3 text-slate-500 dark:text-slate-400">{emp?.employee_type}</td>
                    <td className="p-3 text-right font-medium">₱{d.basic_pay.toFixed(2)}</td>
                    <td className="p-3 text-right font-medium">₱{d.overtime_pay.toFixed(2)}</td>
                    <td className="p-3 text-right font-medium">₱{d.allowance.toFixed(2)}</td>
                    <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                      ₱{d.gross_pay.toFixed(2)}
                    </td>
                    <td className="p-3 text-right text-slate-600 dark:text-slate-300">
                      ₱{d.sss_employee.toFixed(2)}
                    </td>
                    <td className="p-3 text-right text-slate-600 dark:text-slate-300">
                      ₱{d.philhealth_employee.toFixed(2)}
                    </td>
                    <td className="p-3 text-right text-slate-600 dark:text-slate-300">
                      ₱{d.pagibig_employee.toFixed(2)}
                    </td>
                    <td className="p-3 text-right text-slate-600 dark:text-slate-300">
                      ₱{d.withholding_tax.toFixed(2)}
                    </td>
                    <td className="p-3 text-right text-slate-600 dark:text-slate-300">
                      ₱{(d.loan_deduction + d.attendance_deduction).toFixed(2)}
                    </td>
                    <td className="p-3 text-right font-bold text-rose-600 dark:text-rose-400">
                      ₱{d.total_deductions.toFixed(2)}
                    </td>
                    <td className="p-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                      ₱{d.net_pay.toFixed(2)}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDrilldownDetail(d);
                        }}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600"
                        title="View Calculation Formula"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Table Footer Totals */}
            <tfoot className="bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700">
              <tr>
                <td colSpan={3} className="p-3">
                  TOTALS ({activeDetails.length} Workers)
                </td>
                <td className="p-3 text-right">
                  ₱{activeDetails.reduce((s, r) => s + r.basic_pay, 0).toFixed(2)}
                </td>
                <td className="p-3 text-right">
                  ₱{activeDetails.reduce((s, r) => s + r.overtime_pay, 0).toFixed(2)}
                </td>
                <td className="p-3 text-right">
                  ₱{activeDetails.reduce((s, r) => s + r.allowance, 0).toFixed(2)}
                </td>
                <td className="p-3 text-right">
                  ₱{activeDetails.reduce((s, r) => s + r.gross_pay, 0).toFixed(2)}
                </td>
                <td className="p-3 text-right">
                  ₱{activeDetails.reduce((s, r) => s + r.sss_employee, 0).toFixed(2)}
                </td>
                <td className="p-3 text-right">
                  ₱{activeDetails.reduce((s, r) => s + r.philhealth_employee, 0).toFixed(2)}
                </td>
                <td className="p-3 text-right">
                  ₱{activeDetails.reduce((s, r) => s + r.pagibig_employee, 0).toFixed(2)}
                </td>
                <td className="p-3 text-right">
                  ₱{activeDetails.reduce((s, r) => s + r.withholding_tax, 0).toFixed(2)}
                </td>
                <td className="p-3 text-right">
                  ₱{activeDetails.reduce((s, r) => s + (r.loan_deduction + r.attendance_deduction), 0).toFixed(2)}
                </td>
                <td className="p-3 text-right text-rose-600">
                  ₱{activeDetails.reduce((s, r) => s + r.total_deductions, 0).toFixed(2)}
                </td>
                <td className="p-3 text-right text-emerald-600 text-sm">
                  ₱{activeDetails.reduce((s, r) => s + r.net_pay, 0).toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Confirmation Process Modal (Strict Prompt Requirement) */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 mx-auto flex items-center justify-center font-bold">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                PROCESS PAYROLL
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Barangay San Felipe II • Cavite City
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Payroll Period:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedMonth} {selectedCutoff === 1 ? '1–15' : '16–30'}, {selectedYear}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Active Workers:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {activeEmployees.length} Employees
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 font-semibold">
                <span className="text-slate-500">Estimated Total Gross:</span>
                <span>
                  ₱{activeEmployees.reduce((s, e) => s + (e.basic_salary + e.allowance) / 2, 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              This will calculate basic pay, overtime, tardiness, SSS, PhilHealth, Pag-IBIG, BIR withholding tax, and loan installments into Draft status.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteProcess}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20"
              >
                Confirm & Process Payroll
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drilldown Calculation Breakdown Modal */}
      {drilldownDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Statutory Calculation Breakdown
                </h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-mono font-bold">
                  {drilldownDetail.employee_id} • {empMap.get(drilldownDetail.employee_id)?.first_name} {empMap.get(drilldownDetail.employee_id)?.last_name}
                </p>
              </div>
              <button
                onClick={() => setDrilldownDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Earnings Breakdown */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <h4 className="font-bold text-blue-700 dark:text-blue-300 uppercase text-[10px]">
                  1. Gross Pay Breakdown
                </h4>
                <div className="flex justify-between">
                  <span>Semi-Monthly Basic (₱{drilldownDetail.monthly_basic} / 2):</span>
                  <span className="font-bold">₱{drilldownDetail.basic_pay.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Overtime Pay ({drilldownDetail.ot_hours} hrs @ 1.25x):</span>
                  <span className="font-bold">₱{drilldownDetail.overtime_pay.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Semi-Monthly Allowance:</span>
                  <span className="font-bold">₱{drilldownDetail.allowance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-1 font-bold text-slate-900 dark:text-white">
                  <span>Gross Pay Total:</span>
                  <span>₱{drilldownDetail.gross_pay.toFixed(2)}</span>
                </div>
              </div>

              {/* Statutory Deductions */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <h4 className="font-bold text-rose-700 dark:text-rose-300 uppercase text-[10px]">
                  2. Employee Statutory Deductions
                </h4>
                <div className="flex justify-between">
                  <span>SSS EE Share (2026 Table split):</span>
                  <span className="font-bold">₱{drilldownDetail.sss_employee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>PhilHealth EE Share (5% monthly split):</span>
                  <span className="font-bold">₱{drilldownDetail.philhealth_employee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pag-IBIG EE Share (HDMF monthly split):</span>
                  <span className="font-bold">₱{drilldownDetail.pagibig_employee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>BIR Withholding Tax (TRAIN Law):</span>
                  <span className="font-bold">₱{drilldownDetail.withholding_tax.toFixed(2)}</span>
                </div>
                {drilldownDetail.loan_deduction > 0 && (
                  <div className="flex justify-between">
                    <span>Loans / Installments:</span>
                    <span className="font-bold">₱{drilldownDetail.loan_deduction.toFixed(2)}</span>
                  </div>
                )}
                {drilldownDetail.attendance_deduction > 0 && (
                  <div className="flex justify-between">
                    <span>Late & Undertime Deductions:</span>
                    <span className="font-bold">₱{drilldownDetail.attendance_deduction.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-1 font-bold text-rose-600">
                  <span>Total Deductions:</span>
                  <span>-₱{drilldownDetail.total_deductions.toFixed(2)}</span>
                </div>
              </div>

              {/* Net Pay */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex justify-between items-center">
                <span className="font-extrabold text-emerald-900 dark:text-emerald-200 text-sm">
                  NET TAKE-HOME PAY:
                </span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-300 text-lg">
                  ₱{drilldownDetail.net_pay.toFixed(2)}
                </span>
              </div>

              {/* Employer Contributions (Not Deducted) */}
              <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-[11px] space-y-1">
                <span className="font-bold text-blue-900 dark:text-blue-200 block">
                  Employer Barangay Contributions (Not Deducted from Net Pay):
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  SSS Employer: ₱{drilldownDetail.sss_employer.toFixed(2)} | EC Fund: ₱{drilldownDetail.sss_ec.toFixed(2)} | PhilHealth Employer: ₱{drilldownDetail.philhealth_employer.toFixed(2)} | Pag-IBIG Employer: ₱{drilldownDetail.pagibig_employer.toFixed(2)}
                </p>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  Total Barangay Statutory Cost: ₱{drilldownDetail.total_employer_contributions.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="text-right pt-2">
              <button
                onClick={() => setDrilldownDetail(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reopen Modal */}
      {reopenModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-3 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-amber-500" />
              Request Reopen Payroll
            </h3>
            <p className="text-xs text-slate-500">
              Reopening resets HR and Finance approvals to Draft status. A mandatory audit log entry will be created.
            </p>

            <form onSubmit={handleReopenSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Reopening *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Corrected Tanod night shift overtime hours after barangay report."
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReopenModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 font-medium"
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
