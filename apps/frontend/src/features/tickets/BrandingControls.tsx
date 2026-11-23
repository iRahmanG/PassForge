import React, { useRef, useState } from 'react';
import { BrandingConfig } from '@passforge/shared';
import { Palette, Upload, Trash2, RotateCcw, Check, Sparkles, Image as ImageIcon } from 'lucide-react';

interface BrandingControlsProps {
  branding: BrandingConfig;
  defaultAccentColor: string;
  onColorChange: (color: string) => void;
  onLogoUpload: (dataUrl: string) => void;
  onClearLogo: () => void;
  onReset: () => void;
}

const PRESET_PALETTES = [
  { name: 'Muted Terracotta', hex: '#B86E52' },
  { name: 'Muted Sage', hex: '#77866F' },
  { name: 'Deep Navy', hex: '#2C3E50' },
  { name: 'Electric Cyan', hex: '#06b6d4' },
  { name: 'Emerald Pine', hex: '#059669' },
  { name: 'Amber Flame', hex: '#f59e0b' },
  { name: 'Crimson Rose', hex: '#e11d48' },
  { name: 'Midnight Slate', hex: '#475569' },
];

export const BrandingControls: React.FC<BrandingControlsProps> = ({
  branding,
  defaultAccentColor,
  onColorChange,
  onLogoUpload,
  onClearLogo,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, or SVG).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onLogoUpload(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
      e.target.value = '';
    }
  };

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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="bg-white border border-[#E9E5DC] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E9E5DC]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9] flex items-center justify-center shrink-0">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#252525] tracking-tight">
              2. Brand Styling
            </h2>
            <p className="text-[11px] text-[#77736C]">
              Accent palette & event logo
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="text-[#77736C] hover:text-[#252525] p-1.5 rounded-lg hover:bg-[#FAF8F5] transition-colors cursor-pointer"
          title="Reset to design defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Brand Accent Color Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#35332F] uppercase tracking-wider">
            Accent Color
          </label>
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#E9E5DC]">
            <span className="text-[11px] font-mono text-[#252525] font-semibold">
              {branding.accentColor}
            </span>
            <div
              className="w-3 h-3 rounded-full border border-black/10 shadow-sm"
              style={{ backgroundColor: branding.accentColor }}
            />
          </div>
        </div>

        {/* 8 Preset Swatches */}
        <div className="grid grid-cols-4 gap-1.5">
          {PRESET_PALETTES.map((preset) => {
            const isActive = branding.accentColor.toLowerCase() === preset.hex.toLowerCase();
            return (
              <button
                key={preset.hex}
                type="button"
                onClick={() => onColorChange(preset.hex)}
                title={`${preset.name} (${preset.hex})`}
                className={`h-7 rounded-lg transition-all relative flex items-center justify-center cursor-pointer shadow-sm ${
                  isActive
                    ? 'ring-2 ring-[#B86E52] ring-offset-2 ring-offset-white scale-105 z-10'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: preset.hex }}
              >
                {isActive && <Check className="w-3 h-3 text-white drop-shadow stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Custom Hex Input and Native Picker */}
        <div className="flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#9E9A90] font-bold">
              #
            </span>
            <input
              type="text"
              value={branding.accentColor.replace('#', '')}
              onChange={(e) => {
                const val = '#' + e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
                onColorChange(val);
              }}
              className="w-full bg-[#FAF8F5] border border-[#DDD8CD] rounded-lg pl-7 pr-3 py-1.5 text-xs font-mono text-[#252525] focus:outline-none focus:border-[#B86E52] transition-colors"
              placeholder="B86E52"
            />
          </div>

          <div className="relative shrink-0">
            <input
              type="color"
              value={branding.accentColor.length === 7 ? branding.accentColor : defaultAccentColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
            />
            <div
              className="w-8 h-8 rounded-lg border border-[#DDD8CD] cursor-pointer flex items-center justify-center shadow-sm hover:border-[#B86E52] transition"
              style={{ backgroundColor: branding.accentColor }}
              title="Open color wheel"
            >
              <Sparkles className="w-3.5 h-3.5 text-white drop-shadow" />
            </div>
          </div>
        </div>
      </div>

      {/* Event Logo Upload Section */}
      <div className="space-y-2.5 pt-2 border-t border-[#E9E5DC]">
        <label className="text-xs font-bold text-[#35332F] uppercase tracking-wider block">
          Event / Sponsor Logo
        </label>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png,image/jpeg,image/svg+xml"
          className="hidden"
        />

        {branding.logoUrl ? (
          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-14 bg-white rounded-lg border border-[#E9E5DC] flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-sm">
                <img
                  src={branding.logoUrl}
                  alt="Event Logo Preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#252525] truncate">Custom Logo Active</p>
                <p className="text-[10px] text-[#77736C]">Embedded in all 4 formats</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E9E5DC]">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 text-xs font-semibold text-[#252525] bg-white hover:bg-[#F0EDE6] rounded-md transition border border-[#DDD8CD] cursor-pointer"
              >
                Change
              </button>
              <button
                type="button"
                onClick={onClearLogo}
                className="p-1 text-[#A83232] hover:text-[#7A1D1D] hover:bg-[#FDF0F0] rounded-md transition cursor-pointer"
                title="Remove logo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[#B86E52] bg-[#FBF2EE]'
                : 'border-[#DDD8CD] hover:border-[#B86E52] bg-[#FAF8F5] hover:bg-[#FBF2EE]/50'
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-white text-[#B86E52] border border-[#E9E5DC] flex items-center justify-center shadow-sm">
                <Upload className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs font-bold text-[#252525]">Upload Logo</p>
              <p className="text-[10px] text-[#77736C]">PNG, JPG, SVG up to 2MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};