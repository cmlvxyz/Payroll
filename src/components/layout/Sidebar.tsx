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
  BadgeCheck,
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';
import { HeaderBrand } from '../common/HeaderBrand';

interface SidebarProps {
  onCloseMobileMenu?: () => void;
}

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ReactNode;
  roles: string[];
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobileMenu }) => {
  const { currentView, setCurrentView, currentUser, payrollRuns } = useApp();

  const pendingApprovalsCount = payrollRuns.filter(
    (r) => r.status === 'Draft' || r.status === 'HR Approved'
  ).length;

  const isEmployeeRole = currentUser.role === 'EMPLOYEE';

  const sections: { title: string; items: NavItem[] }[] = [
    {
      title: 'Overview',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
          roles: ['ADMIN', 'HR', 'FINANCE'],
        },
      ],
    },
    {
      title: 'Personnel Operations',
      items: [
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
      ],
    },
    {
      title: 'Payroll & Compensation',
      items: [
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
      ],
    },
    {
      title: 'Compliance & Banking',
      items: [
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
      ],
    },
    {
      title: 'Administration',
      items: [
        {
          id: 'audit',
          label: 'Audit Trail',
          icon: <History className="w-4 h-4" />,
          roles: ['ADMIN'],
        },
        {
          id: 'users',
          label: 'User Accounts',
          icon: <ShieldCheck className="w-4 h-4" />,
          roles: ['ADMIN'],
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: <Settings className="w-4 h-4" />,
          roles: ['ADMIN'],
        },
      ],
    },
  ];

  const workerPortalItem: NavItem = {
    id: 'employee_portal',
    label: 'My Worker Portal',
    icon: <UserCheck className="w-4 h-4" />,
    roles: ['ADMIN', 'HR', 'FINANCE', 'EMPLOYEE'],
  };

  const handleNav = (view: AppView) => {
    setCurrentView(view);
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = currentView === item.id;
    return (
      <button
        key={item.id}
        onClick={() => handleNav(item.id)}
        className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
          isActive
            ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100'
        }`}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-amber-400" />
        )}
        <span className="flex items-center gap-3 min-w-0">
          <span className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}>{item.icon}</span>
          <span className="truncate">{item.label}</span>
        </span>
        {item.badge !== undefined && (
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
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
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full transition-colors duration-200 select-none">
      {/* Brand Header */}
      <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800/80">
        <HeaderBrand />
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {isEmployeeRole ? (
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
              Worker Self Service
            </div>
            {renderNavItem(workerPortalItem)}
          </div>
        ) : (
          sections.map((section) => {
            const items = section.items.filter((item) => item.roles.includes(currentUser.role));
            if (items.length === 0) return null;
            return (
              <div key={section.title} className="space-y-1">
                <div className="px-3 pb-1 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                  {section.title}
                </div>
                {items.map(renderNavItem)}
              </div>
            );
          })
        )}

        {!isEmployeeRole && (
          <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="px-3 pb-1 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
              Self Service
            </div>
            {renderNavItem(workerPortalItem)}
          </div>
        )}
      </div>

      {/* Active User Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
        <div className="flex items-center gap-3 px-1.5 py-2 rounded-lg">
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-white/60 dark:ring-slate-800 shrink-0">
            {currentUser.name.slice(0, 2).toUpperCase()}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {currentUser.name}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <BadgeCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
