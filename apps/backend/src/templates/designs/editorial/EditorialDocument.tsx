import React from 'react';
import {
  Document,
  Column,
  Row,
  Heading,
  Text,
  Span,
  Image,
  Divider,
  PageFooter,
} from '@hyper-elements/react';
import { TicketData, BrandingConfig } from '@passforge/shared';

interface EditorialDocumentProps {
  ticket: TicketData;
  branding?: BrandingConfig;
}

export function EditorialDocument({ ticket, branding }: EditorialDocumentProps) {
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
    <Document
      title={`${event.name} — Invitation & Pass`}
      size="A4"
      orientation="portrait"
      margin={40}
      style={{
        backgroundColor: '#faf8f5',
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: '#1c1917',
      }}
    >
      <Document.Page style={{ gap: 28, backgroundColor: '#faf8f5' }}>
        {/* Editorial Top Masthead */}
        <Row
          style={{
            justifyContent: 'space-between',
            alignItems: 'end',
            border: { bottom: `1px solid #d6d3d1` },
            padding: [0, 0, 14, 0],
          }}
        >
          <Column style={{ gap: 4 }}>
            <Text
              style={{
                color: accent,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: 'uppercase',
              }}
            >
              {event.organizer}
            </Text>
            <Text style={{ color: '#78716c', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Curated Events Series • Official Admission Document
            </Text>
          </Column>

          <Column style={{ alignItems: 'end', gap: 2 }}>
            <Text style={{ color: '#1c1917', fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>
              CREDENTIAL REF: {ticketId}
            </Text>
            <Text style={{ color: '#78716c', fontSize: 9 }}>
              AUTHORIZED & CONFIRMED
            </Text>
          </Column>
        </Row>

        {/* Main Editorial Parchment Ticket Frame */}
        <Column
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e7e5e4',
            borderRadius: 6,
            padding: 36,
            gap: 28,
          }}
        >
          {/* Top Section: Event Title & Branding */}
          <Row style={{ justifyContent: 'space-between', alignItems: 'start' }}>
            <Column style={{ flex: 1, gap: 8 }}>
              {logoUrl ? (
                <Image
                  src={{ src: logoUrl, width: 160, height: 40 }}
                  alt="Event Logo"
                  style={{ width: 120, height: 'auto' }}
                />
              ) : (
                <Text
                  style={{
                    color: '#a8a29e',
                    fontSize: 10,
                    letterSpacing: 2.5,
                    textTransform: 'uppercase',
                  }}
                >
                  SPECIAL INVITATION & ACCESS PASS
                </Text>
              )}

              <Heading
                level={1}
                style={{
                  color: '#1c1917',
                  fontSize: 26,
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {event.name}
              </Heading>

              <Text style={{ color: '#78716c', fontSize: 12, lineHeight: 1.4 }}>
                {event.tagline}
              </Text>
            </Column>

            {/* Admission Tier Badge */}
            <Column
              style={{
                border: `1px solid ${tierBadge.border}`,
                borderRadius: 4,
                padding: [8, 16],
                alignItems: 'center',
                backgroundColor: tierBadge.bg,
                gap: 2,
              }}
            >
              <Text
                style={{
                  color: tierBadge.color,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}
              >
                ADMIT ONE
              </Text>
              <Text
                style={{
                  color: tierBadge.color,
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                {tierBadge.label}
              </Text>
            </Column>
          </Row>

          <Divider style={{ borderTop: `1px solid ${accent}33` }} />

          {/* Attendee Prominent Section */}
          <Column style={{ gap: 6 }}>
            <Text
              style={{
                color: '#a8a29e',
                fontSize: 10,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              PREPARED SPECIALLY FOR
            </Text>
            <Heading
              level={2}
              style={{
                color: '#1c1917',
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              {attendee.name}
            </Heading>
            <Text style={{ color: '#78716c', fontSize: 11 }}>
              {attendee.email}
            </Text>
          </Column>

          {/* Metadata Grid (Date, Venue, Seating) */}
          <Row
            style={{
              backgroundColor: '#faf8f5',
              border: '1px solid #f5f3ef',
              borderRadius: 4,
              padding: 18,
              justifyContent: 'space-between',
            }}
          >
            <Column style={{ gap: 4, flex: 1 }}>
              <Text style={{ color: '#a8a29e', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700 }}>
                DATE & TIME
              </Text>
              <Text style={{ color: '#1c1917', fontSize: 12, fontWeight: 700 }}>
                {event.date}
              </Text>
              <Text style={{ color: '#78716c', fontSize: 10 }}>
                Doors open 08:30 AM
              </Text>
            </Column>

            <Column style={{ gap: 4, flex: 1 }}>
              <Text style={{ color: '#a8a29e', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700 }}>
                LOCATION / VENUE
              </Text>
              <Text style={{ color: '#1c1917', fontSize: 12, fontWeight: 700 }}>
                {event.venue}
              </Text>
              <Text style={{ color: '#78716c', fontSize: 10 }}>
                Ghaziabad, Uttar Pradesh, India
              </Text>
            </Column>

            <Column style={{ gap: 4, flex: 1 }}>
              <Text style={{ color: '#a8a29e', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700 }}>
                SEATING ALLOCATION
              </Text>
              <Text style={{ color: accent, fontSize: 13, fontWeight: 700 }}>
                {attendee.seat || 'Open Seating'}
              </Text>
              <Text style={{ color: '#78716c', fontSize: 10 }}>
                {attendee.seat ? 'Reserved Seat' : 'General Access'}
              </Text>
            </Column>
          </Row>

          <Divider style={{ borderTop: '1px dashed #d6d3d1' }} />

          {/* Bottom Stub / Verification & QR */}
          <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Column style={{ gap: 6, maxWidth: 360 }}>
              <Text style={{ color: '#1c1917', fontSize: 11, fontWeight: 700 }}>
                ADMISSION INSTRUCTIONS
              </Text>
              <Text style={{ color: '#78716c', fontSize: 10, lineHeight: 1.5 }}>
                Present this physical document or your digital pass on mobile at registration. A valid government-issued photo ID matching the attendee name is requested upon arrival.
              </Text>
              <Text style={{ color: '#a8a29e', fontSize: 9 }}>
                Issued by PassForge Verification Engine • Non-transferable without prior organizer authorization
              </Text>
            </Column>

            {/* QR Code Container */}
            <Column
              style={{
                alignItems: 'center',
                gap: 6,
                padding: 10,
                border: '1px solid #e7e5e4',
                borderRadius: 4,
                backgroundColor: '#ffffff',
              }}
            >
              <Image
                src={{ src: qrCodeDataUrl, width: 100, height: 100 }}
                alt="Ticket QR Code"
                style={{ width: 90, height: 90 }}
              />
              <Text style={{ color: '#78716c', fontSize: 8, letterSpacing: 1, fontWeight: 700 }}>
                {ticketId}
              </Text>
            </Column>
          </Row>
        </Column>
      </Document.Page>

      {/* Page Footer outside Document.Page */}
      <PageFooter
        style={{
          border: { top: '1px solid #e7e5e4' },
          padding: [10, 0, 0, 0],
        }}
      >
        <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#a8a29e', fontSize: 9 }}>
            {event.name} • Organized by {event.organizer}
          </Text>
          <Text style={{ color: '#a8a29e', fontSize: 9 }}>
            PassForge Printable Document • Powered by Hyper Elements
          </Text>
        </Row>
      </PageFooter>
    </Document>
  );
}
