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

interface TechCanvasProps {
  ticket: TicketData;
  branding?: BrandingConfig;
}

export function TechCanvas({ ticket, branding }: TechCanvasProps) {
  const { event, attendee, ticketId, qrCodeDataUrl } = ticket;
  const accent = branding?.accentColor || '#06b6d4';
  const logoUrl = branding?.logoUrl;

  return (
    <Canvas
      title={`${event.name} — ${attendee.name}`}
      width={1000}
      height={520}
      style={{
        backgroundColor: '#0a0e17',
        fontFamily: 'Arial',
        color: '#f8fafc',
        padding: 36,
        gap: 16,
      }}
    >
      {/* Outer Border Frame */}
      <Column
        style={{
          border: `2px solid ${accent}44`,
          borderRadius: 16,
          backgroundColor: '#0f172a',
          padding: 32,
          gap: 20,
        }}
      >
        {/* Main Content Row */}
        <Row style={{ gap: 32, alignItems: 'center' }}>
          {/* Left Column: Event & Attendee Info (flex: 1) */}
          <Column style={{ flex: 1, gap: 16 }}>
            {/* Organizer + VIP Badge Row */}
            <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              {logoUrl ? (
                <Image
                  src={{ src: logoUrl, width: 180, height: 40 }}
                  alt="Logo"
                  style={{ width: 120, height: 'auto' }}
                />
              ) : (
                <Text
                  style={{
                    color: accent,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                  }}
                >
                  {event.organizer} PRESENTS
                </Text>
              )}
              <Text
                style={{
                  color: '#f59e0b',
                  backgroundColor: '#451a03',
                  border: '1px solid #78350f',
                  borderRadius: 16,
                  padding: [4, 14],
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                ⭐ {attendee.ticketType} ACCESS
              </Text>
            </Row>

            {/* Event Name */}
            <Column style={{ gap: 4 }}>
              <Heading
                level={1}
                style={{
                  color: '#ffffff',
                  fontSize: 34,
                  fontWeight: 700,
                  lineHeight: 1.15,
                }}
              >
                {event.name}
              </Heading>
              <Text style={{ color: '#94a3b8', fontSize: 14 }}>
                {event.tagline}
              </Text>
            </Column>

            <Divider style={{ borderTop: '1px solid #1e293b' }} />

            {/* Attendee Name (Prominent Display) */}
            <Column style={{ gap: 4 }}>
              <Text style={{ color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                Pass Holder
              </Text>
              <Text style={{ color: accent, fontSize: 26, fontWeight: 700 }}>
                {attendee.name}
              </Text>
              <Text style={{ color: '#94a3b8', fontSize: 13 }}>
                {attendee.email}
              </Text>
            </Column>

            {/* Logistics Info Bar */}
            <Row style={{ gap: 24 }}>
              <Column style={{ gap: 2 }}>
                <Text style={{ color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>
                  Date & Time
                </Text>
                <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 700 }}>
                  {event.date}
                </Text>
                <Text style={{ color: '#94a3b8', fontSize: 11 }}>
                  {event.time}
                </Text>
              </Column>

              <Column style={{ gap: 2 }}>
                <Text style={{ color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>
                  Venue
                </Text>
                <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 700 }}>
                  {event.venue}
                </Text>
                <Text style={{ color: '#94a3b8', fontSize: 11 }}>
                  Seat: {attendee.seat || 'General'} • Gate 2
                </Text>
              </Column>
            </Row>
          </Column>

          {/* Right Column: QR Code & Identification Badge */}
          <Column
            style={{
              width: 230,
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: 20,
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Text
              style={{
                color: '#0f172a',
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
              }}
            >
              SCAN TO ADMIT
            </Text>

            <Image
              src={{ src: qrCodeDataUrl, width: 256, height: 256 }}
              alt={`QR code for ticket ${ticketId}`}
              style={{ width: 170, height: 170 }}
            />

            <Column style={{ alignItems: 'center', gap: 2 }}>
              <Text
                style={{
                  color: '#0f172a',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                {ticketId}
              </Text>
              <Text style={{ color: '#64748b', fontSize: 10, textAlign: 'center' }}>
                Tech Edition Pass
              </Text>
            </Column>

            <Text
              style={{
                color: accent,
                fontSize: 9,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              PASSFORGE ENGINE
            </Text>
          </Column>
        </Row>
      </Column>
    </Canvas>
  );
}
