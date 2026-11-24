import React from 'react';

interface QrPatternProps {
  className?: string;
  size?: number;
  color?: string;
}

export const QrPattern: React.FC<QrPatternProps> = ({
  className = 'w-full h-full text-[#252525]',
  color = '#252525',
}) => {
  return (
    <svg
      viewBox="0 0 33 33"
      className={className}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Top Left Corner Finder */}
      <rect x="2" y="2" width="7" height="7" rx="1" fill="none" stroke={color} strokeWidth="1.5" />
      <rect x="4" y="4" width="3" height="3" rx="0.5" />

      {/* Top Right Corner Finder */}
      <rect x="24" y="2" width="7" height="7" rx="1" fill="none" stroke={color} strokeWidth="1.5" />
      <rect x="26" y="4" width="3" height="3" rx="0.5" />

      {/* Bottom Left Corner Finder */}
      <rect x="2" y="24" width="7" height="7" rx="1" fill="none" stroke={color} strokeWidth="1.5" />
      <rect x="4" y="26" width="3" height="3" rx="0.5" />

      {/* Timing lines & Sync patterns */}
      <rect x="11" y="5" width="1.5" height="1.5" />
      <rect x="14" y="5" width="1.5" height="1.5" />
      <rect x="17" y="5" width="1.5" height="1.5" />
      <rect x="20" y="5" width="1.5" height="1.5" />

      <rect x="5" y="11" width="1.5" height="1.5" />
      <rect x="5" y="14" width="1.5" height="1.5" />
      <rect x="5" y="17" width="1.5" height="1.5" />
      <rect x="5" y="20" width="1.5" height="1.5" />

      {/* Data blocks */}
      <rect x="11" y="11" width="4" height="4" rx="0.5" />
      <rect x="17" y="11" width="2" height="2" />
      <rect x="21" y="11" width="2" height="2" />
      <rect x="25" y="11" width="3" height="1.5" />

      <rect x="11" y="17" width="2" height="3" />
      <rect x="15" y="17" width="3" height="2" />
      <rect x="20" y="15" width="4" height="3" rx="0.5" />
      <rect x="26" y="15" width="2" height="2" />

      <rect x="11" y="22" width="3" height="2" />
      <rect x="16" y="21" width="2" height="4" />
      <rect x="20" y="20" width="2" height="2" />
      <rect x="24" y="20" width="4" height="3" rx="0.5" />

      <rect x="11" y="26" width="2" height="3" />
      <rect x="15" y="27" width="4" height="2" />
      <rect x="21" y="25" width="3" height="2" />
      <rect x="26" y="25" width="3" height="4" rx="0.5" />
    </svg>
  );
};
