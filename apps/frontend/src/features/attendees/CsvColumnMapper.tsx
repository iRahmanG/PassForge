import React, { useState, useEffect } from 'react';
import { CsvColumnMapping } from '@passforge/shared';
import { Card } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { Check, ArrowRight, Table, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface CsvColumnMapperProps {
  headers: string[];
  previewRows: Record<string, string>[];
  initialMapping: CsvColumnMapping;
  onConfirmImport: (mapping: CsvColumnMapping) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const CsvColumnMapper: React.FC<CsvColumnMapperProps> = ({
  headers,
  previewRows,
  initialMapping,
  onConfirmImport,
  onCancel,
  loading = false,
}) => {
  const [mapping, setMapping] = useState<CsvColumnMapping>(initialMapping);

  useEffect(() => {
    setMapping(initialMapping);
  }, [initialMapping]);

  const handleChange = (field: keyof CsvColumnMapping, value: string) => {
    setMapping((prev) => ({ ...prev, [field]: value }));
  };

  const isValid = !!mapping.name && !!mapping.email && !!mapping.ticketType;

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
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9] font-bold">
            <span className="w-5 h-5 rounded-full bg-[#B86E52] text-white flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Map Columns</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#9E9A90] shrink-0 hidden sm:block" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF8F5] text-[#77736C] border border-[#E9E5DC] font-medium">
            <span className="w-5 h-5 rounded-full bg-[#EAE6DC] text-[#77736C] flex items-center justify-center text-[10px]">
              3
            </span>
            <span>Validate & Import</span>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={onCancel} icon={<ArrowLeft className="w-3.5 h-3.5" />}>
          Choose Different File
        </Button>
      </div>

      <Card
        headerIcon={<Table className="w-4 h-4 text-[#B86E52]" />}
        title="Map CSV Columns to Attendee Fields"
        subtitle="Confirm which columns in your uploaded file correspond to each attendee domain field"
      >
        <div className="space-y-6">
          {/* Mapping Dropdown Selectors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Full Name */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] space-y-2">
              <label className="text-xs font-bold text-[#252525] flex items-center justify-between">
                <span>
                  Attendee Name <span className="text-[#A83232]">*</span>
                </span>
                {mapping.name ? (
                  <Check className="w-4 h-4 text-[#2E683E]" />
                ) : (
                  <span className="text-[10px] text-[#A83232] font-normal">Required</span>
                )}
              </label>
              <select
                value={mapping.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-white border border-[#DDD8CD] rounded-lg px-3 py-2 text-xs text-[#252525] focus:outline-none focus:border-[#B86E52] font-medium"
              >
                <option value="">-- Select Column --</option>
                {headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#77736C]">Target: Attendee Full Name</p>
            </div>

            {/* Email Address */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] space-y-2">
              <label className="text-xs font-bold text-[#252525] flex items-center justify-between">
                <span>
                  Email Address <span className="text-[#A83232]">*</span>
                </span>
                {mapping.email ? (
                  <Check className="w-4 h-4 text-[#2E683E]" />
                ) : (
                  <span className="text-[10px] text-[#A83232] font-normal">Required</span>
                )}
              </label>
              <select
                value={mapping.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-white border border-[#DDD8CD] rounded-lg px-3 py-2 text-xs text-[#252525] focus:outline-none focus:border-[#B86E52] font-medium"
              >
                <option value="">-- Select Column --</option>
                {headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#77736C]">Target: Unique Attendee Email</p>
            </div>

            {/* Ticket Category */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] space-y-2">
              <label className="text-xs font-bold text-[#252525] flex items-center justify-between">
                <span>
                  Ticket Type <span className="text-[#A83232]">*</span>
                </span>
                {mapping.ticketType ? (
                  <Check className="w-4 h-4 text-[#2E683E]" />
                ) : (
                  <span className="text-[10px] text-[#A83232] font-normal">Required</span>
                )}
              </label>
              <select
                value={mapping.ticketType}
                onChange={(e) => handleChange('ticketType', e.target.value)}
                className="w-full bg-white border border-[#DDD8CD] rounded-lg px-3 py-2 text-xs text-[#252525] focus:outline-none focus:border-[#B86E52] font-medium"
              >
                <option value="">-- Select Column --</option>
                {headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#77736C]">Target: VIP, General, Speaker...</p>
            </div>

            {/* Seat Number */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] space-y-2">
              <label className="text-xs font-bold text-[#252525] flex items-center justify-between">
                <span>Seat Number</span>
                <span className="text-[10px] text-[#77736C] font-normal">Optional</span>
              </label>
              <select
                value={mapping.seat}
                onChange={(e) => handleChange('seat', e.target.value)}
                className="w-full bg-white border border-[#DDD8CD] rounded-lg px-3 py-2 text-xs text-[#252525] focus:outline-none focus:border-[#B86E52] font-medium"
              >
                <option value="">-- Open Seating (None) --</option>
                {headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#77736C]">Target: Specific Seat or Booth</p>
            </div>
          </div>

          {/* First 5 Preview Rows Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#77736C]">
                First 5 Rows Preview
              </h4>
              <span className="text-[11px] text-[#77736C]">
                Total Columns Detected: {headers.length}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E9E5DC] bg-white">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF8F5] text-[#77736C] border-b border-[#E9E5DC]">
                  <tr>
                    {headers.map((h) => (
                      <th key={h} className="p-3 font-semibold text-[11px]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E5DC]">
                  {previewRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF8F5]">
                      {headers.map((h) => (
                        <td key={h} className="p-3 text-[#252525] max-w-[180px] truncate">
                          {row[h] || '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-[#E9E5DC] flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button variant="ghost" size="md" onClick={onCancel}>
              Cancel & Start Over
            </Button>

            <Button
              variant="primary"
              size="md"
              disabled={!isValid || loading}
              loading={loading}
              onClick={() => onConfirmImport(mapping)}
              icon={<Check className="w-4 h-4" />}
            >
              Validate & Import Attendees
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};