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
import { TicketData } from '@passforge/shared';
import { passforgeTheme } from '../theme.js';

interface TicketPageProps {
  ticket: TicketData;
}

export function TicketPage({ ticket }: TicketPageProps) {
  const { event, attendee, ticketId, qrCodeDataUrl } = ticket;

  return (
    <Page
      theme={passforgeTheme}
      title={`${event.name} — Pass for ${attendee.name}`}
      description={`Official admission ticket for ${event.name} at ${event.venue}`}
      width={680}
      breakpoints={{ mobile: 560 }}
      style={{
        backgroundColor: '#0a0e17',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      {/* Top Header */}
      <Column
        style={{
          padding: [32, 20, 20, 20],
          gap: 12,
          alignItems: 'center',
        }}
      >
        <Row style={{ alignItems: 'center', gap: 10 }}>
          <Text
            style={{
              color: '#6366f1',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            PASSFORGE DIGITAL WALLET
          </Text>
          <Text
            style={{
              color: '#10b981',
              backgroundColor: '#064e3b',
              border: '1px solid #059669',
              borderRadius: 12,
              padding: [2, 10],
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            ● CONFIRMED
          </Text>
        </Row>
        <Heading
          level={2}
          style={{
            color: '#ffffff',
            fontSize: 22,
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          {event.name}
        </Heading>
      </Column>

      {/* Main Digital Pass Card */}
      <Column
        style={{
          backgroundColor: '#111827',
          border: '1px solid #1f2937',
          borderRadius: 20,
          padding: 36,
          gap: 24,
        }}
      >
        {/* Pass Top Banner */}
        <Row
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Column style={{ gap: 4 }}>
            <Text
              style={{
                color: '#38bdf8',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
              }}
            >
              {event.organizer}
            </Text>
            <Text style={{ color: '#94a3b8', fontSize: 13 }}>
              Official Admission Ticket
            </Text>
          </Column>

          <Text
            style={{
              color: '#f59e0b',
              backgroundColor: '#451a03',
              border: '1px solid #78350f',
              borderRadius: 20,
              padding: [6, 16],
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            ⭐ {attendee.ticketType} ACCESS
          </Text>
        </Row>

        <Divider style={{ borderTop: '1px solid #1f2937' }} />

        {/* Attendee Name & Seat Showcase */}
        <Column style={{ gap: 8 }}>
          <Text
            style={{
              color: '#64748b',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Ticket Holder
          </Text>
          <Heading
            level={1}
            style={{
              color: '#ffffff',
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            {attendee.name}
          </Heading>
          <Text style={{ color: '#94a3b8', fontSize: 14 }}>
            {attendee.email}
          </Text>
        </Column>

        {/* Seat, Tier, Gate Metrics */}
        <Row style={{ gap: 16 }}>
          <Column
            style={{
              flex: 1,
              backgroundColor: '#1f2937',
              borderRadius: 12,
              padding: 16,
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
              Seat Number
            </Text>
            <Text style={{ color: '#38bdf8', fontSize: 24, fontWeight: 700 }}>
              {attendee.seat}
            </Text>
          </Column>

          <Column
            style={{
              flex: 1,
              backgroundColor: '#1f2937',
              borderRadius: 12,
              padding: 16,
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
              Category
            </Text>
            <Text style={{ color: '#f59e0b', fontSize: 24, fontWeight: 700 }}>
              {attendee.ticketType}
            </Text>
          </Column>

          <Column
            style={{
              flex: 1,
              backgroundColor: '#1f2937',
              borderRadius: 12,
              padding: 16,
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
              Entry Gate
            </Text>
            <Text style={{ color: '#10b981', fontSize: 24, fontWeight: 700 }}>
              Gate 2
            </Text>
          </Column>
        </Row>

        <Divider style={{ borderTop: '1px dashed #374151' }} />

        {/* QR Code Presentation Box */}
        <Column
          style={{
            alignItems: 'center',
            backgroundColor: '#0a0e17',
            borderRadius: 16,
            padding: 24,
            gap: 12,
          }}
        >
          <Column
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: 16,
              alignItems: 'center',
            }}
          >
            <Image
              src={{ src: qrCodeDataUrl, width: 256, height: 256 }}
              alt={`QR code for ticket ${ticketId}`}
              style={{ width: 180, height: 180 }}
            />
          </Column>
          <Text
            style={{
              color: '#e2e8f0',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            ID: {ticketId}
          </Text>
          <Text style={{ color: '#64748b', fontSize: 12, textAlign: 'center' }}>
            Present this barcode or QR at the entrance terminal
          </Text>
        </Column>

        {/* Date and Venue Details */}
        <Row style={{ gap: 20 }}>
          <Column style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
              Date & Schedule
            </Text>
            <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>
              {event.date}
            </Text>
            <Text style={{ color: '#94a3b8', fontSize: 13 }}>
              {event.time}
            </Text>
          </Column>

          <Column style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
              Venue
            </Text>
            <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>
              {event.venue}
            </Text>
            <Text style={{ color: '#94a3b8', fontSize: 13 }}>
              {event.location}
            </Text>
          </Column>
        </Row>

        {/* Action Buttons */}
        <Row style={{ gap: 12, justifyContent: 'center', padding: [8, 0, 0, 0] }}>
          <Button
            href={`/api/download/pdf`}
            style={{
              backgroundColor: '#6366f1',
              color: '#ffffff',
              padding: [12, 24],
              fontSize: 14,
              fontWeight: 700,
              borderRadius: 8,
            }}
          >
            Download PDF Pass
          </Button>
          <Button
            href={`/api/download/png`}
            style={{
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
              padding: [12, 24],
              fontSize: 14,
              fontWeight: 700,
              borderRadius: 8,
            }}
          >
            Save PNG Image
          </Button>
        </Row>
      </Column>

      {/* Footer */}
      <Column
        style={{
          padding: [28, 20],
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Text style={{ color: '#64748b', fontSize: 12, textAlign: 'center' }}>
          PassForge • Hyper Elements Responsive Web Ticket (Page format)
        </Text>
      </Column>
    </Page>
  );
}
