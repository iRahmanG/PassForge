import React from 'react';
import {
  Canvas,
  Column,
  Row,
  Heading,
  Text,
  Image,
  Divider,
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

  return (
    <Canvas
      title={`${event.name} — ${attendee.name}`}
      width={1000}
      height={520}
      style={{
        backgroundColor: '#f5f3ef',
        fontFamily: 'Arial',
        color: '#1c1917',
        padding: 32,
        gap: 16,
      }}
    >
      {/* Outer Editorial Parchment Frame */}
      <Column
        style={{
          border: '1px solid #d6d3d1',
          borderRadius: 12,
          backgroundColor: '#ffffff',
          padding: 32,
          gap: 20,
        }}
      >
        {/* Main Content: Left Main Pass + Right Stub */}
        <Row style={{ gap: 28, alignItems: 'center' }}>
          {/* Left Column: Event & Attendee Info (flex: 1) */}
          <Column style={{ flex: 1, gap: 16 }}>
            {/* Top Bar: Organizer / Logo & Admit One Badge */}
            <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              {logoUrl ? (
                <Image
                  src={{ src: logoUrl, width: 160, height: 40 }}
                  alt="Logo"
                  style={{ width: 120, height: 'auto' }}
                />
              ) : (
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
              )}

              <Text
                style={{
                  color: accent,
                  backgroundColor: '#fef3c7',
                  border: `1px solid ${accent}60`,
                  borderRadius: 4,
                  padding: [4, 14],
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                }}
              >
                {attendee.ticketType} PASS
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
      </Column>
    </Canvas>
  );
}
