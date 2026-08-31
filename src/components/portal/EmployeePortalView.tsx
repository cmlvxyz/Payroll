import React from 'react';
import {
  User,
  Shield,
  Truck,
  Clock,
  FileText,
  DollarSign,
  Download,
  Calendar,
  CreditCard,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PdfService } from '../../services/pdfService';
import { StatusBadge } from '../common/Badge';

export const EmployeePortalView: React.FC = () => {
  const {
    currentUser,
    employees,
    attendanceRecords,
    payrollRuns,
    payrollDetails,
    loans,
    settings,
  } = useApp();

  // Find the employee matching the current logged in user or default to a Tanod
  const currentEmployee =
    employees.find((e) => e.employee_id === currentUser.employee_id) ||
    employees.find((e) => e.employee_type === 'Tanod') ||
    employees[0];

  const empAttendance = attendanceRecords.filter((a) => a.employee_id === currentEmployee.employee_id);
  const empPayrollDetails = payrollDetails.filter((d) => d.employee_id === currentEmployee.employee_id);
  const empLoans = loans.filter((l) => l.employee_id === currentEmployee.employee_id);

  const daysPresent = empAttendance.filter((a) => a.status === 'Present' || a.status === 'Adjusted').length;
  const daysLate = empAttendance.filter((a) => a.status === 'Late').length;
  const otHours = empAttendance.reduce((s, a) => s + (a.ot_hours || 0), 0);

  const latestDetail = empPayrollDetails[0];
  const latestRun = latestDetail
    ? payrollRuns.find((r) => r.id === latestDetail.payroll_run_id)
    : payrollRuns[0];

  const handleDownloadPayslip = (detail: (typeof empPayrollDetails)[0]) => {
    const run = payrollRuns.find((r) => r.id === detail.payroll_run_id) || payrollRuns[0];
    PdfService.generatePayslipPdf(currentEmployee, detail, run, settings);
  };

  return (
    <div className="relative -left-4 -top-5 space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg shadow-blue-900/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-2xl shadow-inner">
            {currentEmployee.first_name[0]}
            {currentEmployee.last_name[0]}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-semibold text-blue-200 mb-1">
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>Barangay Worker Portal • {currentEmployee.employee_type}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentEmployee.first_name} {currentEmployee.last_name}
            </h1>
            <p className="text-blue-100 text-xs mt-0.5">
              Employee ID: {currentEmployee.employee_id} • {currentEmployee.position}
            </p>
          </div>
        </div>

        {latestDetail && (
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-right">
            <span className="text-[10px] uppercase font-bold text-blue-200 block">Latest Net Payout</span>
            <p className="text-2xl font-black text-amber-300">
              ₱{latestDetail.net_pay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
            <button
              onClick={() => handleDownloadPayslip(latestDetail)}
              className="mt-2 px-3 py-1.5 rounded-lg bg-white text-slate-950 text-xs font-bold hover:bg-amber-300 transition-colors inline-flex items-center gap-1 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Payslip</span>
            </button>
          </div>
        )}
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Monthly Compensation</span>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            ₱{(currentEmployee.basic_salary + currentEmployee.allowance).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-500">Basic + Regular Allowance</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">Days Logged</span>
          <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {daysPresent} Days
          </p>
          <span className="text-[11px] text-slate-500">Active Cut-off Attendance</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">Overtime Hours</span>
          <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            {otHours} hrs
          </p>
          <span className="text-[11px] text-slate-500">Compensated at 1.25x</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400">Active Loans</span>
          <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {empLoans.length}
          </p>
          <span className="text-[11px] text-slate-500">Automatic Amortization</span>
        </div>
      </div>

      {/* 2-Column Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Statutory Identifiers & Bank */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-600" />
              My Government Statutory Records
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-500">SSS Number:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{currentEmployee.sss_no}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-500">PhilHealth PIN:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{currentEmployee.philhealth_no}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-500">Pag-IBIG / HDMF:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{currentEmployee.pagibig_no}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-500">TIN:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{currentEmployee.tin}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Payroll Payout Account
            </h3>

            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs">
              <p className="font-bold text-emerald-900 dark:text-emerald-200">{currentEmployee.bank_name}</p>
              <p className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm mt-1">
                {currentEmployee.bank_account || 'Cash Voucher Disbursement'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Direct credit deposit every 15th and 30th of the month.
              </p>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Payslip History & Attendance Log */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payslip History */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <FileText className="w-4 h-4 text-blue-600" />
              My Official Payslips & Compensation History
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Period</th>
                    <th className="p-3 text-right">Gross Pay</th>
                    <th className="p-3 text-right">Deductions</th>
                    <th className="p-3 text-right font-bold text-emerald-600">Net Take-Home</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {empPayrollDetails.map((d) => {
                    const run = payrollRuns.find((r) => r.id === d.payroll_run_id);
                    return (
                      <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          {run ? `${run.payroll_month} ${run.cutoff_number === 1 ? '1–15' : '16–30'}, ${run.payroll_year}` : d.payroll_run_id}
                        </td>
                        <td className="p-3 text-right">₱{d.gross_pay.toFixed(2)}</td>
                        <td className="p-3 text-right text-rose-600">-₱{d.total_deductions.toFixed(2)}</td>
                        <td className="p-3 text-right font-extrabold text-emerald-600 text-sm">
                          ₱{d.net_pay.toFixed(2)}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDownloadPayslip(d)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold inline-flex items-center gap-1 hover:bg-blue-100"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Timekeeping Log for Worker */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Clock className="w-4 h-4 text-blue-600" />
              Recent Timekeeping & Biometric Log
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Time In</th>
                    <th className="p-2.5">Time Out</th>
                    <th className="p-2.5 text-right">Late</th>
                    <th className="p-2.5 text-right">OT</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {empAttendance.slice(0, 7).map((r) => (
                    <tr key={r.id}>
                      <td className="p-2.5 font-medium">{r.attendance_date}</td>
                      <td className="p-2.5 font-mono">{r.time_in}</td>
                      <td className="p-2.5 font-mono">{r.time_out}</td>
                      <td className="p-2.5 text-right">
                        {r.late_minutes > 0 ? `${r.late_minutes}m` : '—'}
                      </td>
                      <td className="p-2.5 text-right">
                        {r.ot_hours > 0 ? `+${r.ot_hours}h` : '—'}
                      </td>
                      <td className="p-2.5">
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
