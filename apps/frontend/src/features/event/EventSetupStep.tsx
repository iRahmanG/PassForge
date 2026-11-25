import React, { useState, useRef } from 'react';
import { EventInfo } from '@passforge/shared';
import { Card } from '../../components/ui/Card.js';
import { Input } from '../../components/ui/Input.js';
import { Button } from '../../components/ui/Button.js';
import { Alert } from '../../components/ui/Alert.js';
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  Globe,
  Tag,
  Sparkles,
  ArrowRight,
  Upload,
  Trash2,
  Palette,
  Check,
  AlertCircle,
  Ticket,
} from 'lucide-react';

interface EventSetupStepProps {
  initialEvent: EventInfo | null;
  onContinue: (
    eventData: Partial<EventInfo>,
    brandingData?: { accentColor?: string; logoDataUrl?: string }
  ) => Promise<void>;
  onLoadDemo: () => Promise<void>;
  currentBrandColor?: string;
  currentLogoUrl?: string;
}

const BRAND_PALETTES = [
  { name: 'Terracotta', hex: '#B86E52' },
  { name: 'Cyber Cyan', hex: '#06B6D4' },
  { name: 'Gala Gold', hex: '#D97706' },
  { name: 'Forest Pine', hex: '#2E683E' },
  { name: 'Keynote Indigo', hex: '#4F46E5' },
  { name: 'Obsidian Slate', hex: '#2C3E50' },
];

export const EventSetupStep: React.FC<EventSetupStepProps> = ({
  initialEvent,
  onContinue,
  onLoadDemo,
  currentBrandColor = '#06b6d4',
  currentLogoUrl,
}) => {
  const [formData, setFormData] = useState<Partial<EventInfo>>({
    name: initialEvent?.name || '',
    date: initialEvent?.date || '',
    time: initialEvent?.time || '09:00 AM - 06:00 PM',
    venue: initialEvent?.venue || '',
    location: initialEvent?.location || '',
    organizer: initialEvent?.organizer || '',
    tagline: initialEvent?.tagline || '',
    website: initialEvent?.website || '',
  });

  const [brandColor, setBrandColor] = useState<string>(currentBrandColor);
  const [logoPreview, setLogoPreview] = useState<string | null>(currentLogoUrl || null);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof EventInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleLogoUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, or SVG).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setLogoPreview(dataUrl);
      setLogoDataUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setLogoDataUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Event name is required (at least 2 characters)';
    }

    if (!formData.date || formData.date.trim().length === 0) {
      newErrors.date = 'Event date is required';
    }

    if (!formData.venue || formData.venue.trim().length < 2) {
      newErrors.venue = 'Venue name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onContinue(
        {
          ...formData,
          location: formData.location || formData.venue,
          organizer: formData.organizer || 'Event Organizer',
          time: formData.time || '09:00 AM - 06:00 PM',
        },
        {
          accentColor: brandColor,
          logoDataUrl: logoDataUrl !== null ? logoDataUrl : undefined,
        }
      );
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to save event details' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-[#E9E5DC] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBF2EE] border border-[#F0D5C9] text-xs font-bold text-[#B86E52]">
            <span>Step 1 of 4</span>
            <span className="text-[#A15D43]">•</span>
            <span>Event Setup</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] font-serif tracking-tight">
            Configure Your Event Details
          </h1>
          <p className="text-sm text-[#5F5B54] leading-relaxed">
            Enter your event identity, schedule, and venue. These details will be automatically
            formatted across all four ticket outputs (Email invitations, Web passes, Printable PDFs, and PNG badges).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Setup Form */}
        <div className="lg:col-span-2">
          <Card
            headerIcon={<Calendar className="w-4 h-4 text-[#B86E52]" />}
            title="Event Information"
            subtitle="Fields marked with * are required to proceed"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.form && (
                <Alert type="error" title="Configuration Error">
                  {errors.form}
                </Alert>
              )}

              {/* Section 1: Required Event Identity */}
              <div className="space-y-4">
                <div className="border-b border-[#E9E5DC] pb-2 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#77736C] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#B86E52]" />
                    Event Identity &amp; Schedule
                  </h4>
                  <span className="text-[11px] font-semibold text-[#B86E52]">* Required fields</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <Input
                      label="Event Name *"
                      value={formData.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g. NextGen AI Summit 2027"
                      helperText="Official title stamped prominently on tickets, badges, and emails"
                      error={errors.name}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Event Date *"
                      value={formData.date || ''}
                      onChange={(e) => handleChange('date', e.target.value)}
                      placeholder="e.g. 15 February 2027"
                      icon={<Calendar className="w-4 h-4 text-[#B86E52]" />}
                      error={errors.date}
                    />

                    <Input
                      label="Event Time (Optional)"
                      value={formData.time || ''}
                      onChange={(e) => handleChange('time', e.target.value)}
                      placeholder="e.g. 09:00 AM - 06:00 PM"
                      icon={<Clock className="w-4 h-4 text-[#77736C]" />}
                    />
                  </div>

                  <div>
                    <Input
                      label="Venue Name *"
                      value={formData.venue || ''}
                      onChange={(e) => handleChange('venue', e.target.value)}
                      placeholder="e.g. Grand Convention Center"
                      icon={<MapPin className="w-4 h-4 text-[#B86E52]" />}
                      helperText="Primary location shown on ticket headers and admission stubs"
                      error={errors.venue}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Address / City (Optional)"
                      value={formData.location || ''}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                      icon={<MapPin className="w-4 h-4 text-[#77736C]" />}
                    />

                    <Input
                      label="Organizer Name (Optional)"
                      value={formData.organizer || ''}
                      onChange={(e) => handleChange('organizer', e.target.value)}
                      placeholder="e.g. PassForge Tech Guild"
                      icon={<Building className="w-4 h-4 text-[#77736C]" />}
                    />
                  </div>

                  <div>
                    <Input
                      label="Event Description / Tagline (Optional)"
                      value={formData.tagline || ''}
                      onChange={(e) => handleChange('tagline', e.target.value)}
                      placeholder="e.g. Annual Flagship Technology & Innovation Summit"
                      icon={<Tag className="w-4 h-4 text-[#77736C]" />}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Optional Visual Branding */}
              <div className="space-y-4 pt-2">
                <div className="border-b border-[#E9E5DC] pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#77736C] flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#B86E52]" />
                    Visual Branding (Optional)
                  </h4>
                </div>

                {/* Brand Color Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#252525]">
                    Ticket Brand Color
                  </label>
                  <p className="text-xs text-[#77736C]">
                    Sets the signature accent color across ticket badges, borders, and QR highlights.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {BRAND_PALETTES.map((palette) => (
                      <button
                        key={palette.hex}
                        type="button"
                        onClick={() => setBrandColor(palette.hex)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          brandColor.toLowerCase() === palette.hex.toLowerCase()
                            ? 'bg-white border-[#252525] shadow-xs text-[#252525]'
                            : 'bg-[#FAF8F5] border-[#E9E5DC] text-[#5F5B54] hover:bg-white'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: palette.hex }}
                        />
                        <span>{palette.name}</span>
                        {brandColor.toLowerCase() === palette.hex.toLowerCase() && (
                          <Check className="w-3 h-3 text-[#252525]" />
                        )}
                      </button>
                    ))}

                    {/* Custom Color Input */}
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-[#FAF8F5] border border-[#E9E5DC] rounded-xl text-xs">
                      <input
                        type="color"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                        title="Pick custom color"
                      />
                      <input
                        type="text"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="w-18 font-mono text-xs text-[#252525] bg-transparent outline-none uppercase"
                        placeholder="#000000"
                        maxLength={7}
                      />
                    </div>
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-[#252525]">
                    Event Logo
                  </label>
                  <p className="text-xs text-[#77736C]">
                    PNG, JPG, or SVG (max 2MB). Rendered on ticket stubs and email headers.
                  </p>

                  {logoPreview ? (
                    <div className="flex items-center gap-4 p-3 bg-[#FAF8F5] border border-[#E9E5DC] rounded-xl">
                      <div className="h-12 w-12 rounded-lg bg-white border border-[#DDD8CD] p-1 flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#252525]">Custom Logo Attached</p>
                        <p className="text-[11px] text-[#2E683E]">✓ Ready for ticket rendering</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="p-1.5 rounded-lg text-[#A83232] hover:bg-[#FDF0F0] border border-[#F5CCCC] transition-colors cursor-pointer"
                        title="Remove logo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#DDD8CD] hover:border-[#B86E52] rounded-xl p-4 text-center cursor-pointer transition-colors bg-[#FAF8F5] hover:bg-[#FBF2EE]/30"
                    >
                      <Upload className="w-5 h-5 mx-auto text-[#77736C] mb-1" />
                      <p className="text-xs font-semibold text-[#252525]">
                        Click to upload logo or drag and drop
                      </p>
                      <p className="text-[10px] text-[#77736C]">SVG, PNG, or JPG (max 2MB)</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleLogoUpload(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-[#E9E5DC] flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  data-testid="step1-try-demo-btn"
                  onClick={onLoadDemo}
                  icon={<Sparkles className="w-4 h-4 text-[#B86E52]" />}
                >
                  Try with Demo Data
                </Button>

                <Button
                  type="submit"
                  size="md"
                  data-testid="step1-continue-btn"
                  loading={loading}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue to Attendees
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right 1 Col: Live Event Brief Card */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E9E5DC] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E5DC]">
              <span className="text-[10px] font-mono font-bold text-[#B86E52] uppercase tracking-wider">
                Live Ticket Preview Brief
              </span>
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: brandColor }}
                title={`Accent Color: ${brandColor}`}
              />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#77736C] font-mono">
                Event Title
              </span>
              <h3 className="text-lg font-bold text-[#252525] font-serif leading-snug break-words">
                {formData.name || 'Untitled Event'}
              </h3>
              {formData.tagline && (
                <p className="text-xs text-[#77736C] italic font-serif break-words">
                  "{formData.tagline}"
                </p>
              )}
            </div>

            <div className="space-y-2 text-xs pt-1 border-t border-[#E9E5DC]">
              <div className="flex items-start gap-2.5 text-[#5F5B54]">
                <Calendar className="w-3.5 h-3.5 text-[#B86E52] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#252525] block">
                    {formData.date || 'Date not set'}
                  </span>
                  <span className="text-[11px] text-[#77736C]">{formData.time}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-[#5F5B54]">
                <MapPin className="w-3.5 h-3.5 text-[#2E683E] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#252525] block">
                    {formData.venue || 'Venue not set'}
                  </span>
                  {formData.location && (
                    <span className="text-[11px] text-[#77736C]">{formData.location}</span>
                  )}
                </div>
              </div>

              {formData.organizer && (
                <div className="flex items-start gap-2.5 text-[#5F5B54]">
                  <Building className="w-3.5 h-3.5 text-[#77736C] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#5F5B54]">{formData.organizer}</span>
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] text-[11px] text-[#77736C] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#252525]">
                <Ticket className="w-3.5 h-3.5 text-[#B86E52]" />
                <span>Next: Import Attendees</span>
              </div>
              <p>
                In Step 2 you will import your CSV attendee roster to generate individual personalized passes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
