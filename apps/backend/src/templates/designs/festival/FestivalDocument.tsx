import React from 'react';
import {
  Document,
  Column,
  Row,
  Heading,
  Text,
  Image,
  Divider,
} from '@hyper-elements/react';
import { TicketData, BrandingConfig } from '@passforge/shared';

interface FestivalDocumentProps {
  ticket: TicketData;
  branding?: BrandingConfig;
}

export function FestivalDocument({ ticket, branding }: FestivalDocumentProps) {
  const { event, attendee, ticketId, qrCodeDataUrl } = ticket;
  const accent = branding?.accentColor || '#FF2E93';

  const seatStr = attendee.seat || 'A-104';
  const rowMatch = seatStr.match(/[A-Za-z]+/);
  const numMatch = seatStr.match(/\d+/);
  const rowVal = rowMatch ? rowMatch[0] : 'A';
  const seatVal = numMatch ? numMatch[0] : '04';

  return (
    <Document
      title={`${event.name} — Festival Pass`}
      size="A4"
      orientation="portrait"
      margin={36}
      style={{
        backgroundColor: '#0A0B1A',
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: '#FFFFFF',
      }}
    >
      <Document.Page style={{ gap: 24, backgroundColor: '#0A0B1A' }}>
        {/* Top Festival Header */}
        <Row
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            border: { bottom: `2px solid ${accent}` },
            padding: [0, 0, 14, 0],
          }}
        >
          <Column style={{ gap: 2 }}>
            <Text style={{ color: accent, fontSize: 13, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase' }}>
              FESTIVAL & CONCERT PASS
            </Text>
            <Text style={{ color: '#94A3B8', fontSize: 11 }}>
              Official High-Security Admission Credential
            </Text>
          </Column>
          <Text style={{ color: '#00D2FF', fontSize: 11, fontWeight: 700, fontFamily: 'Courier, monospace' }}>
            ID: {ticketId}
          </Text>
        </Row>

        {/* Printable Festival Ticket Pass */}
        <Column
          style={{
            border: `2px solid ${accent}55`,
            borderRadius: 16,
            backgroundColor: '#141634',
            overflow: 'hidden',
          }}
        >
          <Row style={{ alignItems: 'stretch' }}>
            {/* Main Pass Section */}
            <Column style={{ flex: 1, padding: [24, 28], gap: 16, justifyContent: 'space-between' }}>
              <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: 2 }}>
                  TICKET • FOR ONE PERSON ONLY
                </Text>
                <Text style={{ backgroundColor: accent, color: '#FFFFFF', borderRadius: 12, padding: [3, 10], fontSize: 9, fontWeight: 700 }}>
                  {attendee.ticketType || 'VIP'} PASS
                </Text>
              </Row>

              <Heading level={1} style={{ fontSize: 26, fontWeight: 800, color: '#FFFFFF', letterSpacing: 1 }}>
                {event.name}
              </Heading>

              {/* Badges [GATE] [ROW] [SEAT] */}
              <Row style={{ gap: 12, alignItems: 'center' }}>
                <Column style={{ backgroundColor: accent, borderRadius: 6, padding: [6, 12], alignItems: 'center', minWidth: 60 }}>
                  <Text style={{ fontSize: 8, fontWeight: 700, color: '#FFFFFF' }}>GATE</Text>
                  <Text style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>01</Text>
                </Column>
                <Column style={{ backgroundColor: accent, borderRadius: 6, padding: [6, 12], alignItems: 'center', minWidth: 60 }}>
                  <Text style={{ fontSize: 8, fontWeight: 700, color: '#FFFFFF' }}>ROW</Text>
                  <Text style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>{rowVal}</Text>
                </Column>
                <Column style={{ backgroundColor: accent, borderRadius: 6, padding: [6, 12], alignItems: 'center', minWidth: 60 }}>
                  <Text style={{ fontSize: 8, fontWeight: 700, color: '#FFFFFF' }}>SEAT</Text>
                  <Text style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>{seatVal}</Text>
                </Column>
                <Column style={{ padding: [0, 0, 0, 8], gap: 2 }}>
                  <Text style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>{event.date}</Text>
                  <Text style={{ fontSize: 11, fontWeight: 700, color: '#00D2FF' }}>{event.time}</Text>
                </Column>
              </Row>

              <Row style={{ backgroundColor: '#1E224A', borderRadius: 8, padding: [8, 14], justifyContent: 'space-between', alignItems: 'center' }}>
                <Column style={{ gap: 1 }}>
                  <Text style={{ fontSize: 8, color: '#94A3B8', textTransform: 'uppercase' }}>ATTENDEE</Text>
                  <Text style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>{attendee.name}</Text>
                </Column>
                <Column style={{ gap: 1, alignItems: 'end' }}>
                  <Text style={{ fontSize: 8, color: '#94A3B8', textTransform: 'uppercase' }}>VENUE</Text>
                  <Text style={{ fontSize: 11, fontWeight: 600, color: '#CBD5E1' }}>{event.venue}</Text>
                </Column>
              </Row>
            </Column>

            {/* Right Perforated Stub with QR */}
            <Column
              style={{
                width: 140,
                backgroundColor: '#16193E',
                border: { left: `2px dashed ${accent}` },
                padding: [20, 14],
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ color: '#00D2FF', fontSize: 10, fontWeight: 800, letterSpacing: 2 }}>
                ADMIT ONE
              </Text>
              <Column style={{ backgroundColor: '#FFFFFF', borderRadius: 8, padding: 6, alignItems: 'center' }}>
                <Image src={{ src: qrCodeDataUrl, width: 90, height: 90 }} alt="QR" style={{ width: 85, height: 85 }} />
              </Column>
              <Text style={{ fontSize: 9, fontWeight: 700, color: '#FFFFFF', fontFamily: 'Courier, monospace' }}>
                {ticketId}
              </Text>
            </Column>
          </Row>
        </Column>

        {/* Security & Entrance Notice */}
        <Column style={{ backgroundColor: '#141634', border: '1px solid #2B3066', borderRadius: 8, padding: 18, gap: 10 }}>
          <Text style={{ fontSize: 12, fontWeight: 700, color: '#00D2FF', textTransform: 'uppercase', letterSpacing: 1 }}>
            Concert & Festival Turnstile Guidelines
          </Text>
          <Text style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.6 }}>
            Keep this ticket ready for gate scanners. Tampering with barcode or serial voids entry. Re-admittance is subject to venue policy.
          </Text>
          <Row
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              border: { top: '1px solid #1E224A' },
              padding: [10, 0, 0, 0],
            }}
          >
            <Text style={{ fontSize: 10, color: '#64748B' }}>Venue: {event.venue} — {event.location}</Text>
            <Text style={{ fontSize: 10, color: accent, fontWeight: 700 }}>PassForge Festival Engine</Text>
          </Row>
        </Column>
      </Document.Page>
    </Document>
  );
}
