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

interface VintageCanvasProps {
  ticket: TicketData;
  branding?: BrandingConfig;
}

export function VintageCanvas({ ticket, branding }: VintageCanvasProps) {
  const { event, attendee, ticketId, qrCodeDataUrl } = ticket;
  const accent = branding?.accentColor || '#C23B38';
  const logoUrl = branding?.logoUrl;

  const getTierBadge = (tier?: string) => {
    const t = (tier || 'general').toLowerCase();
    if (t === 'vip') return { text: '★ VIP ADMIT ★', color: '#991B1B', bg: '#FEE2E2', border: '#F87171' };
    if (t === 'speaker') return { text: '★ SPEAKER ★', color: '#6B21A8', bg: '#F3E8FF', border: '#C084FC' };
    if (t === 'student') return { text: '★ STUDENT ★', color: '#1E40AF', bg: '#DBEAFE', border: '#60A5FA' };
    return { text: '★ ADMIT ONE ★', color: '#374151', bg: '#F3F4F6', border: '#9CA3AF' };
  };
  const tierBadge = getTierBadge(attendee.ticketType);

  return (
    <Canvas
      title={`${event.name} — ${attendee.name}`}
      width={1000}
      height={520}
      style={{
        backgroundColor: '#EFE7DA',
        fontFamily: branding?.fontFamily || 'Georgia, Times, serif',
        color: '#26221F',
        padding: 30,
        gap: 16,
      }}
    >
      {/* Outer Ticket Container with Vintage Border */}
      <Row
        style={{
          border: `3px solid ${accent}`,
          borderRadius: 16,
          backgroundColor: '#FDF8F0',
          overflow: 'hidden',
          flex: 1,
        }}
      >
        {/* Left Perforated Tear Stub (ADMIT ONE) */}
        <Column
          style={{
            width: 130,
            border: { right: `2px dashed ${accent}` },
            backgroundColor: '#F5EFE4',
            padding: [24, 16, 24, 16],
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              color: accent,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
              fontFamily: 'Courier, monospace',
            }}
          >
            № {ticketId.replace(/[^0-9]/g, '').slice(-8) || '32436458'}
          </Text>

          <Column style={{ alignItems: 'center', gap: 8 }}>
            <Text
              style={{
                color: '#26221F',
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 4,
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
            >
              ADMIT
            </Text>
            <Text
              style={{
                color: accent,
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 4,
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
            >
              ONE
            </Text>
          </Column>

          <Text
            style={{
              color: '#786F66',
              fontSize: 9,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              fontFamily: 'Courier, monospace',
            }}
          >
            ★ STUB ★
          </Text>
        </Column>

        {/* Center Main Ticket Body */}
        <Column
          style={{
            flex: 1,
            padding: [24, 28, 24, 28],
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          {/* Top Bar: Event Header / Logo + Decorative Inset Box */}
          <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            {logoUrl ? (
              <Image
                src={{ src: logoUrl, width: 140, height: 36 }}
                alt="Logo"
                style={{ width: 110, height: 32 }}
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
                {event.organizer} • OFFICIAL ADMISSION
              </Text>
            )}

            <Text
              style={{
                color: tierBadge.color,
                backgroundColor: tierBadge.bg,
                border: `1px solid ${tierBadge.border}`,
                borderRadius: 4,
                padding: [4, 12],
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}
            >
              {tierBadge.text}
            </Text>
          </Row>

          {/* Central Ticket Emblem & Title */}
          <Column style={{ alignItems: 'center', gap: 6, padding: [4, 0, 4, 0] }}>
            <Row
              style={{
                alignItems: 'center',
                gap: 12,
                border: { bottom: `2px solid ${accent}` },
                padding: [0, 16, 4, 16],
              }}
            >
              <Text style={{ color: accent, fontSize: 16 }}>◆</Text>
              <Heading
                level={1}
                style={{
                  fontSize: 34,
                  fontWeight: 700,
                  color: '#1C1917',
                  letterSpacing: 6,
                  textTransform: 'uppercase',
                  textAlign: 'center',
                }}
              >
                TICKET
              </Heading>
              <Text style={{ color: accent, fontSize: 16 }}>◆</Text>
            </Row>

            <Heading
              level={2}
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#26221F',
                textAlign: 'center',
              }}
            >
              {event.name}
            </Heading>
          </Column>

          {/* Pass Holder Details Box */}
          <Row
            style={{
              backgroundColor: '#F7EFE1',
              border: '1px solid #DFD5C4',
              borderRadius: 8,
              padding: [10, 16],
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Column style={{ gap: 2 }}>
              <Text style={{ fontSize: 9, color: '#786F66', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                PASS HOLDER
              </Text>
              <Text style={{ fontSize: 16, fontWeight: 700, color: '#1C1917' }}>
                {attendee.name}
              </Text>
            </Column>

            <Column style={{ gap: 2, alignItems: 'center' }}>
              <Text style={{ fontSize: 9, color: '#786F66', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                SEAT NUMBER
              </Text>
              <Text style={{ fontSize: 15, fontWeight: 700, color: accent }}>
                {attendee.seat || 'Open Seating'}
              </Text>
            </Column>

            <Column style={{ gap: 2, alignItems: 'end' }}>
              <Text style={{ fontSize: 9, color: '#786F66', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                SCHEDULE & VENUE
              </Text>
              <Text style={{ fontSize: 11, fontWeight: 600, color: '#26221F' }}>
                {event.date} • {event.venue}
              </Text>
            </Column>
          </Row>

          {/* Bottom Bar: Serial & Verification Stamp */}
          <Row style={{ justifyContent: 'space-between', alignItems: 'center', padding: [4, 0, 0, 0] }}>
            <Text style={{ fontSize: 10, fontFamily: 'Courier, monospace', color: '#786F66' }}>
              SERIAL № {ticketId} • VOUCHER VALID FOR SINGLE ADMISSION
            </Text>
            <Text style={{ fontSize: 10, fontWeight: 700, color: accent, letterSpacing: 1.5 }}>
              PASSFORGE RETRO ENGINE
            </Text>
          </Row>
        </Column>

        {/* Right Perforated Check-In Stub with QR Code */}
        <Column
          style={{
            width: 170,
            border: { left: `2px dashed ${accent}` },
            backgroundColor: '#F5EFE4',
            padding: [20, 16, 20, 16],
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              color: accent,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            SCAN ADMIT
          </Text>

          <Column
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #D6CEBE',
              borderRadius: 8,
              padding: 8,
              alignItems: 'center',
            }}
          >
            <Image
              src={{ src: qrCodeDataUrl, width: 110, height: 110 }}
              alt="Admission QR"
              style={{ width: 105, height: 105 }}
            />
          </Column>

          <Column style={{ alignItems: 'center', gap: 2 }}>
            <Text
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#1C1917',
                fontFamily: 'Courier, monospace',
              }}
            >
              {ticketId}
            </Text>
            <Text style={{ fontSize: 8, color: '#786F66', letterSpacing: 1 }}>
              GATE VERIFIED
            </Text>
          </Column>
        </Column>
      </Row>
    </Canvas>
  );
}
