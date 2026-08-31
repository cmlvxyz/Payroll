import React from 'react';
import {
  Users,
  Clock,
  Calculator,
  CheckSquare,
  FileText,
  Building2,
  Landmark,
  ArrowRight,
  CheckCircle2,
  ListChecks,
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';

interface Step {
  number: number;
  title: string;
  description: string;
  view: AppView;
  icon: React.ReactNode;
  colorClass: string;
}

const STEPS: Step[] = [
  {
    number: 1,
    title: 'Tally the Masterlist',
    description: 'Review or edit the list of Officials, Tanods & Drivers with salaries, allowances, and government numbers (SSS, PhilHealth, Pag-IBIG, TIN, Bank).',
    view: 'employees',
    icon: <Users className="w-4 h-4" />,
    colorClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
  },
  {
    number: 2,
    title: 'Import Attendance',
    description: 'Upload the biometric CSV (employee_id, date, time_in, time_out) for the cutoff period. The system computes days worked, late, OT, and undertime.',
    view: 'attendance',
    icon: <Clock className="w-4 h-4" />,
    colorClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300',
  },
  {
    number: 3,
    title: 'Process Payroll',
    description: 'Generate the payroll run for the cutoff (1-15 or 16-30). Basic pay, OT, allowance, SSS, PhilHealth, Pag-IBIG, tax, loans, and net pay are computed.',
    view: 'payroll',
    icon: <Calculator className="w-4 h-4" />,
    colorClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
  },
  {
    number: 4,
    title: 'Approve the Run',
    description: 'Approve as HR first, then as Finance. Moving the run through DRAFT → HR Approved → Finance Approved → For Payout. Everything can be done by you.',
    view: 'approvals',
    icon: <CheckSquare className="w-4 h-4" />,
    colorClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
  },
  {
    number: 5,
    title: 'Download Payslips',
    description: 'Generate official printable PDF payslips for every worker to print and distribute.',
    view: 'payslips',
    icon: <FileText className="w-4 h-4" />,
    colorClass: 'bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300',
  },
  {
    number: 6,
    title: 'Export Bank File',
    description: 'Generate the BDO or BPI payout CSV for the banking partner to process the payroll.',
    view: 'banking',
    icon: <Building2 className="w-4 h-4" />,
    colorClass: 'bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300',
  },
  {
    number: 7,
    title: 'Generate Gov Reports',
    description: 'Create the SSS R-3, PhilHealth RF-1, Pag-IBIG MCRF, and BIR 1601-C files. Review and upload them manually to each agency.',
    view: 'reports',
    icon: <Landmark className="w-4 h-4" />,
    colorClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300',
  },
];

export const WorkflowGuide: React.FC = () => {
  const { setCurrentView, payrollRuns } = useApp();
  const hasActiveRun = payrollRuns.length > 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-blue-600" />
            Payroll Workflow — Your Step-by-Step Process
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            As the lone payroll officer, simply follow these steps in order each pay period.
            {hasActiveRun && ' You already have a payroll run in progress.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {STEPS.map((step) => (
          <button
            key={step.number}
            onClick={() => setCurrentView(step.view)}
            className="text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${step.colorClass}`}>
                {step.icon}
              </div>
              <span className="text-[11px] font-extrabold text-slate-400 group-hover:text-blue-500 transition-colors">
                STEP {step.number} / 7
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
              {step.title}
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {step.description}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs">
        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          <span className="font-bold text-blue-700 dark:text-blue-300">Remember:</span> You can do all of
          this yourself. Switch your role (Admin / HR / Finance) in the top navigation when approving, and
          use the Employee Portal to check what each worker sees. Government reports are generated for your
          review — you still file/upload them to each agency manually.
        </p>
      </div>
    </div>
  );
};
