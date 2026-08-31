import React from 'react';
import {
  Users,
  Shield,
  Truck,
  DollarSign,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  Landmark,
  Building2,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import { WorkflowGuide } from '../common/WorkflowGuide';

export const DashboardView: React.FC = () => {
  const {
    employees,
    attendanceRecords,
    payrollRuns,
    payrollDetails,
    settings,
    setCurrentView,
    setSelectedPayrollRunId,
  } = useApp();

  const totalEmployees = employees.length;
  const officialsCount = employees.filter((e) => e.employee_type === 'Official').length;
  const tanodsCount = employees.filter((e) => e.employee_type === 'Tanod').length;
  const driversCount = employees.filter((e) => e.employee_type === 'Driver').length;

  const latestRun = payrollRuns[0];
  const pendingApprovalsCount = payrollRuns.filter(
    (r) => r.status === 'Draft' || r.status === 'HR Approved'
  ).length;

  // Attendance metrics
  const totalAttendanceEntries = attendanceRecords.length;
  const presentCount = attendanceRecords.filter((a) => a.status === 'Present' || a.status === 'Adjusted').length;
  const lateCount = attendanceRecords.filter((a) => a.status === 'Late').length;
  const absentCount = attendanceRecords.filter((a) => a.status === 'Absent').length;
  const attendanceRate = totalAttendanceEntries > 0 ? Math.round((presentCount / totalAttendanceEntries) * 100) : 100;

  return (
    <div className="relative -left-4 -top-5 space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white shadow-lg shadow-blue-900/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold mb-2 border border-white/20">
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            <span>Barangay SF II • Limay, Bataan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Payroll & Timekeeping Dashboard
          </h1>
          <p className="text-blue-100 text-sm mt-1 max-w-2xl">
            Automated statutory deductions, timekeeping verification, and bank-ready payout reports for barangay workers.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setCurrentView('attendance')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all shadow-sm flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            <span>Import Attendance</span>
          </button>
          <button
            onClick={() => setCurrentView('payroll')}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Process Payroll</span>
          </button>
        </div>
      </div>

      {/* Step-by-Step Workflow Guide */}
      <WorkflowGuide />

      {/* Summary Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Total Employees */}
        <div
          onClick={() => setCurrentView('employees')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Workers
            </span>
            <Users className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalEmployees}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">100% Active</span>
        </div>

        {/* Barangay Officials */}
        <div
          onClick={() => setCurrentView('employees')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Officials
            </span>
            <Shield className="w-4 h-4 text-blue-700 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{officialsCount}</p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 inline-block">Captain & Kagawads</span>
        </div>

        {/* Barangay Tanods */}
        <div
          onClick={() => setCurrentView('employees')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tanods
            </span>
            <Shield className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{tanodsCount}</p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 inline-block">Security & Patrol</span>
        </div>

        {/* Barangay Drivers */}
        <div
          onClick={() => setCurrentView('employees')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Drivers
            </span>
            <Truck className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{driversCount}</p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 inline-block">Ambulance & Utility</span>
        </div>

        {/* Current Payroll Cost */}
        <div
          onClick={() => setCurrentView('payroll')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Net Payroll Cost
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            ₱{latestRun ? latestRun.total_net.toLocaleString('en-PH', { maximumFractionDigits: 0 }) : '0'}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 inline-block">
            {latestRun ? `${latestRun.payroll_month} Cut-off ${latestRun.cutoff_number}` : 'Current Cutoff'}
          </span>
        </div>

        {/* Pending Approvals */}
        <div
          onClick={() => setCurrentView('approvals')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pending Approvals
            </span>
            <CheckCircle2 className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {pendingApprovalsCount}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 inline-block">HR / Finance Queue</span>
        </div>
      </div>

      {/* Main Grid: Payroll Overview & Upcoming Statutory Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Latest Payroll Overview */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                Current Payroll Run Status
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {latestRun ? `Period: ${latestRun.period_start} to ${latestRun.period_end}` : 'No active run'}
              </p>
            </div>
            {latestRun && <StatusBadge status={latestRun.status} />}
          </div>

          {latestRun ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                  Gross Payroll
                </span>
                <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  ₱{latestRun.total_gross.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Basic + Overtime + Allowances
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30">
                <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                  Total Deductions
                </span>
                <p className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                  - ₱{latestRun.total_deductions.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Gov SSS/PHIC/HDMF/Tax + Loans
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Net Disbursement
                </span>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  ₱{latestRun.total_net.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Bank Payout Net Amount
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-sm">
              No payroll run processed yet. Click Process Payroll to begin.
            </div>
          )}

          {/* Quick Details Table Preview */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Barangay Workers in Active Cut-off
              </span>
              <button
                onClick={() => setCurrentView('payroll')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                View Full Register <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-2.5">ID</th>
                    <th className="p-2.5">Name</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5 text-right">Gross</th>
                    <th className="p-2.5 text-right">Deductions</th>
                    <th className="p-2.5 text-right">Net Pay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {payrollDetails.slice(0, 5).map((detail) => {
                    const emp = employees.find((e) => e.employee_id === detail.employee_id);
                    return (
                      <tr key={detail.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-2.5 font-mono font-bold text-blue-700 dark:text-blue-400">
                          {detail.employee_id}
                        </td>
                        <td className="p-2.5 font-medium text-slate-800 dark:text-slate-200">
                          {emp ? `${emp.last_name}, ${emp.first_name}` : detail.employee_id}
                        </td>
                        <td className="p-2.5 text-slate-500 dark:text-slate-400">
                          {emp?.employee_type}
                        </td>
                        <td className="p-2.5 text-right font-medium text-slate-900 dark:text-slate-100">
                          ₱{detail.gross_pay.toFixed(2)}
                        </td>
                        <td className="p-2.5 text-right font-medium text-rose-600 dark:text-rose-400">
                          ₱{detail.total_deductions.toFixed(2)}
                        </td>
                        <td className="p-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          ₱{detail.net_pay.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Upcoming Statutory Deadlines */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Upcoming Statutory Deadlines
              </h2>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full">
                CY 2026
              </span>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                  15th
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    2nd Cut-off Payroll Period Ends
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Timekeeping consolidation & HR Approval required.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                  {settings.sss_due_day}th
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    SSS R-3 Remittance Filing
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Employer & Employee contributions due for previous month.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                  {settings.philhealth_due_day}th
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    PhilHealth RF-1 & Pag-IBIG MCRF
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    5% PhilHealth split & HDMF mandatory remittance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-xs shrink-0">
                  {settings.bir_due_day}th
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    BIR Form 1601-C Remittance
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Monthly return of income taxes withheld on compensation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setCurrentView('reports')}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Landmark className="w-4 h-4 text-blue-600" />
              <span>Generate Statutory Files</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
