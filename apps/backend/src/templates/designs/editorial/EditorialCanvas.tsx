import React from 'react';
import {
  Canvas,
  Column,
  Row,
  Heading,
  Text,
  Image,
  Divider,
  Layer,
} from '@hyper-elements/react';
import { TicketData, BrandingConfig } from '@passforge/shared';

interface EditorialCanvasProps {
  ticket: TicketData;
  branding?: BrandingConfig;
}

export function EditorialCanvas({ ticket, branding }: EditorialCanvasProps) {
  const { event, attendee, ticketId, qrCodeDataUrl } = ticket;
  const accent = branding?.accentColor || '#b45309';
  const logoUrl = branding?.logoUrl;
  const watermarkUrl = branding?.watermarkUrl;

  const getTierBadge = (tier?: string) => {
    const t = (tier || 'general').toLowerCase();
    if (t === 'vip') return { label: 'VIP PASS', color: '#991b1b', bg: '#fef2f2', border: '#fecaca' };
    if (t === 'speaker') return { label: 'SPEAKER PASS', color: '#581c87', bg: '#faf5ff', border: '#e9d5ff' };
    if (t === 'student') return { label: 'STUDENT PASS', color: '#1e40af', bg: '#eff6ff', border: '#bfdbfe' };
    return { label: 'GENERAL ADMIT', color: '#374151', bg: '#f9fafb', border: '#e5e7eb' };
  };
  const tierBadge = getTierBadge(attendee.ticketType);

  const ticketContent = (
    <Row style={{ gap: 28, alignItems: 'center' }}>
      {/* Left Column: Event & Attendee Info (flex: 1) */}
      <Column style={{ flex: 1, gap: 16 }}>
        {/* Top Bar: Organizer & Admit One Badge */}
        <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Text
            style={{
              color: accent,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2.5,
              textTransform: 'uppercase',
            }}
          >
            {event.organizer} • OFFICIAL INVITATION
          </Text>

          <Text
            style={{
              color: tierBadge.color,
              backgroundColor: tierBadge.bg,
              border: `1px solid ${tierBadge.border}`,
              borderRadius: 4,
              padding: [4, 14],
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            {tierBadge.label}
          </Text>
        </Row>

        {/* Event Name & Tagline */}
        <Column style={{ gap: 4 }}>
          <Heading
            level={1}
            style={{
              color: '#1c1917',
              fontSize: 32,
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {event.name}
          </Heading>
          <Text style={{ color: '#78716c', fontSize: 13 }}>
            {event.tagline}
          </Text>
        </Column>

        <Divider style={{ borderTop: `1px solid ${accent}33` }} />

        {/* Attendee Name & Details */}
        <Row style={{ gap: 20, alignItems: 'center' }}>
          <Column style={{ flex: 1, gap: 4 }}>
            <Text
              style={{
                color: '#a8a29e',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}
            >
              ATTENDEE NAME
            </Text>
            <Heading
              level={2}
              style={{
                color: '#1c1917',
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {attendee.name}
            </Heading>
            <Text style={{ color: '#78716c', fontSize: 12 }}>
              {attendee.email}
            </Text>
          </Column>
        </Row>

        {/* Event Date, Venue, Seat Metadata Bar */}
        <Row
          style={{
            backgroundColor: '#faf8f5',
            border: '1px solid #f5f3ef',
            borderRadius: 6,
            padding: [10, 16],
            justifyContent: 'space-between',
          }}
        >
          <Column style={{ gap: 2 }}>
            <Text style={{ color: '#a8a29e', fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>
              DATE
            </Text>
            <Text style={{ color: '#1c1917', fontSize: 12, fontWeight: 700 }}>
              {event.date}
            </Text>
          </Column>

          <Column style={{ gap: 2 }}>
            <Text style={{ color: '#a8a29e', fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>
              VENUE
            </Text>
            <Text style={{ color: '#1c1917', fontSize: 12, fontWeight: 700 }}>
              {event.venue}
            </Text>
          </Column>

          <Column style={{ gap: 2 }}>
            <Text style={{ color: '#a8a29e', fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>
              SEAT
            </Text>
            <Text style={{ color: accent, fontSize: 12, fontWeight: 700 }}>
              {attendee.seat || 'Open Seating'}
            </Text>
          </Column>
        </Row>
      </Column>

      {/* Right Ticket Stub: QR Code & Verification */}
      <Column
        style={{
          border: { left: '2px dashed #d6d3d1' },
          padding: [0, 0, 0, 28],
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          width: 220,
        }}
      >
        <Text
          style={{
            color: '#a8a29e',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          ENTRY CREDENTIAL
        </Text>

        {/* QR Code */}
        <Column
          style={{
            backgroundColor: '#faf8f5',
            border: '1px solid #e7e5e4',
            borderRadius: 8,
            padding: 10,
            alignItems: 'center',
          }}
        >
          <Image
            src={{ src: qrCodeDataUrl, width: 140, height: 140 }}
            alt="Ticket QR Code"
            style={{ width: 130, height: 130 }}
          />
        </Column>

        <Text
          style={{
            color: '#1c1917',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          {ticketId}
        </Text>

        <Text
          style={{
            color: '#78716c',
            fontSize: 9,
            textAlign: 'center',
          }}
        >
          Please present this pass upon arrival
        </Text>
      </Column>
    </Row>
  );

  return (
    <Canvas
      title={`${event.name} — ${attendee.name}`}
      width={960}
      height={380}
      style={{
        backgroundColor: '#ffffff',
        fontFamily: branding?.fontFamily || 'Georgia, Times, serif',
        color: '#1c1917',
        padding: 0,
      }}
    >
      {/* Outer Editorial Parchment Frame */}
      <Column
        style={{
          width: 960,
          height: 380,
          border: '1px solid #d6d3d1',
          borderRadius: 12,
          backgroundColor: '#ffffff',
          overflow: 'hidden',
        }}
      >
        {watermarkUrl ? (
          <Layer style={{ width: 960, height: 380, alignItems: 'center', justifyItems: 'center' }}>
            <Image
              src={{ src: watermarkUrl, width: 960, height: 380 }}
              alt="Watermark"
              style={{ width: 960, height: 380 }}
            />
            <Column style={{ width: 960, padding: [28, 32], gap: 16 }}>
              {ticketContent}
            </Column>
          </Layer>
        ) : (
          <Column style={{ width: 960, padding: [28, 32], gap: 16 }}>
            {ticketContent}
          </Column>
        )}
      </Column>
    </Canvas>
  );
}
