import { defineTheme } from '@hyper-elements/react';

export const passforgeTheme = defineTheme({
  colors: {
    background: '#0a0e17',
    foreground: '#f1f5f9',
    primary: '#6366f1',
    primaryForeground: '#ffffff',
    muted: '#94a3b8',
    border: '#1e293b',
  },
  fonts: {
    body: 'Arial, Helvetica, sans-serif',
    heading: 'Arial, Helvetica, sans-serif',
  },
  elements: {
    Heading: {
      by: {
        level: {
          1: { fontSize: 28, fontWeight: 700 },
          2: { fontSize: 20, fontWeight: 700 },
          3: { fontSize: 16, fontWeight: 600 },
        },
      },
    },
    Button: {
      borderRadius: 8,
      backgroundColor: '#6366f1',
      color: '#ffffff',
      fontWeight: 600,
    },
  },
});
