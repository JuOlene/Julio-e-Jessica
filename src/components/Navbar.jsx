import React, { useState, useEffect } from 'react';
import { Heart, Lock, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#inicio' },
    { name: 'Data & Local', href: '#localizacao' },
    { name: 'Convidados', href: '#convidados' },
    { name: 'Mensagens', href: '#mensagens' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-wedding-cream/95 backdrop-blur-md shadow-md py-3 border-b border-wedding-gold/20'
          : 'bg-wedding-cream/90 backdrop-blur-md shadow-sm py-4 border-b border-wedding-gold/15'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Monograma */}
        <a
          href="#inicio"
          className="flex items-center gap-2 group cursor-pointer"
        >
          <span className="font-cursive text-3xl md:text-4xl text-[#8C6B38] group-hover:text-[#6D5228] transition-colors font-normal">
            Jéssica & Júlio
          </span>
          <Heart className="w-4 h-4 text-[#B87D7A] fill-[#E8D3D1] transition-transform group-hover:scale-125" />
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-semibold tracking-wider uppercase">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[#2D312E] hover:text-[#8C6B38] transition-colors relative py-1"
            >
              {link.name}
            </a>
          ))}

          {/* Botão Área dos Noivos */}
          <a
            href="#admin"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-wedding-gold/60 text-wedding-gold-dark hover:bg-wedding-gold hover:text-white transition-all text-xs font-bold shadow-sm"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Área dos Noivos</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href="#admin"
            className="p-2 text-wedding-gold-dark hover:text-wedding-gold transition-colors"
            title="Área dos Noivos"
          >
            <Lock className="w-5 h-5" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-wedding-charcoal hover:text-wedding-gold-dark transition-colors cursor-pointer"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-wedding-cream border-b border-wedding-gold/20 shadow-lg px-6 py-4 flex flex-col gap-3 text-wedding-charcoal">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium tracking-wide uppercase py-2 border-b border-wedding-sand/40 hover:text-wedding-gold"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 mt-2 py-3 rounded-xl bg-wedding-gold text-white font-bold text-xs uppercase tracking-wider shadow-sm"
          >
            <Lock className="w-4 h-4" />
            <span>Acessar Área dos Noivos</span>
          </a>
        </div>
      )}
    </nav>
  );
}
