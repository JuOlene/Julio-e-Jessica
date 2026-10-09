import React, { useState } from 'react';
import { audioManager } from '../services/audioManager';

export default function EnvelopeIntro({ onOpen }) {
  const [isOpening, setIsOpening] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleOpen = () => {
    // Tocar a música no momento exato do toque no envelope
    audioManager.play();

    if (isOpening || isCompleted) return;
    setIsOpening(true);

    // Duração da animação do envelope se desdobrando/abrindo para revelar o convite
    setTimeout(() => {
      setIsCompleted(true);
      if (onOpen) onOpen();
    }, 1100);
  };

  if (isCompleted) return null;

  return (
    <div className="fixed inset-0 z-50 w-full min-h-[100dvh] bg-[#ECE8E1] flex items-center justify-center p-0 sm:p-4 select-none perspective-[1200px]">
      
      {/* ENVELOPE COM O MESMO DESIGN E PROPORÇÃO DO CARTÃO */}
      <div 
        onClick={handleOpen}
        className={`w-full max-w-lg min-h-[100dvh] sm:min-h-0 sm:h-[96vh] relative flex flex-col justify-center items-center shadow-[0_20px_60px_rgba(47,58,29,0.18)] bg-[#FAF8F5] sm:rounded-3xl overflow-hidden cursor-pointer transition-all duration-1000 ${
          isOpening ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* Imagem do Envelope em Relevo Seco Original */}
        <img 
          src="/envelope_jj_extended_pure.jpg" 
          alt="Envelope de Casamento Jéssica & Julio" 
          className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-transform duration-1000 ease-out ${
            isOpening ? 'scale-110 blur-[1px]' : 'scale-100'
          }`}
        />

        {/* Efeito da Aba Superior do Envelope abrindo (Envelope Unfolding Effect) */}
        {isOpening && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#EBE6DC] via-[#FAF8F5]/80 to-transparent origin-top animate-flap-open pointer-events-none z-10" />
        )}

        {/* Indicação "TOQUE PARA ABRIR" Elegante posicionada mais para baixo */}
        <div className={`absolute top-[68%] sm:top-[67%] inset-x-0 flex flex-col items-center justify-center pointer-events-none z-20 transition-opacity duration-300 ${isOpening ? 'animate-seal-pop opacity-0' : 'opacity-100'}`}>
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF8F5]/95 backdrop-blur-md border border-[#7A8C4B]/40 shadow-[0_4px_20px_rgba(47,58,29,0.15)] transition-transform duration-500 hover:scale-105">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5E7139] animate-ping" />
            <span className="font-cinzel text-[11px] sm:text-[12px] uppercase tracking-[0.28em] text-[#2F3A1D] font-medium">
              Toque para abrir
            </span>
            <span className="text-[#5E7139] text-xs font-serif italic">✦</span>
          </div>
        </div>

      </div>
    </div>
  );
}
