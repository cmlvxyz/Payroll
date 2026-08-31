import {
  Employee,
  LoanRecord,
  PayrollSettings,
  SssBracket,
  BirTaxBracket,
  User,
  AttendanceRecord,
  AttendanceStatus,
  PayrollRun,
  PayrollDetail,
} from '../types';

export const SEED_USERS: User[] = [
  {
    id: 'USR-001',
    name: 'Hon. Nestor Nabaunag (Punong Barangay)',
    email: 'admin@sf2.local',
    role: 'ADMIN',
    employee_id: 'SF2-001',
    active: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-002',
    name: 'Ricardo De Jesus (HR Officer)',
    email: 'hr@sf2.local',
    role: 'HR',
    employee_id: 'SF2-003',
    active: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-003',
    name: 'Catherine D. Cinco (Finance Officer)',
    email: 'finance@sf2.local',
    role: 'FINANCE',
    employee_id: 'SF2-002',
    active: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-004',
    name: 'Juan Dela Cruz (Barangay Tanod)',
    email: 'employee@sf2.local',
    role: 'EMPLOYEE',
    employee_id: 'SF2-004',
    active: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
];

export const SEED_EMPLOYEES: Employee[] = [
  // 1. Barangay Officials (3)
  {
    id: 'EMP-001',
    employee_id: 'SF2-001',
    first_name: 'Nestor',
    middle_name: '',
    last_name: 'Nabaunag',
    suffix: '',
    employee_type: 'Official',
    position: 'Punong Barangay (Captain)',
    basic_salary: 28000,
    allowance: 5000,
    date_hired: '2023-11-01',
    status: 'Active',
    sss_no: '04-1234567-8',
    philhealth_no: '12-098765432-1',
    pagibig_no: '1210-9876-5432',
    tin: '234-567-890-000',
    bank_name: 'BDO',
    bank_account: '001234567890',
    contact_number: '+63 917 111 2233',
    address: '014 Ilang-Ilang St., Brgy. San Felipe II',
    email: 'punongbarangay@sf2.gov.ph',
    emergency_contact: 'Barangay Hall',
    emergency_phone: '+63 917 111 2234',
  },
  {
    id: 'EMP-002',
    employee_id: 'SF2-002',
    first_name: 'Catherine',
    middle_name: 'D.',
    last_name: 'Cinco',
    suffix: '',
    employee_type: 'Official',
    position: 'Barangay Treasurer (Finance)',
    basic_salary: 21000,
    allowance: 3500,
    date_hired: '2023-11-01',
    status: 'Active',
    sss_no: '04-2345678-9',
    philhealth_no: '12-198765432-2',
    pagibig_no: '1210-8765-4321',
    tin: '345-678-901-000',
    bank_name: 'BDO',
    bank_account: '002345678901',
    contact_number: '+63 918 222 3344',
    address: '045 Rosas Compound, Brgy. San Felipe II',
    email: 'finance@sf2.gov.ph',
    emergency_contact: 'Barangay Hall',
    emergency_phone: '+63 918 222 3345',
  },
  {
    id: 'EMP-003',
    employee_id: 'SF2-003',
    first_name: 'Ricardo',
    middle_name: 'Pascual',
    last_name: 'De Jesus',
    suffix: 'Jr.',
    employee_type: 'Official',
    position: 'Barangay Secretary / HR',
    basic_salary: 18500,
    allowance: 2500,
    date_hired: '2023-11-15',
    status: 'Active',
    sss_no: '04-3456789-0',
    philhealth_no: '12-298765432-3',
    pagibig_no: '1210-7654-3210',
    tin: '456-789-012-000',
    bank_name: 'BPI',
    bank_account: '1987654321',
    contact_number: '+63 919 333 4455',
    address: '102 Dahlia St., Brgy. San Felipe II',
    email: 'sec.dejesus@sf2.gov.ph',
    emergency_contact: 'Corazon De Jesus (Mother)',
    emergency_phone: '+63 919 333 4456',
  },

  // 2. Barangay Tanods (5)
  {
    id: 'EMP-004',
    employee_id: 'SF2-004',
    first_name: 'Juan',
    middle_name: 'Protacio',
    last_name: 'Dela Cruz',
    suffix: '',
    employee_type: 'Tanod',
    position: 'Chief Barangay Tanod (Security Lead)',
    basic_salary: 12500,
    allowance: 1500,
    date_hired: '2022-03-01',
    status: 'Active',
    sss_no: '04-4567890-1',
    philhealth_no: '12-398765432-4',
    pagibig_no: '1210-6543-2109',
    tin: '567-890-123-000',
    bank_name: 'BDO',
    bank_account: '003456789012',
    contact_number: '+63 920 444 5566',
    address: '088 Sampaguita Alley, Brgy. San Felipe II',
    email: 'juan.delacruz@sf2.local',
    emergency_contact: 'Maria Dela Cruz (Spouse)',
    emergency_phone: '+63 920 444 5567',
  },
  {
    id: 'EMP-005',
    employee_id: 'SF2-005',
    first_name: 'Danilo',
    middle_name: 'Reyes',
    last_name: 'Bautista',
    suffix: '',
    employee_type: 'Tanod',
    position: 'Senior Barangay Tanod (Night Shift)',
    basic_salary: 11000,
    allowance: 1200,
    date_hired: '2022-05-15',
    status: 'Active',
    sss_no: '04-5678901-2',
    philhealth_no: '12-498765432-5',
    pagibig_no: '1210-5432-1098',
    tin: '678-901-234-000',
    bank_name: 'BPI',
    bank_account: '1987654322',
    contact_number: '+63 921 555 6677',
    address: '022 Camia St., Brgy. San Felipe II',
    email: 'danilo.bautista@sf2.local',
    emergency_contact: 'Gina Bautista (Spouse)',
    emergency_phone: '+63 921 555 6678',
  },
  {
    id: 'EMP-006',
    employee_id: 'SF2-006',
    first_name: 'Rodolfo',
    middle_name: 'Mercado',
    last_name: 'Garcia',
    suffix: '',
    employee_type: 'Tanod',
    position: 'Barangay Tanod (Peace & Order)',
    basic_salary: 10500,
    allowance: 1000,
    date_hired: '2023-01-10',
    status: 'Active',
    sss_no: '04-6789012-3',
    philhealth_no: '12-598765432-6',
    pagibig_no: '1210-4321-0987',
    tin: '789-012-345-000',
    bank_name: 'BDO',
    bank_account: '004567890123',
    contact_number: '+63 922 666 7788',
    address: '061 Gumamela Lane, Brgy. San Felipe II',
    email: 'rodolfo.garcia@sf2.local',
    emergency_contact: 'Teresa Garcia (Sister)',
    emergency_phone: '+63 922 666 7789',
  },
  {
    id: 'EMP-007',
    employee_id: 'SF2-007',
    first_name: 'Christopher',
    middle_name: 'Villanueva',
    last_name: 'Reyes',
    suffix: '',
    employee_type: 'Tanod',
    position: 'Barangay Tanod (Day Patrol)',
    basic_salary: 10500,
    allowance: 1000,
    date_hired: '2023-04-01',
    status: 'Active',
    sss_no: '04-7890123-4',
    philhealth_no: '12-698765432-7',
    pagibig_no: '1210-3210-9876',
    tin: '890-123-456-000',
    bank_name: 'BDO',
    bank_account: '005678901234',
    contact_number: '+63 923 777 8899',
    address: '019 Waling-Waling, Brgy. San Felipe II',
    email: 'christopher.reyes@sf2.local',
    emergency_contact: 'Jenny Reyes (Spouse)',
    emergency_phone: '+63 923 777 8890',
  },
  {
    id: 'EMP-008',
    employee_id: 'SF2-008',
    first_name: 'Emmanuel',
    middle_name: 'Salazar',
    last_name: 'Aquino',
    suffix: '',
    employee_type: 'Tanod',
    position: 'Barangay Tanod (Traffic Auxiliary)',
    basic_salary: 10500,
    allowance: 1000,
    date_hired: '2023-06-15',
    status: 'Active',
    sss_no: '04-8901234-5',
    philhealth_no: '12-798765432-8',
    pagibig_no: '1210-2109-8765',
    tin: '901-234-567-000',
    bank_name: 'BPI',
    bank_account: '1987654323',
    contact_number: '+63 924 888 9900',
    address: '077 Santan St., Brgy. San Felipe II',
    email: 'emmanuel.aquino@sf2.local',
    emergency_contact: 'Anita Aquino (Mother)',
    emergency_phone: '+63 924 888 9901',
  },

  // 3. Barangay Drivers (2)
  {
    id: 'EMP-009',
    employee_id: 'SF2-009',
    first_name: 'Arnel',
    middle_name: 'Tolentino',
    last_name: 'Magpantay',
    suffix: '',
    employee_type: 'Driver',
    position: 'Barangay Ambulance & Rescue Driver',
    basic_salary: 13000,
    allowance: 1500,
    date_hired: '2022-08-01',
    status: 'Active',
    sss_no: '04-9012345-6',
    philhealth_no: '12-898765432-9',
    pagibig_no: '1210-1098-7654',
    tin: '012-345-678-000',
    bank_name: 'BDO',
    bank_account: '006789012345',
    contact_number: '+63 925 999 0011',
    address: '112 Everlasting Rd., Brgy. San Felipe II',
    email: 'arnel.magpantay@sf2.local',
    emergency_contact: 'Perla Magpantay (Spouse)',
    emergency_phone: '+63 925 999 0012',
  },
  {
    id: 'EMP-010',
    employee_id: 'SF2-010',
    first_name: 'Mario',
    middle_name: 'Bernardo',
    last_name: 'Villanueva',
    suffix: '',
    employee_type: 'Driver',
    position: 'Barangay Utility & Waste Transport Driver',
    basic_salary: 12500,
    allowance: 1200,
    date_hired: '2023-02-01',
    status: 'Active',
    sss_no: '04-0123456-7',
    philhealth_no: '12-998765432-0',
    pagibig_no: '1210-0987-6543',
    tin: '123-456-789-000',
    bank_name: 'BPI',
    bank_account: '1987654324',
    contact_number: '+63 926 000 1122',
    address: '034 Jasmin Alley, Brgy. San Felipe II',
    email: 'mario.villanueva@sf2.local',
    emergency_contact: 'Susan Villanueva (Spouse)',
    emergency_phone: '+63 926 000 1123',
  },
];

export const SEED_LOANS: LoanRecord[] = [
  {
    id: 'LN-001',
    employee_id: 'SF2-004', // Juan Dela Cruz
    loan_type: 'SSS Salary Loan',
    reference_number: 'SSS-LN-2026-089',
    principal_amount: 15000,
    balance: 8500,
    installment_amount: 500, // deducted semi-monthly
    start_date: '2026-01-15',
    end_date: '2026-12-30',
    status: 'Active',
  },
  {
    id: 'LN-002',
    employee_id: 'SF2-009', // Arnel Magpantay
    loan_type: 'Pag-IBIG MPL',
    reference_number: 'HDMF-MPL-2026-114',
    principal_amount: 12000,
    balance: 7200,
    installment_amount: 400,
    start_date: '2026-02-01',
    end_date: '2027-01-30',
    status: 'Active',
  },
  {
    id: 'LN-003',
    employee_id: 'SF2-005', // Danilo Bautista
    loan_type: 'Barangay Emergency Loan',
    reference_number: 'SF2-EMG-2026-012',
    principal_amount: 5000,
    balance: 1500,
    installment_amount: 350,
    start_date: '2026-06-01',
    end_date: '2026-09-30',
    status: 'Active',
  },
];

// Official 2026 SSS Contribution Schedule (Republic Act 11199: 14% total rate -> 9.5% ER, 4.5% EE + EC Fund)
export const SSS_CONTRIBUTION_TABLE_2026: SssBracket[] = [
  { minSalary: 0, maxSalary: 4249.99, salaryCredit: 4000, employeeShare: 180, employerShare: 380, ecShare: 10, totalContribution: 570 },
  { minSalary: 4250, maxSalary: 4749.99, salaryCredit: 4500, employeeShare: 202.50, employerShare: 427.50, ecShare: 10, totalContribution: 640 },
  { minSalary: 4750, maxSalary: 5249.99, salaryCredit: 5000, employeeShare: 225, employerShare: 475, ecShare: 10, totalContribution: 710 },
  { minSalary: 5250, maxSalary: 5749.99, salaryCredit: 5500, employeeShare: 247.50, employerShare: 522.50, ecShare: 10, totalContribution: 780 },
  { minSalary: 5750, maxSalary: 6249.99, salaryCredit: 6000, employeeShare: 270, employerShare: 570, ecShare: 10, totalContribution: 850 },
  { minSalary: 6250, maxSalary: 6749.99, salaryCredit: 6500, employeeShare: 292.50, employerShare: 617.50, ecShare: 10, totalContribution: 920 },
  { minSalary: 6750, maxSalary: 7249.99, salaryCredit: 7000, employeeShare: 315, employerShare: 665, ecShare: 10, totalContribution: 990 },
  { minSalary: 7250, maxSalary: 7749.99, salaryCredit: 7500, employeeShare: 337.50, employerShare: 712.50, ecShare: 10, totalContribution: 1060 },
  { minSalary: 7750, maxSalary: 8249.99, salaryCredit: 8000, employeeShare: 360, employerShare: 760, ecShare: 10, totalContribution: 1130 },
  { minSalary: 8250, maxSalary: 8749.99, salaryCredit: 8500, employeeShare: 382.50, employerShare: 807.50, ecShare: 10, totalContribution: 1200 },
  { minSalary: 8750, maxSalary: 9249.99, salaryCredit: 9000, employeeShare: 405, employerShare: 855, ecShare: 10, totalContribution: 1270 },
  { minSalary: 9250, maxSalary: 9749.99, salaryCredit: 9500, employeeShare: 427.50, employerShare: 902.50, ecShare: 10, totalContribution: 1340 },
  { minSalary: 9750, maxSalary: 10249.99, salaryCredit: 10000, employeeShare: 450, employerShare: 950, ecShare: 10, totalContribution: 1410 },
  { minSalary: 10250, maxSalary: 10749.99, salaryCredit: 10500, employeeShare: 472.50, employerShare: 997.50, ecShare: 10, totalContribution: 1480 },
  { minSalary: 10750, maxSalary: 11249.99, salaryCredit: 11000, employeeShare: 495, employerShare: 1045, ecShare: 10, totalContribution: 1550 },
  { minSalary: 11250, maxSalary: 11749.99, salaryCredit: 11500, employeeShare: 517.50, employerShare: 1092.50, ecShare: 10, totalContribution: 1620 },
  { minSalary: 11750, maxSalary: 12249.99, salaryCredit: 12000, employeeShare: 540, employerShare: 1140, ecShare: 10, totalContribution: 1690 },
  { minSalary: 12250, maxSalary: 12749.99, salaryCredit: 12500, employeeShare: 562.50, employerShare: 1187.50, ecShare: 10, totalContribution: 1760 },
  { minSalary: 12750, maxSalary: 13249.99, salaryCredit: 13000, employeeShare: 585, employerShare: 1235, ecShare: 10, totalContribution: 1830 },
  { minSalary: 13250, maxSalary: 13749.99, salaryCredit: 13500, employeeShare: 607.50, employerShare: 1282.50, ecShare: 10, totalContribution: 1900 },
  { minSalary: 13750, maxSalary: 14249.99, salaryCredit: 14000, employeeShare: 630, employerShare: 1330, ecShare: 10, totalContribution: 1970 },
  { minSalary: 14250, maxSalary: 14749.99, salaryCredit: 14500, employeeShare: 652.50, employerShare: 1377.50, ecShare: 10, totalContribution: 2040 },
  { minSalary: 14750, maxSalary: 15249.99, salaryCredit: 15000, employeeShare: 675, employerShare: 1425, ecShare: 30, totalContribution: 2130 },
  { minSalary: 15250, maxSalary: 15749.99, salaryCredit: 15500, employeeShare: 697.50, employerShare: 1472.50, ecShare: 30, totalContribution: 2200 },
  { minSalary: 15750, maxSalary: 16249.99, salaryCredit: 16000, employeeShare: 720, employerShare: 1520, ecShare: 30, totalContribution: 2270 },
  { minSalary: 16250, maxSalary: 16749.99, salaryCredit: 16500, employeeShare: 742.50, employerShare: 1567.50, ecShare: 30, totalContribution: 2340 },
  { minSalary: 16750, maxSalary: 17249.99, salaryCredit: 17000, employeeShare: 765, employerShare: 1615, ecShare: 30, totalContribution: 2410 },
  { minSalary: 17250, maxSalary: 17749.99, salaryCredit: 17500, employeeShare: 787.50, employerShare: 1662.50, ecShare: 30, totalContribution: 2480 },
  { minSalary: 17750, maxSalary: 18249.99, salaryCredit: 18000, employeeShare: 810, employerShare: 1710, ecShare: 30, totalContribution: 2550 },
  { minSalary: 18250, maxSalary: 18749.99, salaryCredit: 18500, employeeShare: 832.50, employerShare: 1757.50, ecShare: 30, totalContribution: 2620 },
  { minSalary: 18750, maxSalary: 19249.99, salaryCredit: 19000, employeeShare: 855, employerShare: 1805, ecShare: 30, totalContribution: 2690 },
  { minSalary: 19250, maxSalary: 19749.99, salaryCredit: 19500, employeeShare: 877.50, employerShare: 1852.50, ecShare: 30, totalContribution: 2760 },
  { minSalary: 19750, maxSalary: 20249.99, salaryCredit: 20000, employeeShare: 900, employerShare: 1900, ecShare: 30, totalContribution: 2830 },
  { minSalary: 20250, maxSalary: 24749.99, salaryCredit: 22500, employeeShare: 1012.50, employerShare: 2137.50, ecShare: 30, totalContribution: 3180 },
  { minSalary: 24750, maxSalary: 29749.99, salaryCredit: 27500, employeeShare: 1237.50, employerShare: 2612.50, ecShare: 30, totalContribution: 3880 },
  { minSalary: 29750, maxSalary: 999999, salaryCredit: 30000, employeeShare: 1350, employerShare: 2850, ecShare: 30, totalContribution: 4230 },
];

// Revised BIR Withholding Tax Table (Monthly TRAIN Law 2023-2026 Table)
export const BIR_MONTHLY_TAX_TABLE: BirTaxBracket[] = [
  { min_amount: 0, max_amount: 20833.33, base_tax: 0, excess_rate: 0 },
  { min_amount: 20833.33, max_amount: 33333.33, base_tax: 0, excess_rate: 0.15 },
  { min_amount: 33333.33, max_amount: 66666.67, base_tax: 1875, excess_rate: 0.20 },
  { min_amount: 66666.67, max_amount: 166666.67, base_tax: 8541.67, excess_rate: 0.25 },
  { min_amount: 166666.67, max_amount: 666666.67, base_tax: 33541.67, excess_rate: 0.30 },
  { min_amount: 666666.67, max_amount: 99999999, base_tax: 183541.67, excess_rate: 0.35 },
];

export const DEFAULT_SETTINGS: PayrollSettings = {
  barangay_name: 'Barangay San Felipe II',
  barangay_subtitle: 'City of Cavite, Province of Cavite, Republic of the Philippines',
  barangay_address: 'Barangay Hall, J. Felipe Blvd., Brgy. San Felipe II, Cavite City 4100',
  municipality: 'Cavite City',
  province: 'Cavite',
  contact_number: '(046) 431-2890 / +63 917 111 2233',
  punong_barangay: 'Hon. Nestor Nabaunag',
  barangay_treasurer: 'Catherine D. Cinco',
  barangay_secretary: 'Ricardo P. De Jesus Jr.',
  hr_officer: 'Ricardo P. De Jesus Jr.',
  
  work_start_time: '08:00',
  work_end_time: '17:00',
  required_daily_hours: 8,
  working_days_per_month: 22,
  
  cutoff_1_start: 1,
  cutoff_1_end: 15,
  cutoff_2_start: 16,
  cutoff_2_end: 30,
  
  philhealth_rate: 0.05,
  philhealth_max_monthly: 2500, // total cap (EE = 1250, ER = 1250)
  pagibig_rate: 0.02,
  pagibig_max_monthly_employee: 100, // EE cap (ER = 100)
  
  sss_due_day: 10,
  philhealth_due_day: 10,
  pagibig_due_day: 10,
  bir_due_day: 10,
};

// Generate realistic seed attendance for Sep 1-15, 2026 cutoff
export function generateSeedAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const dates = [
    '2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-09-07',
    '2026-09-08', '2026-09-09', '2026-09-10', '2026-09-11', '2026-09-14', '2026-09-15'
  ];

  SEED_EMPLOYEES.forEach((emp, empIdx) => {
    dates.forEach((date, dateIdx) => {
      let timeIn = '07:55';
      let timeOut = '17:05';
      let lateMin = 0;
      let otHours = 0;
      let undertimeHours = 0;
      let absent = false;
      let status: AttendanceStatus = 'Present';

      // Inject realistic variance: Tanods with night patrol OT, occasional late, etc.
      if (emp.employee_type === 'Tanod' && (dateIdx === 3 || dateIdx === 7)) {
        timeIn = '07:50';
        timeOut = '20:00';
        otHours = 3;
      } else if (emp.employee_type === 'Driver' && dateIdx === 5) {
        timeIn = '07:45';
        timeOut = '19:30';
        otHours = 2.5;
      } else if (emp.employee_id === 'SF2-006' && dateIdx === 2) {
        // Late tanod
        timeIn = '08:24';
        timeOut = '17:00';
        lateMin = 24;
        status = 'Late';
      } else if (emp.employee_id === 'SF2-008' && dateIdx === 8) {
        // Adjusted attendance
        timeIn = '08:00';
        timeOut = '17:00';
        status = 'Adjusted';
      }

      records.push({
        id: `ATT-${emp.employee_id}-${date}`,
        employee_id: emp.employee_id,
        attendance_date: date,
        time_in: timeIn,
        time_out: timeOut,
        days_worked: absent ? 0 : 1,
        late_minutes: lateMin,
        ot_hours: otHours,
        undertime_hours: undertimeHours,
        absent,
        status,
        adjustment_reason: status === 'Adjusted' ? 'Biometric reader timeout acknowledged by HR' : undefined,
        adjusted_by: status === 'Adjusted' ? 'Ricardo De Jesus (HR)' : undefined,
        adjusted_at: status === 'Adjusted' ? '2026-09-12 09:15' : undefined,
      });
    });
  });

  return records;
}