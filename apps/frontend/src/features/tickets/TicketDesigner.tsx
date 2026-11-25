import React, { useState, useEffect } from 'react';
import { AttendeeInfo } from '@passforge/shared';
import { useDesignSystem } from '../../hooks/useDesignSystem.js';
import { DesignGallery } from './DesignGallery.js';
import { BrandingControls } from './BrandingControls.js';
import { LiveCanvas } from './LiveCanvas.js';
import { StudioToolbar } from './StudioToolbar.js';
import { BulkExportModal } from './BulkExportModal.js';
import { ActiveTab } from '../../types/index.js';
import {
  AlertTriangle,
  PanelLeftOpen,
  PanelRightOpen,
  Layers,
  Palette,
  X,
  Sliders,
  Terminal,
  Sparkles,
  Ticket,
  Music,
} from 'lucide-react';

interface TicketDesignerProps {
  attendees: AttendeeInfo[];
  eventName: string;
  onNavigateHome?: () => void;
  activeTab?: ActiveTab;
  onSelectTab?: (tab: ActiveTab) => void;
  onLoadDemo?: () => void;
  onOpenPassInspector?: (attendee?: AttendeeInfo) => void;
  onProceedToExport?: () => void;
  isDemoLoaded?: boolean;
}

export const TicketDesigner: React.FC<TicketDesignerProps> = ({
  attendees,
  eventName,
  onNavigateHome = () => {},
  activeTab = 'tickets',
  onSelectTab = () => {},
  onLoadDemo,
  onOpenPassInspector,
  onProceedToExport,
  isDemoLoaded = false,
}) => {
  const {
    designs,
    selectedDesignId,
    selectDesign,
    branding,
    setAccentColor,
    setFontFamily,
    handleLogoUpload,
    clearLogo,
    setWatermark,
    resetBrandingDefaults,
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
    error,
  } = useDesignSystem(attendees[0]?.id);

  // Responsive panel collapse state (defaults to collapsed on < 1024px screens)
  const [leftCollapsed, setLeftCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return true;
    try {
      return sessionStorage.getItem('passforge_left_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [rightCollapsed, setRightCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1280) return true;
    try {
      return sessionStorage.getItem('passforge_right_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  // Mobile drawer state for screens < 768px ('none' | 'templates' | 'brand')
  const [mobileDrawer, setMobileDrawer] = useState<'none' | 'templates' | 'brand'>('none');

  // Bulk Export Modal open state
  const [bulkModalOpen, setBulkModalOpen] = useState<boolean>(false);

  const toggleLeft = () => {
    setLeftCollapsed((prev) => {
      const next = !prev;
      try {
        sessionStorage.setItem('passforge_left_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const toggleRight = () => {
    setRightCollapsed((prev) => {
      const next = !prev;
      try {
        sessionStorage.setItem('passforge_right_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const activeDesign = designs.find((d) => d.id === selectedDesignId);
  const designName = activeDesign ? activeDesign.name : 'Cyber Tech';
  const ticketId = previewData?.ticket?.ticketId || 'APX27-VIP-84920';

  // Automatically sync preview attendee when roster changes
  useEffect(() => {
    if (attendees.length > 0) {
      const exists = attendees.some((a) => a.id === activeAttendeeId);
      if (!exists) {
        setActiveAttendeeId(attendees[0].id);
        refreshPreview(selectedDesignId, branding, activeFormat, attendees[0].id);
      }
    }
  }, [attendees]);

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden bg-[#F7F5F0]">
      {/* Studio Compact Top Bar */}
      <StudioToolbar
        eventName={eventName}
        attendeeCount={attendees.length}
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onNavigateHome={onNavigateHome}
        isDirty={isDirty}
        saving={saving}
        saveSuccess={saveSuccess}
        onSaveConfig={saveConfig}
        ticketId={ticketId}
        onOpenBulkExport={() => setBulkModalOpen(true)}
        onLoadDemo={onLoadDemo}
        onProceedToExport={onProceedToExport}
      />

      {/* Demo Data Loaded Success Banner */}
      {isDemoLoaded && (
        <div className="mx-3 sm:mx-6 mt-2.5 px-4 py-2 rounded-xl bg-[#F4F9F5] border border-[#C6E2CD] text-[#2E683E] text-xs flex items-center gap-2 shadow-2xs">
          <Sparkles className="w-4 h-4 text-[#2E683E] shrink-0" />
          <span className="font-bold">
            Demo Event &amp; 12 Attendees Active
          </span>
          <span className="hidden sm:inline text-[#3F634A]">
            — Setup steps 1 &amp; 2 completed. Customize templates and branding below, then use "Proceed to Export" above when ready.
          </span>
        </div>
      )}


      {error && (
        <div className="mx-4 sm:mx-6 mt-3 p-3 rounded-xl bg-[#FDF0F0] border border-[#F5CCCC] text-[#A83232] text-xs flex items-center gap-2.5 shadow-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3-REGION WORKSPACE ARCHITECTURE */}
      <div className="flex-1 min-h-0 flex overflow-hidden p-2 sm:p-3 lg:p-4 gap-2.5 lg:gap-3 relative pb-16 md:pb-3">
        {/* LEFT REGION: TEMPLATE GALLERY (Desktop/Tablet) */}
        <aside
          className={`hidden md:flex shrink-0 flex-col h-full min-h-0 transition-[width] duration-250 ease-in-out ${
            leftCollapsed ? 'w-16' : 'w-72 lg:w-80'
          }`}
        >
          {!leftCollapsed ? (
            <DesignGallery
              designs={designs}
              selectedDesignId={selectedDesignId}
              onSelectDesign={selectDesign}
              onCollapse={toggleLeft}
            />
          ) : (
            /* Canva/Figma-Style Collapsed Icon Rail */
            <div className="w-16 bg-white border border-[#EAEAEA] rounded-[20px] h-full flex flex-col items-center py-3.5 gap-2 shadow-xs select-none">
              {/* Expand Action Button */}
              <div className="relative group flex items-center justify-center">
                <button
                  onClick={toggleLeft}
                  className="w-10 h-10 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer"
                  title="Expand Templates Sidebar"
                  aria-label="Expand Templates Sidebar"
                >
                  <PanelLeftOpen className="w-4 h-4" />
                </button>
                <div className="absolute left-full ml-3 px-2.5 py-1 text-[11px] font-medium text-white bg-neutral-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  Expand Templates
                </div>
              </div>

              <div className="h-px w-8 bg-[#EAEAEA] my-1" />

              {/* Layouts / Templates Tool Icon (Active Accent Bar & Soft Background) */}
              <div className="relative group w-full flex items-center justify-center">
                <button
                  onClick={toggleLeft}
                  className="relative w-11 h-11 rounded-xl flex items-center justify-center transition-colors cursor-pointer text-neutral-900 bg-neutral-100 hover:bg-neutral-200"
                  title="Templates & Layouts"
                  aria-label="Templates & Layouts"
                >
                  {/* Left Accent Bar */}
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-neutral-900" />
                  <Layers className="w-4 h-4 text-neutral-900" />
                </button>
                <div className="absolute left-full ml-3 px-2.5 py-1 text-[11px] font-medium text-white bg-neutral-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  Templates & Layouts
                </div>
              </div>

              {/* Direct Quick-Switch: Cyber Tech Pass */}
              <div className="relative group w-full flex items-center justify-center">
                <button
                  onClick={() => selectDesign('tech')}
                  className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                    selectedDesignId === 'tech'
                      ? 'text-cyan-600 bg-cyan-50'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                  title="Cyber Tech Pass"
                  aria-label="Cyber Tech Pass"
                >
                  {selectedDesignId === 'tech' && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-cyan-600" />
                  )}
                  <Terminal className="w-4 h-4" />
                </button>
                <div className="absolute left-full ml-3 px-2.5 py-1 text-[11px] font-medium text-white bg-neutral-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  Cyber Tech Pass {selectedDesignId === 'tech' ? '● Active' : ''}
                </div>
              </div>

              {/* Direct Quick-Switch: Editorial Gala Pass */}
              <div className="relative group w-full flex items-center justify-center">
                <button
                  onClick={() => selectDesign('editorial')}
                  className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                    selectedDesignId === 'editorial'
                      ? 'text-amber-700 bg-amber-50'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                  title="Editorial Gala Pass"
                  aria-label="Editorial Gala Pass"
                >
                  {selectedDesignId === 'editorial' && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-amber-700" />
                  )}
                  <Sparkles className="w-4 h-4" />
                </button>
                <div className="absolute left-full ml-3 px-2.5 py-1 text-[11px] font-medium text-white bg-neutral-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  Editorial Gala Pass {selectedDesignId === 'editorial' ? '● Active' : ''}
                </div>
              </div>

              {/* Direct Quick-Switch: Vintage Cinema Stub */}
              <div className="relative group w-full flex items-center justify-center">
                <button
                  onClick={() => selectDesign('vintage')}
                  className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                    selectedDesignId === 'vintage'
                      ? 'text-rose-700 bg-rose-50'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                  title="Vintage Cinema Stub"
                  aria-label="Vintage Cinema Stub"
                >
                  {selectedDesignId === 'vintage' && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-rose-700" />
                  )}
                  <Ticket className="w-4 h-4" />
                </button>
                <div className="absolute left-full ml-3 px-2.5 py-1 text-[11px] font-medium text-white bg-neutral-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  Vintage Cinema Stub {selectedDesignId === 'vintage' ? '● Active' : ''}
                </div>
              </div>

              {/* Direct Quick-Switch: Neon Festival Pass */}
              <div className="relative group w-full flex items-center justify-center">
                <button
                  onClick={() => selectDesign('festival')}
                  className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                    selectedDesignId === 'festival'
                      ? 'text-pink-600 bg-pink-50'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                  title="Neon Festival Pass"
                  aria-label="Neon Festival Pass"
                >
                  {selectedDesignId === 'festival' && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-pink-600" />
                  )}
                  <Music className="w-4 h-4" />
                </button>
                <div className="absolute left-full ml-3 px-2.5 py-1 text-[11px] font-medium text-white bg-neutral-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  Neon Festival Pass {selectedDesignId === 'festival' ? '● Active' : ''}
                </div>
              </div>

              <div className="flex-1" />

              {/* Canvas Options / Settings Shortcut */}
              <div className="relative group w-full flex items-center justify-center">
                <button
                  onClick={toggleLeft}
                  className="w-10 h-10 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer"
                  title="Sidebar Settings"
                  aria-label="Sidebar Settings"
                >
                  <Sliders className="w-4 h-4" />
                </button>
                <div className="absolute left-full ml-3 px-2.5 py-1 text-[11px] font-medium text-white bg-neutral-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  Template Settings
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* CENTRAL REGION: LIVE CANVAS (Visual Focal Point) */}
        <main className="flex-1 min-w-0 min-h-0 flex flex-col h-full overflow-hidden transition-all duration-200 ease-in-out">
          <LiveCanvas
            activeFormat={activeFormat}
            onSelectFormat={setActiveFormat}
            isMobileView={isMobileView}
            onToggleMobileView={setIsMobileView}
            loading={previewLoading}
            previewData={previewData}
            designName={designName}
            attendees={attendees}
            selectedAttendeeId={activeAttendeeId}
            onSelectAttendee={(id) => setActiveAttendeeId(id)}
            onRefresh={() =>
              refreshPreview(selectedDesignId, branding, activeFormat, activeAttendeeId)
            }
            onOpenInspector={() =>
              onOpenPassInspector?.(
                attendees.find((a) => a.id === activeAttendeeId) || attendees[0]
              )
            }
          />
        </main>

        {/* RIGHT REGION: FIGMA-STYLE BRAND KIT INSPECTOR (Desktop/Tablet) */}
        <aside
          className={`hidden md:flex shrink-0 flex-col transition-[width] duration-250 ease-in-out ${
            rightCollapsed ? 'w-16' : 'w-72 lg:w-80'
          }`}
        >
          {!rightCollapsed ? (
            <BrandingControls
              branding={branding}
              defaultAccentColor={activeDesign?.defaultAccentColor || '#B86E52'}
              onColorChange={setAccentColor}
              onFontFamilyChange={setFontFamily}
              onLogoUpload={handleLogoUpload}
              onClearLogo={clearLogo}
              onWatermarkChange={setWatermark}
              onReset={resetBrandingDefaults}
              onCollapse={toggleRight}
              activeDesignId={selectedDesignId}
              attendeeName={previewData?.ticket?.attendee?.name}
              seatNumber={previewData?.ticket?.attendee?.seat}
              ticketType={previewData?.ticket?.attendee?.ticketType}
            />
          ) : (
            /* Canva/Figma-Style Collapsed Right Rail */
            <div className="w-16 bg-white border border-[#EAEAEA] rounded-[20px] h-full flex flex-col items-center py-3.5 gap-2 shadow-xs select-none">
              {/* Expand Action Button */}
              <div className="relative group flex items-center justify-center">
                <button
                  onClick={toggleRight}
                  className="w-10 h-10 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer"
                  title="Expand Brand Kit Panel"
                  aria-label="Expand Brand Kit Panel"
                >
                  <PanelRightOpen className="w-4 h-4" />
                </button>
                <div className="absolute right-full mr-3 px-2.5 py-1 text-[11px] font-medium text-white bg-neutral-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  Expand Brand Kit
                </div>
              </div>

              <div className="h-px w-8 bg-[#EAEAEA] my-1" />

              {/* Brand Kit Active Icon with Right Accent Bar */}
              <div className="relative group w-full flex items-center justify-center">
                <button
                  onClick={toggleRight}
                  className="relative w-11 h-11 rounded-xl flex items-center justify-center transition-colors cursor-pointer text-neutral-900 bg-neutral-100 hover:bg-neutral-200"
                  title="Design & Brand Kit"
                  aria-label="Design & Brand Kit"
                >
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-l bg-neutral-900" />
                  <Palette className="w-4 h-4 text-neutral-900" />
                </button>
                <div className="absolute right-full mr-3 px-2.5 py-1 text-[11px] font-medium text-white bg-neutral-900 rounded-md shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  Design & Brand Kit
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* MOBILE BOTTOM TOOLBAR (Screens < 768px: Canva Mobile Style) */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E9E5DC] px-4 py-2 flex items-center justify-around shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
        style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          onClick={() => setMobileDrawer('templates')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
            mobileDrawer === 'templates' ? 'text-[#B86E52] bg-[#FBF2EE]' : 'text-[#77736C]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px]">Templates</span>
        </button>

        <button
          onClick={() => setMobileDrawer('brand')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
            mobileDrawer === 'brand' ? 'text-[#B86E52] bg-[#FBF2EE]' : 'text-[#77736C]'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span className="text-[10px]">Design Kit</span>
        </button>

        <button
          onClick={saveConfig}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-semibold text-[#2E683E] cursor-pointer"
        >
          <Sliders className="w-4 h-4" />
          <span className="text-[10px]">{saving ? 'Saving...' : 'Save'}</span>
        </button>
      </div>

      {/* MOBILE DRAWER SHEET (Slide-up modal for Templates / Brand Kit on Mobile) */}
      {mobileDrawer !== 'none' && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setMobileDrawer('none')}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          {/* Sheet Container */}
          <div
            className="relative bg-white rounded-t-3xl border-t border-[#E9E5DC] max-h-[85vh] flex flex-col shadow-2xl z-10 overflow-hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            <div className="p-3 border-b border-[#E9E5DC] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-1 bg-[#DDD8CD] rounded-full mx-auto" />
                <span className="text-xs font-bold text-[#252525] uppercase tracking-wider">
                  {mobileDrawer === 'templates' ? 'Select Template' : 'Design & Branding Kit'}
                </span>
              </div>
              <button
                onClick={() => setMobileDrawer('none')}
                className="p-1.5 rounded-lg text-[#77736C] hover:text-[#252525] bg-white border border-[#E9E5DC] cursor-pointer"
                title="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {mobileDrawer === 'templates' ? (
                <DesignGallery
                  designs={designs}
                  selectedDesignId={selectedDesignId}
                  onSelectDesign={(id) => {
                    selectDesign(id);
                    setMobileDrawer('none');
                  }}
                />
              ) : (
                <BrandingControls
                  branding={branding}
                  defaultAccentColor={activeDesign?.defaultAccentColor || '#B86E52'}
                  onColorChange={setAccentColor}
                  onFontFamilyChange={setFontFamily}
                  onLogoUpload={handleLogoUpload}
                  onClearLogo={clearLogo}
                  onWatermarkChange={setWatermark}
                  onReset={resetBrandingDefaults}
                  activeDesignId={selectedDesignId}
                  attendeeName={previewData?.ticket?.attendee?.name}
                  seatNumber={previewData?.ticket?.attendee?.seat}
                  ticketType={previewData?.ticket?.attendee?.ticketType}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Ticket Export Modal */}
      <BulkExportModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        attendees={attendees}
        eventName={eventName}
        designName={designName}
        designId={selectedDesignId}
        onLoadDemo={onLoadDemo}
      />
    </div>
  );
};
