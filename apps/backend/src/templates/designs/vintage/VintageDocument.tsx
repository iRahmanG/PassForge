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

interface VintageDocumentProps {
  ticket: TicketData;
  branding?: BrandingConfig;
}

export function VintageDocument({ ticket, branding }: VintageDocumentProps) {
  const { event, attendee, ticketId, qrCodeDataUrl } = ticket;
  const accent = branding?.accentColor || '#C23B38';

  return (
    <Document
      title={`${event.name} — Vintage Admission Ticket`}
      size="A4"
      orientation="portrait"
      margin={36}
      style={{
        backgroundColor: '#FDFBF7',
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: '#26221F',
      }}
    >
      <Document.Page style={{ gap: 24, backgroundColor: '#FDFBF7' }}>
        {/* Top Vintage Masthead */}
        <Row
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            border: { bottom: `2px solid ${accent}` },
            padding: [0, 0, 14, 0],
          }}
        >
          <Column style={{ gap: 2 }}>
            <Text style={{ color: accent, fontSize: 13, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase' }}>
              PASSFORGE VINTAGE STUB EDITION
            </Text>
            <Text style={{ color: '#786F66', fontSize: 11 }}>
              Official Admission Ticket & Tear-Off Stub
            </Text>
          </Column>
          <Text style={{ color: '#1C1917', fontSize: 11, fontWeight: 700, fontFamily: 'Courier, monospace' }}>
            SERIAL: {ticketId}
          </Text>
        </Row>

        {/* The Printable Vintage Ticket Stub Card */}
        <Column
          style={{
            border: `3px solid ${accent}`,
            borderRadius: 12,
            backgroundColor: '#FDF8F0',
            overflow: 'hidden',
          }}
        >
          {/* Main Pass Row */}
          <Row style={{ alignItems: 'stretch' }}>
            {/* Left Perforated Stub */}
            <Column
              style={{
                width: 90,
                border: { right: `2px dashed ${accent}` },
                backgroundColor: '#F5EFE4',
                padding: [20, 10, 20, 10],
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 9, color: accent, fontWeight: 700, fontFamily: 'Courier, monospace' }}>
                № {ticketId.replace(/[^0-9]/g, '').slice(-6) || '324364'}
              </Text>
              <Column style={{ alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', letterSpacing: 2 }}>
                  ADMIT
                </Text>
                <Text style={{ fontSize: 14, fontWeight: 700, color: accent, letterSpacing: 2 }}>
                  ONE
                </Text>
              </Column>
              <Text style={{ fontSize: 8, color: '#786F66', textTransform: 'uppercase' }}>
                ★ ENTRY ★
              </Text>
            </Column>

            {/* Center Main Pass Body */}
            <Column style={{ flex: 1, padding: [24, 24, 24, 24], gap: 14, justifyContent: 'space-between' }}>
              <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: accent, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
                  {event.organizer}
                </Text>
                <Text style={{ color: '#991B1B', backgroundColor: '#FEE2E2', border: '1px solid #F87171', borderRadius: 4, padding: [2, 10], fontSize: 9, fontWeight: 700 }}>
                  {attendee.ticketType || 'VIP'} PASS
                </Text>
              </Row>

              <Column style={{ alignItems: 'center', gap: 4 }}>
                <Heading level={1} style={{ fontSize: 28, fontWeight: 700, color: '#1C1917', letterSpacing: 4, textTransform: 'uppercase', textAlign: 'center' }}>
                  TICKET
                </Heading>
                <Heading level={2} style={{ fontSize: 18, fontWeight: 700, color: '#26221F', textAlign: 'center' }}>
                  {event.name}
                </Heading>
              </Column>

              <Row style={{ backgroundColor: '#F7EFE1', border: '1px solid #DFD5C4', borderRadius: 8, padding: [10, 16], justifyContent: 'space-between', alignItems: 'center' }}>
                <Column style={{ gap: 2 }}>
                  <Text style={{ fontSize: 9, color: '#786F66', textTransform: 'uppercase' }}>Attendee</Text>
                  <Text style={{ fontSize: 15, fontWeight: 700, color: '#1C1917' }}>{attendee.name}</Text>
                </Column>
                <Column style={{ gap: 2, alignItems: 'center' }}>
                  <Text style={{ fontSize: 9, color: '#786F66', textTransform: 'uppercase' }}>Seat</Text>
                  <Text style={{ fontSize: 14, fontWeight: 700, color: accent }}>{attendee.seat || 'Open'}</Text>
                </Column>
                <Column style={{ gap: 2, alignItems: 'end' }}>
                  <Text style={{ fontSize: 9, color: '#786F66', textTransform: 'uppercase' }}>Date & Venue</Text>
                  <Text style={{ fontSize: 11, fontWeight: 600, color: '#26221F' }}>{event.date}</Text>
                </Column>
              </Row>
            </Column>

            {/* Right Perforated Stub with QR */}
            <Column
              style={{
                width: 140,
                border: { left: `2px dashed ${accent}` },
                backgroundColor: '#F5EFE4',
                padding: [16, 12, 16, 12],
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ color: accent, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                CHECK-IN
              </Text>
              <Column style={{ backgroundColor: '#FFFFFF', border: '1px solid #D6CEBE', borderRadius: 6, padding: 6, alignItems: 'center' }}>
                <Image src={{ src: qrCodeDataUrl, width: 85, height: 85 }} alt="QR" style={{ width: 80, height: 80 }} />
              </Column>
              <Text style={{ fontSize: 9, fontWeight: 700, color: '#1C1917', fontFamily: 'Courier, monospace' }}>
                {ticketId}
              </Text>
            </Column>
          </Row>
        </Column>

        {/* Perforation Cut Guide */}
        <Row style={{ justifyContent: 'center', alignItems: 'center', padding: [4, 0, 4, 0] }}>
          <Text style={{ fontSize: 10, color: '#786F66', letterSpacing: 2, textTransform: 'uppercase' }}>
            ✂ Tear or fold along dashed lines for terminal admittance
          </Text>
        </Row>

        {/* Venue & Event Guidelines */}
        <Column style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5DFD5', borderRadius: 8, padding: 20, gap: 12 }}>
          <Heading level={3} style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', textTransform: 'uppercase', letterSpacing: 1 }}>
            Venue & Entrance Instructions
          </Heading>
          <Text style={{ fontSize: 11, color: '#55504A', lineHeight: 1.6 }}>
            Please present this physical printed ticket or present the dynamic QR barcode on your mobile device at entrance gates. Re-entry requires the verified stub validation.
          </Text>
          <Row style={{ justifyContent: 'space-between', alignItems: 'center', border: { top: '1px solid #F0EAE1' }, padding: [10, 0, 0, 0] }}>
            <Text style={{ fontSize: 10, color: '#786F66' }}>Venue: {event.venue} — {event.location}</Text>
            <Text style={{ fontSize: 10, color: accent, fontWeight: 700 }}>PassForge Document Engine</Text>
          </Row>
        </Column>
      </Document.Page>
    </Document>
  );
}
