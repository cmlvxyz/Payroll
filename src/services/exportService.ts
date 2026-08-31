/**
 * @file exportService.ts
 * @description Exports Excel (XLSX), CSV, Bank Payout Files (BDO & BPI), and Philippine Government Reports (SSS R3, PhilHealth RF1, Pag-IBIG MCRF, BIR 1601-C, Alphalist).
 */

import * as XLSX from 'xlsx';
import { Employee, PayrollDetail, PayrollRun, AttendanceRecord, PayrollSettings } from '../types';

export class ExportService {
  /**
   * Export Employee Masterlist to Excel
   */
  public static exportEmployeesExcel(employees: Employee[]) {
    const data = employees.map((emp) => ({
      'Employee ID': emp.employee_id,
      'Full Name': `${emp.last_name}, ${emp.first_name} ${emp.middle_name || ''} ${emp.suffix || ''}`.trim(),
      'Category': emp.employee_type,
      'Position': emp.position,
      'Monthly Basic (PHP)': emp.basic_salary,
      'Monthly Allowance (PHP)': emp.allowance,
      'Date Hired': emp.date_hired,
      'Status': emp.status,
      'SSS No': emp.sss_no,
      'PhilHealth No': emp.philhealth_no,
      'Pag-IBIG No': emp.pagibig_no,
      'TIN': emp.tin,
      'Bank': emp.bank_name,
      'Account Number': emp.bank_account,
      'Contact Number': emp.contact_number,
      'Email': emp.email,
      'Address': emp.address,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SF2_Employees');
    XLSX.writeFile(wb, `SF2_Barangay_Employees_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  /**
   * Export Payroll Register to Excel with summary rows
   */
  public static exportPayrollRegisterExcel(
    payrollRun: PayrollRun,
    details: PayrollDetail[],
    employees: Employee[],
    settings: PayrollSettings
  ) {
    const empMap = new Map(employees.map((e) => [e.employee_id, e]));

    const rows = details.map((d) => {
      const emp = empMap.get(d.employee_id);
      return {
        'Employee ID': d.employee_id,
        'Employee Name': emp ? `${emp.last_name}, ${emp.first_name}` : d.employee_id,
        'Category': emp?.employee_type || '',
        'Position': emp?.position || '',
        'Basic Pay': d.basic_pay,
        'Overtime': d.overtime_pay,
        'Allowance': d.allowance,
        'Bonus': d.bonus,
        'Gross Pay': d.gross_pay,
        'SSS (EE)': d.sss_employee,
        'PhilHealth (EE)': d.philhealth_employee,
        'Pag-IBIG (EE)': d.pagibig_employee,
        'Withholding Tax': d.withholding_tax,
        'Loan Deductions': d.loan_deduction,
        'Attendance Ded.': d.attendance_deduction,
        'Total Deductions': d.total_deductions,
        'Net Take-Home Pay': d.net_pay,
        'SSS (ER Share)': d.sss_employer,
        'SSS EC Fund': d.sss_ec,
        'PhilHealth (ER Share)': d.philhealth_employer,
        'Pag-IBIG (ER Share)': d.pagibig_employer,
        'Total Employer Cost': d.total_employer_contributions,
      };
    });

    // Add Grand Total row
    const totals = {
      'Employee ID': 'TOTAL',
      'Employee Name': `${details.length} Workers`,
      'Category': '',
      'Position': '',
      'Basic Pay': details.reduce((s, r) => s + r.basic_pay, 0),
      'Overtime': details.reduce((s, r) => s + r.overtime_pay, 0),
      'Allowance': details.reduce((s, r) => s + r.allowance, 0),
      'Bonus': details.reduce((s, r) => s + r.bonus, 0),
      'Gross Pay': details.reduce((s, r) => s + r.gross_pay, 0),
      'SSS (EE)': details.reduce((s, r) => s + r.sss_employee, 0),
      'PhilHealth (EE)': details.reduce((s, r) => s + r.philhealth_employee, 0),
      'Pag-IBIG (EE)': details.reduce((s, r) => s + r.pagibig_employee, 0),
      'Withholding Tax': details.reduce((s, r) => s + r.withholding_tax, 0),
      'Loan Deductions': details.reduce((s, r) => s + r.loan_deduction, 0),
      'Attendance Ded.': details.reduce((s, r) => s + r.attendance_deduction, 0),
      'Total Deductions': details.reduce((s, r) => s + r.total_deductions, 0),
      'Net Take-Home Pay': details.reduce((s, r) => s + r.net_pay, 0),
      'SSS (ER Share)': details.reduce((s, r) => s + r.sss_employer, 0),
      'SSS EC Fund': details.reduce((s, r) => s + r.sss_ec, 0),
      'PhilHealth (ER Share)': details.reduce((s, r) => s + r.philhealth_employer, 0),
      'Pag-IBIG (ER Share)': details.reduce((s, r) => s + r.pagibig_employer, 0),
      'Total Employer Cost': details.reduce((s, r) => s + r.total_employer_contributions, 0),
    };

    const finalData = [...rows, totals];
    const ws = XLSX.utils.json_to_sheet(finalData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payroll_Register');
    XLSX.writeFile(wb, `SF2_Payroll_Register_${payrollRun.payroll_run_id}.xlsx`);
  }

  /**
   * Export Attendance records to CSV
   */
  public static exportAttendanceCsv(records: AttendanceRecord[], employees: Employee[]) {
    const empMap = new Map(employees.map((e) => [e.employee_id, e]));
    let csv = 'Record ID,Employee ID,Employee Name,Date,Time In,Time Out,Days Worked,Late Minutes,OT Hours,Undertime Hours,Status,Reason\n';

    records.forEach((r) => {
      const emp = empMap.get(r.employee_id);
      const name = emp ? `"${emp.last_name}, ${emp.first_name}"` : r.employee_id;
      csv += `${r.id},${r.employee_id},${name},${r.attendance_date},${r.time_in},${r.time_out},${r.days_worked},${r.late_minutes},${r.ot_hours},${r.undertime_hours},${r.status},"${r.adjustment_reason || ''}"\n`;
    });

    this.downloadFile(csv, `SF2_Attendance_Export_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
  }

  /**
   * Generate BDO Corporate Payroll CSV File
   * Format: Account Number, Amount, Employee Name, Reference Number
   */
  public static generateBdoBankFile(payrollRun: PayrollRun, details: PayrollDetail[], employees: Employee[]): string {
    const empMap = new Map(employees.map((e) => [e.employee_id, e]));
    let output = `H,BARANGAY SAN FELIPE II,BDO-PAYROLL,${payrollRun.payroll_run_id},${payrollRun.period_end}\n`;

    details.forEach((d) => {
      const emp = empMap.get(d.employee_id);
      const account = emp?.bank_account || '000000000000';
      const name = emp ? `${emp.last_name} ${emp.first_name}`.replace(/,/g, '') : d.employee_id;
      const amount = d.net_pay.toFixed(2);
      const ref = `SF2-${payrollRun.payroll_month.slice(0, 3).toUpperCase()}${payrollRun.cutoff_number}-${d.employee_id}`;
      output += `D,${account},${amount},${name},${ref}\n`;
    });

    const totalNet = details.reduce((s, r) => s + r.net_pay, 0).toFixed(2);
    output += `T,${details.length},${totalNet}\n`;

    this.downloadFile(output, `BDO_SF2_Payroll_${payrollRun.payroll_run_id}.csv`, 'text/csv');
    return output;
  }

  /**
   * Generate BPI ExpressLink Payroll CSV File
   * Format: Account Number, Employee Name, Net Amount, Hash/Ref
   */
  public static generateBpiBankFile(payrollRun: PayrollRun, details: PayrollDetail[], employees: Employee[]): string {
    const empMap = new Map(employees.map((e) => [e.employee_id, e]));
    let output = `01,SF2-PAYROLL,${payrollRun.period_start.replace(/-/g, '')},${payrollRun.period_end.replace(/-/g, '')}\n`;

    details.forEach((d) => {
      const emp = empMap.get(d.employee_id);
      const account = emp?.bank_account || '0000000000';
      const name = emp ? `${emp.last_name} ${emp.first_name}`.replace(/,/g, '') : d.employee_id;
      const amount = d.net_pay.toFixed(2);
      const ref = `SALARY-BRGY-SF2-${d.employee_id}`;
      output += `02,${account},${name},${amount},${ref}\n`;
    });

    const totalNet = details.reduce((s, r) => s + r.net_pay, 0).toFixed(2);
    output += `99,${details.length},${totalNet}\n`;

    this.downloadFile(output, `BPI_SF2_Payroll_${payrollRun.payroll_run_id}.csv`, 'text/csv');
    return output;
  }

  /**
   * SSS R-3 Form / Electronic File (Contribution Collection List)
   */
  public static generateSssR3Report(payrollRun: PayrollRun, details: PayrollDetail[], employees: Employee[]): string {
    const empMap = new Map(employees.map((e) => [e.employee_id, e]));
    let content = `BARANGAY SAN FELIPE II - SSS R-3 CONTRIBUTION COLLECTION LIST\n`;
    content += `Employer SSS No: 03-9123456-7 | Period: ${payrollRun.payroll_month} ${payrollRun.payroll_year}\n`;
    content += `Generated: ${new Date().toLocaleString('en-PH')}\n\n`;
    content += `SSS Number,Employee Name,Monthly Salary,SS-EE (PHP),SS-ER (PHP),EC-ER (PHP),Total SS (PHP)\n`;

    details.forEach((d) => {
      const emp = empMap.get(d.employee_id);
      const sssNo = emp?.sss_no || 'N/A';
      const name = emp ? `"${emp.last_name}, ${emp.first_name}"` : d.employee_id;
      const totalContribution = (d.sss_employee + d.sss_employer + d.sss_ec).toFixed(2);
      content += `${sssNo},${name},${d.monthly_basic.toFixed(2)},${d.sss_employee.toFixed(2)},${d.sss_employer.toFixed(2)},${d.sss_ec.toFixed(2)},${totalContribution}\n`;
    });

    const totalEE = details.reduce((s, r) => s + r.sss_employee, 0).toFixed(2);
    const totalER = details.reduce((s, r) => s + r.sss_employer, 0).toFixed(2);
    const totalEC = details.reduce((s, r) => s + r.sss_ec, 0).toFixed(2);
    const grandTotal = (parseFloat(totalEE) + parseFloat(totalER) + parseFloat(totalEC)).toFixed(2);

    content += `\nSUMMARY TOTALS:\n`;
    content += `Total Employee Share (EE): PHP ${totalEE}\n`;
    content += `Total Employer Share (ER): PHP ${totalER}\n`;
    content += `Total EC Fund Share: PHP ${totalEC}\n`;
    content += `Grand Total Remittance to SSS: PHP ${grandTotal}\n`;

    this.downloadFile(content, `SSS_R3_Report_${payrollRun.payroll_month}_${payrollRun.payroll_year}.csv`, 'text/csv');
    return content;
  }

  /**
   * PhilHealth RF-1 Form / Electronic Remittance List
   */
  public static generatePhilHealthRf1Report(payrollRun: PayrollRun, details: PayrollDetail[], employees: Employee[]): string {
    const empMap = new Map(employees.map((e) => [e.employee_id, e]));
    let content = `BARANGAY SAN FELIPE II - PHILHEALTH RF-1 QUARTERLY/MONTHLY REMITTANCE REPORT\n`;
    content += `PhilHealth Employer PIN: 12-001234567-8 | Period: ${payrollRun.payroll_month} ${payrollRun.payroll_year}\n`;
    content += `Applicable Rate: 5% of monthly salary (50% EE / 50% ER)\n\n`;
    content += `PhilHealth PIN,Employee Name,Position,Basic Salary,EE Share (PHP),ER Share (PHP),Total Remittance (PHP)\n`;

    details.forEach((d) => {
      const emp = empMap.get(d.employee_id);
      const pin = emp?.philhealth_no || 'N/A';
      const name = emp ? `"${emp.last_name}, ${emp.first_name}"` : d.employee_id;
      const pos = emp?.position || '';
      const total = (d.philhealth_employee + d.philhealth_employer).toFixed(2);
      content += `${pin},${name},"${pos}",${d.monthly_basic.toFixed(2)},${d.philhealth_employee.toFixed(2)},${d.philhealth_employer.toFixed(2)},${total}\n`;
    });

    const totalEE = details.reduce((s, r) => s + r.philhealth_employee, 0).toFixed(2);
    const totalER = details.reduce((s, r) => s + r.philhealth_employer, 0).toFixed(2);
    const grandTotal = (parseFloat(totalEE) + parseFloat(totalER)).toFixed(2);

    content += `\nTOTAL REMITTANCE: PHP ${grandTotal} (EE: PHP ${totalEE} | ER: PHP ${totalER})\n`;

    this.downloadFile(content, `PhilHealth_RF1_Report_${payrollRun.payroll_month}_${payrollRun.payroll_year}.csv`, 'text/csv');
    return content;
  }

  /**
   * Pag-IBIG MCRF (Monthly Compensation and Remittance File)
   */
  public static generatePagibigMcrfReport(payrollRun: PayrollRun, details: PayrollDetail[], employees: Employee[]): string {
    const empMap = new Map(employees.map((e) => [e.employee_id, e]));
    let content = `BARANGAY SAN FELIPE II - PAG-IBIG MONTHLY COMPENSATION & REMITTANCE FILE (MCRF)\n`;
    content += `Pag-IBIG Employer ID: 2012-3456-7890 | Period: ${payrollRun.payroll_month} ${payrollRun.payroll_year}\n\n`;
    content += `Pag-IBIG MID,Employee Name,Membership Type,Monthly Salary,EE Share (PHP),ER Share (PHP),Total Remittance (PHP)\n`;

    details.forEach((d) => {
      const emp = empMap.get(d.employee_id);
      const mid = emp?.pagibig_no || 'N/A';
      const name = emp ? `"${emp.last_name}, ${emp.first_name}"` : d.employee_id;
      const total = (d.pagibig_employee + d.pagibig_employer).toFixed(2);
      content += `${mid},${name},Regular Mandatory,${d.monthly_basic.toFixed(2)},${d.pagibig_employee.toFixed(2)},${d.pagibig_employer.toFixed(2)},${total}\n`;
    });

    const totalEE = details.reduce((s, r) => s + r.pagibig_employee, 0).toFixed(2);
    const totalER = details.reduce((s, r) => s + r.pagibig_employer, 0).toFixed(2);
    const grandTotal = (parseFloat(totalEE) + parseFloat(totalER)).toFixed(2);

    content += `\nTOTAL PAG-IBIG REMITTANCE: PHP ${grandTotal} (EE: PHP ${totalEE} | ER: PHP ${totalER})\n`;

    this.downloadFile(content, `PagIBIG_MCRF_Report_${payrollRun.payroll_month}_${payrollRun.payroll_year}.csv`, 'text/csv');
    return content;
  }

  /**
   * BIR 1601-C (Monthly Remittance Return of Income Taxes Withheld)
   */
  public static generateBir1601CReport(payrollRun: PayrollRun, details: PayrollDetail[]): string {
    const totalGross = details.reduce((s, r) => s + r.gross_pay, 0);
    const nonTaxableStatutory = details.reduce((s, r) => s + (r.sss_employee + r.philhealth_employee + r.pagibig_employee), 0);
    const taxableCompensation = Math.max(0, totalGross - nonTaxableStatutory);
    const totalTaxWithheld = details.reduce((s, r) => s + r.withholding_tax, 0);

    let content = `BIR FORM 1601-C (MONTHLY REMITTANCE RETURN OF INCOME TAXES WITHHELD ON COMPENSATION)\n`;
    content += `Withholding Agent: BARANGAY SAN FELIPE II\n`;
    content += `TIN: 004-987-654-000 | RDO: 057 - Cavite\n`;
    content += `For the Month of: ${payrollRun.payroll_month} ${payrollRun.payroll_year}\n\n`;
    content += `PART II: COMPUTATION OF TAX\n`;
    content += `1. Total Amount of Compensation: PHP ${totalGross.toFixed(2)}\n`;
    content += `2. Less: Non-Taxable Mandatory Statutory Contributions (SSS, PhilHealth, Pag-IBIG): PHP ${nonTaxableStatutory.toFixed(2)}\n`;
    content += `3. Total Taxable Compensation: PHP ${taxableCompensation.toFixed(2)}\n`;
    content += `4. Tax Required to be Withheld (under TRAIN Law): PHP ${totalTaxWithheld.toFixed(2)}\n`;
    content += `5. Total Amount of Remittance to BIR: PHP ${totalTaxWithheld.toFixed(2)}\n\n`;
    content += `CERTIFICATION: We declare under the penalties of perjury that this return has been made in good faith and verified against payroll records.\n`;

    this.downloadFile(content, `BIR_1601C_${payrollRun.payroll_month}_${payrollRun.payroll_year}.txt`, 'text/plain');
    return content;
  }

  public static exportSssReportCsv(payrollRun: PayrollRun, details: PayrollDetail[], employees: Employee[]) {
    return this.generateSssR3Report(payrollRun, details, employees);
  }

  public static exportPhilHealthReportCsv(payrollRun: PayrollRun, details: PayrollDetail[], employees: Employee[]) {
    return this.generatePhilHealthRf1Report(payrollRun, details, employees);
  }

  public static exportPagIbigReportCsv(payrollRun: PayrollRun, details: PayrollDetail[], employees: Employee[]) {
    return this.generatePagibigMcrfReport(payrollRun, details, employees);
  }

  public static exportBirReportCsv(payrollRun: PayrollRun, details: PayrollDetail[], employees?: Employee[]) {
    return this.generateBir1601CReport(payrollRun, details);
  }

  public static exportBankPayoutCsv(
    payrollRun: PayrollRun,
    details: PayrollDetail[],
    employees: Employee[],
    bankType: string = 'BDO'
  ) {
    if (bankType === 'BPI') {
      return this.generateBpiBankFile(payrollRun, details, employees);
    }
    return this.generateBdoBankFile(payrollRun, details, employees);
  }

  /**
   * Helper to trigger browser download
   */
  private static downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
