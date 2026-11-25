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

interface FestivalEmailProps {
  ticket: TicketData;
  branding?: BrandingConfig;
}

export function FestivalEmail({ ticket, branding }: FestivalEmailProps) {
  const { event, attendee, ticketId, qrCodeDataUrl } = ticket;
  const accent = branding?.accentColor || '#FF2E93';
  const logoUrl = branding?.logoUrl;

  const seatStr = attendee.seat || 'A-104';
  const rowMatch = seatStr.match(/[A-Za-z]+/);
  const numMatch = seatStr.match(/\d+/);
  const rowVal = rowMatch ? rowMatch[0] : 'A';
  const seatVal = numMatch ? numMatch[0] : '04';

  return (
    <Email
      previewText={`Your Festival Pass: ${event.name} — ${attendee.name}`}
      title={`${event.name} Festival Admission Pass`}
      width={600}
      style={{
        backgroundColor: '#0A0B1A',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      <Column style={{ padding: [32, 20] }}>
        <Column
          style={{
            backgroundColor: '#141634',
            border: `2px solid ${accent}66`,
            borderRadius: 16,
            padding: [28, 24],
            gap: 20,
          }}
        >
          {/* Header */}
          <Column style={{ alignItems: 'center', gap: 6, textAlign: 'center' }}>
            {logoUrl ? (
              <Image
                src={{ src: logoUrl, width: 140, height: 36 }}
                alt="Logo"
                style={{ width: 120, height: 32 }}
              />
            ) : (
              <Text style={{ color: accent, fontSize: 12, fontWeight: 800, letterSpacing: 4, textTransform: 'uppercase' }}>
                TICKET • FOR ONE PERSON ONLY
              </Text>
            )}
            <Heading level={1} style={{ fontSize: 26, fontWeight: 800, color: '#FFFFFF', letterSpacing: 1 }}>
              {event.name}
            </Heading>
            <Text style={{ color: '#94A3B8', fontSize: 12 }}>
              {event.organizer} • {event.date}
            </Text>
          </Column>

          <Divider style={{ borderTop: `1px solid #2B3066` }} />

          {/* Badges [GATE] [ROW] [SEAT] */}
          <Row style={{ justifyContent: 'center', gap: 12, alignItems: 'center' }}>
            <Column style={{ backgroundColor: accent, borderRadius: 8, padding: [8, 16], alignItems: 'center', minWidth: 65 }}>
              <Text style={{ fontSize: 8, fontWeight: 700, color: '#FFFFFF' }}>GATE</Text>
              <Text style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>01</Text>
            </Column>
            <Column style={{ backgroundColor: accent, borderRadius: 8, padding: [8, 16], alignItems: 'center', minWidth: 65 }}>
              <Text style={{ fontSize: 8, fontWeight: 700, color: '#FFFFFF' }}>ROW</Text>
              <Text style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>{rowVal}</Text>
            </Column>
            <Column style={{ backgroundColor: accent, borderRadius: 8, padding: [8, 16], alignItems: 'center', minWidth: 65 }}>
              <Text style={{ fontSize: 8, fontWeight: 700, color: '#FFFFFF' }}>SEAT</Text>
              <Text style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>{seatVal}</Text>
            </Column>
          </Row>

          {/* Attendee Info */}
          <Column style={{ alignItems: 'center', gap: 4, textAlign: 'center' }}>
            <Text style={{ color: '#94A3B8', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>
              PASS HOLDER
            </Text>
            <Heading level={2} style={{ fontSize: 22, fontWeight: 700, color: '#FFFFFF' }}>
              {attendee.name}
            </Heading>
            <Text style={{ color: '#00D2FF', fontSize: 12, fontWeight: 600 }}>
              {attendee.ticketType || 'VIP'} PASS • {attendee.email}
            </Text>
          </Column>

          {/* QR Verification Box */}
          <Column style={{ alignItems: 'center', gap: 8 }}>
            <Column style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 10, alignItems: 'center' }}>
              <Image src={{ src: qrCodeDataUrl, width: 140, height: 140 }} alt="Festival Pass QR" style={{ width: 130, height: 130 }} />
            </Column>
            <Text style={{ fontSize: 11, fontFamily: 'Courier, monospace', fontWeight: 700, color: '#FFFFFF' }}>
              {ticketId}
            </Text>
            <Text style={{ fontSize: 10, color: '#94A3B8' }}>
              Show this barcode at turnstile entrance scanners
            </Text>
          </Column>

          {/* Action Button */}
          <Row style={{ justifyContent: 'center', gap: 12, padding: [4, 0, 0, 0] }}>
            <Button
              href={`/api/download/pdf?ticketId=${ticketId}`}
              style={{
                backgroundColor: accent,
                color: '#FFFFFF',
                borderRadius: 8,
                padding: [12, 24],
                fontSize: 12,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Download PDF Pass
            </Button>
          </Row>
        </Column>
      </Column>
    </Email>
  );
}
