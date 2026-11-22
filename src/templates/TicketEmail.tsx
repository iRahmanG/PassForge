import React from 'react';
import {
  Email,
  Column,
  Row,
  Heading,
  Text,
  Span,
  Image,
  Button,
  Divider,
} from '@hyper-elements/react';
import { TicketData } from '../types/ticket.js';
import { passforgeTheme } from './theme.js';

interface TicketEmailProps {
  ticket: TicketData;
}

export function TicketEmail({ ticket }: TicketEmailProps) {
  const { event, attendee, ticketId, qrCodeDataUrl, ticketUrl } = ticket;

  return (
    <Email
      theme={passforgeTheme}
      previewText={`Your VIP Pass for ${event.name} — ${attendee.name}`}
      title={`${event.name} Ticket Confirmation`}
      width={600}
      style={{
        backgroundColor: '#0a0e17',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      {/* Top Branding Bar */}
      <Column
        style={{
          padding: [24, 20, 16, 20],
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Text
          style={{
            color: '#6366f1',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          PASSFORGE • OFFICIAL TICKET CONFIRMATION
        </Text>
        <Text style={{ color: '#94a3b8', fontSize: 13 }}>
          Order Confirmed • Check-in Information Below
        </Text>
      </Column>

      {/* Main Ticket Card */}
      <Column
        style={{
          backgroundColor: '#111827',
          border: '1px solid #1f2937',
          borderRadius: 16,
          padding: 32,
          gap: 20,
        }}
      >
        {/* Event Header */}
        <Column style={{ gap: 6 }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Text
              style={{
                color: '#38bdf8',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              {event.organizer}
            </Text>
            <Text
              style={{
                color: '#f59e0b',
                backgroundColor: '#3b2505',
                border: '1px solid #78350f',
                borderRadius: 20,
                padding: [4, 12],
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              ⭐ {attendee.ticketType} PASS
            </Text>
          </Row>

          <Heading
            level={1}
            style={{
              color: '#ffffff',
              fontSize: 26,
              fontWeight: 700,
              lineHeight: 1.25,
            }}
          >
            {event.name}
          </Heading>

          <Text style={{ color: '#94a3b8', fontSize: 14 }}>
            {event.tagline}
          </Text>
        </Column>

        <Divider style={{ borderTop: '1px solid #1f2937' }} />

        {/* Attendee Details & QR Row */}
        <Row style={{ gap: 20, alignItems: 'center' }}>
          {/* Left Column: Attendee Information */}
          <Column style={{ flex: 1, gap: 14 }}>
            <Column style={{ gap: 2 }}>
              <Text style={{ color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                Ticket Holder
              </Text>
              <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: 700 }}>
                {attendee.name}
              </Text>
              <Text style={{ color: '#94a3b8', fontSize: 13 }}>
                {attendee.email}
              </Text>
            </Column>

            <Row style={{ gap: 16 }}>
              <Column style={{ gap: 2 }}>
                <Text style={{ color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Seat
                </Text>
                <Text style={{ color: '#38bdf8', fontSize: 18, fontWeight: 700 }}>
                  {attendee.seat}
                </Text>
              </Column>
              <Column style={{ gap: 2 }}>
                <Text style={{ color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Tier
                </Text>
                <Text style={{ color: '#f59e0b', fontSize: 18, fontWeight: 700 }}>
                  {attendee.ticketType}
                </Text>
              </Column>
            </Row>
          </Column>

          {/* Right Column: QR Code Box */}
          <Column
            style={{
              width: 150,
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: 12,
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Image
              src={{ src: qrCodeDataUrl, width: 256, height: 256 }}
              alt={`QR Code for Ticket ${ticketId}`}
              style={{ width: 126, height: 126 }}
            />
            <Text
              style={{
                color: '#0f172a',
                fontSize: 10,
                fontWeight: 700,
                textAlign: 'center',
                letterSpacing: 0.5,
              }}
            >
              {ticketId}
            </Text>
          </Column>
        </Row>

        <Divider style={{ borderTop: '1px solid #1f2937' }} />

        {/* Event Schedule & Venue Grid */}
        <Row style={{ gap: 16 }}>
          <Column style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
              Date & Time
            </Text>
            <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>
              {event.date}
            </Text>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>
              {event.time}
            </Text>
          </Column>

          <Column style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
              Venue Location
            </Text>
            <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>
              {event.venue}
            </Text>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>
              {event.location}
            </Text>
          </Column>
        </Row>

        {/* Call to Action Button */}
        <Column style={{ alignItems: 'center', padding: [8, 0, 0, 0] }}>
          <Button
            href={ticketUrl}
            style={{
              backgroundColor: '#6366f1',
              color: '#ffffff',
              padding: [12, 28],
              fontSize: 14,
              fontWeight: 700,
              borderRadius: 8,
            }}
          >
            View Digital Pass Portal
          </Button>
        </Column>
      </Column>

      {/* Footer Notice */}
      <Column
        style={{
          padding: [24, 20],
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Text style={{ color: '#64748b', fontSize: 12, textAlign: 'center' }}>
          Please keep this confirmation handy. Present the QR code on your mobile device at registration.
        </Text>
        <Text style={{ color: '#475569', fontSize: 11, textAlign: 'center' }}>
          Generated by PassForge • Hyper Elements Rendering Engine POC
        </Text>
      </Column>
    </Email>
  );
}
