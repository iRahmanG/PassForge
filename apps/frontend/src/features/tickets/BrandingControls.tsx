import React, { useRef, useState } from 'react';
import { BrandingConfig, FONT_OPTIONS } from '@passforge/shared';
import {
  Palette,
  Upload,
  Trash2,
  RotateCcw,
  Check,
  Sparkles,
  PanelRightClose,
  Sliders,
  Type,
  ShieldCheck,
  Copy,
  Layers,
} from 'lucide-react';

interface BrandingControlsProps {
  branding: BrandingConfig;
  defaultAccentColor: string;
  onColorChange: (color: string) => void;
  onFontFamilyChange?: (fontFamily: string) => void;
  onLogoUpload: (dataUrl: string) => void;
  onClearLogo: () => void;
  onWatermarkChange?: (watermark: BrandingConfig['watermark']) => void;
  onReset: () => void;
  onCollapse?: () => void;
  activeDesignId?: string;
  attendeeName?: string;
  seatNumber?: string;
  ticketType?: string;
}

const EVENT_PRESETS = [
  { name: 'Tech Summit', hex: '#06B6D4', icon: '⚡', desc: 'Electric Cyan' },
  { name: 'Premium Gala', hex: '#B45309', icon: '✨', desc: 'Terracotta Gold' },
  { name: 'Vintage Stub', hex: '#C23B38', icon: '🎟️', desc: 'Vintage Crimson' },
  { name: 'Neon Concert', hex: '#FF2E93', icon: '🎵', desc: 'Electric Magenta' },
  { name: 'University Event', hex: '#059669', icon: '🎓', desc: 'Emerald Pine' },
];

const DESIGN_PRESETS = [
  { name: 'Terracotta Ember', hex: '#B86E52', category: 'Signature' },
  { name: 'Sage Herbal', hex: '#77866F', category: 'Signature' },
  { name: 'Deep Obsidian', hex: '#2C3E50', category: 'Minimal' },
  { name: 'Electric Cyan', hex: '#06B6D4', category: 'Cyber' },
  { name: 'Emerald Pine', hex: '#059669', category: 'Classic' },
  { name: 'Royal Gold', hex: '#D97706', category: 'Gala' },
  { name: 'Crimson Velvet', hex: '#E11D48', category: 'Gala' },
  { name: 'Keynote Indigo', hex: '#4F46E5', category: 'Cyber' },
];

// Helper to compute contrast ratio against white
function getContrastRatio(hex: string): { ratio: string; level: 'AAA' | 'AA' | 'FAIL' } {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return { ratio: '4.5:1', level: 'AA' };

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const toLum = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const lum = 0.2126 * toLum(r) + 0.7152 * toLum(g) + 0.0722 * toLum(b);
  const ratio = (1.05 / (lum + 0.05)).toFixed(1);
  const numRatio = parseFloat(ratio);

  if (numRatio >= 7) return { ratio: `${ratio}:1`, level: 'AAA' };
  if (numRatio >= 4.5) return { ratio: `${ratio}:1`, level: 'AA' };
  return { ratio: `${ratio}:1`, level: 'FAIL' };
}

export const BrandingControls: React.FC<BrandingControlsProps> = ({
  branding,
  defaultAccentColor,
  onColorChange,
  onFontFamilyChange,
  onLogoUpload,
  onClearLogo,
  onWatermarkChange,
  onReset,
  onCollapse,
  activeDesignId = 'tech',
  attendeeName = 'Alex Morgan',
  seatNumber = 'A-104',
  ticketType = 'VIP',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedHex, setCopiedHex] = useState(false);

  const contrast = getContrastRatio(branding.accentColor);

  const isWatermarkEnabled = Boolean(branding.logoUrl && branding.watermark?.enabled !== false);
  const watermarkOpacity = typeof branding.watermark?.opacity === 'number' ? branding.watermark.opacity : 0.08;
  const watermarkSize = typeof branding.watermark?.size === 'number' ? branding.watermark.size : 40;

  const handleToggleWatermark = () => {
    onWatermarkChange?.({
      enabled: !isWatermarkEnabled,
      opacity: watermarkOpacity,
      size: watermarkSize,
      position: 'center',
    });
  };

  const handleOpacityChange = (val: number) => {
    onWatermarkChange?.({
      enabled: isWatermarkEnabled,
      opacity: val / 100,
      size: watermarkSize,
      position: 'center',
    });
  };

  const handleSizeChange = (val: number) => {
    onWatermarkChange?.({
      enabled: isWatermarkEnabled,
      opacity: watermarkOpacity,
      size: val,
      position: 'center',
    });
  };

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

  const handleCopyHex = () => {
    navigator.clipboard.writeText(branding.accentColor);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 1500);
  };

  return (
    <div className="bg-white border border-[#E9E5DC] rounded-2xl shadow-xs h-full flex flex-col overflow-hidden">
      {/* Top Inspector Header */}
      <div className="p-3 border-b border-[#E9E5DC] flex items-center justify-between shrink-0 bg-[#FAF8F5]/60">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FBF2EE] border border-[#F0D5C9] flex items-center justify-center text-[#B86E52]">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#252525]">Brand & Styling Kit</h3>
            <p className="text-[10px] text-[#77736C]">Customize palette, fonts & watermark</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onReset}
            className="p-1.5 rounded-md text-[#77736C] hover:text-[#252525] hover:bg-white transition-colors cursor-pointer"
            title="Reset to design defaults"
            aria-label="Reset to design defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {onCollapse && (
            <button
              onClick={onCollapse}
              className="p-1.5 rounded-md text-[#77736C] hover:text-[#252525] hover:bg-white transition-colors cursor-pointer"
              title="Collapse brand kit panel"
              aria-label="Collapse brand kit panel"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Inspector Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* 1. Active Aesthetic Profile Badge */}
            <div className="rounded-xl border border-[#E9E5DC] bg-[#FAF8F5] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#77736C]">
                  Active Design Profile
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-[#E9E5DC] text-[#252525] font-semibold">
                  {activeDesignId === 'tech'
                    ? 'Cyber Matrix'
                    : activeDesignId === 'vintage'
                    ? 'Vintage Stub'
                    : activeDesignId === 'festival'
                    ? 'Neon Festival'
                    : 'Editorial Luxury'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#504D47]">
                <Type className="w-3.5 h-3.5 text-[#B86E52] shrink-0" />
                <span className="font-medium">
                  {activeDesignId === 'tech'
                    ? 'JetBrains Mono + Space Grotesk'
                    : activeDesignId === 'vintage'
                    ? 'Playfair Display + Courier Monospace'
                    : activeDesignId === 'festival'
                    ? 'Impact Display + Inter Sans'
                    : 'Lora Serif + Georgia Headings'}
                </span>
              </div>
            </div>

            {/* Event Theme Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#77736C]">
                Event Theme Presets
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {EVENT_PRESETS.map((preset) => {
                  const isSelected = branding.accentColor.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.name}
                      onClick={() => onColorChange(preset.hex)}
                      data-testid={`preset-${preset.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#B86E52] bg-[#FBF2EE] shadow-2xs'
                          : 'border-[#E9E5DC] bg-white hover:bg-[#FAF8F5]'
                      }`}
                      title={`${preset.name}: ${preset.desc}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs">{preset.icon}</span>
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/10"
                          style={{ backgroundColor: preset.hex }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#252525] mt-1 truncate">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Color Tokens & Swatches */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#B86E52]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#252525]">
                    Primary Accent Token
                  </span>
                </div>
                {/* Contrast Badge */}
                <div
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                    contrast.level === 'FAIL'
                      ? 'bg-[#FDF0F0] text-[#A83232] border-[#F5CCCC]'
                      : 'bg-[#EEF6F0] text-[#2E683E] border-[#C6E2CD]'
                  }`}
                  title={`Relative contrast ratio against white background: ${contrast.ratio}`}
                >
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span>{contrast.level} {contrast.ratio}</span>
                </div>
              </div>

              {/* 8 Preset Swatches */}
              <div className="grid grid-cols-4 gap-2">
                {DESIGN_PRESETS.map((preset) => {
                  const isActive = branding.accentColor.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => onColorChange(preset.hex)}
                      title={`${preset.name} (${preset.hex})`}
                      className={`h-7 rounded-lg transition-all relative flex items-center justify-center cursor-pointer shadow-xs ${
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
                    className="w-full bg-[#FAF8F5] border border-[#DDD8CD] rounded-lg pl-7 pr-7 py-1.5 text-xs font-mono text-[#252525] focus:outline-none focus:border-[#B86E52] transition-colors"
                    placeholder="B86E52"
                  />
                  <button
                    onClick={handleCopyHex}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#77736C] hover:text-[#252525] transition-colors cursor-pointer"
                    title="Copy hex code"
                  >
                    {copiedHex ? <Check className="w-3 h-3 text-[#2E683E]" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                <div className="relative shrink-0">
                  <input
                    type="color"
                    value={branding.accentColor.length === 7 ? branding.accentColor : defaultAccentColor}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                  />
                  <div
                    className="w-8 h-8 rounded-lg border border-[#DDD8CD] cursor-pointer flex items-center justify-center shadow-xs hover:border-[#B86E52] transition"
                    style={{ backgroundColor: branding.accentColor }}
                    title="Open color wheel"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white drop-shadow" />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Typography & Font Options */}
            <div className="space-y-2.5 pt-2 border-t border-[#E9E5DC]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-[#B86E52]" />
                  <span className="text-[11px] font-bold text-[#252525] uppercase tracking-wider">
                    Typography & Fonts
                  </span>
                </div>
                <span className="text-[10px] text-[#77736C] font-mono">
                  {FONT_OPTIONS.length} options
                </span>
              </div>

              <div className="space-y-1.5">
                {FONT_OPTIONS.map((font) => {
                  const isSelected =
                    branding.fontFamily === font.family ||
                    (!branding.fontFamily && font.id === (activeDesignId === 'editorial' ? 'serif-editorial' : 'sans-modern'));

                  return (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => onFontFamilyChange?.(font.family)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? 'border-[#B86E52] bg-[#FBF2EE] shadow-xs ring-1 ring-[#B86E52]/20'
                          : 'border-[#E9E5DC] bg-white hover:bg-[#FAF8F5] hover:border-[#DDD8CD]'
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-bold text-[#252525] truncate"
                            style={{ fontFamily: font.family }}
                          >
                            {font.name}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E9E5DC] text-[#77736C]">
                            {font.category}
                          </span>
                        </div>
                        <p
                          className="text-[11px] text-[#504D47] truncate"
                          style={{ fontFamily: font.family }}
                        >
                          Aa Bb Gg 123 • {font.description}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#B86E52] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Event Identity Asset Section */}
            <div className="space-y-2 pt-2 border-t border-[#E9E5DC]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#252525] uppercase tracking-wider">
                  Event / Sponsor Logo
                </span>
                <span className="text-[10px] text-[#77736C] font-mono">
                  SVG / PNG / JPG
                </span>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    processFile(file);
                    e.target.value = '';
                  }
                }}
                accept="image/png,image/jpeg,image/svg+xml"
                className="hidden"
              />

              {branding.logoUrl ? (
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-16 bg-white rounded-lg border border-[#E9E5DC] flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-xs">
                      <img
                        src={branding.logoUrl}
                        alt="Event Logo Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#252525] truncate">Active Logo Asset</p>
                      <p className="text-[10px] text-[#2E683E] font-medium flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> Synchronized SSR
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E9E5DC]">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 text-xs font-semibold text-[#252525] bg-white hover:bg-[#F0EDE6] rounded-md transition border border-[#DDD8CD] cursor-pointer"
                    >
                      Replace Logo
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
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) processFile(file);
                  }}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#B86E52] bg-[#FBF2EE]'
                      : 'border-[#DDD8CD] hover:border-[#B86E52] bg-[#FAF8F5] hover:bg-[#FBF2EE]/50'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <div className="w-8 h-8 rounded-lg bg-white text-[#B86E52] border border-[#E9E5DC] flex items-center justify-center shadow-xs">
                      <Upload className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-[#252525]">Upload Brand Asset</p>
                    <p className="text-[10px] text-[#77736C]">Auto-fits ticket header (max 2MB)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Background Watermark Section */}
            <div className="pt-4 border-t border-[#E9E5DC] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#B86E52]" />
                  <span className="text-xs font-bold text-[#252525]">Background Watermark</span>
                </div>

                {branding.logoUrl ? (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isWatermarkEnabled}
                    onClick={handleToggleWatermark}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isWatermarkEnabled ? 'bg-[#B86E52]' : 'bg-[#DDD8CD]'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        isWatermarkEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                ) : (
                  <span className="text-[10px] text-[#A39E93] bg-[#F0EDE6] px-2 py-0.5 rounded-full font-medium">
                    Requires Logo
                  </span>
                )}
              </div>

              {!branding.logoUrl ? (
                <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E9E5DC] text-[11px] text-[#77736C] flex items-center gap-2">
                  <span className="text-xs">💡</span>
                  <span>Upload an event logo above to activate background watermark branding.</span>
                </div>
              ) : isWatermarkEnabled ? (
                <div className="space-y-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC]">
                  {/* Opacity Control */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#504D47]">Opacity</span>
                      <span className="font-mono text-[11px] font-bold text-[#B86E52] bg-white px-1.5 py-0.5 rounded border border-[#E9E5DC]">
                        {Math.round(watermarkOpacity * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="15"
                      step="1"
                      value={Math.round(watermarkOpacity * 100)}
                      onChange={(e) => handleOpacityChange(Number(e.target.value))}
                      className="w-full accent-[#B86E52] h-1.5 bg-[#E9E5DC] rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-[#A39E93]">
                      <span>3% (Subtle)</span>
                      <span>8% (Default)</span>
                      <span>15% (Vibrant)</span>
                    </div>
                  </div>

                  {/* Size Control */}
                  <div className="space-y-1.5 pt-2 border-t border-[#E9E5DC]/70">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#504D47]">Watermark Width</span>
                      <span className="font-mono text-[11px] font-bold text-[#B86E52] bg-white px-1.5 py-0.5 rounded border border-[#E9E5DC]">
                        {watermarkSize}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="25"
                      max="55"
                      step="1"
                      value={watermarkSize}
                      onChange={(e) => handleSizeChange(Number(e.target.value))}
                      className="w-full accent-[#B86E52] h-1.5 bg-[#E9E5DC] rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-[#A39E93]">
                      <span>25% (Compact)</span>
                      <span>40% (Default)</span>
                      <span>55% (Wide)</span>
                    </div>
                  </div>

                  {/* Position Indicator */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E9E5DC]/70 text-xs">
                    <span className="font-semibold text-[#504D47]">Alignment</span>
                    <span className="text-[10px] font-medium text-[#504D47] bg-white px-2 py-0.5 rounded border border-[#E9E5DC]">
                      Center • Aspect Ratio Contained
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
      </div>

      {/* Inspector Footer Status */}
      <div className="p-3 border-t border-[#E9E5DC] bg-[#FAF8F5] flex items-center justify-between text-[11px] text-[#77736C] shrink-0">
        <span className="font-mono text-[10px]">PassForge Design Engine</span>
        <span className="inline-flex items-center gap-1 text-[10px] text-[#2E683E] font-medium font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E683E]" />
          SSR Synchronized
        </span>
      </div>
    </div>
  );
};
