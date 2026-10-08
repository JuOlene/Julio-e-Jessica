import React, { useState } from 'react';

export default function EnvelopeIntro({ onOpen }) {
  const [isOpening, setIsOpening] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleOpen = () => {
    if (isOpening || isCompleted) return;
    setIsOpening(true);

    // Animação suave e fluida revelando o convite
    setTimeout(() => {
      setIsCompleted(true);
      if (onOpen) onOpen();
    }, 850);
  };

  if (isCompleted) return null;

  return (
    <div className="fixed inset-0 z-50 w-full min-h-[100dvh] bg-[#ECE8E1] flex items-center justify-center p-0 sm:p-4 select-none">
      
      {/* ENVELOPE COM O PAPEL CONTÍNUO ESTENDIDO ATÉ EMBAIXO E SEM CORTES */}
      <div 
        onClick={handleOpen}
        className={`w-full max-w-lg min-h-[100dvh] sm:min-h-0 sm:h-[96vh] relative flex flex-col justify-center items-center shadow-[0_20px_60px_rgba(47,58,29,0.18)] bg-[#FAF8F5] sm:rounded-3xl overflow-hidden cursor-pointer transition-all duration-800 ${
          isOpening ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* Imagem do Envelope em Relevo Seco com papel contínuo estendido até a borda inferior */}
        <img 
          src="/envelope_jj_extended_pure.jpg" 
          alt="Envelope de Casamento Jessica & Julio" 
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Indicação "CLIQUE AQUI" posicionada perfeitamente abaixo do lacre de cera */}
        <div className="absolute top-[55%] sm:top-[54%] inset-x-0 flex flex-col items-center justify-center pointer-events-none z-20">
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FAF8F5]/90 backdrop-blur-[2px] border border-[#7A8C4B]/30 shadow-[0_2px_10px_rgba(0,0,0,0.06)] animate-pulse">
            <span className="font-cinzel text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#3F4D27] font-bold">
              CLIQUE AQUI
            </span>
            <span className="text-xs text-[#3F4D27]">
              👆
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
