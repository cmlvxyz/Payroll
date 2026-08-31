/**
 * @file attendanceService.ts
 * @description Biometric CSV Import, validation, and attendance calculation for SF II workers.
 */

import { AttendanceRecord, Employee, PayrollSettings, AttendanceStatus } from '../types';

export interface CsvImportResult {
  importedCount: number;
  skippedCount: number;
  errorCount: number;
  errors: string[];
  records: AttendanceRecord[];
}

export class AttendanceService {
  /**
   * Parse and validate CSV biometric data.
   * Expected format:
   * employee_id,date,time_in,time_out
   * e.g., SF2-001,2026-09-01,08:02,17:01
   */
  public static parseBiometricCsv(
    csvContent: string,
    existingEmployees: Employee[],
    settings: PayrollSettings
  ): CsvImportResult {
    const lines = csvContent.trim().split(/\r\n|\n/);
    const validEmployeeIds = new Set(existingEmployees.map((e) => e.employee_id));
    const importedRecords: AttendanceRecord[] = [];
    const errors: string[] = [];
    let skippedCount = 0;

    const [expectedStartHour, expectedStartMin] = settings.work_start_time.split(':').map(Number);
    const [expectedEndHour, expectedEndMin] = settings.work_end_time.split(':').map(Number);
    const expectedStartMinutes = expectedStartHour * 60 + expectedStartMin;
    const expectedEndMinutes = expectedEndHour * 60 + expectedEndMin;

    const seenEntries = new Set<string>();

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Skip header if present
      if (index === 0 && (trimmed.toLowerCase().includes('employee_id') || trimmed.toLowerCase().includes('date'))) {
        return;
      }

      const parts = trimmed.split(',').map((p) => p.trim());
      if (parts.length < 4) {
        errors.push(`Line ${index + 1}: Insufficient columns. Expected 'employee_id,date,time_in,time_out'. Found: "${trimmed}"`);
        return;
      }

      const [employeeId, dateStr, timeIn, timeOut] = parts;

      // 1. Validate employee
      if (!validEmployeeIds.has(employeeId)) {
        errors.push(`Line ${index + 1}: Unrecognized Employee ID "${employeeId}". Not in Barangay SF II masterlist.`);
        return;
      }

      // 2. Validate date format (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        errors.push(`Line ${index + 1}: Invalid date format "${dateStr}". Expected YYYY-MM-DD.`);
        return;
      }

      // 3. Validate time format (HH:mm)
      if (!/^\d{1,2}:\d{2}$/.test(timeIn) || !/^\d{1,2}:\d{2}$/.test(timeOut)) {
        errors.push(`Line ${index + 1}: Invalid time format. Found in="${timeIn}", out="${timeOut}". Expected HH:mm.`);
        return;
      }

      // 4. Duplicate check
      const entryKey = `${employeeId}-${dateStr}`;
      if (seenEntries.has(entryKey)) {
        skippedCount++;
        errors.push(`Line ${index + 1}: Duplicate entry for ${employeeId} on ${dateStr}. Skipped.`);
        return;
      }
      seenEntries.add(entryKey);

      // 5. Calculate late, undertime, OT
      const [inH, inM] = timeIn.split(':').map(Number);
      const [outH, outM] = timeOut.split(':').map(Number);
      const inMinutes = inH * 60 + inM;
      const outMinutes = outH * 60 + outM;

      if (outMinutes < inMinutes) {
        errors.push(`Line ${index + 1}: Time-out (${timeOut}) cannot be earlier than Time-in (${timeIn}).`);
        return;
      }

      // Late minutes
      const lateMinutes = Math.max(0, inMinutes - expectedStartMinutes);

      // Overtime hours
      const otMinutes = Math.max(0, outMinutes - expectedEndMinutes);
      const otHours = Math.round((otMinutes / 60) * 10) / 10;

      // Undertime
      const totalWorkMinutes = Math.max(0, outMinutes - inMinutes - 60); // minus 1 hr lunch break
      const requiredWorkMinutes = settings.required_daily_hours * 60;
      const undertimeMinutes = Math.max(0, requiredWorkMinutes - totalWorkMinutes);
      const undertimeHours = Math.round((undertimeMinutes / 60) * 10) / 10;

      let status: AttendanceStatus = 'Present';
      if (lateMinutes > 0) {
        status = 'Late';
      }

      importedRecords.push({
        id: `ATT-${employeeId}-${dateStr}`,
        employee_id: employeeId,
        attendance_date: dateStr,
        time_in: timeIn,
        time_out: timeOut,
        days_worked: 1,
        late_minutes: lateMinutes,
        ot_hours: otHours,
        undertime_hours: undertimeHours,
        absent: false,
        status,
      });
    });

    return {
      importedCount: importedRecords.length,
      skippedCount,
      errorCount: errors.length,
      errors,
      records: importedRecords,
    };
  }

  /**
   * Sample template CSV for download
   */
  public static getSampleBiometricCsv(): string {
    return `employee_id,date,time_in,time_out
SF2-001,2026-09-01,07:55,17:05
SF2-002,2026-09-01,08:00,17:00
SF2-003,2026-09-01,07:50,17:15
SF2-004,2026-09-01,07:45,20:00
SF2-005,2026-09-01,08:05,17:00
SF2-006,2026-09-01,08:20,17:00
SF2-007,2026-09-01,07:58,17:02
SF2-008,2026-09-01,08:00,17:00
SF2-009,2026-09-01,07:40,19:30
SF2-010,2026-09-01,07:50,17:10`;
  }
}
