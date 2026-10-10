'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QRCodeViewProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  includeMargin?: boolean;
}

export function QRCodeView({
  value,
  size = 120,
  fgColor = '#059669',
  bgColor = '#ffffff',
  includeMargin = true,
}: QRCodeViewProps) {
  return (
    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 inline-block">
      <QRCodeSVG
        value={value}
        size={size}
        fgColor={fgColor}
        bgColor={bgColor}
        includeMargin={includeMargin}
        level="M"
      />
    </div>
  );
}
