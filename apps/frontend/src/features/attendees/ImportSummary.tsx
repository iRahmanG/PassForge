import React from 'react';
import { CsvImportResult } from '@passforge/shared';
import { Card } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import {
  CheckCircle2,
  AlertTriangle,
  Users,
  FileSpreadsheet,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

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
    <div className="space-y-6">
      {/* Workflow Step Bar */}
      <div className="bg-white border border-[#E9E5DC] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF8F5] text-[#77736C] border border-[#E9E5DC] font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#2E683E]" />
            <span>1. Uploaded CSV</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#9E9A90] shrink-0 hidden sm:block" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF8F5] text-[#77736C] border border-[#E9E5DC] font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#2E683E]" />
            <span>2. Mapped Columns</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#9E9A90] shrink-0 hidden sm:block" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EEF6F0] text-[#2E683E] border border-[#C6E2CD] font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#2E683E]" />
            <span>3. Complete</span>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={onReset} icon={<RotateCcw className="w-3.5 h-3.5" />}>
          Import Another CSV
        </Button>
      </div>

      <Card
        headerIcon={<CheckCircle2 className="w-4 h-4 text-[#2E683E]" />}
        title="CSV Import Summary Report"
        subtitle={`Processing finished • ${result.validCount} valid record${
          result.validCount === 1 ? '' : 's'
        } registered into in-memory store`}
      >
        <div className="space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E9E5DC] flex flex-col">
              <span className="text-xs text-[#77736C] font-medium flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-[#9E9A90]" /> Total Rows
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#252525] mt-1.5">
                {result.totalRows}
              </span>
            </div>

            <div className="bg-[#EEF6F0] p-4 rounded-xl border border-[#C6E2CD] flex flex-col">
              <span className="text-xs text-[#2E683E] font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E683E]" /> Valid Attendees
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2E683E] mt-1.5">
                {result.validCount}
              </span>
            </div>

            <div
              className={`p-4 rounded-xl border flex flex-col ${
                result.invalidCount > 0
                  ? 'bg-[#FDF0F0] border-[#F5CCCC]'
                  : 'bg-[#FAF8F5] border-[#E9E5DC]'
              }`}
            >
              <span
                className={`text-xs font-medium flex items-center gap-1.5 ${
                  result.invalidCount > 0 ? 'text-[#A83232]' : 'text-[#77736C]'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-[#A83232]" /> Invalid Rows
              </span>
              <span
                className={`text-2xl sm:text-3xl font-extrabold mt-1.5 ${
                  result.invalidCount > 0 ? 'text-[#A83232]' : 'text-[#77736C]'
                }`}
              >
                {result.invalidCount}
              </span>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E9E5DC] flex flex-col">
              <span className="text-xs text-[#77736C] font-medium">Skipped Empty Rows</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#77736C] mt-1.5">
                {result.skippedEmptyRows}
              </span>
            </div>
          </div>

          {/* Success Callout Banner */}
          {isPerfect ? (
            <div className="p-5 rounded-2xl bg-[#EEF6F0] border border-[#C6E2CD] text-[#2E683E] text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white border border-[#C6E2CD] text-[#2E683E] shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#252525]">
                    All Attendee Records Verified
                  </h4>
                  <p className="text-[#55684D] mt-0.5">
                    100% of rows passed Zod schema validation without formatting errors or duplicate emails.
                  </p>
                </div>
              </div>
              <Button size="md" onClick={onGoToDirectory} icon={<Users className="w-4 h-4" />}>
                View Attendee Directory
              </Button>
            </div>
          ) : result.errors.length > 0 ? (
            /* Error Diagnosis Table */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#A83232] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#A83232]" />
                  Validation Diagnoses ({result.errors.length})
                </h4>
                <span className="text-[11px] text-[#77736C]">
                  Correct these entries in your CSV and re-upload
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#E9E5DC] bg-white">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] text-[#77736C] border-b border-[#E9E5DC] font-mono text-[11px]">
                    <tr>
                      <th className="p-3 w-20">Row #</th>
                      <th className="p-3 w-36">Field</th>
                      <th className="p-3">Error Diagnosis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E5DC] font-mono">
                    {result.errors.map((err, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF8F5]">
                        <td className="p-3 text-[#77736C] font-bold">Line {err.row}</td>
                        <td className="p-3 text-[#A83232] font-semibold">{err.field}</td>
                        <td className="p-3 text-[#4A4641]">{err.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-[#E9E5DC] flex items-center justify-between">
            <span className="text-xs text-[#77736C]">
              Ready to design passes for {result.validCount} attendee
              {result.validCount === 1 ? '' : 's'}
            </span>
            <Button size="md" onClick={onGoToDirectory} icon={<Users className="w-4 h-4" />}>
              Open Attendee Directory
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};