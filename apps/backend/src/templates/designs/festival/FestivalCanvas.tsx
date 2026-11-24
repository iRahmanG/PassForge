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

interface FestivalCanvasProps {
  ticket: TicketData;
  branding?: BrandingConfig;
}

export function FestivalCanvas({ ticket, branding }: FestivalCanvasProps) {
  const { event, attendee, ticketId, qrCodeDataUrl } = ticket;
  const accent = branding?.accentColor || '#FF2E93';
  const logoUrl = branding?.logoUrl;

  const getTierBadge = (tier?: string) => {
    const t = (tier || 'general').toLowerCase();
    if (t === 'vip') return { text: 'VIP ACCESS', bg: '#FF2E93', color: '#FFFFFF' };
    if (t === 'speaker') return { text: 'BACKSTAGE PASS', bg: '#A855F7', color: '#FFFFFF' };
    if (t === 'student') return { text: 'FAN ZONE', bg: '#06B6D4', color: '#FFFFFF' };
    return { text: 'GENERAL ADMIT', bg: '#3B82F6', color: '#FFFFFF' };
  };
  const tierBadge = getTierBadge(attendee.ticketType);

  // Seat number formatting for the 3 iconic pill badges (GATE, ROW, SEAT)
  const seatStr = attendee.seat || 'A-104';
  const rowMatch = seatStr.match(/[A-Za-z]+/);
  const numMatch = seatStr.match(/\d+/);
  const rowVal = rowMatch ? rowMatch[0] : 'A';
  const seatVal = numMatch ? numMatch[0] : '04';

  return (
    <Canvas
      title={`${event.name} — ${attendee.name}`}
      width={1000}
      height={520}
      style={{
        backgroundColor: '#0A0B1A',
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: '#FFFFFF',
        padding: 30,
        gap: 16,
      }}
    >
      {/* Outer Festival Ticket Card */}
      <Row
        style={{
          border: `2px solid ${accent}55`,
          borderRadius: 20,
          backgroundColor: '#141634',
          overflow: 'hidden',
          flex: 1,
        }}
      >
        {/* Main Body (Left & Center) */}
        <Column
          style={{
            flex: 1,
            padding: [28, 32],
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          {/* Top Bar: Title & Subtitle matching Image 3 */}
          <Column style={{ gap: 4 }}>
            <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: accent,
                  letterSpacing: 4,
                  textTransform: 'uppercase',
                }}
              >
                TICKET
              </Text>
              <Text
                style={{
                  backgroundColor: tierBadge.bg,
                  color: tierBadge.color,
                  borderRadius: 20,
                  padding: [4, 14],
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                }}
              >
                {tierBadge.text}
              </Text>
            </Row>
            <Text
              style={{
                fontSize: 10,
                color: '#94A3B8',
                letterSpacing: 2,
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              FOR ONE PERSON ONLY • {event.organizer}
            </Text>
          </Column>

          {/* Event Main Title */}
          <Heading
            level={1}
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: 1,
              lineHeight: 1.2,
            }}
          >
            {event.name}
          </Heading>

          {/* Iconic 3 Block Badges: [GATE] [ROW] [SEAT] directly from Image 3 */}
          <Row style={{ gap: 14, alignItems: 'center' }}>
            {/* Gate Badge */}
            <Column
              style={{
                backgroundColor: accent,
                borderRadius: 8,
                padding: [8, 16],
                alignItems: 'center',
                gap: 2,
                minWidth: 80,
              }}
            >
              <Text style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: 1.5 }}>
                GATE
              </Text>
              <Text style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF' }}>
                01
              </Text>
            </Column>

            {/* Row Badge */}
            <Column
              style={{
                backgroundColor: accent,
                borderRadius: 8,
                padding: [8, 16],
                alignItems: 'center',
                gap: 2,
                minWidth: 80,
              }}
            >
              <Text style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: 1.5 }}>
                ROW
              </Text>
              <Text style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF' }}>
                {rowVal}
              </Text>
            </Column>

            {/* Seat Badge */}
            <Column
              style={{
                backgroundColor: accent,
                borderRadius: 8,
                padding: [8, 16],
                alignItems: 'center',
                gap: 2,
                minWidth: 80,
              }}
            >
              <Text style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: 1.5 }}>
                SEAT
              </Text>
              <Text style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF' }}>
                {seatVal}
              </Text>
            </Column>

            {/* Hero Schedule Display */}
            <Column style={{ padding: [0, 0, 0, 12], gap: 2 }}>
              <Text style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', letterSpacing: 1.5 }}>
                {event.date}
              </Text>
              <Text style={{ fontSize: 13, fontWeight: 700, color: '#00D2FF', letterSpacing: 1 }}>
                {event.time}
              </Text>
            </Column>
          </Row>

          {/* Attendee Details Row */}
          <Row
            style={{
              backgroundColor: '#1E224A',
              border: '1px solid #2B3066',
              borderRadius: 12,
              padding: [10, 16],
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Column style={{ gap: 2 }}>
              <Text style={{ fontSize: 9, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                PASS HOLDER
              </Text>
              <Text style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>
                {attendee.name}
              </Text>
            </Column>

            <Column style={{ gap: 2, alignItems: 'end' }}>
              <Text style={{ fontSize: 9, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                VENUE
              </Text>
              <Text style={{ fontSize: 12, fontWeight: 600, color: '#CBD5E1' }}>
                {event.venue}
              </Text>
            </Column>
          </Row>
        </Column>

        {/* Vertical Perforated Wave Divider with Dots (Image 3) */}
        <Column
          style={{
            width: 32,
            backgroundColor: '#1A1D44',
            border: {
              left: `2px dashed ${accent}`,
              right: '1px solid #2B3066',
            },
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: [12, 0],
          }}
        >
          <Text style={{ color: accent, fontSize: 10 }}>●</Text>
          <Text style={{ color: accent, fontSize: 10 }}>●</Text>
          <Text style={{ color: accent, fontSize: 10 }}>●</Text>
          <Text style={{ color: accent, fontSize: 10 }}>●</Text>
          <Text style={{ color: accent, fontSize: 10 }}>●</Text>
          <Text style={{ color: accent, fontSize: 10 }}>●</Text>
        </Column>

        {/* Right Admission Stub (Barcode & QR) */}
        <Column
          style={{
            width: 190,
            backgroundColor: '#16193E',
            padding: [24, 18],
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              color: '#00D2FF',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            ADMIT ONE
          </Text>

          <Column
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 10,
              padding: 8,
              alignItems: 'center',
            }}
          >
            <Image
              src={{ src: qrCodeDataUrl, width: 115, height: 115 }}
              alt="Festival QR"
              style={{ width: 110, height: 110 }}
            />
          </Column>

          <Column style={{ alignItems: 'center', gap: 2 }}>
            <Text
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#FFFFFF',
                fontFamily: 'Courier, monospace',
                letterSpacing: 1,
              }}
            >
              {ticketId}
            </Text>
            <Text style={{ fontSize: 9, color: '#94A3B8', letterSpacing: 1 }}>
              FAST-TRACK ENTRY
            </Text>
          </Column>
        </Column>
      </Row>
    </Canvas>
  );
}
