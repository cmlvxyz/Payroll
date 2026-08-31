/**
 * @file pdfService.ts
 * @description Generates official printable and downloadable PDF payslips for Barangay San Felipe II workers.
 */

import { jsPDF } from 'jspdf';
import { Employee, PayrollDetail, PayrollRun, PayrollSettings } from '../types';

export class PdfService {
  /**
   * Generate a PDF Payslip for an employee and trigger download
   */
  public static generatePayslipPdf(
    employee: Employee,
    detail: PayrollDetail,
    payrollRun: PayrollRun,
    settings: PayrollSettings
  ) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const primaryColor = '#1e3a8a'; // Navy Blue
    const darkText = '#0f172a';
    const grayText = '#475569';
    const lightBg = '#f8fafc';
    const borderColor = '#cbd5e1';

    // Header Background
    doc.setFillColor(30, 58, 138);
    doc.rect(15, 12, 180, 26, 'F');

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('REPUBLIC OF THE PHILIPPINES', 105, 18, { align: 'center' });
    doc.setFontSize(14);
    doc.text('BARANGAY SAN FELIPE II', 105, 25, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Cavite City • Payroll & Timekeeping Management System', 105, 31, { align: 'center' });

    // Subheader Banner
    doc.setFillColor(241, 245, 249);
    doc.rect(15, 41, 180, 10, 'F');
    doc.setTextColor(30, 58, 138);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('OFFICIAL EMPLOYEE PAYSLIP', 20, 47.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(
      `Cut-off: ${payrollRun.payroll_month} ${payrollRun.cutoff_number === 1 ? '1-15' : '16-30'}, ${payrollRun.payroll_year} (${payrollRun.payroll_run_id})`,
      190,
      47.5,
      { align: 'right' }
    );

    // Employee Information Box
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, 54, 180, 26, 2, 2, 'FD');

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(8);
    doc.text('EMPLOYEE NAME:', 20, 60);
    doc.text('EMPLOYEE ID:', 20, 66);
    doc.text('CATEGORY:', 20, 72);

    doc.text('POSITION:', 105, 60);
    doc.text('BANK ACCOUNT:', 105, 66);
    doc.text('TIN / SSS:', 105, 72);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`${employee.last_name}, ${employee.first_name} ${employee.middle_name || ''} ${employee.suffix || ''}`.trim(), 52, 60);
    doc.text(employee.employee_id, 52, 66);
    doc.text(employee.employee_type, 52, 72);

    doc.text(employee.position, 135, 60);
    doc.text(`${employee.bank_name} - ${employee.bank_account}`, 135, 66);
    doc.text(`${employee.tin || 'N/A'} / ${employee.sss_no || 'N/A'}`, 135, 72);

    // Earnings & Deductions Tables (Two Column Layout)
    const tableTop = 84;
    const colWidth = 87;

    // --- LEFT: EARNINGS ---
    doc.setFillColor(238, 242, 255);
    doc.rect(15, tableTop, colWidth, 7, 'F');
    doc.setTextColor(30, 58, 138);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('EARNINGS', 20, tableTop + 5);
    doc.text('AMOUNT (PHP)', 15 + colWidth - 5, tableTop + 5, { align: 'right' });

    let yPos = tableTop + 13;
    const addRow = (label: string, value: number, isLeft: boolean) => {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(8.5);
      const xLabel = isLeft ? 20 : 108;
      const xVal = isLeft ? 15 + colWidth - 5 : 108 + colWidth - 5;

      doc.text(label, xLabel, yPos);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(`PHP ${value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, xVal, yPos, {
        align: 'right',
      });
      yPos += 6;
    };

    addRow('Basic Semi-Monthly Pay', detail.basic_pay, true);
    addRow(`Overtime Pay (${detail.ot_hours} hrs)`, detail.overtime_pay, true);
    addRow('Semi-Monthly Allowance', detail.allowance, true);
    if (detail.bonus > 0) {
      addRow('Honorarium / Bonus', detail.bonus, true);
    }

    // Total Gross Row
    doc.setFillColor(248, 250, 252);
    doc.rect(15, 114, colWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text('TOTAL GROSS PAY', 20, 119);
    doc.text(
      `PHP ${detail.gross_pay.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      15 + colWidth - 5,
      119,
      { align: 'right' }
    );

    // --- RIGHT: DEDUCTIONS ---
    doc.setFillColor(254, 242, 242);
    doc.rect(108, tableTop, colWidth, 7, 'F');
    doc.setTextColor(185, 28, 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('DEDUCTIONS (EMPLOYEE)', 113, tableTop + 5);
    doc.text('AMOUNT (PHP)', 108 + colWidth - 5, tableTop + 5, { align: 'right' });

    yPos = tableTop + 13;
    const addDeductionRow = (label: string, value: number) => {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(8.5);
      doc.text(label, 113, yPos);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(`PHP ${value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 108 + colWidth - 5, yPos, {
        align: 'right',
      });
      yPos += 5.5;
    };

    addDeductionRow('SSS Contribution (EE)', detail.sss_employee);
    addDeductionRow('PhilHealth Contribution (EE)', detail.philhealth_employee);
    addDeductionRow('Pag-IBIG / HDMF (EE)', detail.pagibig_employee);
    addDeductionRow('Withholding Tax (TRAIN)', detail.withholding_tax);
    if (detail.loan_deduction > 0) {
      addDeductionRow('Loans / Installments', detail.loan_deduction);
    }
    if (detail.attendance_deduction > 0) {
      addDeductionRow(`Tardiness / Undertime (${detail.late_minutes}m)`, detail.attendance_deduction);
    }
    if (detail.other_deduction > 0) {
      addDeductionRow('Other Deductions', detail.other_deduction);
    }

    // Total Deductions Row
    doc.setFillColor(254, 242, 242);
    doc.rect(108, 114, colWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(185, 28, 28);
    doc.text('TOTAL DEDUCTIONS', 113, 119);
    doc.text(
      `PHP ${detail.total_deductions.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      108 + colWidth - 5,
      119,
      { align: 'right' }
    );

    // --- NET TAKE HOME PAY BOX (Prominent) ---
    doc.setFillColor(16, 185, 129); // Emerald Green
    doc.roundedRect(15, 126, 180, 16, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('NET TAKE-HOME PAY:', 22, 136);
    doc.setFontSize(14);
    doc.text(
      `PHP ${detail.net_pay.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      190,
      136.5,
      { align: 'right' }
    );

    // --- EMPLOYER STATUTORY CONTRIBUTIONS SECTION ---
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(15, 147, 180, 22, 2, 2, 'FD');
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('EMPLOYER STATUTORY CONTRIBUTIONS (Barangay Paid – Not Deducted From Employee)', 20, 153);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`SSS Employer Share: PHP ${detail.sss_employer.toFixed(2)}`, 20, 160);
    doc.text(`SSS EC Fund: PHP ${detail.sss_ec.toFixed(2)}`, 75, 160);
    doc.text(`PhilHealth Employer: PHP ${detail.philhealth_employer.toFixed(2)}`, 115, 160);
    doc.text(`Pag-IBIG Employer: PHP ${detail.pagibig_employer.toFixed(2)}`, 160, 160);

    doc.setFont('helvetica', 'bold');
    doc.text(`Total Barangay Statutory Contribution: PHP ${detail.total_employer_contributions.toFixed(2)}`, 20, 166);

    // --- SIGNATURE BLOCKS ---
    const sigY = 188;
    doc.setDrawColor(148, 163, 184);

    // Prepared by
    doc.line(20, sigY + 12, 65, sigY + 12);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(settings.barangay_treasurer, 42.5, sigY + 16, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7);
    doc.text('Barangay Treasurer / Prepared by', 42.5, sigY + 20, { align: 'center' });

    // Approved by
    doc.line(80, sigY + 12, 125, sigY + 12);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(settings.punong_barangay, 102.5, sigY + 16, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7);
    doc.text('Punong Barangay / Approved by', 102.5, sigY + 20, { align: 'center' });

    // Received by
    doc.line(140, sigY + 12, 185, sigY + 12);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`${employee.first_name} ${employee.last_name}`, 162.5, sigY + 16, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7);
    doc.text('Employee Signature / Date', 162.5, sigY + 20, { align: 'center' });

    // Footer Disclaimer
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'System-generated official payslip via SF II Barangay Payroll Management System • Cavite City. Document validity subject to barangay record verification.',
      105,
      220,
      { align: 'center' }
    );

    // Save
    const filename = `SF2_Payslip_${employee.employee_id}_${payrollRun.payroll_run_id}.pdf`;
    doc.save(filename);
  }
}
