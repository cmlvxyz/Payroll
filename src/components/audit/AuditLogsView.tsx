import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  FileText,
  User,
  Clock,
  ArrowRight,
  Database,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.performed_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target_entity.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  return (
    <div className="relative -left-4 -top-5 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              COA & Government Compliance Audit Trail
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 rounded-full">
              {filteredLogs.length} Logged Actions
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable audit logging for attendance corrections, payroll state transitions, and statutory modifications.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail by user, action, employee ID, or remarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
          >
            <option value="ALL">All Actions</option>
            <option value="PAYROLL_PROCESS">PAYROLL_PROCESS</option>
            <option value="HR_APPROVE">HR_APPROVE</option>
            <option value="FINANCE_APPROVE">FINANCE_APPROVE</option>
            <option value="ATTENDANCE_ADJUST">ATTENDANCE_ADJUST</option>
            <option value="REOPEN_PAYROLL">REOPEN_PAYROLL</option>
            <option value="LOAN_UPDATE">LOAN_UPDATE</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">User / Role</th>
                <th className="p-3.5">Action Code</th>
                <th className="p-3.5">Target Entity</th>
                <th className="p-3.5">Details & Audit Remarks</th>
                <th className="p-3.5">State Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No audit records match the search.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const getActionColor = (act: string) => {
                    if (act.includes('APPROVE') || act.includes('PAID')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
                    if (act.includes('REOPEN') || act.includes('ADJUST')) return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
                    if (act.includes('DEACTIVATE')) return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
                    return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
                  };

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap text-[11px]">
                        {new Date(log.timestamp).toLocaleString('en-PH')}
                      </td>
                      <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {log.performed_by}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">
                        {log.target_entity}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300 max-w-md">
                        {log.details}
                      </td>
                      <td className="p-3.5 text-[11px]">
                        {log.old_value || log.new_value ? (
                          <div className="flex items-center gap-1.5 font-mono">
                            <span className="text-slate-400 line-through">{log.old_value || 'None'}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                            <span className="font-bold text-blue-600 dark:text-blue-400">{log.new_value}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
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
    </div>
  );
};
