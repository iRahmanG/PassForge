import React, { useRef } from 'react';
import { BrandingConfig } from '@passforge/shared';
import { Palette, Upload, Trash2, RotateCcw, Image as ImageIcon, Sparkles } from 'lucide-react';

interface BrandingControlsProps {
  branding: BrandingConfig;
  defaultAccentColor: string;
  onColorChange: (color: string) => void;
  onLogoUpload: (dataUrl: string) => void;
  onClearLogo: () => void;
  onReset: () => void;
}

const PRESET_PALETTES = [
  { name: 'Electric Cyan', hex: '#06b6d4' },
  { name: 'Indigo Core', hex: '#6366f1' },
  { name: 'Amber Terracotta', hex: '#b45309' },
  { name: 'Emerald Pine', hex: '#059669' },
  { name: 'Crimson Rose', hex: '#e11d48' },
  { name: 'Royal Violet', hex: '#8b5cf6' },
  { name: 'Sunset Flame', hex: '#ea580c' },
  { name: 'Midnight Slate', hex: '#334155' },
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onLogoUpload(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              2. Event Branding Customization
            </h2>
            <p className="text-xs text-slate-400">
              Customize accent highlights and upload an optional event sponsor or organization logo.
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-all"
          title="Reset branding to design template defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Accent Color Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Accent Color
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">{branding.accentColor}</span>
              <div
                className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: branding.accentColor }}
              />
            </div>
          </div>

          {/* Palette Swatches */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {PRESET_PALETTES.map((preset) => {
              const isActive = branding.accentColor.toLowerCase() === preset.hex.toLowerCase();
              return (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => onColorChange(preset.hex)}
                  title={preset.name}
                  className={`h-8 rounded-lg transition-transform relative flex items-center justify-center ${
                    isActive ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900 z-10' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.hex }}
                >
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white shadow" />}
                </button>
              );
            })}
          </div>

          {/* Custom Hex Input and Color Picker */}
          <div className="flex items-center gap-2 pt-1">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">
                #
              </span>
              <input
                type="text"
                value={branding.accentColor.replace('#', '')}
                onChange={(e) => {
                  const val = '#' + e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
                  onColorChange(val);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                placeholder="06b6d4"
              />
            </div>

            <div className="relative">
              <input
                type="color"
                value={branding.accentColor.length === 7 ? branding.accentColor : defaultAccentColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
              <div
                className="w-8 h-8 rounded-lg border border-slate-700 cursor-pointer flex items-center justify-center shadow-inner"
                style={{ backgroundColor: branding.accentColor }}
                title="Open native color picker"
              >
                <Sparkles className="w-3.5 h-3.5 text-white/70 drop-shadow" />
              </div>
            </div>
          </div>
        </div>

        {/* Logo Upload Section */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Event / Sponsor Logo (Optional)
          </label>

          {branding.logoUrl ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-16 bg-slate-900 rounded border border-slate-800 flex items-center justify-center p-1 overflow-hidden">
                  <img
                    src={branding.logoUrl}
                    alt="Event Logo Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Custom Logo Active</p>
                  <p className="text-[10px] text-slate-400">Embedded in PDF, Canvas & HTML</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={onClearLogo}
                  className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition"
                  title="Remove custom logo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 text-center cursor-pointer transition-all bg-slate-950/40 hover:bg-slate-950/80 group"
            >
              <div className="flex flex-col items-center justify-center gap-1.5">
                <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 flex items-center justify-center transition">
                  <Upload className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-slate-300 group-hover:text-white transition">
                  Upload Event Logo (PNG, SVG, JPG)
                </p>
                <p className="text-[10px] text-slate-500">
                  Recommended: Transparent PNG or SVG under 2MB
                </p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
