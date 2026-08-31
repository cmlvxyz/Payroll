import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Building2,
  Landmark,
  Shield,
  CreditCard,
  FileCheck,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExportService } from '../../services/exportService';
import { Employee } from '../../types';

export const ReportsView: React.FC = () => {
  const {
    payrollRuns,
    payrollDetails,
    employees,
    selectedPayrollRunId,
    setSelectedPayrollRunId,
    settings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'sss' | 'philhealth' | 'pagibig' | 'bir' | 'bank' | 'register'>('sss');
  const [bankType, setBankType] = useState<'BDO' | 'BPI' | 'Landbank'>('BDO');

  const activeRun = payrollRuns.find((r) => r.id === selectedPayrollRunId) || payrollRuns[0];
  const activeDetails = activeRun
    ? payrollDetails.filter((d) => d.payroll_run_id === activeRun.id)
    : [];

  const empMap = new Map<string, Employee>(employees.map((e) => [e.employee_id, e]));

  // Totals calculations
  const totalSssEE = activeDetails.reduce((s, d) => s + d.sss_employee, 0);
  const totalSssER = activeDetails.reduce((s, d) => s + d.sss_employer, 0);
  const totalSssEC = activeDetails.reduce((s, d) => s + d.sss_ec, 0);
  const grandTotalSss = totalSssEE + totalSssER + totalSssEC;

  const totalPhicEE = activeDetails.reduce((s, d) => s + d.philhealth_employee, 0);
  const totalPhicER = activeDetails.reduce((s, d) => s + d.philhealth_employer, 0);
  const grandTotalPhic = totalPhicEE + totalPhicER;

  const totalPagibigEE = activeDetails.reduce((s, d) => s + d.pagibig_employee, 0);
  const totalPagibigER = activeDetails.reduce((s, d) => s + d.pagibig_employer, 0);
  const grandTotalPagibig = totalPagibigEE + totalPagibigER;

  const totalTax = activeDetails.reduce((s, d) => s + d.withholding_tax, 0);
  const totalGross = activeDetails.reduce((s, d) => s + d.gross_pay, 0);
  const totalNet = activeDetails.reduce((s, d) => s + d.net_pay, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Philippine Statutory & Bank Payout Reports
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 rounded-full">
              CY 2026 Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Export compliant schedules for SSS R-3, PhilHealth RF-1, Pag-IBIG MCRF, BIR 1601-C, and Corporate Bank CSV files.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span>Print Current Report</span>
          </button>
        </div>
      </div>

      {/* Select Period & Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Period:</span>
          <select
            value={activeRun?.id || ''}
            onChange={(e) => setSelectedPayrollRunId(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          >
            {payrollRuns.map((r) => (
              <option key={r.id} value={r.id}>
                {r.payroll_month} Cut-off {r.cutoff_number} ({r.payroll_year})
              </option>
            ))}
          </select>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('sss')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'sss'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            SSS (R-3)
          </button>
          <button
            onClick={() => setActiveTab('philhealth')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'philhealth'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            PhilHealth (RF-1)
          </button>
          <button
            onClick={() => setActiveTab('pagibig')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'pagibig'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Pag-IBIG (MCRF)
          </button>
          <button
            onClick={() => setActiveTab('bir')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'bir'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            BIR (1601-C)
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'bank'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Bank Payout CSV
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'register'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Full Master Register
          </button>
        </div>
      </div>

      {/* Main Report Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        {/* Report Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Barangay San Felipe II • Cavite City
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {activeTab === 'sss' && 'SSS Monthly Collection & Contribution List (R-3 Format)'}
              {activeTab === 'philhealth' && 'PhilHealth Monthly Remittance Report (RF-1 Format)'}
              {activeTab === 'pagibig' && 'Pag-IBIG Member Contribution Remittance Form (MCRF)'}
              {activeTab === 'bir' && 'BIR Form 1601-C & Compensation Withholding Tax Schedule'}
              {activeTab === 'bank' && `Bank Direct Payout File (${bankType} Corporate Format)`}
              {activeTab === 'register' && 'Official Semi-Monthly Payroll Master Register'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Period: {activeRun?.period_start} to {activeRun?.period_end}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'bank' && (
              <select
                value={bankType}
                onChange={(e) => setBankType(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              >
                <option value="BDO">BDO Unibank (EPCS/Auto-Credit)</option>
                <option value="BPI">BPI ExpressLink</option>
                <option value="Landbank">Landbank Findes</option>
              </select>
            )}

            <button
              onClick={() => {
                if (activeTab === 'sss') ExportService.exportSssReportCsv(activeRun, activeDetails, employees);
                else if (activeTab === 'philhealth') ExportService.exportPhilHealthReportCsv(activeRun, activeDetails, employees);
                else if (activeTab === 'pagibig') ExportService.exportPagIbigReportCsv(activeRun, activeDetails, employees);
                else if (activeTab === 'bir') ExportService.exportBirReportCsv(activeRun, activeDetails, employees);
                else if (activeTab === 'bank') ExportService.exportBankPayoutCsv(activeRun, activeDetails, employees, bankType);
                else if (activeTab === 'register') ExportService.exportPayrollRegisterExcel(activeRun, activeDetails, employees, settings);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export {activeTab === 'register' ? 'Excel' : 'CSV'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Tables Based on Tab */}
        {activeTab === 'sss' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">SSS Number</th>
                    <th className="p-3">Employee Name</th>
                    <th className="p-3 text-right">Monthly Compensation</th>
                    <th className="p-3 text-right">EE Share (5%)</th>
                    <th className="p-3 text-right">ER Share (10%)</th>
                    <th className="p-3 text-right">EC Fund</th>
                    <th className="p-3 text-right font-bold text-blue-700 dark:text-blue-400">Total SSS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeDetails.map((d) => {
                    const emp = empMap.get(d.employee_id);
                    return (
                      <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {emp?.sss_no || 'Missing'}
                        </td>
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          {emp ? `${emp.last_name}, ${emp.first_name}` : d.employee_id}
                        </td>
                        <td className="p-3 text-right font-medium">₱{d.monthly_basic.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium">₱{d.sss_employee.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium">₱{d.sss_employer.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium">₱{d.sss_ec.toFixed(2)}</td>
                        <td className="p-3 text-right font-bold text-blue-700 dark:text-blue-400">
                          ₱{(d.sss_employee + d.sss_employer + d.sss_ec).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700">
                  <tr>
                    <td colSpan={3} className="p-3">TOTAL SSS REMITTANCE</td>
                    <td className="p-3 text-right">₱{totalSssEE.toFixed(2)}</td>
                    <td className="p-3 text-right">₱{totalSssER.toFixed(2)}</td>
                    <td className="p-3 text-right">₱{totalSssEC.toFixed(2)}</td>
                    <td className="p-3 text-right text-blue-700 dark:text-blue-300 text-sm">
                      ₱{grandTotalSss.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'philhealth' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">PhilHealth PIN</th>
                    <th className="p-3">Employee Name</th>
                    <th className="p-3 text-right">Basic Monthly Salary</th>
                    <th className="p-3 text-right">Employee Share (2.5%)</th>
                    <th className="p-3 text-right">Employer Share (2.5%)</th>
                    <th className="p-3 text-right font-bold text-emerald-700 dark:text-emerald-400">
                      Total PHIC (5%)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeDetails.map((d) => {
                    const emp = empMap.get(d.employee_id);
                    return (
                      <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {emp?.philhealth_no || 'Missing'}
                        </td>
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          {emp ? `${emp.last_name}, ${emp.first_name}` : d.employee_id}
                        </td>
                        <td className="p-3 text-right font-medium">₱{d.monthly_basic.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium">₱{d.philhealth_employee.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium">₱{d.philhealth_employer.toFixed(2)}</td>
                        <td className="p-3 text-right font-bold text-emerald-700 dark:text-emerald-400">
                          ₱{(d.philhealth_employee + d.philhealth_employer).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700">
                  <tr>
                    <td colSpan={3} className="p-3">TOTAL PHILHEALTH REMITTANCE</td>
                    <td className="p-3 text-right">₱{totalPhicEE.toFixed(2)}</td>
                    <td className="p-3 text-right">₱{totalPhicER.toFixed(2)}</td>
                    <td className="p-3 text-right text-emerald-700 dark:text-emerald-300 text-sm">
                      ₱{grandTotalPhic.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'pagibig' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Pag-IBIG MID</th>
                    <th className="p-3">Employee Name</th>
                    <th className="p-3 text-right">Monthly Compensation</th>
                    <th className="p-3 text-right">Employee Share</th>
                    <th className="p-3 text-right">Employer Share</th>
                    <th className="p-3 text-right font-bold text-blue-700 dark:text-blue-400">Total HDMF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeDetails.map((d) => {
                    const emp = empMap.get(d.employee_id);
                    return (
                      <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {emp?.pagibig_no || 'Missing'}
                        </td>
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          {emp ? `${emp.last_name}, ${emp.first_name}` : d.employee_id}
                        </td>
                        <td className="p-3 text-right font-medium">₱{d.monthly_basic.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium">₱{d.pagibig_employee.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium">₱{d.pagibig_employer.toFixed(2)}</td>
                        <td className="p-3 text-right font-bold text-blue-700 dark:text-blue-400">
                          ₱{(d.pagibig_employee + d.pagibig_employer).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700">
                  <tr>
                    <td colSpan={3} className="p-3">TOTAL PAG-IBIG REMITTANCE</td>
                    <td className="p-3 text-right">₱{totalPagibigEE.toFixed(2)}</td>
                    <td className="p-3 text-right">₱{totalPagibigER.toFixed(2)}</td>
                    <td className="p-3 text-right text-blue-700 dark:text-blue-300 text-sm">
                      ₱{grandTotalPagibig.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bir' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">TIN</th>
                    <th className="p-3">Employee Name</th>
                    <th className="p-3 text-right">Gross Taxable Compensation</th>
                    <th className="p-3 text-right">Statutory Deductions (Non-Taxable)</th>
                    <th className="p-3 text-right">Net Taxable Compensation</th>
                    <th className="p-3 text-right font-bold text-rose-700 dark:text-rose-400">
                      Tax Withheld (TRAIN Law)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeDetails.map((d) => {
                    const emp = empMap.get(d.employee_id);
                    const nonTax = d.sss_employee + d.philhealth_employee + d.pagibig_employee;
                    const taxable = Math.max(0, d.gross_pay - nonTax);
                    return (
                      <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {emp?.tin || 'Missing'}
                        </td>
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          {emp ? `${emp.last_name}, ${emp.first_name}` : d.employee_id}
                        </td>
                        <td className="p-3 text-right font-medium">₱{d.gross_pay.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium">₱{nonTax.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium">₱{taxable.toFixed(2)}</td>
                        <td className="p-3 text-right font-bold text-rose-600 dark:text-rose-400">
                          ₱{d.withholding_tax.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700">
                  <tr>
                    <td colSpan={5} className="p-3">TOTAL BIR 1601-C TAX WITHHELD</td>
                    <td className="p-3 text-right text-rose-600 text-sm">₱{totalTax.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bank' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Account Number</th>
                    <th className="p-3">Account Holder Name</th>
                    <th className="p-3">Bank Institution</th>
                    <th className="p-3 text-right font-bold text-emerald-700 dark:text-emerald-400">
                      Disbursement Amount (PHP)
                    </th>
                    <th className="p-3">Transaction Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeDetails.map((d) => {
                    const emp = empMap.get(d.employee_id);
                    return (
                      <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-blue-700 dark:text-blue-400">
                          {emp?.bank_account || 'CHECK/VOUCHER'}
                        </td>
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          {emp ? `${emp.last_name}, ${emp.first_name}` : d.employee_id}
                        </td>
                        <td className="p-3 font-medium text-slate-600 dark:text-slate-400">
                          {emp?.bank_name || 'Cash Voucher'}
                        </td>
                        <td className="p-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                          ₱{d.net_pay.toFixed(2)}
                        </td>
                        <td className="p-3 text-slate-500 dark:text-slate-400 text-[11px]">
                          SF2 PAYROLL {activeRun?.payroll_month} C{activeRun?.cutoff_number}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700">
                  <tr>
                    <td colSpan={3} className="p-3">TOTAL BANK DIRECT DISBURSEMENT</td>
                    <td className="p-3 text-right text-emerald-600 text-base">₱{totalNet.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'register' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 dark:bg-slate-800 font-bold border-b border-slate-200 dark:border-slate-800 uppercase text-[9px]">
                  <tr>
                    <th className="p-2">ID</th>
                    <th className="p-2">Name</th>
                    <th className="p-2 text-right">Basic</th>
                    <th className="p-2 text-right">OT</th>
                    <th className="p-2 text-right">Allowance</th>
                    <th className="p-2 text-right">Gross</th>
                    <th className="p-2 text-right">SSS</th>
                    <th className="p-2 text-right">PhilHealth</th>
                    <th className="p-2 text-right">Pag-IBIG</th>
                    <th className="p-2 text-right">Tax</th>
                    <th className="p-2 text-right">Deductions</th>
                    <th className="p-2 text-right font-bold text-emerald-600">Net Pay</th>
                    <th className="p-2 text-center">Signature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeDetails.map((d) => {
                    const emp = empMap.get(d.employee_id);
                    return (
                      <tr key={d.id}>
                        <td className="p-2 font-mono font-bold text-blue-700">{d.employee_id}</td>
                        <td className="p-2 font-bold whitespace-nowrap">
                          {emp ? `${emp.last_name}, ${emp.first_name}` : d.employee_id}
                        </td>
                        <td className="p-2 text-right">₱{d.basic_pay.toFixed(2)}</td>
                        <td className="p-2 text-right">₱{d.overtime_pay.toFixed(2)}</td>
                        <td className="p-2 text-right">₱{d.allowance.toFixed(2)}</td>
                        <td className="p-2 text-right font-bold">₱{d.gross_pay.toFixed(2)}</td>
                        <td className="p-2 text-right">₱{d.sss_employee.toFixed(2)}</td>
                        <td className="p-2 text-right">₱{d.philhealth_employee.toFixed(2)}</td>
                        <td className="p-2 text-right">₱{d.pagibig_employee.toFixed(2)}</td>
                        <td className="p-2 text-right">₱{d.withholding_tax.toFixed(2)}</td>
                        <td className="p-2 text-right text-rose-600 font-medium">₱{d.total_deductions.toFixed(2)}</td>
                        <td className="p-2 text-right text-emerald-600 font-extrabold">₱{d.net_pay.toFixed(2)}</td>
                        <td className="p-2 text-center text-slate-300 font-mono">________________</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Official Signatories Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold mb-8">Prepared and Certified Correct By:</p>
                <p className="font-extrabold text-slate-900 dark:text-white border-t border-slate-300 dark:border-slate-700 pt-2 inline-block px-8">
                  {settings.barangay_treasurer}
                </p>
                <p className="text-slate-500 font-medium">Barangay Treasurer</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold mb-8">Approved For Payout By:</p>
                <p className="font-extrabold text-slate-900 dark:text-white border-t border-slate-300 dark:border-slate-700 pt-2 inline-block px-8">
                  {settings.punong_barangay}
                </p>
                <p className="text-slate-500 font-medium">Punong Barangay (Captain)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
