import React from 'react';

// Símbolo Sagrado Minimalista Cruz & Coração
export function CrossHeartIcon({ className = 'w-6 h-6 text-[#8C6B38]' }) {
  return (
    <svg viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Cruz superior */}
      <path d="M12 2V9M9 5H15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {/* Coração central */}
      <path 
        d="M12 11.5C10.5 9 6.5 9 4.5 12C2.5 15 5 19.5 12 24C19 19.5 21.5 15 19.5 12C17.5 9 13.5 9 12 11.5Z" 
        stroke="currentColor" 
        strokeWidth="1.6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Três pontinhos sagrados inferiores */}
      <circle cx="12" cy="27" r="0.8" fill="currentColor" />
      <circle cx="12" cy="29" r="0.8" fill="currentColor" />
      <circle cx="12" cy="31" r="0.8" fill="currentColor" />
    </svg>
  );
}

// Camada de Fundo: Relevo Seco Floral & Linho Nobre Espalhado
export function FloralBackgroundLayer({ className = '' }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
      {/* Fundo de Linho com Flores em Relevo Seco (Desktop & Mobile) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60 hidden md:block"
        style={{ backgroundImage: `url('/relevo_floral_wide.jpg')` }}
      />
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60 md:hidden"
        style={{ backgroundImage: `url('/relevo_floral_vertical.jpg')` }}
      />

      {/* Véu suave de marfim para manter contraste perfeito e elegância */}
      <div className="absolute inset-0 bg-[#FDFBF7]/30 backdrop-blur-[0.2px]"></div>
    </div>
  );
}

export function FloralCorner() {
  return null;
}
