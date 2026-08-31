/**
 * @file payrollCalculationService.ts
 * @description Centralized Philippine Payroll & Statutory Calculation Engine for Barangay San Felipe II.
 * Implements SSS 2026 Table, PhilHealth 5% split with monthly cap, Pag-IBIG HDMF monthly caps,
 * BIR Withholding Tax Table (TRAIN Law), and attendance adjustments.
 */

import { Employee, AttendanceRecord, LoanRecord, PayrollDetail, PayrollSettings, SssBracket } from '../types';
import { SSS_CONTRIBUTION_TABLE_2026, BIR_MONTHLY_TAX_TABLE, DEFAULT_SETTINGS } from '../data/seedData';

export class PayrollCalculationService {
  /**
   * Find matching SSS bracket for a given monthly salary (2026 Schedule).
   */
  public static getSssContribution(monthlySalary: number, customTable: SssBracket[] = SSS_CONTRIBUTION_TABLE_2026) {
    const bracket = customTable.find(
      (b) => monthlySalary >= b.minSalary && monthlySalary <= b.maxSalary
    ) || customTable[customTable.length - 1];

    return {
      monthlyEmployeeShare: bracket.employeeShare,
      monthlyEmployerShare: bracket.employerShare,
      monthlyEcShare: bracket.ecShare,
      salaryCredit: bracket.salaryCredit,
      totalMonthly: bracket.totalContribution,
    };
  }

  /**
   * PhilHealth 5% calculation: 50% EE share, 50% ER share.
   * Subject to statutory cap (default ₱2,500 total monthly contribution -> max ₱1,250 EE share).
   */
  public static getPhilHealthContribution(
    monthlySalary: number,
    rate = DEFAULT_SETTINGS.philhealth_rate,
    maxTotalMonthly = DEFAULT_SETTINGS.philhealth_max_monthly
  ) {
    const rawTotal = monthlySalary * rate;
    const cappedTotal = Math.min(rawTotal, maxTotalMonthly);
    const monthlyEmployeeShare = cappedTotal / 2;
    const monthlyEmployerShare = cappedTotal / 2;

    return {
      monthlyTotal: cappedTotal,
      monthlyEmployeeShare,
      monthlyEmployerShare,
    };
  }

  /**
   * Pag-IBIG (HDMF) calculation: 2% of basic salary capped at ₱100/mo EE share (or updated cap).
   */
  public static getPagibigContribution(
    monthlySalary: number,
    rate = DEFAULT_SETTINGS.pagibig_rate,
    maxEmployeeShare = DEFAULT_SETTINGS.pagibig_max_monthly_employee
  ) {
    const rawEmployeeShare = monthlySalary * rate;
    const monthlyEmployeeShare = Math.min(rawEmployeeShare, maxEmployeeShare);
    const monthlyEmployerShare = monthlyEmployeeShare; // Employer matches employee share

    return {
      monthlyEmployeeShare,
      monthlyEmployerShare,
      totalMonthly: monthlyEmployeeShare + monthlyEmployerShare,
    };
  }

  /**
   * BIR TRAIN Law Graduated Withholding Tax (Monthly Calculation).
   * Note: Philippine tax is annualized/monthly. Semi-monthly tax is correctly distributed.
   */
  public static getBirWithholdingTax(monthlyTaxableIncome: number): number {
    if (monthlyTaxableIncome <= 20833.33) {
      return 0; // Tax-exempt bracket under TRAIN Law (< ₱250k/year)
    }

    for (const bracket of BIR_MONTHLY_TAX_TABLE) {
      if (monthlyTaxableIncome >= bracket.min_amount && monthlyTaxableIncome <= bracket.max_amount) {
        const excess = monthlyTaxableIncome - bracket.min_amount;
        const tax = bracket.base_tax + excess * bracket.excess_rate;
        return Math.max(0, Math.round(tax * 100) / 100);
      }
    }

    // Fallback highest bracket
    const highest = BIR_MONTHLY_TAX_TABLE[BIR_MONTHLY_TAX_TABLE.length - 1];
    const excess = monthlyTaxableIncome - highest.min_amount;
    return highest.base_tax + excess * highest.excess_rate;
  }

  /**
   * Calculate complete payroll detail for a single employee for a specific cut-off.
   */
  public static calculateEmployeePayroll(
    employee: Employee,
    payrollRunId: string,
    attendanceRecords: AttendanceRecord[],
    activeLoans: LoanRecord[],
    settings: PayrollSettings = DEFAULT_SETTINGS,
    cutoffNumber: 1 | 2 = 1,
    bonusAmount: number = 0,
    cashAdvanceAmount: number = 0,
    otherDeductionAmount: number = 0
  ): PayrollDetail {
    const monthlyBasic = employee.basic_salary;
    const monthlyAllowance = employee.allowance;
    const workingDays = settings.working_days_per_month || 22;
    const dailyRate = monthlyBasic / workingDays;
    const hourlyRate = dailyRate / (settings.required_daily_hours || 8);

    // 1. Semi-monthly basic pay and allowance
    const basicPay = Math.round((monthlyBasic / 2) * 100) / 100;
    const semiAllowance = Math.round((monthlyAllowance / 2) * 100) / 100;

    // 2. Attendance metrics for this employee
    const empAttendance = attendanceRecords.filter((a) => a.employee_id === employee.employee_id);
    const daysPresent = empAttendance.filter((a) => a.status === 'Present' || a.status === 'Adjusted').length;
    const daysAbsent = empAttendance.filter((a) => a.status === 'Absent').length;
    const totalLateMinutes = empAttendance.reduce((acc, curr) => acc + (curr.late_minutes || 0), 0);
    const totalOtHours = empAttendance.reduce((acc, curr) => acc + (curr.ot_hours || 0), 0);
    const totalUndertimeHours = empAttendance.reduce((acc, curr) => acc + (curr.undertime_hours || 0), 0);

    // Overtime pay (1.25x regular hourly rate)
    const overtimePay = Math.round(totalOtHours * hourlyRate * 1.25 * 100) / 100;

    // Attendance deductions (Late, Undertime, Unpaid Absences)
    const lateDeduction = (totalLateMinutes / 60) * hourlyRate;
    const undertimeDeduction = totalUndertimeHours * hourlyRate;
    const absentDeduction = daysAbsent * dailyRate;
    const attendanceDeduction = Math.round((lateDeduction + undertimeDeduction + absentDeduction) * 100) / 100;

    // Gross Pay
    const grossPay = Math.round((basicPay + overtimePay + semiAllowance + bonusAmount) * 100) / 100;

    // 3. Statutory Contributions (Semi-monthly half of monthly rates)
    // SSS
    const sss = this.getSssContribution(monthlyBasic);
    const sssEmployee = Math.round((sss.monthlyEmployeeShare / 2) * 100) / 100;
    const sssEmployer = Math.round((sss.monthlyEmployerShare / 2) * 100) / 100;
    const sssEc = Math.round((sss.monthlyEcShare / 2) * 100) / 100;

    // PhilHealth
    const philhealth = this.getPhilHealthContribution(monthlyBasic, settings.philhealth_rate, settings.philhealth_max_monthly);
    const philhealthEmployee = Math.round((philhealth.monthlyEmployeeShare / 2) * 100) / 100;
    const philhealthEmployer = Math.round((philhealth.monthlyEmployerShare / 2) * 100) / 100;

    // Pag-IBIG
    const pagibig = this.getPagibigContribution(monthlyBasic, settings.pagibig_rate, settings.pagibig_max_monthly_employee);
    const pagibigEmployee = Math.round((pagibig.monthlyEmployeeShare / 2) * 100) / 100;
    const pagibigEmployer = Math.round((pagibig.monthlyEmployerShare / 2) * 100) / 100;

    // 4. BIR Withholding Tax (Estimated monthly taxable income -> semi-monthly allocation)
    const estimatedMonthlyTaxable = Math.max(
      0,
      monthlyBasic + overtimePay * 2 - (sss.monthlyEmployeeShare + philhealth.monthlyEmployeeShare + pagibig.monthlyEmployeeShare)
    );
    const fullMonthlyTax = this.getBirWithholdingTax(estimatedMonthlyTaxable);
    const withholdingTax = Math.round((fullMonthlyTax / 2) * 100) / 100;

    // 5. Loans
    const empLoans = activeLoans.filter((l) => l.employee_id === employee.employee_id && l.status === 'Active');
    const loanDeduction = empLoans.reduce((sum, loan) => sum + loan.installment_amount, 0);

    // 6. Deductions Total
    const totalDeductions = Math.round(
      (sssEmployee +
        philhealthEmployee +
        pagibigEmployee +
        withholdingTax +
        loanDeduction +
        cashAdvanceAmount +
        otherDeductionAmount +
        attendanceDeduction) *
        100
    ) / 100;

    // 7. Net Take Home Pay
    const netPay = Math.max(0, Math.round((grossPay - totalDeductions) * 100) / 100);

    // 8. Employer Statutory Cost (NOT deducted from employee)
    const totalEmployerContributions = Math.round((sssEmployer + sssEc + philhealthEmployer + pagibigEmployer) * 100) / 100;

    return {
      id: `PD-${payrollRunId}-${employee.employee_id}`,
      payroll_run_id: payrollRunId,
      employee_id: employee.employee_id,
      monthly_basic: monthlyBasic,
      basic_pay: basicPay,
      overtime_pay: overtimePay,
      allowance: semiAllowance,
      bonus: bonusAmount,
      gross_pay: grossPay,
      sss_employee: sssEmployee,
      philhealth_employee: philhealthEmployee,
      pagibig_employee: pagibigEmployee,
      withholding_tax: withholdingTax,
      loan_deduction: loanDeduction,
      cash_advance: cashAdvanceAmount,
      other_deduction: otherDeductionAmount,
      attendance_deduction: attendanceDeduction,
      total_deductions: totalDeductions,
      net_pay: netPay,
      sss_employer: sssEmployer,
      sss_ec: sssEc,
      philhealth_employer: philhealthEmployer,
      pagibig_employer: pagibigEmployer,
      total_employer_contributions: totalEmployerContributions,
      days_present: daysPresent,
      days_absent: daysAbsent,
      late_minutes: totalLateMinutes,
      ot_hours: totalOtHours,
    };
  }
}
