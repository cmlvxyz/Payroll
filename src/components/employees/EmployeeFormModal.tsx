import React, { useState } from 'react';
import { X, Save, Shield, Truck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Employee, EmployeeType, EmployeeStatus } from '../../types';

interface EmployeeFormModalProps {
  employee: Employee | null;
  onClose: () => void;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({ employee, onClose }) => {
  const { addEmployee, updateEmployee } = useApp();

  const isEditing = !!employee;

  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    employee_id: employee?.employee_id || `SF2-0${Math.floor(Math.random() * 90 + 10)}`,
    first_name: employee?.first_name || '',
    middle_name: employee?.middle_name || '',
    last_name: employee?.last_name || '',
    suffix: employee?.suffix || '',
    employee_type: employee?.employee_type || 'Tanod',
    position: employee?.position || '',
    basic_salary: employee?.basic_salary || 12000,
    allowance: employee?.allowance || 1000,
    date_hired: employee?.date_hired || new Date().toISOString().slice(0, 10),
    status: employee?.status || 'Active',
    sss_no: employee?.sss_no || '04-0000000-0',
    philhealth_no: employee?.philhealth_no || '12-000000000-0',
    pagibig_no: employee?.pagibig_no || '1210-0000-0000',
    tin: employee?.tin || '000-000-000-000',
    bank_name: employee?.bank_name || 'BDO',
    bank_account: employee?.bank_account || '',
    contact_number: employee?.contact_number || '+63 900 000 0000',
    address: employee?.address || 'Brgy. San Felipe II, Cavite City',
    email: employee?.email || '',
    emergency_contact: employee?.emergency_contact || '',
    emergency_phone: employee?.emergency_phone || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.employee_id) {
      alert('Please fill out all required name and ID fields.');
      return;
    }

    if (isEditing && employee) {
      updateEmployee({ ...formData, id: employee.id });
    } else {
      addEmployee(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isEditing ? `Edit Worker: ${employee?.employee_id}` : 'Register New Barangay Worker'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Barangay San Felipe II • Timekeeping & Statutory Compensation Records
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Employee ID *
              </label>
              <input
                type="text"
                required
                value={formData.employee_id}
                onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-blue-700 dark:text-blue-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Worker Category *
              </label>
              <select
                value={formData.employee_type}
                onChange={(e) => setFormData({ ...formData, employee_type: e.target.value as EmployeeType })}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="Official">Barangay Official</option>
                <option value="Tanod">Barangay Tanod</option>
                <option value="Driver">Barangay Driver</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as EmployeeStatus })}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="Active">Active</option>
                <option value="Resigned">Resigned</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-1">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Middle Name
              </label>
              <input
                type="text"
                value={formData.middle_name}
                onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Suffix
              </label>
              <input
                type="text"
                placeholder="Jr., Sr., III"
                value={formData.suffix || ''}
                onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          {/* Position & Compensation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Position / Designation *
              </label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Monthly Basic Salary (PHP) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="100"
                value={formData.basic_salary}
                onChange={(e) => setFormData({ ...formData, basic_salary: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Monthly Allowance (PHP)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={formData.allowance}
                onChange={(e) => setFormData({ ...formData, allowance: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          {/* Philippine Statutory Numbers */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
            <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2 uppercase text-[11px] tracking-wider">
              Philippine Statutory Identification Numbers
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-0.5">
                  SSS Number (e.g. 04-1234567-8)
                </label>
                <input
                  type="text"
                  value={formData.sss_no}
                  onChange={(e) => setFormData({ ...formData, sss_no: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-0.5">
                  PhilHealth PIN (e.g. 12-098765432-1)
                </label>
                <input
                  type="text"
                  value={formData.philhealth_no}
                  onChange={(e) => setFormData({ ...formData, philhealth_no: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-0.5">
                  Pag-IBIG / HDMF MID
                </label>
                <input
                  type="text"
                  value={formData.pagibig_no}
                  onChange={(e) => setFormData({ ...formData, pagibig_no: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-0.5">
                  TIN (Tax Identification No.)
                </label>
                <input
                  type="text"
                  value={formData.tin}
                  onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
            <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2 uppercase text-[11px] tracking-wider">
              Bank Account for Direct Payout
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-0.5">Bank Partner</label>
                <select
                  value={formData.bank_name}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value as any })}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="BDO">BDO Unibank (Corporate Payroll)</option>
                  <option value="BPI">BPI (ExpressLink)</option>
                  <option value="Landbank">Landbank of the Philippines</option>
                  <option value="Cash / Check">Cash / Barangay Voucher</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-0.5">Account Number</label>
                <input
                  type="text"
                  value={formData.bank_account}
                  onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-100 dark:border-slate-800 pt-3">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-0.5">Contact Number</label>
              <input
                type="text"
                value={formData.contact_number}
                onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-0.5">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Register Worker'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
