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

interface VintageEmailProps {
  ticket: TicketData;
  branding?: BrandingConfig;
}

export function VintageEmail({ ticket, branding }: VintageEmailProps) {
  const { event, attendee, ticketId, qrCodeDataUrl } = ticket;
  const accent = branding?.accentColor || '#C23B38';
  const logoUrl = branding?.logoUrl;

  return (
    <Email
      previewText={`Your Admission Ticket: ${event.name} — ${attendee.name}`}
      title={`${event.name} Official Ticket Confirmation`}
      width={600}
      style={{
        backgroundColor: '#EFE7DA',
        fontFamily: 'Georgia, Times, serif',
      }}
    >
      {/* Outer Email Card */}
      <Column style={{ padding: [32, 20] }}>
        <Column
          style={{
            backgroundColor: '#FDF8F0',
            border: `3px solid ${accent}`,
            borderRadius: 12,
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
                style={{ width: 110, height: 32 }}
              />
            ) : (
              <Text style={{ color: accent, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>
                {event.organizer} • OFFICIAL ADMISSION
              </Text>
            )}
            <Row style={{ alignItems: 'center', gap: 10, justifyContent: 'center' }}>
              <Text style={{ color: accent, fontSize: 14 }}>★</Text>
              <Heading level={1} style={{ fontSize: 28, fontWeight: 700, color: '#1C1917', letterSpacing: 4, textTransform: 'uppercase' }}>
                TICKET
              </Heading>
              <Text style={{ color: accent, fontSize: 14 }}>★</Text>
            </Row>
            <Heading level={2} style={{ fontSize: 20, fontWeight: 700, color: '#26221F' }}>
              {event.name}
            </Heading>
          </Column>

          <Divider style={{ borderTop: `2px dashed ${accent}` }} />

          {/* Attendee Presentation */}
          <Column style={{ alignItems: 'center', gap: 4, textAlign: 'center' }}>
            <Text style={{ color: '#786F66', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>
              ADMIT ONE TO
            </Text>
            <Heading level={3} style={{ fontSize: 22, fontWeight: 700, color: '#1C1917' }}>
              {attendee.name}
            </Heading>
            <Text style={{ color: '#786F66', fontSize: 12 }}>
              {attendee.email}
            </Text>
          </Column>

          {/* Seat & Voucher Box */}
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
              <Text style={{ fontSize: 9, color: '#786F66', textTransform: 'uppercase' }}>CATEGORY</Text>
              <Text style={{ fontSize: 14, fontWeight: 700, color: '#991B1B' }}>{attendee.ticketType || 'VIP'}</Text>
            </Column>
            <Column style={{ gap: 2, alignItems: 'center' }}>
              <Text style={{ fontSize: 9, color: '#786F66', textTransform: 'uppercase' }}>SEAT</Text>
              <Text style={{ fontSize: 15, fontWeight: 700, color: accent }}>{attendee.seat || 'Open Seating'}</Text>
            </Column>
            <Column style={{ gap: 2, alignItems: 'end' }}>
              <Text style={{ fontSize: 9, color: '#786F66', textTransform: 'uppercase' }}>DATE</Text>
              <Text style={{ fontSize: 12, fontWeight: 600, color: '#26221F' }}>{event.date}</Text>
            </Column>
          </Row>

          {/* QR Code Validation Box */}
          <Column style={{ alignItems: 'center', gap: 8 }}>
            <Column style={{ backgroundColor: '#FFFFFF', border: '1px solid #D6CEBE', borderRadius: 8, padding: 10, alignItems: 'center' }}>
              <Image src={{ src: qrCodeDataUrl, width: 140, height: 140 }} alt="Ticket QR" style={{ width: 130, height: 130 }} />
            </Column>
            <Text style={{ fontSize: 11, fontFamily: 'Courier, monospace', fontWeight: 700, color: '#1C1917' }}>
              № {ticketId}
            </Text>
            <Text style={{ fontSize: 10, color: '#786F66' }}>
              Present this barcode or print this pass for admission
            </Text>
          </Column>

          {/* Action Buttons */}
          <Row style={{ justifyContent: 'center', gap: 12, padding: [8, 0, 0, 0] }}>
            <Button
              href={`/api/download/pdf?ticketId=${ticketId}`}
              style={{
                backgroundColor: accent,
                color: '#FFFFFF',
                borderRadius: 6,
                padding: [10, 20],
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
