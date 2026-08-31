import React, { useState } from 'react';
import {
  Clock,
  Upload,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  X,
  FileText,
  Shield,
  Truck,
  Plus,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord, AttendanceStatus, Employee } from '../../types';
import { StatusBadge } from '../common/Badge';
import { AttendanceService, CsvImportResult } from '../../services/attendanceService';
import { ExportService } from '../../services/exportService';

export const AttendanceView: React.FC = () => {
  const {
    attendanceRecords,
    employees,
    settings,
    addAttendanceRecords,
    adjustAttendance,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [importResult, setImportResult] = useState<CsvImportResult | null>(null);

  // Manual Adjustment Modal State
  const [adjustingRecord, setAdjustingRecord] = useState<AttendanceRecord | null>(null);
  const [adjTimeIn, setAdjTimeIn] = useState('');
  const [adjTimeOut, setAdjTimeOut] = useState('');
  const [adjReason, setAdjReason] = useState('');

  // Filter records
  const empMap = new Map<string, Employee>(employees.map((e) => [e.employee_id, e]));

  const filteredRecords = attendanceRecords.filter((r) => {
    const emp = empMap.get(r.employee_id);
    const empName = emp ? `${emp.first_name} ${emp.last_name}` : '';
    const matchesSearch =
      r.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !dateFilter || r.attendance_date === dateFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesDate && matchesStatus;
  });

  const handleOpenAdjust = (rec: AttendanceRecord) => {
    setAdjustingRecord(rec);
    setAdjTimeIn(rec.time_in);
    setAdjTimeOut(rec.time_out);
    setAdjReason(rec.adjustment_reason || '');
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingRecord) return;
    if (!adjReason.trim()) {
      alert('Mandatory adjustment reason is required for government audit compliance.');
      return;
    }
    adjustAttendance(adjustingRecord.id, adjTimeIn, adjTimeOut, adjReason.trim());
    setAdjustingRecord(null);
  };

  const handleParseCsv = (rawContent: string) => {
    const result = AttendanceService.parseBiometricCsv(rawContent, employees, settings);
    setImportResult(result);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
      handleParseCsv(content);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (importResult && importResult.records.length > 0) {
      addAttendanceRecords(importResult.records);
      setIsImportModalOpen(false);
      setCsvText('');
      setImportResult(null);
    }
  };

  const handleDownloadSampleCsv = () => {
    const sample = AttendanceService.getSampleBiometricCsv();
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SF2_Biometric_Attendance_Template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative -left-4 -top-5 space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Attendance & Timekeeping Management
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 rounded-full">
              {filteredRecords.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configured Schedule: {settings.work_start_time} - {settings.work_end_time} ({settings.required_daily_hours} hrs/day) • Biometric Integration
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => ExportService.exportAttendanceCsv(attendanceRecords, employees)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Upload className="w-4 h-4" />
            <span>Import Biometric CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="relative -top-2 flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by worker name or ID (e.g. SF2-004)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium"
          >
            <option value="ALL">All Status</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Adjusted">Adjusted</option>
            <option value="Absent">Absent</option>
          </select>

          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-1"
            >
              Clear Date
            </button>
          )}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="relative -top-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-auto max-h-[500px] attendance-scroll">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px] sticky top-0 z-10">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Employee ID</th>
                <th className="p-3.5">Worker Name</th>
                <th className="p-3.5">Time In</th>
                <th className="p-3.5">Time Out</th>
                <th className="p-3.5 text-right">Late (min)</th>
                <th className="p-3.5 text-right">Overtime (hrs)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Adjustment Reason / Log</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-slate-400">
                    No attendance records found for this filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const emp = empMap.get(r.employee_id);
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                        {r.attendance_date}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-blue-700 dark:text-blue-400">
                        {r.employee_id}
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {emp ? `${emp.last_name}, ${emp.first_name}` : r.employee_id}
                      </td>
                      <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">
                        {r.time_in}
                      </td>
                      <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">
                        {r.time_out}
                      </td>
                      <td className="p-3.5 text-right font-medium">
                        {r.late_minutes > 0 ? (
                          <span className="text-rose-600 font-bold">{r.late_minutes}m</span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right font-medium">
                        {r.ot_hours > 0 ? (
                          <span className="text-emerald-600 font-bold">+{r.ot_hours}h</span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="p-3.5 text-slate-500 dark:text-slate-400 text-[11px] max-w-[200px] truncate">
                        {r.adjustment_reason || '—'}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleOpenAdjust(r)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1 font-semibold text-[11px]"
                          title="Manual Attendance Adjustment"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Adjust</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Biometric Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-600" />
                  Import Biometric CSV Attendance
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Format: employee_id,date,time_in,time_out
                </p>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40">
                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>Need the standard CSV format template?</span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Download Sample CSV
                </button>
              </div>

              {/* Upload Input */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select CSV File from Biometric Device:
                </label>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              {/* Textarea for pasting directly */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Or Paste CSV Data Directly:
                </label>
                <textarea
                  rows={4}
                  placeholder={`employee_id,date,time_in,time_out\nSF2-001,2026-09-01,07:55,17:05\nSF2-004,2026-09-01,07:45,20:00`}
                  value={csvText}
                  onChange={(e) => {
                    setCsvText(e.target.value);
                    handleParseCsv(e.target.value);
                  }}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px]"
                />
              </div>

              {/* Validation Summary */}
              {importResult && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Valid: {importResult.importedCount} records
                    </span>
                    {importResult.skippedCount > 0 && (
                      <span className="text-amber-600">
                        Duplicates Skipped: {importResult.skippedCount}
                      </span>
                    )}
                    {importResult.errorCount > 0 && (
                      <span className="text-rose-600 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        Errors: {importResult.errorCount}
                      </span>
                    )}
                  </div>

                  {importResult.errors.length > 0 && (
                    <div className="max-h-24 overflow-y-auto bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg text-rose-800 dark:text-rose-300 text-[11px] space-y-1">
                      {importResult.errors.map((err, i) => (
                        <p key={i}>• {err}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  disabled={!importResult || importResult.importedCount === 0}
                  onClick={handleConfirmImport}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold shadow-md"
                >
                  Import {importResult?.importedCount || 0} Records
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Attendance Adjustment Modal */}
      {adjustingRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Edit2 className="w-4 h-4 text-blue-600" />
                Manual Attendance Adjustment
              </h3>
              <button onClick={() => setAdjustingRecord(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="p-5 space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Employee ID:</span>
                  <span className="font-mono font-bold text-blue-600">{adjustingRecord.employee_id}</span>
                </div>
                <div className="flex justify-between font-medium mt-1">
                  <span className="text-slate-500">Date:</span>
                  <span className="font-bold">{adjustingRecord.attendance_date}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    New Time-In (HH:mm)
                  </label>
                  <input
                    type="time"
                    required
                    value={adjTimeIn}
                    onChange={(e) => setAdjTimeIn(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    New Time-Out (HH:mm)
                  </label>
                  <input
                    type="time"
                    required
                    value={adjTimeOut}
                    onChange={(e) => setAdjTimeOut(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mandatory Audit Reason *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Biometric machine failed during power interruption. Verified by HR."
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustingRecord(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
                >
                  Save & Log Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
