import React from 'react';
import {
  ShieldCheck,
  UserCheck,
  Key,
  Shield,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const UsersView: React.FC = () => {
  const { currentUser, switchRole } = useApp();

  const userRolesList: {
    role: UserRole;
    name: string;
    email: string;
    description: string;
    permissions: string[];
  }[] = [
    {
      role: 'ADMIN',
      name: 'Hon. Nestor Nabaunag (Punong Barangay)',
      email: 'captain@sanfelipe2.gov.ph',
      description: 'Executive oversight, statutory configuration, final sign-off and audit logs.',
      permissions: [
        'Full System Configuration & Settings',
        'Approve & Reopen Payroll Runs',
        'Audit Trail & COA Compliance Inspection',
        'Employee Masterlist Management',
        'Direct Bank Payout File Export',
      ],
    },
    {
      role: 'HR',
      name: 'Maria Santos (HR & Timekeeper)',
      email: 'hr@sanfelipe2.gov.ph',
      description: 'Employee enrollment, biometric CSV import, attendance validation and adjustments.',
      permissions: [
        'Employee Masterlist Enrollment & Updates',
        'Biometric CSV Attendance Processing',
        'Manual Attendance Adjustments (Audit Logged)',
        'Step 1 HR Payroll Calculation & Review',
        'Generate Worker Payslips',
      ],
    },
    {
      role: 'FINANCE',
      name: 'Catherine D. Cinco (Barangay Treasurer)',
      email: 'treasurer@sanfelipe2.gov.ph',
      description: 'Fund disbursement, statutory contribution schedules (SSS, PHIC, HDMF, BIR), and bank payouts.',
      permissions: [
        'Step 2 Finance Approval & Fund Authorization',
        'SSS R-3, PhilHealth RF-1, Pag-IBIG MCRF Schedules',
        'BIR 1601-C Withholding Tax Export',
        'Bank Direct Credit File Generation (BDO/BPI/Landbank)',
        'Printable Payroll Register with Signatories',
      ],
    },
    {
      role: 'EMPLOYEE',
      name: 'Roberto Mendoza (Barangay Tanod)',
      email: 'roberto.m@sanfelipe2.gov.ph',
      description: 'Barangay worker self-service portal for viewing logs, loan balances, and downloading payslips.',
      permissions: [
        'View Personal Biometric Attendance Logs',
        'Download Official PDF Payslips',
        'Check Personal Loan & Amortization Balances',
        'Verify Personal SSS, PhilHealth, Pag-IBIG IDs',
      ],
    },
  ];

  return (
    <div className="relative -left-4 -top-5 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Role-Based Access Control & User Accounts
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 rounded-full">
              Active: {currentUser.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Switch between system roles to test permissions, two-step authorization workflows, and worker views.
          </p>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userRolesList.map((u) => {
          const isActive = currentUser.role === u.role;
          return (
            <div
              key={u.role}
              className={`p-6 rounded-2xl border transition-all ${
                isActive
                  ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 shadow-md shadow-blue-600/10'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {u.role}
                      </h3>
                      {isActive && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                          Current Session
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">{u.name}</p>
                    <p className="text-[11px] text-slate-400">{u.email}</p>
                  </div>
                </div>

                {!isActive && (
                  <button
                    onClick={() => switchRole(u.role)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Switch to Role
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                {u.description}
              </p>

              <div className="mt-4 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Permissions Included:
                </span>
                {u.permissions.map((perm, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
