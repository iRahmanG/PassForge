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
} from 'lucide-react';

interface TicketDesignerProps {
  attendees: AttendeeInfo[];
  eventName: string;
  onNavigateHome?: () => void;
  activeTab?: ActiveTab;
  onSelectTab?: (tab: ActiveTab) => void;
}

export const TicketDesigner: React.FC<TicketDesignerProps> = ({
  attendees,
  eventName,
  onNavigateHome = () => {},
  activeTab = 'tickets',
  onSelectTab = () => {},
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

  // Responsive panel collapse state (defaults to collapsed on < 1200px screens)
  const [leftCollapsed, setLeftCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1200) return true;
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
  const ticketId = previewData?.ticket?.ticketId || 'KTF27-VIP-84920';

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F5F0]">
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
      />

      {error && (
        <div className="mx-4 sm:mx-6 mt-3 p-3 rounded-xl bg-[#FDF0F0] border border-[#F5CCCC] text-[#A83232] text-xs flex items-center gap-2.5 shadow-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3-REGION WORKSPACE ARCHITECTURE */}
      <div className="flex-1 flex overflow-hidden p-2 sm:p-3 lg:p-4 gap-2.5 lg:gap-3 relative pb-20 md:pb-4">
        {/* LEFT REGION: TEMPLATE GALLERY (Desktop/Tablet) */}
        {!leftCollapsed ? (
          <aside className="hidden md:flex w-64 lg:w-72 shrink-0 flex-col transition-all duration-200 ease-in-out">
            <DesignGallery
              designs={designs}
              selectedDesignId={selectedDesignId}
              onSelectDesign={selectDesign}
              onCollapse={toggleLeft}
            />
          </aside>
        ) : (
          /* Left Collapsed Rail */
          <aside className="hidden md:flex w-12 shrink-0 bg-white border border-[#E9E5DC] rounded-2xl flex-col items-center py-3 gap-3 transition-all duration-200 ease-in-out shadow-xs">
            <button
              onClick={toggleLeft}
              className="p-1.5 rounded-lg text-[#77736C] hover:text-[#252525] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              title="Expand Templates Sidebar"
              aria-label="Expand Templates Sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-[#E9E5DC]" />
            <button
              onClick={toggleLeft}
              className="cursor-pointer flex flex-col items-center gap-1.5 p-1 rounded-xl text-[#77736C] hover:text-[#B86E52] hover:bg-[#FAF8F5] transition-colors group"
              title="Expand Templates"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] group-hover:bg-[#FBF2EE] border border-[#E9E5DC] group-hover:border-[#F0D5C9] flex items-center justify-center transition-colors">
                <Layers className="w-4 h-4 text-[#77736C] group-hover:text-[#B86E52]" />
              </div>
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#77736C] group-hover:text-[#B86E52]">
                Layout
              </span>
            </button>
          </aside>
        )}

        {/* CENTRAL REGION: LIVE CANVAS (Visual Focal Point) */}
        <main className="flex-1 min-w-0 flex flex-col transition-all duration-200 ease-in-out">
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
          />
        </main>

        {/* RIGHT REGION: FIGMA-STYLE BRAND KIT INSPECTOR (Desktop/Tablet) */}
        {!rightCollapsed ? (
          <aside className="hidden md:flex w-72 lg:w-80 shrink-0 flex-col transition-all duration-200 ease-in-out">
            <BrandingControls
              branding={branding}
              defaultAccentColor={activeDesign?.defaultAccentColor || '#B86E52'}
              onColorChange={setAccentColor}
              onLogoUpload={handleLogoUpload}
              onClearLogo={clearLogo}
              onReset={resetBrandingDefaults}
              onCollapse={toggleRight}
              activeDesignId={selectedDesignId}
              attendeeName={previewData?.ticket?.attendee?.name}
              seatNumber={previewData?.ticket?.attendee?.seat}
              ticketType={previewData?.ticket?.attendee?.ticketType}
            />
          </aside>
        ) : (
          /* Right Collapsed Rail */
          <aside className="hidden md:flex w-12 shrink-0 bg-white border border-[#E9E5DC] rounded-2xl flex-col items-center py-3 gap-3 transition-all duration-200 ease-in-out shadow-xs">
            <button
              onClick={toggleRight}
              className="p-1.5 rounded-lg text-[#77736C] hover:text-[#252525] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              title="Expand Brand Kit Panel"
              aria-label="Expand Brand Kit Panel"
            >
              <PanelRightOpen className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-[#E9E5DC]" />
            <button
              onClick={toggleRight}
              className="cursor-pointer flex flex-col items-center gap-1.5 p-1 rounded-xl text-[#77736C] hover:text-[#B86E52] hover:bg-[#FAF8F5] transition-colors group"
              title="Expand Brand Kit (Colors & Logo)"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] group-hover:bg-[#FBF2EE] border border-[#E9E5DC] group-hover:border-[#F0D5C9] flex items-center justify-center transition-colors">
                <Palette className="w-4 h-4 text-[#77736C] group-hover:text-[#B86E52]" />
              </div>
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#77736C] group-hover:text-[#B86E52]">
                Brand
              </span>
            </button>
          </aside>
        )}
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
                  onLogoUpload={handleLogoUpload}
                  onClearLogo={clearLogo}
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
      />
    </div>
  );
};
