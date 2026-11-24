import React, { useState, useRef } from 'react';
import { Card } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { UploadCloud, FileText, Download, ArrowRight, HelpCircle, CheckCircle2, Sparkles } from 'lucide-react';

interface CsvUploaderProps {
  onFileLoaded: (file: File, content: string) => void;
  onTextLoaded: (content: string) => void;
  loading?: boolean;
}

const SAMPLE_CSV = `Full Name,Email Address,Ticket Type,Seat Number
Aarav Sharma,aarav@kiet.edu,VIP,B-101
Diya Patel,diya@kiet.edu,General,C-205
Rohan Verma,rohan@kiet.edu,Speaker,A-012
Dr. Priya Nair,priya.nair@kiet.edu,VIP,A-105
Ananya Das,ananya.das@kiet.edu,Student,D-304
Kunal Singh,kunal@kiet.edu,General,C-206`;

export const CsvUploader: React.FC<CsvUploaderProps> = ({
  onFileLoaded,
  onTextLoaded,
  loading = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pasteMode, setPasteMode] = useState(false);
  const [rawText, setRawText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      onFileLoaded(file, content);
    };
    reader.readAsText(file);
  };

  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'passforge_sample_attendees.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePasteSubmit = () => {
    if (!rawText.trim()) return;
    onTextLoaded(rawText);
  };

  return (
    <div className="space-y-6">
      {/* Workflow Step Bar */}
      <div className="bg-white border border-[#E9E5DC] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9] font-bold">
            <span className="w-5 h-5 rounded-full bg-[#B86E52] text-white flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Upload CSV</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#9E9A90] shrink-0 hidden sm:block" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF8F5] text-[#77736C] border border-[#E9E5DC] font-medium">
            <span className="w-5 h-5 rounded-full bg-[#EAE6DC] text-[#77736C] flex items-center justify-center text-[10px]">
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

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadSample}
            icon={<Download className="w-3.5 h-3.5 text-[#B86E52]" />}
          >
            Download Sample CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            data-testid="try-sample-csv-btn"
            onClick={() => onTextLoaded(SAMPLE_CSV)}
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Try Sample CSV
          </Button>
        </div>
      </div>

      <Card
        headerIcon={<UploadCloud className="w-4 h-4 text-[#B86E52]" />}
        title="Upload Attendee Roster"
        subtitle="Ingest bulk attendee records with flexible column auto-detection and validation"
      >
        <div className="space-y-6">
          {/* Quick Demo Helper Box */}
          <div className="bg-[#FAF8F5] border border-[#E9E5DC] rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#252525]">Demonstration Sample Spreadsheet</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#EEF6F0] text-[#2E683E] uppercase">6 Attendees</span>
                </div>
                <p className="text-[11px] text-[#77736C] mt-0.5">
                  Test our automated column detection, validation, and multi-tier ingestion without preparing a spreadsheet.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTextLoaded(SAMPLE_CSV)}
              icon={<Sparkles className="w-3.5 h-3.5 text-[#B86E52]" />}
            >
              Load Sample into Importer →
            </Button>
          </div>
          {/* Method Selector Tabs */}
          <div className="flex items-center justify-between border-b border-[#E9E5DC] pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPasteMode(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  !pasteMode
                    ? 'bg-[#B86E52] text-white shadow-sm'
                    : 'text-[#77736C] hover:text-[#252525] hover:bg-[#F0EDE6]'
                }`}
              >
                File Upload (.csv, .txt)
              </button>
              <button
                type="button"
                onClick={() => setPasteMode(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  pasteMode
                    ? 'bg-[#B86E52] text-white shadow-sm'
                    : 'text-[#77736C] hover:text-[#252525] hover:bg-[#F0EDE6]'
                }`}
              >
                Direct Text Input
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#77736C]">
              <HelpCircle className="w-3.5 h-3.5 text-[#9E9A90]" />
              <span>Comma, tab, or semicolon separated</span>
            </div>
          </div>

          {!pasteMode ? (
            /* Drag and Drop Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-[#B86E52] bg-[#FBF2EE]'
                  : 'border-[#DDD8CD] hover:border-[#B86E52] bg-[#FAF8F5] hover:bg-[#FBF2EE]/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleFileInput}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#E9E5DC] flex items-center justify-center text-[#B86E52] shadow-sm">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#252525]">
                    Click to browse or drag & drop attendee CSV
                  </p>
                  <p className="text-xs text-[#77736C] mt-1">
                    Supports CSV or TXT up to 10MB • Auto-detects Name, Email, Ticket Type, and Seat
                  </p>
                </div>

                <div className="pt-2">
                  <Button variant="secondary" size="sm" type="button">
                    Browse Computer
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Paste Raw CSV Area */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#35332F] mb-1.5">
                  Paste Raw CSV or TSV Content
                </label>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={SAMPLE_CSV}
                  rows={8}
                  className="w-full bg-[#FAF8F5] border border-[#DDD8CD] rounded-xl p-3.5 text-xs font-mono text-[#252525] placeholder-[#9E9A90] focus:outline-none focus:border-[#B86E52] focus:ring-2 focus:ring-[#B86E52]/15"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="primary"
                  size="md"
                  disabled={!rawText.trim() || loading}
                  onClick={handlePasteSubmit}
                  loading={loading}
                >
                  Parse & Map Columns
                </Button>
              </div>
            </div>
          )}

          {/* Guidelines Box */}
          <div className="bg-[#FAF8F5] border border-[#E9E5DC] rounded-xl p-4 text-xs text-[#77736C] space-y-2">
            <h5 className="font-bold text-[#252525] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2E683E]" />
              Attendee Data Formatting Guide
            </h5>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-[#4A4641] leading-relaxed pl-1">
              <li>First row should contain column headers (e.g. <code>Full Name</code>, <code>Email</code>, <code>Ticket Type</code>, <code>Seat</code>).</li>
              <li>Required fields: <strong>Attendee Name</strong> and <strong>Email Address</strong>.</li>
              <li>Ticket types default to <code>General</code> if unspecified in the import.</li>
              <li>Seat number is optional; passes automatically display "Open Seating" when omitted.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};