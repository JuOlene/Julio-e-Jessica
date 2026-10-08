import React, { useState, useEffect } from 'react';
import { Calendar, Heart } from 'lucide-react';
import { CrossHeartIcon } from './FloralDecorations';

export default function Hero({ weddingDate = '2026-11-14T16:00:00' }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const target = new Date(weddingDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  return (
    <section 
      id="inicio" 
      className="relative min-h-screen flex items-center justify-center text-center px-4 overflow-hidden pt-24 pb-16 bg-cover bg-center bg-no-repeat"
    >
      {/* Imagem de Fundo em Relevo Seco Floral Direta & 100% Nítida */}
      <div 
        className="absolute inset-0 -z-10 bg-cover bg-center hidden md:block"
        style={{ backgroundImage: `url('/relevo_floral_wide.jpg')` }}
      />
      <div 
        className="absolute inset-0 -z-10 bg-cover bg-center md:hidden"
        style={{ backgroundImage: `url('/relevo_floral_vertical.jpg')` }}
      />

      <div className="max-w-4xl mx-auto z-10 py-6">
        {/* Símbolo Sagrado Cruz & Coração */}
        <div className="flex justify-center mb-3">
          <CrossHeartIcon className="w-8 h-10 text-[#8C6B38]" />
        </div>

        {/* Monogram tag */}
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#C5A880]/50 text-xs tracking-widest uppercase font-bold mb-5 text-[#8C6B38] shadow-sm">
          <Heart className="w-3.5 h-3.5 text-[#B87D7A] fill-[#E8D3D1] animate-pulse" />
          <span>Nosso Grande Dia</span>
          <Heart className="w-3.5 h-3.5 text-[#B87D7A] fill-[#E8D3D1] animate-pulse" />
        </div>

        {/* Nomes dos Noivos */}
        <h1
          className="font-cursive text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-3 text-[#2D312E] drop-shadow-sm font-normal tracking-wide"
        >
          Jessica & Julio
        </h1>

        <p
          className="text-lg md:text-xl font-medium max-w-xl mx-auto mb-7 font-serif italic tracking-wide text-[#2D312E]"
        >
          "O amor é paciente, o amor é bondoso. Tudo sofre, tudo crê, tudo espera, tudo suporta."
        </p>

        {/* Data Preview */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:text-base mb-8 text-[#2D312E]">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-[#C5A880]/40 shadow-sm">
            <Calendar className="w-4 h-4 text-[#8C6B38]" />
            <span className="font-bold">14 de Novembro de 2026 às 16:00h</span>
          </div>
        </div>

        {/* Countdown Box */}
        <div className="bg-white/85 backdrop-blur-md border border-[#C5A880]/40 rounded-3xl p-6 sm:p-8 max-w-xl mx-auto shadow-xl">
          <p className="text-xs uppercase tracking-widest text-[#8C6B38] mb-4 font-bold">Contagem Regressiva</p>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            <div className="p-3 bg-[#FDFBF7]/90 rounded-2xl border border-[#C5A880]/30 shadow-sm">
              <span className="block text-2xl sm:text-4xl font-bold font-serif text-[#1C201D]">{timeLeft.days}</span>
              <span className="text-xs text-[#5A605B] uppercase tracking-wider font-bold">Dias</span>
            </div>
            <div className="p-3 bg-[#FDFBF7]/90 rounded-2xl border border-[#C5A880]/30 shadow-sm">
              <span className="block text-2xl sm:text-4xl font-bold font-serif text-[#1C201D]">{timeLeft.hours}</span>
              <span className="text-xs text-[#5A605B] uppercase tracking-wider font-bold">Horas</span>
            </div>
            <div className="p-3 bg-[#FDFBF7]/90 rounded-2xl border border-[#C5A880]/30 shadow-sm">
              <span className="block text-2xl sm:text-4xl font-bold font-serif text-[#1C201D]">{timeLeft.minutes}</span>
              <span className="text-xs text-[#5A605B] uppercase tracking-wider font-bold">Minutos</span>
            </div>
            <div className="p-3 bg-[#FDFBF7]/90 rounded-2xl border border-[#C5A880]/30 shadow-sm">
              <span className="block text-2xl sm:text-4xl font-bold font-serif text-[#1C201D]">{timeLeft.seconds}</span>
              <span className="text-xs text-[#5A605B] uppercase tracking-wider font-bold">Segundos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
