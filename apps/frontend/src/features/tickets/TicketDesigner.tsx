import React from 'react';
import { AttendeeInfo } from '@passforge/shared';
import { useDesignSystem } from '../../hooks/useDesignSystem.js';
import { DesignGallery } from './DesignGallery.js';
import { BrandingControls } from './BrandingControls.js';
import { PreviewToolbar } from './PreviewToolbar.js';
import { TicketPreview } from './TicketPreview.js';
import { TicketFormatCards } from './TicketFormatCards.js';
import { Sparkles, AlertTriangle, Sliders, Check } from 'lucide-react';

interface TicketDesignerProps {
  attendees: AttendeeInfo[];
  eventName: string;
}

export const TicketDesigner: React.FC<TicketDesignerProps> = ({
  attendees,
  eventName,
}) => {
  const {
    designs,
    selectedDesignId,
    selectDesign,
    branding,
    setAccentColor,
    handleLogoUpload,
    clearLogo,
    resetBrandingDefaults,
    savedConfig,
    isDirty,
    saving,
    saveSuccess,
    saveConfig,
    activeFormat,
    setActiveFormat,
    activeAttendeeId,
    setActiveAttendeeId,
    isMobileView,
    setIsMobileView,
    previewLoading,
    previewData,
    refreshPreview,
    loading,
    error,
  } = useDesignSystem(attendees[0]?.id);

  const activeDesign = designs.find((d) => d.id === selectedDesignId);
  const designName = activeDesign ? activeDesign.name : 'Cyber Tech';

  return (
    <div className="space-y-6">
      {/* Top Title & Studio Status Banner */}
      <div className="bg-white border border-[#E9E5DC] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3 h-3" />
              Design Studio
            </span>
            {isDirty && (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FDF6E8] text-[#945B0E] border border-[#F3E0BA]">
                ● Unsaved Changes
              </span>
            )}
            {saveSuccess && (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EEF6F0] text-[#2E683E] border border-[#C6E2CD]">
                ✓ Saved to Backend
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#252525] tracking-tight font-sans">
            Ticket Design Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#77736C] mt-0.5 max-w-2xl leading-relaxed">
            Choose a ticket layout, customize event branding, and preview personalized tickets across four output formats.
          </p>
        </div>

        <button
          onClick={saveConfig}
          disabled={saving}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer ${
            saveSuccess
              ? 'bg-[#EEF6F0] text-[#2E683E] border border-[#C6E2CD]'
              : isDirty
              ? 'bg-[#B86E52] hover:bg-[#A15D43] text-white shadow-sm'
              : 'bg-[#FAF8F5] hover:bg-[#F0EDE6] text-[#4A4641] border border-[#DDD8CD]'
          }`}
        >
          {saveSuccess ? (
            <>
              <Check className="w-4 h-4 text-[#2E683E]" />
              <span>Configuration Saved</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{saving ? 'Saving...' : isDirty ? 'Save Design Configuration' : 'Design Config Saved'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#FDF0F0] border border-[#F5CCCC] text-[#A83232] text-xs flex items-center gap-2.5 shadow-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3-PART STUDIO EDITOR LAYOUT (Canva / Figma style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Layout Selection (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <DesignGallery
            designs={designs}
            selectedDesignId={selectedDesignId}
            onSelectDesign={selectDesign}
          />
        </div>

        {/* CENTER COLUMN: Live Preview Stage & Toolbar (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <PreviewToolbar
            attendees={attendees}
            selectedAttendeeId={activeAttendeeId}
            onSelectAttendee={(id) => {
              setActiveAttendeeId(id);
            }}
            activeFormat={activeFormat}
            onSelectFormat={setActiveFormat}
            isMobileView={isMobileView}
            onToggleMobileView={setIsMobileView}
            onRefresh={() =>
              refreshPreview(selectedDesignId, branding, activeFormat, activeAttendeeId)
            }
            onSaveConfig={saveConfig}
            isDirty={isDirty}
            saving={saving}
            saveSuccess={saveSuccess}
            loading={previewLoading}
          />

          <TicketPreview
            activeFormat={activeFormat}
            isMobileView={isMobileView}
            loading={previewLoading}
            previewData={previewData}
            designName={designName}
          />

          <TicketFormatCards
            results={previewData?.results}
            onPreviewFormat={setActiveFormat}
          />
        </div>

        {/* RIGHT COLUMN: Brand Styling Controls (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <BrandingControls
            branding={branding}
            defaultAccentColor={activeDesign?.defaultAccentColor || '#B86E52'}
            onColorChange={setAccentColor}
            onLogoUpload={handleLogoUpload}
            onClearLogo={clearLogo}
            onReset={resetBrandingDefaults}
          />
        </div>
      </div>
    </div>
  );
};