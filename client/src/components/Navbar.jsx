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
    { name: 'Confirmar Presença', href: '#rsvp' },
    { name: 'Mural de Mensagens', href: '#mural' },
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
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wider uppercase">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[#2D312E] hover:text-[#8C6B38] transition-colors relative py-1"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-wedding-charcoal hover:text-wedding-gold-dark transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-wedding-cream border-b border-wedding-gold/20 shadow-lg px-6 py-4 flex flex-col gap-4 text-wedding-charcoal">
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
        </div>
      )}
    </nav>
  );
}
