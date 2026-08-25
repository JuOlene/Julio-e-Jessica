import React from 'react';

// Símbolo Minimalista Sagrado Cruz & Coração
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

// Camada Simplista e Elegante de Terço & Flores em Linho
export function FloralBackgroundLayer({ className = '', variant = 'default' }) {
  const wideBg = variant === 'floral' ? '/hero_bg.jpg' : '/terco_flores_wide.jpg';
  const mobileBg = variant === 'floral' ? '/hero_bg_mobile.jpg' : '/terco_flores_vertical.jpg';

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
      {/* Imagem do Terço Dourado & Flores sobre Linho com opacidade sutil */}
      <div 
        className="absolute inset-0 bg-cover bg-right md:bg-center opacity-35 hidden md:block"
        style={{ backgroundImage: `url('${wideBg}')` }}
      />
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-35 md:hidden"
        style={{ backgroundImage: `url('${mobileBg}')` }}
      />

      {/* Véu suave de linho marfim para manter leitura impecável */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/80 via-[#FDFBF7]/50 to-[#FDFBF7]/80 backdrop-blur-[0.3px]"></div>
    </div>
  );
}

export function FloralCorner() {
  return null;
}
