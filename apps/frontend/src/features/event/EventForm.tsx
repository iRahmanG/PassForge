import React, { useState } from 'react';
import { EventInfo } from '@passforge/shared';
import { Card } from '../../components/ui/Card.js';
import { Input } from '../../components/ui/Input.js';
import { Button } from '../../components/ui/Button.js';
import { Alert } from '../../components/ui/Alert.js';
import { Save, RefreshCw, CheckCircle2 } from 'lucide-react';

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
    setFormData(prev => ({ ...prev, [field]: value }));
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
    } catch (err: any) {
      setError(err.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Event Configuration"
      subtitle="Define event details that will appear on all personalized tickets"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {savedSuccess && (
          <Alert type="success" title="Event Updated">
            Event information has been saved successfully and will reflect on newly generated tickets.
          </Alert>
        )}

        {error && (
          <Alert type="error" title="Validation Error">
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Event Name *"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            required
            placeholder="e.g. KIET TechFest 2027"
          />

          <Input
            label="Organizer Name *"
            value={formData.organizer}
            onChange={e => handleChange('organizer', e.target.value)}
            required
            placeholder="e.g. KIET Technical Team"
          />

          <Input
            label="Event Date *"
            value={formData.date}
            onChange={e => handleChange('date', e.target.value)}
            required
            placeholder="e.g. 15 February 2027"
          />

          <Input
            label="Event Timing *"
            value={formData.time}
            onChange={e => handleChange('time', e.target.value)}
            required
            placeholder="e.g. 09:00 AM - 06:00 PM IST"
          />

          <Input
            label="Venue *"
            value={formData.venue}
            onChange={e => handleChange('venue', e.target.value)}
            required
            placeholder="e.g. KIET Group of Institutions"
          />

          <Input
            label="Location Address *"
            value={formData.location}
            onChange={e => handleChange('location', e.target.value)}
            required
            placeholder="e.g. Delhi-NCR, Ghaziabad, UP"
          />

          <Input
            label="Event Tagline / Subtitle"
            value={formData.tagline}
            onChange={e => handleChange('tagline', e.target.value)}
            placeholder="e.g. Annual Flagship Technology & Innovation Summit"
          />

          <Input
            label="Official Website URL"
            value={formData.website}
            onChange={e => handleChange('website', e.target.value)}
            placeholder="https://kiet.edu/techfest2027"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData(initialEvent)}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Reset Changes
          </Button>
          <Button
            type="submit"
            loading={loading}
            icon={savedSuccess ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          >
            Save Event Details
          </Button>
        </div>
      </form>
    </Card>
  );
};
