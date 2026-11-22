import { useState, useEffect, useCallback } from 'react';
import {
  TicketDesignId,
  DesignMetadata,
  BrandingConfig,
  DesignConfig,
  OutputFormat,
  TicketData,
  TicketPreviewResponse,
} from '@passforge/shared';
import {
  fetchDesigns,
  fetchCurrentDesignConfig,
  saveDesignConfig,
  fetchTicketPreview,
  uploadLogo,
  resetBranding as apiResetBranding,
} from '../services/api.js';

export function useDesignSystem(initialAttendeeId?: string) {
  const [designs, setDesigns] = useState<DesignMetadata[]>([]);
  const [selectedDesignId, setSelectedDesignId] = useState<TicketDesignId>('tech');
  const [branding, setBranding] = useState<BrandingConfig>({
    accentColor: '#06b6d4',
    showOrganizer: true,
  });
  const [savedConfig, setSavedConfig] = useState<DesignConfig | null>(null);

  // Preview state
  const [activeFormat, setActiveFormat] = useState<OutputFormat>('png');
  const [activeAttendeeId, setActiveAttendeeId] = useState<string | undefined>(initialAttendeeId);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<{
    ticket?: TicketData;
    pngDataUrl?: string;
    emailHtml?: string;
    pageHtml?: string;
    pdfUrl?: string;
    pdfBase64?: string;
    result?: any;
    results?: any;
  } | null>(null);

  // Status flags
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load designs and saved configuration on mount
  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        setLoading(true);
        const [loadedDesigns, currentConfig] = await Promise.all([
          fetchDesigns(),
          fetchCurrentDesignConfig(),
        ]);
        if (!mounted) return;
        setDesigns(loadedDesigns);
        setSavedConfig(currentConfig);
        setSelectedDesignId(currentConfig.designId);
        setBranding(currentConfig.branding);
      } catch (err: any) {
        if (mounted) setError(err.message || 'Failed to initialize design system');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  // Compute whether there are unsaved changes
  const isDirty = Boolean(
    savedConfig &&
      (savedConfig.designId !== selectedDesignId ||
        savedConfig.branding.accentColor !== branding.accentColor ||
        savedConfig.branding.logoUrl !== branding.logoUrl)
  );

  // Trigger preview fetch
  const refreshPreview = useCallback(
    async (
      designId = selectedDesignId,
      customBranding = branding,
      format = activeFormat,
      attendeeId = activeAttendeeId
    ) => {
      setPreviewLoading(true);
      setError(null);
      try {
        const res = await fetchTicketPreview({
          designId,
          branding: customBranding,
          format: 'all', // Fetch all preview formats so switching is instant
          attendeeId,
        });

        setPreviewData({
          ticket: res.ticket,
          pngDataUrl: (res as any).previews?.pngDataUrl,
          emailHtml: (res as any).previews?.emailHtml,
          pageHtml: (res as any).previews?.pageHtml,
          pdfUrl: (res as any).previews?.pdfUrl,
          results: res.results,
        });
      } catch (err: any) {
        console.error('Error refreshing preview:', err);
        setError(err.message || 'Failed to generate live preview');
      } finally {
        setPreviewLoading(false);
      }
    },
    [selectedDesignId, branding, activeFormat, activeAttendeeId]
  );

  // Trigger preview update when design, branding, or attendee changes
  useEffect(() => {
    if (!loading && designs.length > 0) {
      refreshPreview(selectedDesignId, branding, activeFormat, activeAttendeeId);
    }
  }, [selectedDesignId, branding.accentColor, branding.logoUrl, activeAttendeeId, loading]);

  // Design selection handler
  const selectDesign = (id: TicketDesignId) => {
    setSelectedDesignId(id);
    const targetMeta = designs.find((d) => d.id === id);
    if (targetMeta) {
      // Default to target design's signature accent color
      setBranding((prev) => ({
        ...prev,
        accentColor: targetMeta.defaultAccentColor,
      }));
    }
  };

  // Branding handlers
  const setAccentColor = (color: string) => {
    setBranding((prev) => ({ ...prev, accentColor: color }));
  };

  const handleLogoUpload = async (dataUrl: string) => {
    try {
      const res = await uploadLogo(dataUrl);
      setBranding((prev) => ({ ...prev, logoUrl: res.logoUrl }));
    } catch (err: any) {
      setError(err.message || 'Failed to upload logo');
    }
  };

  const clearLogo = () => {
    setBranding((prev) => ({ ...prev, logoUrl: undefined }));
  };

  const resetBrandingDefaults = async () => {
    try {
      const targetMeta = designs.find((d) => d.id === selectedDesignId);
      const defaultColor = targetMeta ? targetMeta.defaultAccentColor : '#06b6d4';
      setBranding({
        accentColor: defaultColor,
        showOrganizer: true,
        logoUrl: undefined,
      });
      await apiResetBranding();
    } catch (err: any) {
      console.error('Error resetting branding:', err);
    }
  };

  // Persist current configuration
  const saveConfig = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);
    try {
      const updated = await saveDesignConfig({
        designId: selectedDesignId,
        branding,
      });
      setSavedConfig(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  return {
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
  };
}
