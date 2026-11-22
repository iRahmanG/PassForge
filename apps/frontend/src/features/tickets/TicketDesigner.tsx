import React, { useState } from 'react';
import { AttendeeInfo } from '@passforge/shared';
import { useDesignSystem } from '../../hooks/useDesignSystem.js';
import { DesignGallery } from './DesignGallery.js';
import { BrandingControls } from './BrandingControls.js';
import { PreviewToolbar } from './PreviewToolbar.js';
import { TicketPreview } from './TicketPreview.js';
import { Sparkles, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

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
  const designName = activeDesign ? activeDesign.name : 'Tech / Hackathon';

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              Design System & Live Preview
            </span>
            {isDirty && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                ● Unsaved Changes
              </span>
            )}
            {saveSuccess && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ✓ Saved to Backend State
              </span>
            )}
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Ticket Design & Branding System
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Choose a visual design architecture, customize event branding accents, and preview personalized passes live across all four Hyper Elements formats.
          </p>
        </div>

        <button
          onClick={saveConfig}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shrink-0 ${
            saveSuccess
              ? 'bg-emerald-600 text-white border border-emerald-500 shadow-emerald-900/30'
              : isDirty
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400 shadow-indigo-900/40'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-200" />
          <span>{saving ? 'Saving...' : saveSuccess ? 'Saved Successfully!' : isDirty ? 'Save Design Configuration' : 'Design Config Up-to-Date'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Design Gallery: Choose between Tech vs Editorial */}
      <DesignGallery
        designs={designs}
        selectedDesignId={selectedDesignId}
        onSelectDesign={selectDesign}
      />

      {/* 2. Branding Controls: Accent color & Logo upload */}
      <BrandingControls
        branding={branding}
        defaultAccentColor={activeDesign?.defaultAccentColor || '#06b6d4'}
        onColorChange={setAccentColor}
        onLogoUpload={handleLogoUpload}
        onClearLogo={clearLogo}
        onReset={resetBrandingDefaults}
      />

      {/* 3. Live Preview Section with Toolbar */}
      <div className="space-y-4">
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
          onRefresh={() => refreshPreview(selectedDesignId, branding, activeFormat, activeAttendeeId)}
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
      </div>
    </div>
  );
};
