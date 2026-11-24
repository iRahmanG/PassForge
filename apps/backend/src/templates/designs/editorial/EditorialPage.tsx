import React from 'react';
import {
  Page,
  Column,
  Row,
  Heading,
  Text,
  Image,
  Button,
  Divider,
} from '@hyper-elements/react';
import { TicketData, BrandingConfig } from '@passforge/shared';

interface EditorialPageProps {
  ticket: TicketData;
  branding?: BrandingConfig;
}

export function EditorialPage({ ticket, branding }: EditorialPageProps) {
  const { event, attendee, ticketId, qrCodeDataUrl } = ticket;
  const accent = branding?.accentColor || '#b45309';
  const logoUrl = branding?.logoUrl;

  const getTierBadge = (tier?: string) => {
    const t = (tier || 'general').toLowerCase();
    if (t === 'vip') return { label: 'VIP PASS', color: '#991b1b', bg: '#fef2f2', border: '#fecaca' };
    if (t === 'speaker') return { label: 'SPEAKER PASS', color: '#581c87', bg: '#faf5ff', border: '#e9d5ff' };
    if (t === 'student') return { label: 'STUDENT PASS', color: '#1e40af', bg: '#eff6ff', border: '#bfdbfe' };
    return { label: 'GENERAL ADMIT', color: '#374151', bg: '#f9fafb', border: '#e5e7eb' };
  };
  const tierBadge = getTierBadge(attendee.ticketType);

  return (
    <Page
      title={`${event.name} — Admission Pass`}
      description={`Official invitation pass for ${attendee.name}`}
      width={680}
      breakpoints={{ mobile: 560 }}
      style={{
        backgroundColor: '#f5f3ef',
        fontFamily: 'Georgia, Times, serif',
        color: '#1c1917',
      }}
    >
      {/* Top Header */}
      <Column
        style={{
          padding: [36, 20, 20, 20],
          gap: 8,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: accent,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          {event.organizer} PRESENTS
        </Text>
        <Heading
          level={2}
          style={{
            color: '#1c1917',
            fontSize: 22,
            fontWeight: 400,
            textAlign: 'center',
            letterSpacing: 0.5,
          }}
        >
          Official Digital Pass
        </Heading>
      </Column>

      {/* Main Parchment Pass Card */}
      <Column
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e7e5e4',
          borderRadius: 12,
          padding: 40,
          gap: 28,
        }}
      >
        {/* Pass Top Banner */}
        <Row
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            border: { bottom: '1px solid #e7e5e4' },
            padding: [0, 0, 16, 0],
          }}
        >
          {logoUrl ? (
            <Image
              src={{ src: logoUrl, width: 200, height: 50 }}
              alt="Logo"
              style={{ width: 120, height: 'auto' }}
            />
          ) : (
            <Text style={{ color: '#78716c', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>
              SERIES 2027 • ADMISSION
            </Text>
          )}

          <Text
            style={{
              color: tierBadge.color,
              backgroundColor: tierBadge.bg,
              border: `1px solid ${tierBadge.border}`,
              borderRadius: 4,
              padding: [4, 12],
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {tierBadge.label}
          </Text>
        </Row>

        {/* Event Title */}
        <Column style={{ gap: 6, alignItems: 'center', textAlign: 'center' }}>
          <Heading
            level={1}
            style={{
              color: '#1c1917',
              fontSize: 30,
              fontWeight: 400,
              lineHeight: 1.2,
            }}
          >
            {event.name}
          </Heading>
          <Text style={{ color: '#78716c', fontSize: 14, fontStyle: 'italic', maxWidth: 460 }}>
            {event.tagline}
          </Text>
        </Column>

        <Divider style={{ borderTop: `1px solid ${accent}40` }} />

        {/* Attendee Name Showcase */}
        <Column style={{ gap: 8, alignItems: 'center', textAlign: 'center' }}>
          <Text
            style={{
              color: '#a8a29e',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            Ticket Issued To
          </Text>
          <Heading
            level={2}
            style={{
              color: '#1c1917',
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            {attendee.name}
          </Heading>
          <Text style={{ color: '#78716c', fontSize: 13 }}>
            {attendee.email}
          </Text>
        </Column>

        {/* Seat & Logistics Row */}
        <Row style={{ gap: 16 }}>
          <Column
            style={{
              flex: 1,
              border: '1px solid #e7e5e4',
              borderRadius: 8,
              padding: 16,
              alignItems: 'center',
              gap: 4,
              backgroundColor: '#fafaf9',
            }}
          >
            <Text style={{ color: '#a8a29e', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
              Assigned Seat
            </Text>
            <Text style={{ color: '#1c1917', fontSize: 20, fontWeight: 700 }}>
              {attendee.seat || 'Open Seating'}
            </Text>
          </Column>

          <Column
            style={{
              flex: 1,
              border: '1px solid #e7e5e4',
              borderRadius: 8,
              padding: 16,
              alignItems: 'center',
              gap: 4,
              backgroundColor: '#fafaf9',
            }}
          >
            <Text style={{ color: '#a8a29e', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
              Access Category
            </Text>
            <Text style={{ color: accent, fontSize: 20, fontWeight: 700 }}>
              {attendee.ticketType}
            </Text>
          </Column>
        </Row>

        <Divider style={{ borderTop: '1px dashed #d6d3d1' }} />

        {/* QR Code Presentation */}
        <Row style={{ gap: 24, alignItems: 'center', backgroundColor: '#fafaf9', padding: 20, borderRadius: 8, border: '1px solid #e7e5e4' }}>
          <Column
            style={{
              width: 140,
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #e7e5e4',
              borderRadius: 6,
              padding: 8,
            }}
          >
            <Image
              src={{ src: qrCodeDataUrl, width: 256, height: 256 }}
              alt={`QR code for ticket ${ticketId}`}
              style={{ width: 120, height: 120 }}
            />
          </Column>

          <Column style={{ flex: 1, gap: 6 }}>
            <Text style={{ color: '#a8a29e', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
              Official Check-in Pass
            </Text>
            <Text style={{ color: '#1c1917', fontSize: 13, fontFamily: 'monospace', fontWeight: 700 }}>
              REF: {ticketId}
            </Text>
            <Text style={{ color: '#78716c', fontSize: 12 }}>
              Present this pass at the reception desk for credential verification.
            </Text>
          </Column>
        </Row>

        {/* Schedule & Venue Details */}
        <Row style={{ gap: 20 }}>
          <Column style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: '#a8a29e', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
              Date & Schedule
            </Text>
            <Text style={{ color: '#1c1917', fontSize: 13, fontWeight: 700 }}>
              {event.date}
            </Text>
            <Text style={{ color: '#78716c', fontSize: 12 }}>
              {event.time}
            </Text>
          </Column>

          <Column style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: '#a8a29e', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
              Venue Location
            </Text>
            <Text style={{ color: '#1c1917', fontSize: 13, fontWeight: 700 }}>
              {event.venue}
            </Text>
            <Text style={{ color: '#78716c', fontSize: 12 }}>
              {event.location}
            </Text>
          </Column>
        </Row>

        {/* Actions */}
        <Row style={{ gap: 12, justifyContent: 'center', padding: [8, 0, 0, 0] }}>
          <Button
            href={`/api/download/pdf?ticketId=${ticketId}&designId=editorial`}
            style={{
              backgroundColor: '#292524',
              color: '#ffffff',
              padding: [10, 22],
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 6,
            }}
          >
            Download PDF Pass
          </Button>
          <Button
            href={`/api/download/png?ticketId=${ticketId}&designId=editorial`}
            style={{
              backgroundColor: '#f5f5f4',
              color: '#44403c',
              border: '1px solid #d6d3d1',
              padding: [10, 22],
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 6,
            }}
          >
            Save PNG Image
          </Button>
        </Row>
      </Column>

      {/* Footer */}
      <Column
        style={{
          padding: [28, 20],
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Text style={{ color: '#a8a29e', fontSize: 11, textAlign: 'center' }}>
          PassForge Design System • Editorial Series
        </Text>
      </Column>
    </Page>
  );
}
