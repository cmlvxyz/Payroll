import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Search,
  Filter,
  Shield,
  Truck,
  Eye,
  CheckCircle2,
  Calendar,
  Building2,
  DollarSign,
  Send,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PdfService } from '../../services/pdfService';
import { PayrollDetail, Employee } from '../../types';

export const PayslipsView: React.FC = () => {
  const {
    payrollRuns,
    payrollDetails,
    employees,
    selectedPayrollRunId,
    setSelectedPayrollRunId,
    settings,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [previewDetail, setPreviewDetail] = useState<PayrollDetail | null>(null);

  const activeRun = payrollRuns.find((r) => r.id === selectedPayrollRunId) || payrollRuns[0];
  const activeDetails = activeRun
    ? payrollDetails.filter((d) => d.payroll_run_id === activeRun.id)
    : [];

  const empMap = new Map<string, Employee>(employees.map((e) => [e.employee_id, e]));

  const filteredDetails = activeDetails.filter((d) => {
    const emp = empMap.get(d.employee_id);
    const empName = emp ? `${emp.first_name} ${emp.last_name}` : '';
    const matchesSearch =
      d.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || emp?.employee_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleDownloadSinglePdf = (d: PayrollDetail) => {
    const emp = empMap.get(d.employee_id);
    if (!emp || !activeRun) return;
    PdfService.generatePayslipPdf(emp, d, activeRun, settings);
  };

  const handleDownloadBatch = () => {
    if (!activeRun) return;
    activeDetails.forEach((d, idx) => {
      const emp = empMap.get(d.employee_id);
      if (emp) {
        setTimeout(() => {
          PdfService.generatePayslipPdf(emp, d, activeRun, settings);
        }, idx * 250);
      }
    });
  };

  const selectedPreviewEmp = previewDetail ? empMap.get(previewDetail.employee_id) : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Barangay Payslip Generator
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 rounded-full">
              {filteredDetails.length} Payslips Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Official Payslips for Barangay San Felipe II • Printable & PDF with statutory details
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span>Print View</span>
          </button>
          <button
            onClick={handleDownloadBatch}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Download All PDFs</span>
          </button>
        </div>
      </div>

      {/* Select Run & Search */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={activeRun?.id || ''}
            onChange={(e) => setSelectedPayrollRunId(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          >
            {payrollRuns.map((r) => (
              <option key={r.id} value={r.id}>
                {r.payroll_month} {r.cutoff_number === 1 ? '1–15' : '16–30'}, {r.payroll_year} ({r.status})
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
          >
            <option value="ALL">All Categories</option>
            <option value="Official">Officials</option>
            <option value="Tanod">Tanods</option>
            <option value="Driver">Drivers</option>
          </select>
        </div>
      </div>

      {/* Grid of Payslip Summary Cards + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Payslip Grid Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Worker Payslips ({filteredDetails.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredDetails.map((d) => {
              const emp = empMap.get(d.employee_id);
              return (
                <div
                  key={d.id}
                  onClick={() => setPreviewDetail(d)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    previewDetail?.id === d.id
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400">
                        {d.employee_id}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {emp ? `${emp.last_name}, ${emp.first_name}` : d.employee_id}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{emp?.position}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {emp?.employee_type}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Net Pay</span>
                      <p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
                        ₱{d.net_pay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewDetail(d);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-blue-600 dark:text-blue-400"
                        title="Preview On-Screen"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadSinglePdf(d);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-xs"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Live On-Screen Payslip Preview Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              Official Payslip Preview
            </h3>
            {previewDetail && (
              <button
                onClick={() => handleDownloadSinglePdf(previewDetail)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save PDF</span>
              </button>
            )}
          </div>

          {previewDetail && selectedPreviewEmp ? (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-3.5 font-sans">
              {/* Header inside preview */}
              <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-[10px] font-bold tracking-wider uppercase text-blue-700 dark:text-blue-300">
                  REPUBLIC OF THE PHILIPPINES
                </span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  BARANGAY SAN FELIPE II
                </h4>
                <p className="text-[10px] text-slate-500">
                  Cavite City, Cavite • Official Compensation Slip
                </p>
                <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-1">
                  Cut-off: {activeRun?.payroll_month} {activeRun?.cutoff_number === 1 ? '1–15' : '16–30'}, {activeRun?.payroll_year}
                </p>
              </div>

              {/* Worker Info */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px] block">EMPLOYEE</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedPreviewEmp.last_name}, {selectedPreviewEmp.first_name}
                  </span>
                  <span className="text-slate-500 block">{selectedPreviewEmp.position}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">ID & BANK</span>
                  <span className="font-mono font-bold text-blue-600">{selectedPreviewEmp.employee_id}</span>
                  <span className="text-slate-500 block">
                    {selectedPreviewEmp.bank_name}: {selectedPreviewEmp.bank_account || 'Cash Voucher'}
                  </span>
                </div>
              </div>

              {/* 2-Column Earnings & Deductions */}
              <div className="grid grid-cols-2 gap-3">
                {/* Earnings */}
                <div className="space-y-1 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 text-[10px] uppercase block">
                    Earnings
                  </span>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Basic Pay:</span>
                    <span>₱{previewDetail.basic_pay.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">OT ({previewDetail.ot_hours}h):</span>
                    <span>₱{previewDetail.overtime_pay.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Allowance:</span>
                    <span>₱{previewDetail.allowance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-1 font-bold">
                    <span>Gross Pay:</span>
                    <span>₱{previewDetail.gross_pay.toFixed(2)}</span>
                  </div>
                </div>

                {/* Deductions */}
                <div className="space-y-1 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-rose-700 dark:text-rose-300 text-[10px] uppercase block">
                    Deductions
                  </span>
                  <div className="flex justify-between">
                    <span className="text-slate-500">SSS (EE):</span>
                    <span>₱{previewDetail.sss_employee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">PhilHealth:</span>
                    <span>₱{previewDetail.philhealth_employee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pag-IBIG:</span>
                    <span>₱{previewDetail.pagibig_employee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Withholding Tax:</span>
                    <span>₱{previewDetail.withholding_tax.toFixed(2)}</span>
                  </div>
                  {previewDetail.loan_deduction > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Loans:</span>
                      <span>₱{previewDetail.loan_deduction.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-1 font-bold text-rose-600">
                    <span>Total Ded:</span>
                    <span>-₱{previewDetail.total_deductions.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Net Pay Callout */}
              <div className="p-3 rounded-xl bg-emerald-600 text-white flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-100">
                    NET DISBURSEMENT
                  </span>
                  <p className="text-xl font-black">
                    ₱{previewDetail.net_pay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-200" />
              </div>

              {/* Signatures block inside preview */}
              <div className="grid grid-cols-2 gap-2 text-[9px] text-center pt-2 text-slate-500 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{settings.barangay_treasurer}</p>
                  <p>Barangay Treasurer</p>
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{settings.punong_barangay}</p>
                  <p>Punong Barangay</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Select any payslip card to preview official breakdown.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
