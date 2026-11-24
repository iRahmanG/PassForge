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
import { passforgeTheme } from '../../theme.js';

interface TechEmailProps {
  ticket: TicketData;
  branding?: BrandingConfig;
}

export function TechEmail({ ticket, branding }: TechEmailProps) {
  const { event, attendee, ticketId, qrCodeDataUrl, ticketUrl } = ticket;
  const accent = branding?.accentColor || '#06b6d4';
  const logoUrl = branding?.logoUrl;

  const getTierBadge = (tier?: string) => {
    const t = (tier || 'general').toLowerCase();
    if (t === 'vip') return { text: '⭐ VIP ACCESS', color: '#f59e0b', bg: '#451a03', border: '#78350f' };
    if (t === 'speaker') return { text: '🎤 SPEAKER PASS', color: '#c084fc', bg: '#3b0764', border: '#6b21a8' };
    if (t === 'student') return { text: '🎓 STUDENT TIER', color: '#38bdf8', bg: '#082f49', border: '#0369a1' };
    return { text: '● GENERAL ADMIT', color: '#94a3b8', bg: '#1e293b', border: '#334155' };
  };
  const tierBadge = getTierBadge(attendee.ticketType);

  return (
    <Email
      theme={passforgeTheme}
      previewText={`Your ${attendee.ticketType} Pass for ${event.name} — ${attendee.name}`}
      title={`${event.name} Ticket Confirmation`}
      width={600}
      style={{
        backgroundColor: '#0a0e17',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      {/* Top Header */}
      <Column
        style={{
          padding: [24, 20, 16, 20],
          alignItems: 'center',
          gap: 6,
        }}
      >
        {logoUrl ? (
          <Image
            src={{ src: logoUrl, width: 240, height: 60 }}
            alt="Event Logo"
            style={{ width: 140, height: 'auto', borderRadius: 4 }}
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
            PASSFORGE • OFFICIAL TECHFEST PASS
          </Text>
        )}
        <Text style={{ color: '#94a3b8', fontSize: 13 }}>
          Order Confirmed • Digital Admission Credentials
        </Text>
      </Column>

      {/* Main Ticket Card */}
      <Column
        style={{
          backgroundColor: '#111827',
          border: '1px solid #1f2937',
          borderRadius: 16,
          padding: 32,
          gap: 20,
        }}
      >
        {/* Event Header with Accent Bar */}
        <Column style={{ gap: 8 }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Text
              style={{
                color: accent,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}
            >
              {event.organizer} PRESENTS
            </Text>
            <Text
              style={{
                color: tierBadge.color,
                backgroundColor: tierBadge.bg,
                border: `1px solid ${tierBadge.border}`,
                borderRadius: 20,
                padding: [4, 12],
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              {tierBadge.text}
            </Text>
          </Row>

          <Heading
            level={1}
            style={{
              color: '#ffffff',
              fontSize: 26,
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {event.name}
          </Heading>

          <Text style={{ color: '#94a3b8', fontSize: 13 }}>
            {event.tagline}
          </Text>
        </Column>

        <Divider style={{ borderTop: '1px solid #1f2937' }} />

        {/* Attendee Details & QR Row */}
        <Row style={{ gap: 20, alignItems: 'center' }}>
          {/* Left Column: Attendee Information */}
          <Column style={{ flex: 1, gap: 14 }}>
            <Column style={{ gap: 2 }}>
              <Text style={{ color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                Pass Holder
              </Text>
              <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: 700 }}>
                {attendee.name}
              </Text>
              <Text style={{ color: '#94a3b8', fontSize: 13 }}>
                {attendee.email}
              </Text>
            </Column>

            <Row style={{ gap: 16 }}>
              <Column style={{ gap: 2 }}>
                <Text style={{ color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Seat
                </Text>
                <Text style={{ color: accent, fontSize: 18, fontWeight: 700 }}>
                  {attendee.seat || 'Open Seating'}
                </Text>
              </Column>
              <Column style={{ gap: 2 }}>
                <Text style={{ color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Category
                </Text>
                <Text style={{ color: '#f59e0b', fontSize: 18, fontWeight: 700 }}>
                  {attendee.ticketType}
                </Text>
              </Column>
            </Row>
          </Column>

          {/* Right Column: QR Code Box */}
          <Column
            style={{
              width: 150,
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: 12,
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Image
              src={{ src: qrCodeDataUrl, width: 256, height: 256 }}
              alt={`QR Code for Ticket ${ticketId}`}
              style={{ width: 126, height: 126 }}
            />
            <Text
              style={{
                color: '#0f172a',
                fontSize: 10,
                fontWeight: 700,
                textAlign: 'center',
                letterSpacing: 0.5,
              }}
            >
              {ticketId}
            </Text>
          </Column>
        </Row>

        <Divider style={{ borderTop: '1px solid #1f2937' }} />

        {/* Event Schedule & Venue Grid */}
        <Row style={{ gap: 16 }}>
          <Column style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
              Date & Time
            </Text>
            <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>
              {event.date}
            </Text>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>
              {event.time}
            </Text>
          </Column>

          <Column style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
              Venue Location
            </Text>
            <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>
              {event.venue}
            </Text>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>
              {event.location}
            </Text>
          </Column>
        </Row>

        {/* Action Button */}
        <Column style={{ alignItems: 'center', padding: [8, 0, 0, 0] }}>
          <Button
            href={ticketUrl}
            style={{
              backgroundColor: accent,
              color: '#0a0e17',
              padding: [12, 28],
              fontSize: 14,
              fontWeight: 700,
              borderRadius: 8,
            }}
          >
            Access Digital Pass Portal
          </Button>
        </Column>
      </Column>

      {/* Footer Notice */}
      <Column
        style={{
          padding: [24, 20],
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Text style={{ color: '#64748b', fontSize: 12, textAlign: 'center' }}>
          Please keep this confirmation handy. Present the QR code on your mobile device at entrance.
        </Text>
        <Text style={{ color: '#475569', fontSize: 11, textAlign: 'center' }}>
          PassForge Design System • Tech Edition
        </Text>
      </Column>
    </Email>
  );
}
