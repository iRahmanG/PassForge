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

interface FestivalPageProps {
  ticket: TicketData;
  branding?: BrandingConfig;
}

export function FestivalPage({ ticket, branding }: FestivalPageProps) {
  const { event, attendee, ticketId, qrCodeDataUrl } = ticket;
  const accent = branding?.accentColor || '#FF2E93';
  const logoUrl = branding?.logoUrl;

  const seatStr = attendee.seat || 'A-104';
  const rowMatch = seatStr.match(/[A-Za-z]+/);
  const numMatch = seatStr.match(/\d+/);
  const rowVal = rowMatch ? rowMatch[0] : 'A';
  const seatVal = numMatch ? numMatch[0] : '04';

  return (
    <Page
      title={`${event.name} — Festival Pass`}
      description={`Official festival admission pass for ${attendee.name}`}
      width={680}
      breakpoints={{ mobile: 560 }}
      style={{
        backgroundColor: '#0A0B1A',
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: '#FFFFFF',
      }}
    >
      <Column style={{ padding: [36, 20], gap: 24, alignItems: 'center' }}>
        <Column
          style={{
            width: '100%',
            maxWidth: 620,
            backgroundColor: '#141634',
            border: `2px solid ${accent}66`,
            borderRadius: 20,
            overflow: 'hidden',
          }}
        >
          {/* Header Banner */}
          <Column
            style={{
              padding: [24, 24, 16, 24],
              alignItems: 'center',
              gap: 6,
              border: { bottom: '1px solid #2B3066' },
            }}
          >
            {logoUrl ? (
              <Image
                src={{ src: logoUrl, width: 140, height: 36 }}
                alt="Logo"
                style={{ width: 120, height: 32 }}
              />
            ) : (
              <Text style={{ color: accent, fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase' }}>
                TICKET • FOR ONE PERSON ONLY
              </Text>
            )}
            <Heading level={1} style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF', textAlign: 'center' }}>
              {event.name}
            </Heading>
            <Text style={{ fontSize: 12, color: '#94A3B8' }}>
              {event.organizer}
            </Text>
          </Column>

          {/* Badges and Event Stats */}
          <Column style={{ padding: [20, 24], gap: 18 }}>
            <Row style={{ justifyContent: 'center', gap: 12, alignItems: 'center' }}>
              <Column style={{ backgroundColor: accent, borderRadius: 8, padding: [8, 16], alignItems: 'center', minWidth: 70 }}>
                <Text style={{ fontSize: 8, fontWeight: 700, color: '#FFFFFF' }}>GATE</Text>
                <Text style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>01</Text>
              </Column>
              <Column style={{ backgroundColor: accent, borderRadius: 8, padding: [8, 16], alignItems: 'center', minWidth: 70 }}>
                <Text style={{ fontSize: 8, fontWeight: 700, color: '#FFFFFF' }}>ROW</Text>
                <Text style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>{rowVal}</Text>
              </Column>
              <Column style={{ backgroundColor: accent, borderRadius: 8, padding: [8, 16], alignItems: 'center', minWidth: 70 }}>
                <Text style={{ fontSize: 8, fontWeight: 700, color: '#FFFFFF' }}>SEAT</Text>
                <Text style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>{seatVal}</Text>
              </Column>
            </Row>

            {/* Attendee Details */}
            <Row style={{ backgroundColor: '#1E224A', borderRadius: 10, padding: [12, 16], justifyContent: 'space-between', alignItems: 'center' }}>
              <Column style={{ gap: 2 }}>
                <Text style={{ fontSize: 9, color: '#94A3B8', textTransform: 'uppercase' }}>PASS HOLDER</Text>
                <Heading level={2} style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>{attendee.name}</Heading>
                <Text style={{ fontSize: 11, color: '#00D2FF' }}>{attendee.email}</Text>
              </Column>

              <Column style={{ gap: 2, alignItems: 'end' }}>
                <Text style={{ fontSize: 9, color: '#94A3B8', textTransform: 'uppercase' }}>DATE & TIME</Text>
                <Text style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>{event.date}</Text>
                <Text style={{ fontSize: 11, color: '#00D2FF' }}>{event.time}</Text>
              </Column>
            </Row>

            {/* Dynamic QR Barcode Section */}
            <Column style={{ alignItems: 'center', gap: 8, padding: [10, 0] }}>
              <Column style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, alignItems: 'center' }}>
                <Image src={{ src: qrCodeDataUrl, width: 160, height: 160 }} alt="QR Code" style={{ width: 150, height: 150 }} />
              </Column>
              <Text style={{ fontSize: 12, fontFamily: 'Courier, monospace', fontWeight: 700, color: '#FFFFFF' }}>
                TICKET REF: {ticketId}
              </Text>
              <Text style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center' }}>
                Show this barcode or add to wallet for turnstile access
              </Text>
            </Column>

            {/* Actions */}
            <Row style={{ gap: 12, justifyContent: 'center', padding: [6, 0, 0, 0] }}>
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
                  backgroundColor: '#00D2FF',
                  color: '#0A0B1A',
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
