import React from 'react';
import { Layer, Image } from '@hyper-elements/react';

/**
 * Wraps ticket card content with an underlying logo watermark inside a Hyper Elements <Layer>.
 * When watermarkUrl is undefined, returns the content unaltered.
 */
export function renderWithWatermark(
  watermarkUrl: string | undefined,
  width: number,
  height: number,
  content: React.ReactElement,
  isEmail: boolean = false
): React.ReactElement {
  if (!watermarkUrl) return content;
  return (
    <Layer style={{ width: isEmail ? '100%' : width, alignItems: 'center', justifyItems: 'center' }}>
      <Image
        src={{ src: watermarkUrl, width, height }}
        alt="Watermark"
        style={{ width: isEmail ? '100%' : width, height: isEmail ? undefined : height }}
      />
      {content}
    </Layer>
  );
}
