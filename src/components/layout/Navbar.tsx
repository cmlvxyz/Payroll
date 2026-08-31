import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Shield,
  Bell,
  Menu,
  X,
  UserCheck,
  Calendar,
  Layers,
  ChevronDown,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HeaderBrand } from '../common/HeaderBrand';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  mobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu, mobileMenuOpen }) => {
  const {
    isDarkMode,
    toggleDarkMode,
    currentUser,
    switchRole,
    settings,
    payrollRuns,
    setCurrentView,
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const pendingApprovals = payrollRuns.filter(
    (r) => r.status === 'Draft' || r.status === 'HR Approved'
  ).length;

  const roles: { role: UserRole; title: string; desc: string }[] = [
    { role: 'ADMIN', title: 'Admin (Punong Barangay)', desc: 'Full System Control & Settings' },
    { role: 'HR', title: 'HR Officer', desc: 'Attendance & Employee Management' },
    { role: 'FINANCE', title: 'Finance (Barangay Treasurer)', desc: 'Payroll, Banks & Gov Reports' },
    { role: 'EMPLOYEE', title: 'Barangay Worker (Tanod/Driver)', desc: 'Personal Attendance & Payslips' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5">
        {/* Left: Mobile menu button + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 focus:outline-none transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="lg:hidden">
            <HeaderBrand compact />
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Limay, Bataan • SF II 2026 Active Payroll System</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setRoleDropdownOpen(!roleDropdownOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors shadow-sm"
              title="Switch role for demo testing"
            >
              <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
              <span className="hidden sm:inline text-slate-500 dark:text-slate-400">Role:</span>
              <span className="font-bold text-blue-700 dark:text-blue-300">{currentUser.role}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Active Session Role
                  </p>
                </div>
                <div className="py-1">
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchRole(r.role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-start gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                        currentUser.role === r.role ? 'bg-blue-50/70 dark:bg-blue-950/40' : ''
                      }`}
                    >
                      <Shield
                        className={`w-4 h-4 mt-0.5 ${
                          currentUser.role === r.role
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-400'
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {r.role}
                          </span>
                          {currentUser.role === r.role && (
                            <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{r.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setRoleDropdownOpen(false);
              }}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
              title="Statutory Deadlines & Alerts"
            >
              <Bell className="w-5 h-5" />
              {pendingApprovals > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Statutory Reminders & Alerts
                  </h4>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                    Brgy SF II
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40">
                    <p className="font-bold text-blue-900 dark:text-blue-200">
                      SSS, PhilHealth & Pag-IBIG Remittance
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                      Due by the {settings.sss_due_day}th of the following month. Verify monthly contributions before filing.
                    </p>
                  </div>

                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40">
                    <p className="font-bold text-amber-900 dark:text-amber-200">
                      BIR Form 1601-C Tax Return
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                      Due on or before the {settings.bir_due_day}th of the month following compensation withholding.
                    </p>
                  </div>

                  {pendingApprovals > 0 && (
                    <div
                      onClick={() => {
                        setCurrentView('approvals');
                        setNotificationsOpen(false);
                      }}
                      className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 cursor-pointer hover:bg-emerald-100/70 transition-colors"
                    >
                      <p className="font-bold text-emerald-900 dark:text-emerald-200">
                        {pendingApprovals} Payroll Run(s) Awaiting Approval
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                        Click to review and authorize payroll disbursements.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode for night reading'}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600 hover:-rotate-12 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
