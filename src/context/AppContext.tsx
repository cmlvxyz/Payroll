/**
 * @file AppContext.tsx
 * @description Central Application Context & State Management with LocalStorage persistence,
 * role authorization, dark mode switcher, and audit logging.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Employee,
  AttendanceRecord,
  LoanRecord,
  PayrollRun,
  PayrollDetail,
  AuditLog,
  User,
  UserRole,
  PayrollSettings,
} from '../types';
import {
  SEED_EMPLOYEES,
  SEED_USERS,
  SEED_LOANS,
  DEFAULT_SETTINGS,
  generateSeedAttendance,
} from '../data/seedData';
import { PayrollCalculationService } from '../services/payrollCalculationService';

export type AppView =
  | 'dashboard'
  | 'employees'
  | 'employee_profile'
  | 'attendance'
  | 'payroll'
  | 'approvals'
  | 'payslips'
  | 'reports'
  | 'banking'
  | 'audit'
  | 'users'
  | 'settings'
  | 'employee_portal';

interface AppContextType {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // View & Nav
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedEmployeeId: string | null;
  setSelectedEmployeeId: (id: string | null) => void;
  selectedPayrollRunId: string | null;
  setSelectedPayrollRunId: (id: string | null) => void;

  // Auth & Roles
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;

  // Employees
  employees: Employee[];
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (emp: Employee) => void;
  deactivateEmployee: (id: string) => void;

  // Attendance
  attendanceRecords: AttendanceRecord[];
  addAttendanceRecords: (records: AttendanceRecord[]) => void;
  adjustAttendance: (recordId: string, newTimeIn: string, newTimeOut: string, reason: string) => void;

  // Loans
  loans: LoanRecord[];
  addLoan: (loan: Omit<LoanRecord, 'id'>) => void;
  updateLoan: (loan: LoanRecord) => void;
  updateLoanStatus: (loanId: string, status: LoanRecord['status']) => void;

  // Payroll
  payrollRuns: PayrollRun[];
  payrollDetails: PayrollDetail[];
  processPayrollRun: (month: string, year: number, cutoff: 1 | 2) => PayrollRun;
  hrApprovePayroll: (runId: string) => void;
  financeApprovePayroll: (runId: string) => void;
  reopenPayroll: (runId: string, reason: string) => void;
  markAsPaid: (runId: string) => void;

  // Settings
  settings: PayrollSettings;
  updateSettings: (settings: PayrollSettings) => void;
  resetToDemoData: () => void;

  // Audit Logs
  auditLogs: AuditLog[];
  logAction: (action: string, module: AuditLog['module'], modelType: string, modelId: string, oldVal?: string, newVal?: string) => void;

  // Notification Toast
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sf2_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sf2_dark_mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // View state
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>('SF2-001');
  const [selectedPayrollRunId, setSelectedPayrollRunId] = useState<string | null>(null);

  // Users state
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('sf2_users');
    return saved ? JSON.parse(saved) : SEED_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    // FIX: Ensure currentUser is always from the 'users' state, not stale localStorage.
    // If a saved user is found, use it; otherwise, fallback to the first user in the 'users' array.
    const savedUser = localStorage.getItem('sf2_current_user');
    if (savedUser) {
      const parsedUser: User = JSON.parse(savedUser);
      return parsedUser;
    }
    return users[0] || SEED_USERS[0];
  });

  // Employees state
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('sf2_employees');
    return saved ? JSON.parse(saved) : SEED_EMPLOYEES;
  });

  // Attendance state
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('sf2_attendance');
    return saved ? JSON.parse(saved) : generateSeedAttendance();
  });

  // Loans state
  const [loans, setLoans] = useState<LoanRecord[]>(() => {
    const saved = localStorage.getItem('sf2_loans');
    return saved ? JSON.parse(saved) : SEED_LOANS;
  });

  // Settings state
  const [settings, setSettings] = useState<PayrollSettings>(() => {
    const saved = localStorage.getItem('sf2_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(() => {
    const saved = localStorage.getItem('sf2_payroll_runs');
    return saved ? JSON.parse(saved) : [];
  });

  const [payrollDetails, setPayrollDetails] = useState<PayrollDetail[]>(() => {
    const saved = localStorage.getItem('sf2_payroll_details');
    return saved ? JSON.parse(saved) : [];
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('sf2_audit_logs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'LOG-001',
        user_id: 'USR-002',
        user_name: 'Ricardo De Jesus (HR)',
        user_role: 'HR',
        action: 'Processed Payroll Run PR-2026-09-1',
        module: 'Payroll',
        model_type: 'PayrollRun',
        model_id: 'PR-2026-09-1',
        ip_address: '192.168.1.15',
        created_at: '2026-09-15 17:30:12',
      },
      {
        id: 'LOG-002',
        user_id: 'USR-002',
        user_name: 'Ricardo De Jesus (HR)',
        user_role: 'HR',
        action: 'HR Approved Payroll Run PR-2026-09-1',
        module: 'Approval',
        model_type: 'PayrollRun',
        model_id: 'PR-2026-09-1',
        ip_address: '192.168.1.15',
        created_at: '2026-09-15 17:45:00',
      },
      {
        id: 'LOG-003',
        user_id: 'USR-003',
        user_name: 'Catherine D. Cinco (Finance)',
        user_role: 'FINANCE',
        action: 'Finance Approved Payroll Run PR-2026-09-1',
        module: 'Approval',
        model_type: 'PayrollRun',
        model_id: 'PR-2026-09-1',
        ip_address: '192.168.1.18',
        created_at: '2026-09-16 09:10:44',
      },
    ];
  });

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('sf2_users', JSON.stringify(users));
  }, [users]);
  
  useEffect(() => {
    localStorage.setItem('sf2_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sf2_employees', JSON.stringify(employees));
  }, [employees]);
  useEffect(() => {
    localStorage.setItem('sf2_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);
  useEffect(() => {
    localStorage.setItem('sf2_loans', JSON.stringify(loans));
  }, [loans]);
  useEffect(() => {
    localStorage.setItem('sf2_settings', JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem('sf2_payroll_runs', JSON.stringify(payrollRuns));
  }, [payrollRuns]);
  useEffect(() => {
    localStorage.setItem('sf2_payroll_details', JSON.stringify(payrollDetails));
  }, [payrollDetails]);
  useEffect(() => {
    localStorage.setItem('sf2_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Log action helper
  const logAction = (
    action: string,
    module: AuditLog['module'],
    modelType: string,
    modelId: string,
    oldVal?: string,
    newVal?: string
  ) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_role: currentUser.role,
      action,
      module,
      model_type: modelType,
      model_id: modelId,
      old_values: oldVal,
      new_values: newVal,
      ip_address: '192.168.1.102',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Switch role simulation
  const switchRole = (role: UserRole) => {
    const matched = users.find((u) => u.role === role) || {
      id: `USR-ROLE-${role}`,
      name: `${role} User`,
      email: `${role.toLowerCase()}@sf2.local`,
      role,
      active: true,
    };
    setCurrentUser(matched);

    // If switching to EMPLOYEE, redirect to employee portal
    if (role === 'EMPLOYEE') {
      setCurrentView('employee_portal');
      setSelectedEmployeeId(matched.employee_id || 'SF2-004');
    } else if (currentView === 'employee_portal') {
      setCurrentView('dashboard');
    }

    logAction(`Switched session role to ${role}`, 'Auth', 'User', matched.id);
    showToast(`Role switched to ${role}`, 'info');
  };

  // User Actions
  const addUser = (user: Omit<User, 'id'>) => {
    const id = `USR-${Date.now().toString().slice(-4)}`;
    const newUser: User = { ...user, id };
    setUsers((prev) => [...prev, newUser]);
    logAction(`Created system user ${newUser.name} (${newUser.role})`, 'Auth', 'User', id);
    showToast(`User ${newUser.name} added successfully.`);
  };

  const updateUser = (updated: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    logAction(`Updated system user ${updated.name}`, 'Auth', 'User', updated.id);
    showToast(`User ${updated.name} updated.`);
  };

  // Employee Actions
  const addEmployee = (emp: Omit<Employee, 'id'>) => {
    const id = `EMP-${Date.now().toString().slice(-4)}`;
    const newEmp: Employee = { ...emp, id };
    setEmployees((prev) => [...prev, newEmp]);
    logAction(`Added new employee ${newEmp.first_name} ${newEmp.last_name} (${newEmp.employee_id})`, 'Employee', 'Employee', newEmp.employee_id);
    showToast(`Employee ${newEmp.employee_id} registered.`);
  };

  const updateEmployee = (updated: Employee) => {
    const old = employees.find((e) => e.id === updated.id);
    setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    logAction(
      `Updated employee info for ${updated.employee_id}`,
      'Employee',
      'Employee',
      updated.employee_id,
      old ? `Salary: PHP ${old.basic_salary}, Status: ${old.status}` : undefined,
      `Salary: PHP ${updated.basic_salary}, Status: ${updated.status}`
    );
    showToast(`Employee ${updated.employee_id} updated.`);
  };

  const deactivateEmployee = (id: string) => {
    const target = employees.find((e) => e.id === id);
    if (!target) return;
    const updated: Employee = { ...target, status: 'Resigned' };
    setEmployees((prev) => prev.map((e) => (e.id === id ? updated : e)));
    logAction(`Deactivated employee ${target.employee_id}`, 'Employee', 'Employee', target.employee_id);
    showToast(`Employee ${target.employee_id} status marked as Resigned.`);
  };

  // Attendance Actions
  const addAttendanceRecords = (records: AttendanceRecord[]) => {
    setAttendanceRecords((prev) => {
      const existingKeys = new Set(prev.map((r) => `${r.employee_id}-${r.attendance_date}`));
      const filteredNew = records.filter((r) => !existingKeys.has(`${r.employee_id}-${r.attendance_date}`));
      return [...filteredNew, ...prev];
    });
    logAction(`Imported ${records.length} biometric attendance records`, 'Attendance', 'Attendance', 'BATCH-IMPORT');
    showToast(`Imported ${records.length} attendance records.`);
  };

  const adjustAttendance = (recordId: string, newTimeIn: string, newTimeOut: string, reason: string) => {
    setAttendanceRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          const oldVal = `${r.time_in} - ${r.time_out}`;
          logAction(
            `Manually adjusted attendance for ${r.employee_id} on ${r.attendance_date}`,
            'Attendance',
            'AttendanceRecord',
            recordId,
            oldVal,
            `${newTimeIn} - ${newTimeOut} | Reason: ${reason}`
          );
          return {
            ...r,
            time_in: newTimeIn,
            time_out: newTimeOut,
            status: 'Adjusted',
            adjustment_reason: reason,
            adjusted_by: currentUser.name,
            adjusted_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
        }
        return r;
      })
    );
    showToast('Attendance record adjusted.');
  };

  // Loan Actions
  const addLoan = (loan: Omit<LoanRecord, 'id'>) => {
    const id = `LN-${Date.now().toString().slice(-4)}`;
    const newLoan: LoanRecord = { ...loan, id };
    setLoans((prev) => [...prev, newLoan]);
    logAction(`Added ${newLoan.loan_type} for ${newLoan.employee_id}`, 'Loan', 'LoanRecord', id);
    showToast(`Loan record added for ${newLoan.employee_id}.`);
  };

  const updateLoan = (loan: LoanRecord) => {
    setLoans((prev) => prev.map((l) => (l.id === loan.id ? loan : l)));
    logAction(`Updated loan ${loan.reference_number}`, 'Loan', 'LoanRecord', loan.id);
    showToast(`Loan ${loan.reference_number} updated.`);
  };

  const updateLoanStatus = (loanId: string, status: LoanRecord['status']) => {
    setLoans((prev) =>
      prev.map((l) => {
        if (l.id === loanId) {
          logAction(`Changed status of loan ${l.reference_number} to ${status}`, 'Loan', 'LoanRecord', loanId);
          return { ...l, status };
        }
        return l;
      })
    );
    showToast(`Loan status updated to ${status}.`);
  };

  // Payroll Processing
  const processPayrollRun = (month: string, year: number, cutoff: 1 | 2): PayrollRun => {
    const runId = `PR-${year}-${month.slice(0, 3).toUpperCase()}-${cutoff}`;
    const startDay = cutoff === 1 ? '01' : '16';
    const endDay = cutoff === 1 ? '15' : '30';
    const monthNum = ('0' + (new Date(`${month} 1, ${year}`).getMonth() + 1)).slice(-2);
    const periodStart = `${year}-${monthNum}-${startDay}`;
    const periodEnd = `${year}-${monthNum}-${endDay}`;

    const activeEmployees = employees.filter((e) => e.status === 'Active');
    const newDetails: PayrollDetail[] = activeEmployees.map((emp) =>
      PayrollCalculationService.calculateEmployeePayroll(
        emp,
        runId,
        attendanceRecords,
        loans,
        settings,
        cutoff
      )
    );

    const totalGross = newDetails.reduce((s, r) => s + r.gross_pay, 0);
    const totalDeductions = newDetails.reduce((s, r) => s + r.total_deductions, 0);
    const totalNet = newDetails.reduce((s, r) => s + r.net_pay, 0);
    const totalEmployerCost = newDetails.reduce((s, r) => s + r.total_employer_contributions, 0);

    const newRun: PayrollRun = {
      id: runId,
      payroll_run_id: runId,
      period_start: periodStart,
      period_end: periodEnd,
      payroll_month: month,
      payroll_year: year,
      cutoff_number: cutoff,
      status: 'Draft',
      total_gross: totalGross,
      total_deductions: totalDeductions,
      total_net: totalNet,
      total_employer_cost: totalEmployerCost,
      employee_count: activeEmployees.length,
      processed_by: currentUser.name,
      processed_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setPayrollRuns((prev) => [newRun, ...prev.filter((r) => r.id !== runId)]);
    setPayrollDetails((prev) => [...newDetails, ...prev.filter((d) => d.payroll_run_id !== runId)]);
    setSelectedPayrollRunId(runId);

    logAction(
      `Processed payroll ${runId} for ${activeEmployees.length} employees (${month} ${cutoff === 1 ? '1-15' : '16-30'})`,
      'Payroll',
      'PayrollRun',
      runId,
      undefined,
      `Gross: PHP ${totalGross}, Net: PHP ${totalNet}`
    );

    showToast(`Payroll ${runId} processed successfully in Draft state.`);
    return newRun;
  };

  const hrApprovePayroll = (runId: string) => {
    setPayrollRuns((prev) =>
      prev.map((r) =>
        r.id === runId
          ? {
              ...r,
              status: 'HR Approved',
              approved_by_hr: currentUser.name,
              approved_at_hr: new Date().toISOString().replace('T', ' ').slice(0, 16),
            }
          : r
      )
    );
    logAction(`HR Approved payroll run ${runId}`, 'Approval', 'PayrollRun', runId);
    showToast(`Payroll ${runId} is now HR Approved.`);
  };

  const financeApprovePayroll = (runId: string) => {
    setPayrollRuns((prev) =>
      prev.map((r) =>
        r.id === runId
          ? {
              ...r,
              status: 'Finance Approved',
              approved_by_finance: currentUser.name,
              approved_at_finance: new Date().toISOString().replace('T', ' ').slice(0, 16),
            }
          : r
      )
    );
    logAction(`Finance Approved payroll run ${runId}`, 'Approval', 'PayrollRun', runId);
    showToast(`Payroll ${runId} is Finance Approved and ready for payout.`);
  };

  const reopenPayroll = (runId: string, reason: string) => {
    setPayrollRuns((prev) =>
      prev.map((r) =>
        r.id === runId
          ? {
              ...r,
              status: 'Draft',
              reopen_reason: reason,
              reopened_by: currentUser.name,
              reopened_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
              approved_by_hr: undefined,
              approved_at_hr: undefined,
              approved_by_finance: undefined,
              approved_at_finance: undefined,
            }
          : r
      )
    );
    logAction(`Reopened payroll run ${runId}`, 'Payroll', 'PayrollRun', runId, undefined, `Reason: ${reason}`);
    showToast(`Payroll ${runId} reopened to Draft. Approvals reset.`);
  };

  const markAsPaid = (runId: string) => {
    setPayrollRuns((prev) =>
      prev.map((r) =>
        r.id === runId
          ? {
              ...r,
              status: 'Paid',
            }
          : r
      )
    );
    logAction(`Marked payroll run ${runId} as Paid / Completed`, 'Payroll', 'PayrollRun', runId);
    showToast(`Payroll ${runId} marked as Paid.`);
  };

  // Settings
  const updateSettings = (newSettings: PayrollSettings) => {
    setSettings(newSettings);
    logAction('Updated Barangay Payroll Settings', 'Settings', 'PayrollSettings', 'MAIN');
    showToast('Settings saved successfully.');
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setEmployees(SEED_EMPLOYEES);
    setAttendanceRecords([]);
    setLoans(SEED_LOANS);
    setPayrollRuns([]);
    setPayrollDetails([]);
    setSettings(DEFAULT_SETTINGS);
    setUsers(SEED_USERS);
    setCurrentUser(SEED_USERS[0]);
    showToast('Reset to pristine Barangay San Felipe II data.');
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        currentView,
        setCurrentView,
        selectedEmployeeId,
        setSelectedEmployeeId,
        selectedPayrollRunId,
        setSelectedPayrollRunId,
        currentUser,
        setCurrentUser,
        switchRole,
        users,
        addUser,
        updateUser,
        employees,
        addEmployee,
        updateEmployee,
        deactivateEmployee,
        attendanceRecords,
        addAttendanceRecords,
        adjustAttendance,
        loans,
        addLoan,
        updateLoan,
        updateLoanStatus,
        payrollRuns,
        payrollDetails,
        processPayrollRun,
        hrApprovePayroll,
        financeApprovePayroll,
        reopenPayroll,
        markAsPaid,
        settings,
        updateSettings,
        resetToDemoData,
        auditLogs,
        logAction,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};