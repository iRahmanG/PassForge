import React, { useState } from 'react';
import { EventInfo } from '@passforge/shared';
import { Card } from '../../components/ui/Card.js';
import { Input } from '../../components/ui/Input.js';
import { Button } from '../../components/ui/Button.js';
import { Alert } from '../../components/ui/Alert.js';
import { Save, Calendar, Clock, MapPin, Building, Globe, Tag, Sparkles, RotateCcw } from 'lucide-react';

interface EventFormProps {
  initialEvent: EventInfo;
  onSave: (event: Partial<EventInfo>) => Promise<void>;
}

export const EventForm: React.FC<EventFormProps> = ({ initialEvent, onSave }) => {
  const [formData, setFormData] = useState<EventInfo>(initialEvent);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof EventInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSavedSuccess(false);
    setError(null);
  };

  const handleReset = () => {
    setFormData(initialEvent);
    setSavedSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSave(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update event credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      headerIcon={<Calendar className="w-4 h-4 text-[#B86E52]" />}
      title="Event Configuration"
      subtitle="Define official conference and venue details stamped across all four ticket outputs"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {savedSuccess && (
          <Alert type="success" title="Event Changes Saved">
            Event details have been updated successfully and will immediately reflect across all new ticket previews.
          </Alert>
        )}

        {error && (
          <Alert type="error" title="Configuration Error">
            {error}
          </Alert>
        )}

        {/* Section 1: Event Identity */}
        <div className="space-y-4">
          <div className="border-b border-[#E9E5DC] pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#77736C] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B86E52]" />
              Event Identity
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Event Title"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                placeholder="e.g. Apex Global Summit 2027"
                helperText="Primary heading displayed on all tickets and email subjects"
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Tagline / Subtitle"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="e.g. Innovation • Technology • Leadership"
                helperText="Short subtitle displayed below the event name"
                icon={<Tag className="w-4 h-4" />}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Date & Schedule */}
        <div className="space-y-4">
          <div className="border-b border-[#E9E5DC] pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#77736C] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#B86E52]" />
              Date & Schedule
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Event Date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
              placeholder="e.g. 15 February 2027"
              icon={<Calendar className="w-4 h-4" />}
            />

            <Input
              label="Schedule Timing"
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
              required
              placeholder="e.g. 09:00 AM - 06:00 PM IST"
              icon={<Clock className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Section 3: Venue & Location */}
        <div className="space-y-4">
          <div className="border-b border-[#E9E5DC] pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#77736C] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#B86E52]" />
              Venue & Location
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Venue Name"
              value={formData.venue}
              onChange={(e) => handleChange('venue', e.target.value)}
              required
              placeholder="e.g. Grand Horizon Center"
              icon={<Building className="w-4 h-4" />}
            />

            <Input
              label="Full Address / City"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              required
              placeholder="e.g. San Francisco, CA 94103"
              icon={<MapPin className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Section 4: Organizer & Website */}
        <div className="space-y-4">
          <div className="border-b border-[#E9E5DC] pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#77736C] flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#77866F]" />
              Organizer Details
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Organizer Organization / Team"
              value={formData.organizer}
              onChange={(e) => handleChange('organizer', e.target.value)}
              required
              placeholder="e.g. Apex Technology Directorate"
              icon={<Building className="w-4 h-4" />}
            />

            <Input
              label="Official Website URL"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="e.g. https://apexsummit2027.example.com"
              icon={<Globe className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-[#E9E5DC] flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Form
          </Button>

          <Button
            type="submit"
            size="md"
            loading={loading}
            icon={<Save className="w-4 h-4" />}
          >
            {savedSuccess ? 'Event Saved!' : 'Save Event Settings'}
          </Button>
        </div>
      </form>
    </Card>
  );
};