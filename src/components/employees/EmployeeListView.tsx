import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  FileSpreadsheet,
  Eye,
  Edit2,
  Clock,
  FileText,
  UserX,
  Shield,
  Truck,
  ArrowUpDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Employee, EmployeeType, EmployeeStatus } from '../../types';
import { StatusBadge } from '../common/Badge';
import { ExportService } from '../../services/exportService';
import { EmployeeFormModal } from './EmployeeFormModal';

export const EmployeeListView: React.FC = () => {
  const {
    employees,
    setCurrentView,
    setSelectedEmployeeId,
    deactivateEmployee,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const filtered = employees.filter((emp) => {
    const matchesSearch =
      emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || emp.employee_type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || emp.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleViewProfile = (id: string) => {
    setSelectedEmployeeId(id);
    setCurrentView('employee_profile');
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleExportExcel = () => {
    ExportService.exportEmployeesExcel(employees);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Barangay Workers Masterlist
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 rounded-full">
              {filtered.length} of {employees.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Barangay San Felipe II • Officials, Tanods, and Drivers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={handleAddNew}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID (e.g. SF2-004), position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="ALL">All Categories</option>
            <option value="Official">Barangay Officials</option>
            <option value="Tanod">Barangay Tanods</option>
            <option value="Driver">Barangay Drivers</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="ALL">All Status</option>
            <option value="Active">Active Only</option>
            <option value="Resigned">Resigned / Inactive</option>
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Employee ID</th>
                <th className="p-3.5">Full Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Position</th>
                <th className="p-3.5 text-right">Monthly Basic</th>
                <th className="p-3.5 text-right">Allowance</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    No employee records match the search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => {
                  const typeIcons = {
                    Official: <Shield className="w-3.5 h-3.5 text-blue-600 inline mr-1" />,
                    Tanod: <Shield className="w-3.5 h-3.5 text-emerald-600 inline mr-1" />,
                    Driver: <Truck className="w-3.5 h-3.5 text-amber-600 inline mr-1" />,
                  };

                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-3.5 font-mono font-bold text-blue-700 dark:text-blue-400">
                        {emp.employee_id}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {emp.last_name}, {emp.first_name} {emp.middle_name || ''} {emp.suffix || ''}
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {emp.bank_name}: {emp.bank_account}
                        </span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">
                        {typeIcons[emp.employee_type]}
                        <span>{emp.employee_type}</span>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">
                        {emp.position}
                      </td>
                      <td className="p-3.5 text-right font-semibold text-slate-900 dark:text-slate-100">
                        ₱{emp.basic_salary.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3.5 text-right font-medium text-slate-600 dark:text-slate-400">
                        ₱{emp.allowance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3.5">
                        <StatusBadge status={emp.status} />
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleViewProfile(emp.employee_id)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50 transition-colors"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(emp)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Employee Information"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEmployeeId(emp.employee_id);
                              setCurrentView('attendance');
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                            title="View Attendance Log"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                          {emp.status === 'Active' && (
                            <button
                              onClick={() => {
                                if (
                                  confirm(`Are you sure you want to deactivate/resign ${emp.first_name} ${emp.last_name}?`)
                                ) {
                                  deactivateEmployee(emp.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                              title="Mark as Resigned"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <EmployeeFormModal
          employee={editingEmployee}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
