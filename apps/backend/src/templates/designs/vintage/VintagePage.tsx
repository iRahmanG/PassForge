import React from 'react';
import {
  Page,
  Column,
  Row,
  Heading,
  Text,
  Image,
  Button,
  Divider,
} from '@hyper-elements/react';
import { TicketData, BrandingConfig } from '@passforge/shared';

interface VintagePageProps {
  ticket: TicketData;
  branding?: BrandingConfig;
}

export function VintagePage({ ticket, branding }: VintagePageProps) {
  const { event, attendee, ticketId, qrCodeDataUrl } = ticket;
  const accent = branding?.accentColor || '#C23B38';

  return (
    <Page
      title={`${event.name} — Admission Pass`}
      description={`Vintage Admission Ticket for ${attendee.name}`}
      width={680}
      breakpoints={{ mobile: 560 }}
      style={{
        backgroundColor: '#EFE7DA',
        fontFamily: 'Georgia, Times, serif',
        color: '#26221F',
      }}
    >
      <Column style={{ padding: [36, 20], gap: 24, alignItems: 'center' }}>
        {/* Vintage Ticket Card */}
        <Column
          style={{
            width: '100%',
            maxWidth: 620,
            backgroundColor: '#FDF8F0',
            border: `3px solid ${accent}`,
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          {/* Header Banner */}
          <Column
            style={{
              padding: [24, 24, 16, 24],
              alignItems: 'center',
              gap: 6,
              border: { bottom: `2px dashed ${accent}` },
            }}
          >
            <Text style={{ color: accent, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>
              {event.organizer} • OFFICIAL ADMISSION
            </Text>
            <Heading level={1} style={{ fontSize: 32, fontWeight: 700, color: '#1C1917', letterSpacing: 6, textTransform: 'uppercase' }}>
              TICKET
            </Heading>
            <Heading level={2} style={{ fontSize: 20, fontWeight: 700, color: '#26221F', textAlign: 'center' }}>
              {event.name}
            </Heading>
          </Column>

          {/* Ticket Body Content */}
          <Column style={{ padding: [20, 24], gap: 16 }}>
            {/* Attendee presentation */}
            <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Column style={{ gap: 2 }}>
                <Text style={{ fontSize: 10, color: '#786F66', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                  ADMIT ONE
                </Text>
                <Heading level={3} style={{ fontSize: 22, fontWeight: 700, color: '#1C1917' }}>
                  {attendee.name}
                </Heading>
                <Text style={{ fontSize: 12, color: '#786F66' }}>
                  {attendee.email}
                </Text>
              </Column>

              <Text
                style={{
                  color: '#991B1B',
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #F87171',
                  borderRadius: 6,
                  padding: [4, 12],
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {attendee.ticketType || 'VIP'} PASS
              </Text>
            </Row>

            {/* Seat & Schedule Box */}
            <Row
              style={{
                backgroundColor: '#F7EFE1',
                border: '1px solid #DFD5C4',
                borderRadius: 8,
                padding: [12, 16],
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Column style={{ gap: 2 }}>
                <Text style={{ fontSize: 9, color: '#786F66', textTransform: 'uppercase' }}>SEAT</Text>
                <Text style={{ fontSize: 16, fontWeight: 700, color: accent }}>{attendee.seat || 'Open Seating'}</Text>
              </Column>
              <Column style={{ gap: 2, alignItems: 'center' }}>
                <Text style={{ fontSize: 9, color: '#786F66', textTransform: 'uppercase' }}>DATE</Text>
                <Text style={{ fontSize: 12, fontWeight: 600, color: '#26221F' }}>{event.date}</Text>
              </Column>
              <Column style={{ gap: 2, alignItems: 'end' }}>
                <Text style={{ fontSize: 9, color: '#786F66', textTransform: 'uppercase' }}>TIME</Text>
                <Text style={{ fontSize: 12, fontWeight: 600, color: '#26221F' }}>{event.time}</Text>
              </Column>
            </Row>

            {/* QR Barcode Section */}
            <Column style={{ alignItems: 'center', gap: 8, padding: [12, 0] }}>
              <Column style={{ backgroundColor: '#FFFFFF', border: '1px solid #D6CEBE', borderRadius: 8, padding: 12, alignItems: 'center' }}>
                <Image src={{ src: qrCodeDataUrl, width: 160, height: 160 }} alt="QR Code" style={{ width: 150, height: 150 }} />
              </Column>
              <Text style={{ fontSize: 12, fontFamily: 'Courier, monospace', fontWeight: 700, color: '#1C1917' }}>
                SERIAL № {ticketId}
              </Text>
              <Text style={{ fontSize: 11, color: '#786F66', textAlign: 'center' }}>
                Present this barcode at turnstile entrance terminals
              </Text>
            </Column>

            {/* Action Download Buttons */}
            <Row style={{ gap: 12, justifyContent: 'center', padding: [8, 0, 0, 0] }}>
              <Button
                href={`/api/download/pdf?ticketId=${ticketId}`}
                style={{
                  backgroundColor: accent,
                  color: '#FFFFFF',
                  borderRadius: 8,
                  padding: [10, 20],
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Download PDF Pass
              </Button>
              <Button
                href={`/api/download/png?ticketId=${ticketId}`}
                style={{
                  backgroundColor: '#26221F',
                  color: '#FFFFFF',
                  borderRadius: 8,
                  padding: [10, 20],
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Save Badge Image
              </Button>
            </Row>
          </Column>
        </Column>
      </Column>
    </Page>
  );
}
