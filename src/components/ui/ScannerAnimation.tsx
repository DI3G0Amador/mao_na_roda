import React from 'react';
import { Camera } from 'lucide-react';

interface ScannerAnimationProps {
  label?: string;
  isScanning?: boolean;
  onCapture?: () => void;
}

export const ScannerAnimation: React.FC<ScannerAnimationProps> = ({
  label = 'Aponte a câmera para a placa ou avaria',
  isScanning = true,
  onCapture,
}) => {
  return (
    <div
      onClick={onCapture}
      className="relative w-full h-48 rounded-2xl border-2 border-dashed border-primary/40 bg-surface/80 overflow-hidden flex flex-col items-center justify-center p-4 cursor-pointer group hover:border-primary transition-colors"
    >
      {/* Laser Scan Line */}
      {isScanning && (
        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scanline shadow-[0_0_15px_#D97706] z-10" />
      )}

      {/* Target Reticle corners */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-primary" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-primary" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-primary" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-primary" />

      {/* Icon & Text */}
      <div className="flex flex-col items-center text-center space-y-2 z-0">
        <div className="p-3 bg-primary/10 border border-primary/30 rounded-full text-primary group-hover:scale-110 transition-transform">
          <Camera className="w-8 h-8" />
        </div>
        <p className="text-sm font-semibold font-display text-text-main tracking-wide">
          {label}
        </p>
        <span className="text-xs text-primary/80 bg-primary/10 px-2.5 py-0.5 rounded-full font-mono">
          TOQUE PARA FOTOGRAFAR
        </span>
      </div>
    </div>
  );
};
