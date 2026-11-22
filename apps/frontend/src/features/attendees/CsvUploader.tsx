import React, { useState, useRef } from 'react';
import { Card } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { UploadCloud, FileText, Download, Edit3, X } from 'lucide-react';

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
    reader.onload = ev => {
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
    <Card
      title="Upload Attendee CSV"
      subtitle="Upload or paste attendee data to generate bulk personalized tickets"
      action={
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadSample}
          icon={<Download className="w-3.5 h-3.5" />}
        >
          Sample CSV
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Toggle between File Upload and Direct Text Paste */}
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
          <span className="text-slate-400">Supported columns: Full Name, Email, Ticket Category, Seat Number</span>
          <button
            type="button"
            onClick={() => setPasteMode(!pasteMode)}
            className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" />
            {pasteMode ? 'Switch to File Drag & Drop' : 'Or Paste CSV Raw Text'}
          </button>
        </div>

        {pasteMode ? (
          <div className="space-y-3">
            <textarea
              className="w-full h-44 bg-slate-950 font-mono text-xs p-3 rounded-lg border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              placeholder="Paste comma-separated values with headers here (e.g. Name,Email,Ticket Type,Seat)..."
              value={rawText}
              onChange={e => setRawText(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRawText(SAMPLE_CSV)}
              >
                Insert Sample Data
              </Button>
              <Button
                size="sm"
                onClick={handlePasteSubmit}
                disabled={!rawText.trim() || loading}
                loading={loading}
              >
                Parse CSV Text
              </Button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-indigo-500 bg-indigo-950/20'
                : selectedFile
                ? 'border-emerald-600/60 bg-emerald-950/10'
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/70'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept=".csv,.txt,text/csv,text/plain"
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 shadow-md">
                {selectedFile ? <FileText className="w-6 h-6 text-emerald-400" /> : <UploadCloud className="w-6 h-6" />}
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-200">
                  {selectedFile ? selectedFile.name : 'Click to upload or drag & drop CSV file'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedFile
                    ? `${(selectedFile.size / 1024).toFixed(1)} KB • Click to change file`
                    : 'CSV or plain text up to 5MB (max 5,000 rows)'}
                </p>
              </div>

              {selectedFile && (
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/30">
                    File Ready for Mapping
                  </span>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Clear
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
