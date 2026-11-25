import React from 'react';
import {
  Email,
  Column,
  Row,
  Heading,
  Text,
  Image,
  Button,
  Divider,
} from '@hyper-elements/react';
import { TicketData, BrandingConfig } from '@passforge/shared';
import { renderWithWatermark } from '../../utils/watermark.js';

interface EditorialEmailProps {
  ticket: TicketData;
  branding?: BrandingConfig;
}

export function EditorialEmail({ ticket, branding }: EditorialEmailProps) {
  const { event, attendee, ticketId, qrCodeDataUrl, ticketUrl } = ticket;
  const accent = branding?.accentColor || '#b45309';
  const logoUrl = branding?.logoUrl;
  const watermarkUrl = branding?.watermarkUrl;

  const getTierBadge = (tier?: string) => {
    const t = (tier || 'general').toLowerCase();
    if (t === 'vip') return { label: 'VIP PASS', color: '#991b1b', border: '#fecaca', bg: '#fef2f2' };
    if (t === 'speaker') return { label: 'SPEAKER PASS', color: '#581c87', border: '#e9d5ff', bg: '#faf5ff' };
    if (t === 'student') return { label: 'STUDENT PASS', color: '#1e40af', border: '#bfdbfe', bg: '#eff6ff' };
    return { label: 'GENERAL PASS', color: '#374151', border: '#e5e7eb', bg: '#f9fafb' };
  };
  const tierBadge = getTierBadge(attendee.ticketType);

  return (
    <Email
      previewText={`Invitation & Pass: ${event.name} — ${attendee.name}`}
      title={`${event.name} Official Invitation`}
      width={600}
      style={{
        backgroundColor: '#f5f3ef',
        fontFamily: branding?.fontFamily || 'Georgia, Times, serif',
      }}
    >
      {/* Top Editorial Masthead */}
      <Column
        style={{
          padding: [32, 24, 20, 24],
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Text
          style={{
            color: accent,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          {event.organizer} • OFFICIAL INVITATION
        </Text>
        <Text style={{ color: '#78716c', fontSize: 13, fontStyle: 'italic' }}>
          Personal Admission Credential & Guest Confirmation
        </Text>
      </Column>

      {/* Main Ticket Parchment Card */}
      <Column
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e7e5e4',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        {renderWithWatermark(
          watermarkUrl,
          600,
          440,
          <Column style={{ width: '100%', padding: [36, 32], gap: 24 }}>
            {/* Event Header */}
            <Column style={{ alignItems: 'center', gap: 8, textAlign: 'center' }}>
          {logoUrl ? (
            <Image
              src={{ src: logoUrl, width: 200, height: 50 }}
              alt="Event Logo"
              style={{ width: 130, height: 32 }}
            />
          ) : null}

          <Text style={{ color: '#a8a29e', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>
            ADMIT ONE
          </Text>

          <Heading
            level={1}
            style={{
              color: '#1c1917',
              fontSize: 28,
              fontWeight: 400,
              lineHeight: 1.25,
            }}
          >
            {event.name}
          </Heading>

          <Text style={{ color: '#78716c', fontSize: 13, fontStyle: 'italic', maxWidth: 440 }}>
            {event.tagline}
          </Text>
        </Column>

        <Divider style={{ borderTop: `1px solid ${accent}40` }} />

        {/* Attendee Presentation */}
        <Column style={{ alignItems: 'center', gap: 6, textAlign: 'center' }}>
          <Text style={{ color: '#a8a29e', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>
            Cordially Issued To
          </Text>
          <Heading
            level={2}
            style={{
              color: '#1c1917',
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {attendee.name}
          </Heading>
          <Text style={{ color: '#78716c', fontSize: 13 }}>
            {attendee.email}
          </Text>

          {/* Tier and Seat Minimal Badge */}
          <Row style={{ gap: 12, justifyContent: 'center', padding: [8, 0, 0, 0] }}>
            <Text
              style={{
                color: tierBadge.color,
                backgroundColor: tierBadge.bg,
                border: `1px solid ${tierBadge.border}`,
                borderRadius: 4,
                padding: [3, 10],
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {tierBadge.label}
            </Text>
            <Text
              style={{
                color: '#57534e',
                border: '1px solid #d6d3d1',
                borderRadius: 4,
                padding: [3, 10],
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              SEAT: {attendee.seat || 'Open Seating'}
            </Text>
          </Row>
        </Column>

        <Divider style={{ borderTop: '1px solid #f5f5f4' }} />

        {/* Details and QR Code Side by Side */}
        <Row style={{ gap: 24, alignItems: 'center' }}>
          <Column style={{ flex: 1, gap: 12 }}>
            <Column style={{ gap: 2 }}>
              <Text style={{ color: '#a8a29e', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                Date & Schedule
              </Text>
              <Text style={{ color: '#1c1917', fontSize: 14, fontWeight: 700 }}>
                {event.date}
              </Text>
              <Text style={{ color: '#78716c', fontSize: 12 }}>
                {event.time}
              </Text>
            </Column>

            <Column style={{ gap: 2 }}>
              <Text style={{ color: '#a8a29e', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                Venue Location
              </Text>
              <Text style={{ color: '#1c1917', fontSize: 14, fontWeight: 700 }}>
                {event.venue}
              </Text>
              <Text style={{ color: '#78716c', fontSize: 12 }}>
                {event.location}
              </Text>
            </Column>
          </Column>

          {/* QR Code */}
          <Column
            style={{
              width: 140,
              border: '1px solid #e7e5e4',
              borderRadius: 6,
              padding: 10,
              alignItems: 'center',
              gap: 4,
              backgroundColor: '#fafaf9',
            }}
          >
            <Image
              src={{ src: qrCodeDataUrl, width: 256, height: 256 }}
              alt={`QR code for ticket ${ticketId}`}
              style={{ width: 110, height: 110 }}
            />
            <Text style={{ color: '#57534e', fontSize: 9, fontFamily: 'monospace', letterSpacing: 1 }}>
              {ticketId}
            </Text>
          </Column>
        </Row>

        <Divider style={{ borderTop: '1px solid #f5f5f4' }} />

        {/* Call to Action */}
        <Column style={{ alignItems: 'center' }}>
          <Button
            href={ticketUrl}
            style={{
              backgroundColor: '#292524',
              color: '#ffffff',
              padding: [10, 24],
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 4,
              letterSpacing: 0.5,
            }}
          >
            Open Digital Invitation
          </Button>
        </Column>
          </Column>,
          true
        )}
      </Column>

      {/* Footer */}
      <Column
        style={{
          padding: [24, 20],
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Text style={{ color: '#a8a29e', fontSize: 11, textAlign: 'center' }}>
          PassForge Editorial Series • Non-transferable admission
        </Text>
      </Column>
    </Email>
  );
}
