import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-wedding-charcoal text-white py-12 border-t border-wedding-gold/20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <span className="font-cursive text-4xl text-wedding-gold block mb-2">
          Jéssica & Júlio
        </span>
        <p className="text-xs text-white/60 font-light uppercase tracking-widest mb-6">
          14 de Novembro de 2026 • Espaço Villa Jardins
        </p>

        <div className="flex items-center justify-center gap-1 text-xs text-white/40">
          <span>Feito com</span>
          <Heart className="w-3.5 h-3.5 text-wedding-rose fill-wedding-rose inline mx-1" />
          <span>para celebrar o amor</span>
        </div>
      </div>
    </footer>
  );
}
