import React from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  Calculator,
  CheckSquare,
  FileText,
  Landmark,
  Building2,
  History,
  ShieldCheck,
  Settings,
  UserCheck,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';
import { HeaderBrand } from '../common/HeaderBrand';

interface SidebarProps {
  onCloseMobileMenu?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobileMenu }) => {
  const { currentView, setCurrentView, currentUser, payrollRuns } = useApp();

  const pendingApprovalsCount = payrollRuns.filter(
    (r) => r.status === 'Draft' || r.status === 'HR Approved'
  ).length;

  const isEmployeeRole = currentUser.role === 'EMPLOYEE';

  const navItems: {
    id: AppView;
    label: string;
    icon: React.ReactNode;
    roles: string[];
    badge?: number;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      roles: ['ADMIN', 'HR', 'FINANCE'],
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: <Users className="w-4 h-4" />,
      roles: ['ADMIN', 'HR', 'FINANCE'],
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: <Clock className="w-4 h-4" />,
      roles: ['ADMIN', 'HR'],
    },
    {
      id: 'payroll',
      label: 'Payroll',
      icon: <Calculator className="w-4 h-4" />,
      roles: ['ADMIN', 'HR', 'FINANCE'],
    },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: <CheckSquare className="w-4 h-4" />,
      roles: ['ADMIN', 'HR', 'FINANCE'],
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
    },
    {
      id: 'payslips',
      label: 'Payslips',
      icon: <FileText className="w-4 h-4" />,
      roles: ['ADMIN', 'HR', 'FINANCE'],
    },
    {
      id: 'reports',
      label: 'Government Reports',
      icon: <Landmark className="w-4 h-4" />,
      roles: ['ADMIN', 'FINANCE'],
    },
    {
      id: 'banking',
      label: 'Bank Export',
      icon: <Building2 className="w-4 h-4" />,
      roles: ['ADMIN', 'FINANCE'],
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      icon: <History className="w-4 h-4" />,
      roles: ['ADMIN'],
    },
    {
      id: 'users',
      label: 'Users',
      icon: <ShieldCheck className="w-4 h-4" />,
      roles: ['ADMIN'],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      roles: ['ADMIN'],
    },
    // Worker Portal Item
    {
      id: 'employee_portal',
      label: 'My Worker Portal',
      icon: <UserCheck className="w-4 h-4" />,
      roles: ['ADMIN', 'HR', 'FINANCE', 'EMPLOYEE'],
    },
  ];

  const filteredNav = navItems.filter((item) => item.roles.includes(currentUser.role));

  const handleNav = (view: AppView) => {
    setCurrentView(view);
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full transition-colors duration-200 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
        <HeaderBrand />
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
          {isEmployeeRole ? 'Worker Self Service' : 'Barangay Management'}
        </div>

        {filteredNav.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white text-blue-700'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Worker / Logged in User Footer Card */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 m-2 rounded-xl border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            {currentUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {currentUser.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
