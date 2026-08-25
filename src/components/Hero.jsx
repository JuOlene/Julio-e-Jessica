import React, { useState, useEffect } from 'react';
import { Calendar, Heart, MapPin } from 'lucide-react';
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
    <section id="inicio" className="relative min-h-[92vh] flex items-center justify-center text-center px-4 overflow-hidden pt-20">
      {/* Background Image with romantic overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center -z-10 scale-105 transform transition-transform duration-10000 ease-out"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-wedding-cream via-black/20 to-black/60"></div>
      </div>

      <div className="max-w-4xl mx-auto z-10 py-16">
        {/* Símbolo Sagrado Cruz & Coração (Foto 1) */}
        <div className="flex justify-center mb-3">
          <CrossHeartIcon className="w-6 h-8 text-[#C5A880]" />
        </div>

        {/* Monogram tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#C5A880]/50 text-xs tracking-widest uppercase font-bold mb-6 text-[#8C6B38] shadow-sm">
          <Heart className="w-3.5 h-3.5 text-[#B87D7A] fill-[#E8D3D1] animate-pulse" />
          <span>Nosso Grande Dia</span>
          <Heart className="w-3.5 h-3.5 text-[#B87D7A] fill-[#E8D3D1] animate-pulse" />
        </div>

        {/* Nomes dos Noivos */}
        <h1
          className="font-cursive text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-4 text-[#2D312E] drop-shadow-sm font-normal"
        >
          Jéssica & Júlio
        </h1>

        <p
          className="text-lg md:text-xl font-medium max-w-xl mx-auto mb-8 font-serif italic tracking-wide text-[#2D312E]"
        >
          "O amor é paciente, o amor é bondoso. Tudo sofre, tudo crê, tudo espera, tudo suporta."
        </p>

        {/* Data & Local Preview */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:text-base mb-10 text-[#2D312E]">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#C5A880]/40 shadow-sm">
            <Calendar className="w-4 h-4 text-[#8C6B38]" />
            <span className="font-bold">14 de Novembro de 2026 às 16:00h</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#C5A880]/40 shadow-sm">
            <MapPin className="w-4 h-4 text-[#B87D7A]" />
            <span className="font-bold">Espaço Villa Jardins</span>
          </div>
        </div>

        {/* Countdown Box */}
        <div className="bg-white/85 backdrop-blur-md border border-[#C5A880]/40 rounded-3xl p-6 sm:p-8 max-w-xl mx-auto shadow-2xl mb-10">
          <p className="text-xs uppercase tracking-widest text-[#8C6B38] mb-4 font-bold">Contagem Regressiva</p>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            <div className="p-3 bg-wedding-cream/90 rounded-2xl border border-[#C5A880]/30 shadow-sm">
              <span className="block text-2xl sm:text-4xl font-bold font-serif text-[#1C201D]">{timeLeft.days}</span>
              <span className="text-xs text-[#5A605B] uppercase tracking-wider font-bold">Dias</span>
            </div>
            <div className="p-3 bg-wedding-cream/90 rounded-2xl border border-[#C5A880]/30 shadow-sm">
              <span className="block text-2xl sm:text-4xl font-bold font-serif text-[#1C201D]">{timeLeft.hours}</span>
              <span className="text-xs text-[#5A605B] uppercase tracking-wider font-bold">Horas</span>
            </div>
            <div className="p-3 bg-wedding-cream/90 rounded-2xl border border-[#C5A880]/30 shadow-sm">
              <span className="block text-2xl sm:text-4xl font-bold font-serif text-[#1C201D]">{timeLeft.minutes}</span>
              <span className="text-xs text-[#5A605B] uppercase tracking-wider font-bold">Minutos</span>
            </div>
            <div className="p-3 bg-wedding-cream/90 rounded-2xl border border-[#C5A880]/30 shadow-sm">
              <span className="block text-2xl sm:text-4xl font-bold font-serif text-[#1C201D]">{timeLeft.seconds}</span>
              <span className="text-xs text-[#5A605B] uppercase tracking-wider font-bold">Segundos</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#rsvp"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-wedding-gold hover:bg-wedding-gold-dark text-white font-bold text-sm tracking-wider uppercase shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            Confirmar Presença
          </a>
          <a
            href="#mural"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-wedding-charcoal/90 hover:bg-wedding-charcoal backdrop-blur-md border border-[#C5A880]/40 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-md"
          >
            Deixar um Recado
          </a>
        </div>
      </div>
    </section>
  );
}
