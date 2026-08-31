import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  PlayCircle,
  X,
  Save,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LoanRecord, LoanType, Employee } from '../../types';
import { StatusBadge } from '../common/Badge';

export const LoansView: React.FC = () => {
  const { loans, employees, addLoan, updateLoan } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    employee_id: employees[0]?.employee_id || 'SF2-004',
    loan_type: 'SSS Salary Loan' as LoanType,
    principal_amount: 15000,
    installment_amount: 625,
    balance: 15000,
    start_date: new Date().toISOString().slice(0, 10),
    end_date: '2027-09-01',
    reference_number: `LN-2026-${Math.floor(Math.random() * 900 + 100)}`,
  });

  const empMap = new Map<string, Employee>(employees.map((e) => [e.employee_id, e]));

  const filteredLoans = loans.filter((l) => {
    const emp = empMap.get(l.employee_id);
    const empName = emp ? `${emp.first_name} ${emp.last_name}` : '';
    const matchesSearch =
      l.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || l.loan_type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalActiveBalances = loans
    .filter((l) => l.status === 'Active')
    .reduce((s, l) => s + l.balance, 0);

  const totalCutoffDeductions = loans
    .filter((l) => l.status === 'Active')
    .reduce((s, l) => s + l.installment_amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLoan({
      ...formData,
      status: 'Active',
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Barangay Worker Loans & Amortizations
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 rounded-full">
              {loans.filter((l) => l.status === 'Active').length} Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage SSS Salary Loans, Pag-IBIG Calamity Loans, and Barangay Emergency Cash Advances.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Loan</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Total Active Principal Balance</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₱{totalActiveBalances.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-500">Across all barangay employees</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase text-rose-600 dark:text-rose-400">
            Cut-off Amortization Deductions
          </span>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            ₱{totalCutoffDeductions.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-500">Automatic payroll reduction</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">
            Loan Types Supported
          </span>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">
            SSS • Pag-IBIG • Emergency CA • Uniform
          </p>
          <span className="text-[11px] text-emerald-600">Auto-stops upon reaching ₱0 balance</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by worker name, ID, or loan reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
          >
            <option value="ALL">All Loan Types</option>
            <option value="SSS Salary Loan">SSS Salary Loan</option>
            <option value="Pag-IBIG Calamity Loan">Pag-IBIG Calamity Loan</option>
            <option value="Barangay Emergency Loan">Barangay Emergency Loan</option>
            <option value="Cash Advance">Cash Advance</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
          >
            <option value="ALL">All Status</option>
            <option value="Active">Active</option>
            <option value="Fully Paid">Fully Paid</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Reference No</th>
                <th className="p-3.5">Employee</th>
                <th className="p-3.5">Loan Category</th>
                <th className="p-3.5 text-right">Principal</th>
                <th className="p-3.5 text-right">Installment / Cutoff</th>
                <th className="p-3.5 text-right font-bold text-slate-900 dark:text-white">Remaining Balance</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Toggle State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    No loan records found.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((l) => {
                  const emp = empMap.get(l.employee_id);
                  return (
                    <tr key={l.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 font-mono font-bold text-blue-700 dark:text-blue-400">
                        {l.reference_number}
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {emp ? `${emp.last_name}, ${emp.first_name}` : l.employee_id}
                        </span>
                        <span className="text-[11px] text-slate-400">{l.employee_id}</span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">
                        {l.loan_type}
                      </td>
                      <td className="p-3.5 text-right font-medium">
                        ₱{l.principal_amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3.5 text-right font-bold text-rose-600 dark:text-rose-400">
                        ₱{l.installment_amount.toFixed(2)}
                      </td>
                      <td className="p-3.5 text-right font-extrabold text-slate-900 dark:text-white text-sm">
                        ₱{l.balance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3.5">
                        <StatusBadge status={l.status} />
                      </td>
                      <td className="p-3.5 text-center">
                        {l.status === 'Active' ? (
                          <button
                            onClick={() => updateLoan({ ...l, status: 'Suspended' })}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-[11px] font-bold hover:bg-amber-100"
                            title="Suspend deduction for next cutoff"
                          >
                            <PauseCircle className="w-3.5 h-3.5" />
                            <span>Suspend</span>
                          </button>
                        ) : l.status === 'Suspended' ? (
                          <button
                            onClick={() => updateLoan({ ...l, status: 'Active' })}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] font-bold hover:bg-emerald-100"
                            title="Resume automatic deduction"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Resume</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Paid Off</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Loan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                Register New Loan / Deduction Schedule
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Employee *
                </label>
                <select
                  value={formData.employee_id}
                  onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  {employees.map((e) => (
                    <option key={e.employee_id} value={e.employee_id}>
                      {e.employee_id} - {e.last_name}, {e.first_name} ({e.employee_type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Loan Category *
                  </label>
                  <select
                    value={formData.loan_type}
                    onChange={(e) => setFormData({ ...formData, loan_type: e.target.value as LoanType })}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  >
                    <option value="SSS Salary Loan">SSS Salary Loan</option>
                    <option value="Pag-IBIG Calamity Loan">Pag-IBIG Calamity Loan</option>
                    <option value="Barangay Emergency Loan">Barangay Emergency Loan</option>
                    <option value="Cash Advance">Cash Advance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Reference / Voucher No *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.reference_number}
                    onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Principal Amount (PHP) *
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    step="50"
                    value={formData.principal_amount}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setFormData({ ...formData, principal_amount: val, balance: val });
                    }}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cut-off Installment (PHP) *
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    step="25"
                    value={formData.installment_amount}
                    onChange={(e) => setFormData({ ...formData, installment_amount: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-rose-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20"
                >
                  Register Loan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
