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

interface TechDocumentProps {
  ticket: TicketData;
  branding?: BrandingConfig;
}

export function TechDocument({ ticket, branding }: TechDocumentProps) {
  const { event, attendee, ticketId, qrCodeDataUrl } = ticket;
  const accent = branding?.accentColor || '#06b6d4';
  const logoUrl = branding?.logoUrl;

  const getTierBadge = (tier?: string) => {
    const t = (tier || 'general').toLowerCase();
    if (t === 'vip') return { label: 'VIP PASS', color: '#78350f', bg: '#fef3c7', border: '#d97706' };
    if (t === 'speaker') return { label: 'SPEAKER PASS', color: '#4c1d95', bg: '#f3e8ff', border: '#9333ea' };
    if (t === 'student') return { label: 'STUDENT PASS', color: '#0c4a6e', bg: '#e0f2fe', border: '#0284c7' };
    return { label: 'GENERAL ADMIT', color: '#1e293b', bg: '#f1f5f9', border: '#64748b' };
  };
  const tierBadge = getTierBadge(attendee.ticketType);

  return (
    <Document
      title={`${event.name} - Official Admission Pass`}
      size="A4"
      orientation="portrait"
      margin={32}
      style={{
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: '#0f172a',
      }}
    >
      <Document.Page style={{ gap: 24, backgroundColor: '#ffffff' }}>
        {/* Document Header */}
        <Row style={{ justifyContent: 'space-between', alignItems: 'center', border: { bottom: '2px solid #0f172a' }, padding: [0, 0, 12, 0] }}>
          <Column style={{ gap: 2 }}>
            <Text style={{ color: accent, fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
              PASSFORGE OFFICIAL ADMISSION PASS
            </Text>
            <Text style={{ color: '#64748b', fontSize: 11 }}>
              Tech / Hackathon Edition • Generated via Hyper Elements
            </Text>
          </Column>
          <Column style={{ alignItems: 'end', gap: 2 }}>
            <Text style={{ color: '#0f172a', fontSize: 11, fontWeight: 700 }}>
              TICKET REF: {ticketId}
            </Text>
            <Text style={{ color: '#059669', fontSize: 11, fontWeight: 700 }}>
              STATUS: CONFIRMED
            </Text>
          </Column>
        </Row>

        {/* Primary Ticket Card / Stub */}
        <Column
          style={{
            border: '2px solid #0f172a',
            borderRadius: 12,
            backgroundColor: '#f8fafc',
            padding: 24,
            gap: 18,
          }}
        >
          {/* Top Bar of the Ticket */}
          <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Column style={{ gap: 2 }}>
              {logoUrl ? (
                <Image
                  src={{ src: logoUrl, width: 180, height: 40 }}
                  alt="Logo"
                  style={{ width: 130, height: 'auto' }}
                />
              ) : (
                <Text style={{ color: accent, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {event.organizer} PRESENTS
                </Text>
              )}
              <Heading level={1} style={{ color: '#0f172a', fontSize: 24, fontWeight: 700 }}>
                {event.name}
              </Heading>
              <Text style={{ color: '#475569', fontSize: 12 }}>
                {event.tagline}
              </Text>
            </Column>

            <Column
              style={{
                backgroundColor: tierBadge.bg,
                border: `2px solid ${tierBadge.border}`,
                borderRadius: 8,
                padding: [6, 16],
                alignItems: 'center',
              }}
            >
              <Text style={{ color: tierBadge.color, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                ACCESS TIER
              </Text>
              <Text style={{ color: tierBadge.color, fontSize: 16, fontWeight: 700 }}>
                {tierBadge.label}
              </Text>
            </Column>
          </Row>

          <Divider style={{ borderTop: '2px dashed #94a3b8' }} />

          {/* Attendee Details & QR Row */}
          <Row style={{ gap: 20, alignItems: 'center' }}>
            {/* Left Column: Attendee Data */}
            <Column style={{ flex: 1, gap: 12 }}>
              <Column style={{ gap: 2 }}>
                <Text style={{ color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Attendee Name
                </Text>
                <Text style={{ color: '#0f172a', fontSize: 22, fontWeight: 700 }}>
                  {attendee.name}
                </Text>
                <Text style={{ color: '#475569', fontSize: 12 }}>
                  {attendee.email}
                </Text>
              </Column>

              <Row style={{ gap: 16 }}>
                <Column
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 6,
                    padding: [8, 14],
                    gap: 2,
                  }}
                >
                  <Text style={{ color: '#64748b', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>
                    Seat Allocation
                  </Text>
                  <Text style={{ color: '#0f172a', fontSize: 16, fontWeight: 700 }}>
                    {attendee.seat || 'Open Seating'}
                  </Text>
                </Column>

                <Column
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 6,
                    padding: [8, 14],
                    gap: 2,
                  }}
                >
                  <Text style={{ color: '#64748b', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>
                    Gate Entry
                  </Text>
                  <Text style={{ color: '#059669', fontSize: 16, fontWeight: 700 }}>
                    Gate 2 (VIP Lane)
                  </Text>
                </Column>
              </Row>
            </Column>

            {/* Right Column: QR Code & Verification Block */}
            <Column
              style={{
                width: 160,
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                padding: 12,
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Image
                src={{ src: qrCodeDataUrl, width: 256, height: 256 }}
                alt={`QR code for ticket ${ticketId}`}
                style={{ width: 130, height: 130 }}
              />
              <Text style={{ color: '#0f172a', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
                {ticketId}
              </Text>
              <Text style={{ color: '#64748b', fontSize: 9, textAlign: 'center' }}>
                Scan for rapid entrance
              </Text>
            </Column>
          </Row>

          <Divider style={{ borderTop: '1px solid #cbd5e1' }} />

          {/* Event Logistics */}
          <Row style={{ gap: 16 }}>
            <Column style={{ flex: 1, gap: 2 }}>
              <Text style={{ color: '#64748b', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>
                Date & Time
              </Text>
              <Text style={{ color: '#0f172a', fontSize: 13, fontWeight: 700 }}>
                {event.date}
              </Text>
              <Text style={{ color: '#475569', fontSize: 11 }}>
                {event.time}
              </Text>
            </Column>

            <Column style={{ flex: 1.5, gap: 2 }}>
              <Text style={{ color: '#64748b', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>
                Venue & Address
              </Text>
              <Text style={{ color: '#0f172a', fontSize: 13, fontWeight: 700 }}>
                {event.venue}
              </Text>
              <Text style={{ color: '#475569', fontSize: 11 }}>
                {event.location}
              </Text>
            </Column>
          </Row>
        </Column>

        {/* Important Attendee Instructions Section */}
        <Column
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: 16,
            gap: 10,
            backgroundColor: '#ffffff',
          }}
        >
          <Text style={{ color: '#0f172a', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
            Important Entry Instructions & Guidelines
          </Text>

          <Column style={{ gap: 6 }}>
            <Text style={{ color: '#334155', fontSize: 11, lineHeight: 1.4 }}>
              • <Span style={{ fontWeight: 700 }}>Photo Identification:</Span> Please present this printed pass along with a valid Government or Institutional ID card at the check-in desk.
            </Text>
            <Text style={{ color: '#334155', fontSize: 11, lineHeight: 1.4 }}>
              • <Span style={{ fontWeight: 700 }}>Arrival Timing:</Span> Registration desk opens at 08:30 AM IST. Keynote commencement starts promptly at 10:00 AM IST.
            </Text>
            <Text style={{ color: '#334155', fontSize: 11, lineHeight: 1.4 }}>
              • <Span style={{ fontWeight: 700 }}>VIP Privileges:</Span> Includes reserved seating in Block A, access to the VIP Networking Lounge, lunch buffet, and exclusive speaker meetups.
            </Text>
            <Text style={{ color: '#334155', fontSize: 11, lineHeight: 1.4 }}>
              • <Span style={{ fontWeight: 700 }}>Non-Transferable:</Span> This pass is non-transferable and mapped to {attendee.name} ({attendee.email}).
            </Text>
          </Column>
        </Column>

        {/* Venue Information Note */}
        <Row
          style={{
            backgroundColor: '#f1f5f9',
            borderRadius: 6,
            padding: [10, 14],
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#475569', fontSize: 10 }}>
            Organized by: <Span style={{ fontWeight: 700 }}>{event.organizer}</Span> • Official Website: {event.website}
          </Text>
          <Text style={{ color: '#64748b', fontSize: 10 }}>
            Helpdesk: support@passforge.local
          </Text>
        </Row>
      </Document.Page>

      <PageFooter
        style={{
          padding: [8, 0],
          border: { top: '1px solid #e2e8f0' },
        }}
      >
        <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#94a3b8', fontSize: 9 }}>
            PassForge — Hyper Elements Document PDF Rendering Engine (Tech Edition)
          </Text>
          <Text style={{ color: '#94a3b8', fontSize: 9 }}>
            Do not duplicate • Page 1 of 1
          </Text>
        </Row>
      </PageFooter>
    </Document>
  );
}
