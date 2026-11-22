import React, { useState, useEffect } from 'react';
import { CsvColumnMapping } from '@passforge/shared';
import { Card } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { Check, ArrowRight, Table, AlertCircle } from 'lucide-react';

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
    setMapping(prev => ({ ...prev, [field]: value }));
  };

  const isValid = !!mapping.name && !!mapping.email && !!mapping.ticketType;

  return (
    <Card
      title="Map CSV Columns"
      subtitle="Verify or adjust column mapping to match your attendee data structure"
    >
      <div className="space-y-6">
        {/* Mapping Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Attendee Name *</span>
              {mapping.name && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </label>
            <select
              value={mapping.name}
              onChange={e => handleChange('name', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Select Column --</option>
              {headers.map(h => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">Maps to attendee full name</p>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Email Address *</span>
              {mapping.email && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </label>
            <select
              value={mapping.email}
              onChange={e => handleChange('email', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Select Column --</option>
              {headers.map(h => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">Unique identifier for attendee</p>
          </div>

          {/* Ticket Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Ticket Type *</span>
              {mapping.ticketType && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </label>
            <select
              value={mapping.ticketType}
              onChange={e => handleChange('ticketType', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Select Column --</option>
              {headers.map(h => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">e.g. VIP, General, Speaker</p>
          </div>

          {/* Seat Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Seat Number (Optional)</span>
              {mapping.seat && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </label>
            <select
              value={mapping.seat || ''}
              onChange={e => handleChange('seat', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Unassigned (Default) --</option>
              {headers.map(h => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">Assigned seat or desk</p>
          </div>
        </div>

        {/* Live Preview Table */}
        {previewRows.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Table className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sample Row Preview (first {Math.min(previewRows.length, 3)} rows)</span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/60">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                  <tr>
                    <th className="p-2.5">Mapped Name</th>
                    <th className="p-2.5">Mapped Email</th>
                    <th className="p-2.5">Mapped Tier</th>
                    <th className="p-2.5">Mapped Seat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {previewRows.slice(0, 3).map((r, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      <td className="p-2.5 font-medium text-slate-200">{mapping.name ? r[mapping.name] || '—' : '—'}</td>
                      <td className="p-2.5 text-indigo-300 font-mono text-[11px]">{mapping.email ? r[mapping.email] || '—' : '—'}</td>
                      <td className="p-2.5 text-amber-400">{mapping.ticketType ? r[mapping.ticketType] || 'General' : 'General'}</td>
                      <td className="p-2.5 text-slate-300 font-mono text-[11px]">{mapping.seat ? r[mapping.seat] || 'Unassigned' : 'Unassigned'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!isValid && (
          <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/30 p-2.5 rounded-lg border border-amber-800/40">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Please select mapped columns for Name, Email, and Ticket Type to proceed.</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Back / Upload Another File
          </Button>

          <Button
            size="md"
            onClick={() => onConfirmImport(mapping)}
            disabled={!isValid || loading}
            loading={loading}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Import & Validate Attendees
          </Button>
        </div>
      </div>
    </Card>
  );
};
