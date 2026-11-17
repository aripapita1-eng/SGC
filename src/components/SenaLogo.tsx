import React from 'react';

interface SenaLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const SenaLogo: React.FC<SenaLogoProps> = ({
  className = '',
  size = 48,
  glow = true,
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center relative select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/assets/aistudio/image_a21268f2.png"
        alt="Logo oficial SENA"
        className={`w-full h-full object-contain transition-all duration-300 ${
          glow ? 'drop-shadow-[0_0_12px_rgba(0,255,102,0.85)] brightness-110' : ''
        }`}
        loading="eager"
      />
    </div>
  );
};
