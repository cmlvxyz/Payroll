import React from 'react';
import {
  ArrowLeft,
  Shield,
  Truck,
  Building2,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  Download,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import { PdfService } from '../../services/pdfService';

export const EmployeeProfileView: React.FC = () => {
  const {
    employees,
    selectedEmployeeId,
    setCurrentView,
    attendanceRecords,
    payrollRuns,
    payrollDetails,
    loans,
    settings,
  } = useApp();

  const employee = employees.find((e) => e.employee_id === selectedEmployeeId) || employees[0];

  if (!employee) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500">Employee not found.</p>
        <button
          onClick={() => setCurrentView('employees')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Back to List
        </button>
      </div>
    );
  }

  // Attendance stats for this employee
  const empAttendance = attendanceRecords.filter((a) => a.employee_id === employee.employee_id);
  const daysPresent = empAttendance.filter((a) => a.status === 'Present' || a.status === 'Adjusted').length;
  const daysLate = empAttendance.filter((a) => a.status === 'Late').length;
  const totalLateMin = empAttendance.reduce((s, a) => s + (a.late_minutes || 0), 0);
  const totalOtHrs = empAttendance.reduce((s, a) => s + (a.ot_hours || 0), 0);

  // Payroll history for this employee
  const empPayrollDetails = payrollDetails.filter((d) => d.employee_id === employee.employee_id);

  // Active Loans
  const empLoans = loans.filter((l) => l.employee_id === employee.employee_id);

  const handleDownloadPayslip = (detail: (typeof empPayrollDetails)[0]) => {
    const run = payrollRuns.find((r) => r.id === detail.payroll_run_id) || payrollRuns[0];
    PdfService.generatePayslipPdf(employee, detail, run, settings);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('employees')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Masterlist</span>
        </button>
        <div className="flex items-center gap-2">
          <StatusBadge status={employee.status} />
          <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
            {employee.employee_id}
          </span>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
              {employee.first_name[0]}
              {employee.last_name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {employee.last_name}, {employee.first_name} {employee.middle_name || ''}{' '}
                  {employee.suffix || ''}
                </h1>
              </div>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                {employee.position} • {employee.employee_type}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Barangay San Felipe II • Date Hired: {employee.date_hired}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Basic</span>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                ₱{employee.basic_salary.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="border-l border-slate-200 dark:border-slate-700 pl-4">
              <span className="text-[10px] uppercase font-bold text-slate-400">Allowance</span>
              <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                ₱{employee.allowance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal, Bank & Gov Numbers */}
        <div className="space-y-6">
          {/* Statutory Identifiers */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-600" />
              Government Statutory IDs
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400 font-medium">SSS No.</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {employee.sss_no || 'Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400 font-medium">PhilHealth PIN</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {employee.philhealth_no || 'Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Pag-IBIG / HDMF</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {employee.pagibig_no || 'Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400 font-medium">TIN</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {employee.tin || 'Missing'}
                </span>
              </div>
            </div>
          </div>

          {/* Bank & Payout Information */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Bank Payout Information
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Bank Partner</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{employee.bank_name}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Account Number</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {employee.bank_account || 'None specified'}
                </span>
              </div>
            </div>
          </div>

          {/* Active Barangay Loans */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-amber-600" />
              Active Loans & Deductions ({empLoans.length})
            </h3>

            {empLoans.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No active loan amortizations.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {empLoans.map((l) => (
                  <div
                    key={l.id}
                    className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 dark:text-amber-200">{l.loan_type}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        ₱{l.installment_amount}/cutoff
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Ref: {l.reference_number}</span>
                      <span>Balance: ₱{l.balance.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Columns: Timekeeping & Payroll History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timekeeping Summary Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Attendance & Timekeeping Summary (Active Cut-off)
              </h3>
              <span className="text-xs text-slate-400">{empAttendance.length} Logged Days</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                  Days Present
                </span>
                <p className="text-xl font-extrabold text-emerald-800 dark:text-emerald-200 mt-0.5">
                  {daysPresent}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40">
                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase">
                  Overtime (OT)
                </span>
                <p className="text-xl font-extrabold text-blue-800 dark:text-blue-200 mt-0.5">
                  {totalOtHrs} hrs
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40">
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">
                  Tardiness (Late)
                </span>
                <p className="text-xl font-extrabold text-amber-800 dark:text-amber-200 mt-0.5">
                  {totalLateMin} mins
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                  Recorded Days
                </span>
                <p className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                  {empAttendance.length}
                </p>
              </div>
            </div>
          </div>

          {/* Payroll & Payslip History Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Payroll & Payslip Disbursements History
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Payroll Run ID</th>
                    <th className="p-3 text-right">Gross Pay</th>
                    <th className="p-3 text-right">Deductions</th>
                    <th className="p-3 text-right">Net Take-Home</th>
                    <th className="p-3 text-center">Payslip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {empPayrollDetails.map((d) => {
                    const run = payrollRuns.find((r) => r.id === d.payroll_run_id);
                    return (
                      <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-blue-700 dark:text-blue-400">
                          {d.payroll_run_id}
                          <span className="block text-[10px] text-slate-400 font-sans font-normal">
                            {run ? `${run.payroll_month} ${run.cutoff_number === 1 ? '1-15' : '16-30'}` : ''}
                          </span>
                        </td>
                        <td className="p-3 text-right font-medium text-slate-800 dark:text-slate-200">
                          ₱{d.gross_pay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-right font-medium text-rose-600 dark:text-rose-400">
                          -₱{d.total_deductions.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                          ₱{d.net_pay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDownloadPayslip(d)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold hover:bg-blue-100 transition-colors shadow-xs"
                            title="Download Official PDF Payslip"
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
        </div>
      </div>
    </div>
  );
};
