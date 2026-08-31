import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/Toast';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { EmployeeListView } from './components/employees/EmployeeListView';
import { EmployeeProfileView } from './components/employees/EmployeeProfileView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { PayrollProcessingView } from './components/payroll/PayrollProcessingView';
import { ApprovalsView } from './components/approvals/ApprovalsView';
import { PayslipsView } from './components/payslips/PayslipsView';
import { ReportsView } from './components/reports/ReportsView';
import { LoansView } from './components/loans/LoansView';
import { AuditLogsView } from './components/audit/AuditLogsView';
import { SettingsView } from './components/settings/SettingsView';
import { UsersView } from './components/users/UsersView';
import { EmployeePortalView } from './components/portal/EmployeePortalView';

const MainLayout: React.FC = () => {
  const { currentView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'employees':
        return <EmployeeListView />;
      case 'employee_profile':
        return <EmployeeProfileView />;
      case 'attendance':
        return <AttendanceView />;
      case 'payroll':
        return <PayrollProcessingView />;
      case 'approvals':
        return <ApprovalsView />;
      case 'payslips':
        return <PayslipsView />;
      case 'reports':
      case 'banking':
        return <ReportsView />;
      case 'loans':
        return <LoansView />;
      case 'audit':
        return <AuditLogsView />;
      case 'users':
        return <UsersView />;
      case 'settings':
        return <SettingsView />;
      case 'employee_portal':
        return <EmployeePortalView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col overflow-hidden transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        mobileMenuOpen={mobileMenuOpen}
      />

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0 h-full">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
            />
            {/* Drawer */}
            <div className="relative w-64 max-w-[80vw] bg-white dark:bg-slate-900 h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
              <Sidebar onCloseMobileMenu={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
