import React from 'react';
import { CsvImportResult } from '@passforge/shared';
import { Card } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { CheckCircle2, AlertTriangle, Users, FileSpreadsheet, ArrowRight, RotateCcw } from 'lucide-react';

interface ImportSummaryProps {
  result: CsvImportResult;
  onGoToDirectory: () => void;
  onReset: () => void;
}

export const ImportSummary: React.FC<ImportSummaryProps> = ({
  result,
  onGoToDirectory,
  onReset,
}) => {
  const isPerfect = result.invalidCount === 0 && result.validCount > 0;

  return (
    <Card
      title="CSV Import Summary"
      subtitle={`Processing complete • ${result.validCount} valid record${result.validCount === 1 ? '' : 's'} added`}
      action={
        <Button variant="outline" size="sm" onClick={onReset} icon={<RotateCcw className="w-3.5 h-3.5" />}>
          Import Another CSV
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" /> Total Rows
            </span>
            <span className="text-2xl font-bold text-white mt-1">{result.totalRows}</span>
          </div>

          <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-600/30 flex flex-col">
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Valid Attendees
            </span>
            <span className="text-2xl font-bold text-emerald-300 mt-1">{result.validCount}</span>
          </div>

          <div className={`p-4 rounded-xl border flex flex-col ${
            result.invalidCount > 0
              ? 'bg-rose-950/20 border-rose-600/30'
              : 'bg-slate-950 border-slate-800'
          }`}>
            <span className={`text-xs font-medium flex items-center gap-1.5 ${
              result.invalidCount > 0 ? 'text-rose-400' : 'text-slate-400'
            }`}>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Invalid Rows
            </span>
            <span className={`text-2xl font-bold mt-1 ${
              result.invalidCount > 0 ? 'text-rose-300' : 'text-slate-400'
            }`}>
              {result.invalidCount}
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col">
            <span className="text-xs text-slate-400 font-medium">Skipped Empty Rows</span>
            <span className="text-2xl font-bold text-slate-400 mt-1">{result.skippedEmptyRows}</span>
          </div>
        </div>

        {/* Status Callout Banner */}
        {isPerfect ? (
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-sm text-emerald-100">All Rows Successfully Imported</p>
                <p className="text-emerald-300/80">Every row passed validation and has been registered in the attendee store.</p>
              </div>
            </div>
            <Button size="sm" onClick={onGoToDirectory} icon={<Users className="w-4 h-4" />}>
              View Attendee Directory
            </Button>
          </div>
        ) : result.errors.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Validation Errors ({result.errors.length})
              </h4>
              <span className="text-xs text-slate-500">Fix these rows in your CSV and re-import if needed</span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                  <tr>
                    <th className="p-3 w-20">Row #</th>
                    <th className="p-3 w-32">Field</th>
                    <th className="p-3">Error Message</th>
                    <th className="p-3">Row Content</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-sans">
                  {result.errors.map((err, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono font-bold text-rose-400">Line {err.row}</td>
                      <td className="p-3 font-mono text-slate-300 uppercase text-[11px]">{err.field}</td>
                      <td className="p-3 text-rose-300 font-medium">{err.message}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-400 max-w-xs truncate">
                        {err.rawData ? JSON.stringify(err.rawData) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {/* Action Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onReset}>
            Import Another CSV File
          </Button>
          <Button onClick={onGoToDirectory} icon={<ArrowRight className="w-4 h-4" />}>
            Go to Attendee Directory ({result.validCount} Ready)
          </Button>
        </div>
      </div>
    </Card>
  );
};
