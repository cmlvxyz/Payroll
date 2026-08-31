import React, { useState } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  Building2,
  Shield,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BarangaySettings } from '../../types';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetToDemoData } = useApp();

  const [formData, setFormData] = useState<BarangaySettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetDemo = () => {
    if (confirm('Are you sure you want to reset all records back to pristine Barangay San Felipe II demo data?')) {
      resetToDemoData();
    }
  };

  return (
    <div className="relative -left-4 -top-5 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Barangay Payroll & Statutory Parameters
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 rounded-full">
              CY 2026 Tables
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure statutory contribution rates, barangay officials signatories, and timekeeping policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDemo}
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Barangay and statutory settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Barangay Details & Signatories */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Building2 className="w-4 h-4 text-blue-600" />
            Barangay Information & Official Signatories
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Barangay Name
              </label>
              <input
                type="text"
                required
                value={formData.barangay_name}
                onChange={(e) => setFormData({ ...formData, barangay_name: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                City / Municipality
              </label>
              <input
                type="text"
                required
                value={formData.municipality}
                onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Province
              </label>
              <input
                type="text"
                required
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Punong Barangay (Captain Signatory)
              </label>
              <input
                type="text"
                required
                value={formData.punong_barangay}
                onChange={(e) => setFormData({ ...formData, punong_barangay: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
              />
              <span className="text-[10px] text-slate-400">Appears on official payroll registers and payslips</span>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Barangay Treasurer (Finance Signatory)
              </label>
              <input
                type="text"
                required
                value={formData.barangay_treasurer}
                onChange={(e) => setFormData({ ...formData, barangay_treasurer: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
              />
              <span className="text-[10px] text-slate-400">Prepares and certifies statutory remittances</span>
            </div>
          </div>
        </div>

        {/* Statutory Parameters Reference & Overrides */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Shield className="w-4 h-4 text-emerald-600" />
            Philippine Statutory Contribution Parameters (CY 2026)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 space-y-2">
              <span className="font-bold text-blue-900 dark:text-blue-200 text-xs block">
                Social Security System (SSS)
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                15.0% Total Rate (10.0% Employer, 5.0% Employee) + EC Fund. Based on 2026 Monthly Salary Credit brackets.
              </p>
              <div className="text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                Monthly Remittance Due: {formData.sss_due_day}th of the month
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 space-y-2">
              <span className="font-bold text-emerald-900 dark:text-emerald-200 text-xs block">
                PhilHealth (PHIC)
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                5.0% Premium Rate (2.5% Employee, 2.5% Employer). Income floor ₱10,000; income ceiling ₱100,000.
              </p>
              <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                Monthly Remittance Due: {formData.philhealth_due_day}th of the month
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/30 space-y-2">
              <span className="font-bold text-amber-900 dark:text-amber-200 text-xs block">
                Pag-IBIG / HDMF Fund
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                2.0% Employee, 2.0% Employer. Standard monthly employee cap: ₱200 (₱100/semi-monthly cutoff).
              </p>
              <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                Monthly Remittance Due: {formData.pagibig_due_day}th of the month
              </div>
            </div>
          </div>
        </div>

        {/* Working Hours & Remittance Deadlines */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Clock className="w-4 h-4 text-blue-600" />
            Timekeeping Schedule & Remittance Day Deadlines
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Standard Time In
              </label>
              <input
                type="time"
                value={formData.work_start_time}
                onChange={(e) => setFormData({ ...formData, work_start_time: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Standard Time Out
              </label>
              <input
                type="time"
                value={formData.work_end_time}
                onChange={(e) => setFormData({ ...formData, work_end_time: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Overtime Multiplier
              </label>
              <input
                type="number"
                step="0.05"
                value={formData.ot_rate_multiplier}
                onChange={(e) => setFormData({ ...formData, ot_rate_multiplier: parseFloat(e.target.value) || 1.25 })}
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                BIR 1601-C Due Day
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={formData.bir_due_day}
                onChange={(e) => setFormData({ ...formData, bir_due_day: parseInt(e.target.value) || 10 })}
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Barangay Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
};
