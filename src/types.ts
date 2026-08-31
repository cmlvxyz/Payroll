export type UserRole = 'ADMIN' | 'HR' | 'FINANCE' | 'EMPLOYEE';

export type EmployeeType = 'Official' | 'Tanod' | 'Driver';

export type EmployeeStatus = 'Active' | 'Resigned' | 'On Leave';

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'On Leave' | 'Rest Day' | 'Holiday' | 'Adjusted';

export type PayrollStatus = 'Draft' | 'HR Approved' | 'Finance Approved' | 'For Payout' | 'Paid';

export type LoanType =
  | 'SSS Salary Loan'
  | 'Pag-IBIG MPL'
  | 'Pag-IBIG Calamity Loan'
  | 'Barangay Emergency Loan'
  | 'Cash Advance'
  | 'Cooperative Loan';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employee_id?: string;
  active: boolean;
  avatar?: string;
}

export interface Employee {
  id: string;
  employee_id: string; // e.g., 'SF2-001'
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix?: string;
  employee_type: EmployeeType;
  position: string;
  basic_salary: number; // Monthly Basic Salary in PHP
  allowance: number; // Monthly Allowance in PHP
  date_hired: string;
  status: EmployeeStatus;
  sss_no: string;
  philhealth_no: string;
  pagibig_no: string;
  tin: string;
  bank_name: 'BDO' | 'BPI' | 'Landbank' | 'Cash / Check';
  bank_account: string;
  contact_number: string;
  address: string;
  email: string;
  emergency_contact?: string;
  emergency_phone?: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  attendance_date: string; // YYYY-MM-DD
  time_in: string; // HH:mm
  time_out: string; // HH:mm
  days_worked: number; // usually 1.0 or 0.5
  late_minutes: number;
  ot_hours: number;
  undertime_hours: number;
  absent: boolean;
  status: AttendanceStatus;
  adjustment_reason?: string;
  adjusted_by?: string;
  adjusted_at?: string;
}

export interface LoanRecord {
  id: string;
  employee_id: string;
  loan_type: LoanType;
  reference_number: string;
  principal_amount: number;
  balance: number;
  installment_amount: number; // semi-monthly deduction
  start_date: string;
  end_date: string;
  status: 'Active' | 'Fully Paid' | 'Suspended' | 'Cancelled';
}

export type Loan = LoanRecord;

export interface PayrollDetail {
  id: string;
  payroll_run_id: string;
  employee_id: string;

  // Earnings
  monthly_basic: number;
  basic_pay: number; // semi-monthly basic (basic_salary / 2)
  overtime_pay: number;
  allowance: number; // semi-monthly allowance (allowance / 2)
  bonus: number;
  gross_pay: number;

  // Deductions - Employee Share
  sss_employee: number;
  philhealth_employee: number;
  pagibig_employee: number;
  withholding_tax: number;
  loan_deduction: number;
  cash_advance: number;
  other_deduction: number;
  attendance_deduction: number; // late, undertime, unpaid absences
  total_deductions: number;

  // Net Take Home Pay
  net_pay: number;

  // Employer Statutory Contributions (DO NOT subtract from employee net pay)
  sss_employer: number;
  sss_ec: number; // Employees' Compensation Fund
  philhealth_employer: number;
  pagibig_employer: number;
  total_employer_contributions: number;

  // Calculation breakdown metadata
  days_present: number;
  days_absent: number;
  late_minutes: number;
  ot_hours: number;
}

export interface PayrollRun {
  id: string;
  payroll_run_id: string; // e.g. 'PR-2026-09-1'
  period_start: string; // YYYY-MM-DD e.g. '2026-09-01'
  period_end: string; // YYYY-MM-DD e.g. '2026-09-15'
  payroll_month: string; // 'September'
  payroll_year: number; // 2026
  cutoff_number: 1 | 2; // 1: 1-15, 2: 16-30/31
  status: PayrollStatus;
  total_gross: number;
  total_deductions: number;
  total_net: number;
  total_employer_cost: number;
  employee_count: number;
  processed_by: string;
  processed_at: string;
  approved_by_hr?: string;
  approved_at_hr?: string;
  approved_by_finance?: string;
  approved_at_finance?: string;
  reopen_reason?: string;
  reopened_by?: string;
  reopened_at?: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  action: string;
  module:
    | 'Employee'
    | 'Attendance'
    | 'Payroll'
    | 'Approval'
    | 'Loan'
    | 'Reports'
    | 'Bank'
    | 'Settings'
    | 'Auth';
  model_type: string;
  model_id: string;
  old_values?: string;
  new_values?: string;
  ip_address: string;
  created_at: string;
  // UI helpers
  timestamp?: string;
  performed_by?: string;
  target_entity?: string;
  details?: string;
  old_value?: string;
  new_value?: string;
}

export interface SssBracket {
  minSalary: number;
  maxSalary: number;
  salaryCredit: number;
  employeeShare: number;
  employerShare: number;
  ecShare: number;
  totalContribution: number;
}

export interface BirTaxBracket {
  min_amount: number;
  max_amount: number;
  base_tax: number;
  excess_rate: number; // e.g. 0.15 for 15%
}

export interface BarangaySettings {
  barangay_name: string;
  barangay_subtitle?: string;
  barangay_address?: string;
  municipality: string;
  province: string;
  contact_number?: string;
  punong_barangay: string;
  barangay_treasurer: string;
  barangay_secretary?: string;
  hr_officer?: string;

  // Work Schedule
  work_start_time: string; // '08:00'
  work_end_time: string; // '17:00'
  required_daily_hours: number; // 8
  working_days_per_month: number; // 22
  ot_rate_multiplier?: number;

  // Cutoffs
  cutoff_1_start: number; // 1
  cutoff_1_end: number; // 15
  cutoff_2_start: number; // 16
  cutoff_2_end: number; // 30

  // Contribution Rules
  philhealth_rate: number; // 0.05 (5%)
  philhealth_max_monthly: number; // 2500 (total contribution cap)
  pagibig_rate: number; // 0.02 (2%)
  pagibig_max_monthly_employee: number; // 100

  // Upcoming deadlines
  sss_due_day: number; // 10th of following month
  philhealth_due_day: number; // 10th of following month
  pagibig_due_day: number; // 10th of following month
  bir_due_day: number; // 10th of following month
}

export type PayrollSettings = BarangaySettings;
