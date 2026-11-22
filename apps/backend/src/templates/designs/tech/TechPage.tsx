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
import { passforgeTheme } from '../../theme.js';

interface TechPageProps {
  ticket: TicketData;
  branding?: BrandingConfig;
}

export function TechPage({ ticket, branding }: TechPageProps) {
  const { event, attendee, ticketId, qrCodeDataUrl } = ticket;
  const accent = branding?.accentColor || '#06b6d4';
  const logoUrl = branding?.logoUrl;

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
          {logoUrl ? (
            <Image
              src={{ src: logoUrl, width: 200, height: 50 }}
              alt="Logo"
              style={{ width: 120, height: 'auto' }}
            />
          ) : (
            <Text
              style={{
                color: accent,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              PASSFORGE TECH WALLET
            </Text>
          )}
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
          border: `1px solid ${accent}33`,
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
                color: accent,
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
              }}
            >
              {event.organizer}
            </Text>
            <Text style={{ color: '#94a3b8', fontSize: 13 }}>
              Official Summit Credentials
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
            ⚡ {attendee.ticketType} ACCESS
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
            Pass Holder
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
              Seat
            </Text>
            <Text style={{ color: accent, fontSize: 22, fontWeight: 700 }}>
              {attendee.seat || 'General'}
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
            <Text style={{ color: '#f59e0b', fontSize: 22, fontWeight: 700 }}>
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
            <Text style={{ color: '#10b981', fontSize: 22, fontWeight: 700 }}>
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
            href={`/api/download/pdf?ticketId=${ticketId}`}
            style={{
              backgroundColor: accent,
              color: '#0a0e17',
              padding: [12, 24],
              fontSize: 14,
              fontWeight: 700,
              borderRadius: 8,
            }}
          >
            Download PDF Pass
          </Button>
          <Button
            href={`/api/download/png?ticketId=${ticketId}`}
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
          PassForge Design System • Tech Edition (Page Format)
        </Text>
      </Column>
    </Page>
  );
}
